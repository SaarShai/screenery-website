#!/usr/bin/env node
// Export a catalog-all design into a web kit (kit.json + per-part GLB), see ../KIT-SCHEMA.md.
//   node export_kit.mjs --design princess [--out ../kits] [--catalog <catalog-all dir>]
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { Document, Logger, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, reorder, textureCompress, weld } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { DESIGNS, LAYOUT_IDS } from './designs.mjs';
import { assembleJoints, foldJoints, bounds as jointBounds } from './joints.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1] ?? true] : [])).filter(Boolean));
// Geometry, artwork and rules come from the Screenery source checkout.
const REPO = '/Users/za/Documents/screenery fresh codex';
const CATALOG = args.catalog ?? path.join(REPO, 'output/catalog-all');
const OUT = args.out ?? path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../public/configurator/kits');
const MAX_TEX = 2048;

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linRGB = (h) => hex(h).map((v) => srgbToLinear(v / 255));
const sha256 = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const readJSON = async (f) => JSON.parse(await fs.readFile(f, 'utf8'));

// ---- 4x4 row-major matrix helpers (rigid transforms) ----
const mul = (A, B) => A.map((r, i) => r.map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
const translate = (t) => [[1, 0, 0, t[0]], [0, 1, 0, t[1]], [0, 0, 1, t[2]], [0, 0, 0, 1]];
const apply = (M, v) => [0, 1, 2].map((i) => M[i][0] * v[0] + M[i][1] * v[1] + M[i][2] * v[2] + M[i][3]);
const invRigid = (M) => {
  const R = [[M[0][0], M[1][0], M[2][0]], [M[0][1], M[1][1], M[2][1]], [M[0][2], M[1][2], M[2][2]]];
  const t = [M[0][3], M[1][3], M[2][3]];
  const nt = R.map((r) => -(r[0] * t[0] + r[1] * t[1] + r[2] * t[2]));
  return [[...R[0], nt[0]], [...R[1], nt[1]], [...R[2], nt[2]], [0, 0, 0, 1]];
};
const colMajor = (M) => [0, 1, 2, 3].flatMap((j) => [0, 1, 2, 3].map((i) => M[i][j]));
// Rodrigues rotation by deg about the axis through p0 with direction d (right-handed).
function rotationAboutAxis(p0, d, deg) {
  const n = Math.hypot(...d); const [x, y, z] = d.map((c) => c / n);
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), C = 1 - c;
  const R = [[c + x * x * C, x * y * C - z * s, x * z * C + y * s, 0], [y * x * C + z * s, c + y * y * C, y * z * C - x * s, 0], [z * x * C - y * s, z * y * C + x * s, c + z * z * C, 0], [0, 0, 0, 1]];
  return mul(translate(p0), mul(R, translate(p0.map((v) => -v))));
}


function feltColour(palette, role) {
  if (role === 'front') return palette.front;
  if (role === 'middle') return palette.middle ?? palette.back;
  return palette.back; // back, door-back, backpiece, patches
}

// Bake the RGBA artwork over felt colour into an opaque texture whose [0,1] UV square covers the whole
// UV range used by the art faces (pixels outside the source image become felt, like Blender's CLIP).
async function bakeTexture(imagePath, felt, uvs) {
  const img = sharp(imagePath).ensureAlpha();
  const { width: W, height: H } = await img.metadata();
  let u0 = 0, u1 = 1, v0 = 0, v1 = 1;
  for (const [u, v] of uvs) { u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  const pad = 1e-3; u0 -= pad; v0 -= pad; u1 += pad; v1 += pad;
  const CW = Math.ceil((u1 - u0) * W), CH = Math.ceil((v1 - v0) * H);
  const left = Math.round(-u0 * W), top = Math.round((v1 - 1) * H); // bottom-left UV origin
  const [r, g, b] = hex(felt);
  const png = await sharp({ create: { width: CW, height: CH, channels: 4, background: { r, g, b, alpha: 1 } } })
    .composite([{ input: await img.toBuffer(), left, top }]).removeAlpha().png().toBuffer();
  const remap = ([u, v]) => [(u - u0) / (u1 - u0), 1 - (v - v0) / (v1 - v0)]; // glTF: v down
  return { png, remap, size: [CW, CH] };
}

function bbox(rows) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const p of rows) for (const v of p.vertices_mm) for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], v[i]); max[i] = Math.max(max[i], v[i]); }
  return { min, max };
}

async function writePartGLB(io, node, rows, palette, texDir, faces, imageRoot) {
  const doc = new Document().setLogger(new Logger(Logger.Verbosity.WARN));
  const buffer = doc.createBuffer();
  const mesh = doc.createMesh(node.id);
  doc.createScene('scene').addChild(doc.createNode(node.id).setMesh(mesh));
  for (const ply of rows) {
    const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(ply.vertices_mm.flat())).setBuffer(buffer);
    const art = new Set(ply.art_faces ?? []);
    const felt = feltColour(palette, ply.role);
    const feltTris = [], artTris = [];
    ply.triangles.forEach((t, i) => (art.has(i) && ply.image && ply.uv ? artTris : feltTris).push(...t));
    const addPrim = (tris, material, uvAcc) => {
      if (!tris.length) return;
      const idx = doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(tris)).setBuffer(buffer);
      const prim = doc.createPrimitive().setAttribute('POSITION', pos).setIndices(idx).setMaterial(material);
      if (uvAcc) prim.setAttribute('TEXCOORD_0', uvAcc);
      mesh.addPrimitive(prim);
    };
    addPrim(feltTris, doc.createMaterial(`${ply.id}:felt`).setBaseColorFactor([...linRGB(felt), 1]).setMetallicFactor(0).setRoughnessFactor(0.95), null);
    if (artTris.length) {
      const used = new Set(artTris);
      const imagePath = path.isAbsolute(ply.image) ? ply.image.replace('/Users/za/Documents/screenery fresh codex/', REPO + '/') : path.join(imageRoot, ply.image);
      const { png, remap, size } = await bakeTexture(imagePath, felt, ply.uv.filter((_, i) => used.has(i)));
      const uv = doc.createAccessor().setType('VEC2').setArray(new Float32Array(ply.uv.flatMap(remap))).setBuffer(buffer);
      const faceId = `${node.id}:${slug(ply.role)}${rows.filter((r) => r.role === ply.role).length > 1 ? '-' + slug(ply.id) : ''}`;
      const tex = doc.createTexture(faceId).setImage(png).setMimeType('image/png');
      addPrim(artTris, doc.createMaterial(`${ply.id}:art`).setBaseColorTexture(tex).setMetallicFactor(0).setRoughnessFactor(0.95), uv);
      const texFile = `textures/${faceId.replace(/:/g, '-')}.webp`;
      await sharp(png).webp({ quality: 90 }).toFile(path.join(texDir, path.basename(texFile)));
      faces.push({
        id: faceId, part_id: node.id, ply_id: ply.id, role: ply.role, texture: texFile, texture_px: size,
        two_sided: art.size === ply.triangles.length,
        ...(ply.print_lo && ply.print_size ? { rect_mm: [ply.print_lo[0], ply.print_lo[1], ply.print_lo[0] + ply.print_size[0], ply.print_lo[1] + ply.print_size[1]], print_axes: ply.print_axes, print_normal: ply.print_normal } : {}),
      });
    }
  }
  await doc.transform(weld(), dedup(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 82, resize: [MAX_TEX, MAX_TEX] }),
    reorder({ encoder: MeshoptEncoder, target: 'size' }));
  // Keep float32 positions: the old 14-bit grid rounded joint boundaries by
  // hundredths of a millimetre and could collapse small seam triangles.
  doc.createExtension(EXTMeshoptCompression).setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  return io.writeBinary(doc);
}

async function main() {
  const id = args.design ?? process.argv[2];
  const design = DESIGNS[id];
  if (!design) throw new Error(`unknown design ${id}; known: ${Object.keys(DESIGNS).join(', ')}`);
  const files = {
    opened: path.join(CATALOG, `${id}-opened.json`), fold: path.join(CATALOG, `${id}-fold-check.json`),
    opening: path.join(CATALOG, `${id}-opening-check.json`), views: path.join(CATALOG, `${id}-view-openings.json`),
    rules: path.join(REPO, 'ground truth/rules.json'),
    exporter: path.join(import.meta.dirname, 'export_kit.mjs'),
    joints: path.join(import.meta.dirname, 'joints.mjs'),
    joint_meshes: path.join(import.meta.dirname, 'prepare_joint_meshes.py'),
  };
  const [rowsAll, fold, opening, views, palettes] = await Promise.all([
    readJSON(files.opened), readJSON(files.fold), readJSON(files.opening), readJSON(files.views), readJSON(path.join(CATALOG, 'material-palettes.json')),
  ]);
  const palette = palettes[design.palette ?? id];
  const rows = rowsAll.filter((r) => r.installed !== false);
  const byId = new Map(rows.map((r) => [r.id, r]));

  // ---- leaves: undo the baked opening so every part is exported closed; keep hinge data ----
  const leaves = [];
  for (const leaf of opening.leaves) {
    const label = leaf.label ?? leaf.name;
    const recordIds = views.leaves?.[label]?.record_ids ?? [leaf.host, ...(leaf.backing_ids ?? [])];
    const recs = recordIds.map((rid) => byId.get(rid)).filter(Boolean);
    if (!recs.length) { console.warn(`${id}: leaf ${label} has no records`); continue; }
    const [p0, p1] = leaf.hinge_axis_mm; const d = p1.map((c, i) => c - p0[i]);
    // pick the undo sign that flattens the leaf (smallest extent along the wall normal, z)
    const extentZ = (M) => { let lo = Infinity, hi = -Infinity; for (const r of recs) for (const v of r.vertices_mm) { const z = apply(M, v)[2]; lo = Math.min(lo, z); hi = Math.max(hi, z); } return hi - lo; };
    const cand = [-leaf.angle_deg, leaf.angle_deg].map((deg) => ({ deg, M: rotationAboutAxis(p0, d, deg) }));
    cand.forEach((c) => (c.extent = extentZ(c.M)));
    cand.sort((a, b) => a.extent - b.extent);
    const undo = cand[0];
    for (const r of recs) r.vertices_mm = r.vertices_mm.map((v) => apply(undo.M, v));
    const hostPart = recs.map((r) => r.part_id).find((p) => rows.some((r2) => r2.part_id === p && !recordIds.includes(r2.id))) ?? recs[0].part_id;
    leaves.push({ label, recs, hostPart, hinge: { origin: p0, axis: d, open_deg: -undo.deg }, undone: undo.extent.toFixed(1), other: cand[1].extent.toFixed(1) });
    for (const r of recs) r._leaf = label;
  }

  // ---- part nodes: group rows by part_id (+ rig group when a part spans two walls); leaves are their own nodes ----
  const nodes = new Map();
  const addRow = (nodeId, row, meta) => { if (!nodes.has(nodeId)) nodes.set(nodeId, { id: nodeId, rows: [], ...meta }); nodes.get(nodeId).rows.push(row); };
  for (const r of rows.filter((r) => !r._leaf)) {
    const siblings = rows.filter((x) => x.part_id === r.part_id && !x._leaf);
    const groups = [...new Set(siblings.map((x) => x.rig_group))];
    const main = groups.sort((a, b) => siblings.filter((x) => x.rig_group === b).length - siblings.filter((x) => x.rig_group === a).length)[0];
    const nodeId = slug(r.part_id) + (r.rig_group === main ? '' : '-flap');
    const cls = design.classify(r.part_id, r.name);
    addRow(nodeId, r, { part_id: r.part_id, label: r.name ?? r.part_id, kind: r.rig_group === main ? cls.kind : 'flap', rig_group: r.rig_group });
  }
  for (const leaf of leaves) {
    const host = rows.find((r) => r.part_id === leaf.hostPart && !r._leaf);
    for (const r of leaf.recs) addRow(slug(leaf.label).replace(/-leaf$/, '') + '-leaf', r, { part_id: leaf.hostPart, label: leaf.label, kind: 'leaf', rig_group: host?.rig_group ?? r.rig_group, leaf_of: slug(leaf.hostPart), hinge: leaf.hinge });
  }

  // Fit reciprocal tab/socket cap edges before applying any display layout.
  const assembly = assembleJoints(rows, fold, { birthday: id === 'birthday' });
  for (const n of nodes.values()) if (n.hinge) {
    const M = assembly.transforms.get(n.rows[0]);
    n.hinge.origin = apply(M, n.hinge.origin);
    n.hinge.axis = apply(M, n.hinge.axis).map((v, i) => v - M[i][3]);
  }

  // Apply the shared groove rule and create source-derived intermediate parts.
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'screenery-joints-'));
  try {
    const input = path.join(scratch, 'input.json'), output = path.join(scratch, 'output.json');
    await fs.writeFile(input, JSON.stringify({ design: id, rows, chain: ['left', 'right'].filter(side => design.chain?.[side]).map(side => {
      const c = design.chain[side];
      return { side, flap: nodes.get(c.flap).rows[0].id, receiver_moves: c.unit.includes(c.receiver) };
    }), joints: assembly.joints.map(j => ({
      donor: j.donor.id, flap: j.flap.id, receiver: j.receiver.id, positive: j.positive, root_faces: j.rootFaces,
    })) }));
    execFileSync(args.python ?? path.join(REPO, '.venv/bin/python'), [path.join(import.meta.dirname, 'prepare_joint_meshes.py'), input, output], { stdio: 'inherit' });
    const prepared = await readJSON(output);
    for (const r of prepared.rows) Object.assign(byId.get(r.id), r);
    for (const n of nodes.values()) if (n.hinge) {
      const offset = prepared.group_offsets[n.rig_group] ?? [0, 0, 0];
      n.hinge.origin = n.hinge.origin.map((v, i) => v + offset[i]);
    }
    assembly.seating = prepared.seating;
    assembly.repairs = prepared.repairs;
    for (let i = 0; i < assembly.joints.length; i++) {
      assembly.joints[i].hinge = prepared.joints[i].hinge_mm;
      assembly.joints[i].rootFaces = [prepared.joints[i].hinge_mm, prepared.joints[i].hinge_mm];
    }
    for (const variant of prepared.variants) {
      const base = [...nodes.values()].find(n => n.rows.some(r => r.id === variant.source));
      const variantRows = base.rows.map(r => r.id === variant.source ? variant.row : structuredClone(r));
      const linked = { ...base, id: base.id + '-linked', variant_of: base.id, rows: variantRows };
      nodes.set(linked.id, linked); rows.push(...variantRows);
    }
  } finally { await fs.rm(scratch, { recursive: true, force: true }); }

  // ---- normalize: floor at y = 0, x/z centred on the closed straight pose ----
  const all = bbox(rows);
  const T = translate([-(all.min[0] + all.max[0]) / 2, -all.min[1], -(all.min[2] + all.max[2]) / 2]);
  const Tinv = invRigid(T);
  for (const r of rows) r.vertices_mm = r.vertices_mm.map((v) => apply(T, v));
  for (const n of nodes.values()) if (n.hinge) n.hinge = { origin: apply(T, n.hinge.origin), axis: n.hinge.axis, open_deg: n.hinge.open_deg };

  // ---- extras ----
  const extras = (design.extras ?? []).map((e) => ({ id: e.id, label: e.label, default_on: e.default_on, part_ids: [...nodes.values()].filter((n) => e.match(n.part_id, n.label)).map((n) => n.id) })).filter((e) => e.part_ids.length);
  for (const n of nodes.values()) n.extra_id = extras.find((e) => e.part_ids.includes(n.id))?.id ?? null;

  // All layouts use the same seated joint graph. Prior source collision flags
  // describe the prior unseated pose; validate the rebuilt meshes separately.
  const foldLayouts = [...fold.layouts, ...(fold.rejected_layouts ?? [])].filter(L => LAYOUT_IDS[L.id]);
  const layouts = foldLayouts.map(L => {
    const frames = foldJoints(assembly.joints, fold, L);
    return { id: LAYOUT_IDS[L.id].toLowerCase(), label: LAYOUT_IDS[L.id], catalog_id: L.id,
      transforms: Object.fromEntries([...nodes.values()].map(n => [n.id, colMajor(mul(T, mul(frames.get(n.rig_group), Tinv)))])) };
  });
  const nodeFor = row => [...nodes.values()].find(n => n.rows.includes(row)).id;
  const jointRecords = assembly.joints.map(j => ({ donor: nodeFor(j.donor), receiver: nodeFor(j.receiver), flap: nodeFor(j.flap),
    hinge_mm: apply(T, j.hinge),
    seating: assembly.seating.find(s => s.flap === j.flap.id) }));
  let chain = null;
  if (design.chain) {
    const sides = {};
    for (const side of ['left', 'right']) {
      const c = design.chain[side];
      if (!c) continue;
      const j = assembly.joints.find(j => nodeFor(j.flap) === c.flap);
      const receiverMoves = c.unit.includes(c.receiver);
      const unitWall = receiverMoves ? j.receiver : j.donor;
      const b = jointBounds([unitWall]);
      const hinge = apply(T, j.hinge);
      const edge = side === 'left' ? 'lo' : 'hi';
      const stepX = b[edge][0] - (receiverMoves ? hinge[0] : jointBounds([j.receiver])[edge][0]);
      const lead = receiverMoves ? c.receiver : c.donor;
      sides[side] = {
        part_ids: receiverMoves ? [...c.unit, c.flap] : c.unit,
        inner_part_ids: receiverMoves ? [] : [c.flap],
        linked_parts: { [lead]: lead + '-linked' },
        step_x_mm: stepX, step_mm: Math.abs(stepX), hinge_mm: hinge,
        joints: Object.fromEntries(layouts.map(L => {
          const m = L.transforms[lead];
          return [L.id, { angle_deg: Math.round(Math.atan2(m[8], m[0]) * 180 / Math.PI), alternate: L.id === 'concertina' }];
        })),
      };
    }
    chain = { max_extra: design.chain.max_extra, sides };
  }

  // Exact solids for the bounded hinge-contact check. The delivered GLBs are
  // checked independently after decoding; this cache retains double precision
  // for the Boolean kernel, which is stricter than a graphics triangle mesh.
  const verifyDir = path.join(REPO, 'configurator/research/joints', id, 'cache');
  await fs.mkdir(verifyDir, { recursive: true });
  await fs.writeFile(path.join(verifyDir, 'source-geometry.json'), JSON.stringify(Object.fromEntries(
    [...nodes.values()].map(n => [n.id, n.rows.map(r => ({ id: r.id, vertices_mm: r.vertices_mm, triangles: r.triangles }))])
  )));

  // ---- write GLBs ----
  const outDir = path.join(OUT, id), partsDir = path.join(outDir, 'parts'), texDir = path.join(outDir, 'textures');
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(partsDir, { recursive: true }); await fs.mkdir(texDir, { recursive: true });
  await MeshoptEncoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
  const parts = [], faces = [];
  for (const n of nodes.values()) {
    const glb = await writePartGLB(io, n, n.rows, palette, texDir, faces, design.imageRoot ? path.resolve(CATALOG, design.imageRoot) : CATALOG);
    const file = `parts/${n.id}.glb`;
    await fs.writeFile(path.join(outDir, file), glb);
    parts.push({ id: n.id, label: n.label, kind: n.kind, glb: file, quantity: 1, variant_of: n.variant_of ?? null, extra_id: n.extra_id, leaf_of: n.leaf_of ?? null, hinge: n.hinge ?? null,
      plies: n.rows.map((r) => ({ id: r.id, role: r.role })), bounds_mm: bbox(n.rows), bytes: glb.byteLength });
    console.log(`${id}: ${n.id.padEnd(34)} ${n.kind.padEnd(8)} ${String(n.rows.length).padStart(2)} plies ${(glb.byteLength / 1e6).toFixed(2)} MB`);
  }
  const defaultRows = [...nodes.values()].filter((n) => !n.extra_id || extras.find((e) => e.id === n.extra_id).default_on).flatMap((n) => n.rows);
  const pins = Object.fromEntries(await Promise.all(Object.values(files).map(async (f) => [path.relative(REPO, f), await sha256(f)])));
  const kit = {
    schema: 'screenery.kit/v1', id, name: design.name, units: 'mm', up: 'y',
    source: { catalog_all: path.relative(REPO, files.opened), pins, normalization_translate_mm: [T[0][3], T[1][3], T[2][3]] },
    palette, rear_artwork_policy: 'mirrored', bounds_mm: bbox(defaultRows),
    parts, faces, layouts, extras, chain, joints: jointRecords, geometry_repairs: assembly.repairs,
    cameras: { front: { azimuth_deg: 0, elevation_deg: 2 }, oblique: { azimuth_deg: 25, elevation_deg: 7 }, wide: { azimuth_deg: 45, elevation_deg: 8 }, rear: { azimuth_deg: 180, elevation_deg: 4 } },
    logo_slots: [],
  };
  await fs.writeFile(path.join(outDir, 'kit.json'), JSON.stringify(kit, null, 1));

  // thumbnail + reference from the catalog-all straight camera-03 render; merge kits/index.json
  const renderDir = path.join(CATALOG, 'renders', id, 'straight');
  const ref = (await fs.readdir(renderDir).catch(() => [])).find((f) => /B-printed.*__03-/.test(f));
  if (ref) {
    const src = path.join(renderDir, ref);
    await sharp(src).flatten({ background: '#fafaf8' }).resize(800, 640).webp({ quality: 85 }).toFile(path.join(outDir, 'thumb.webp'));
    await sharp(src).flatten({ background: '#ffffff' }).resize(1000, 800).png().toFile(path.join(outDir, 'reference-03.png'));
  } else console.warn(`${id}: no straight camera-03 render found in ${renderDir}`);
  const indexFile = path.join(OUT, 'index.json');
  const index = (await readJSON(indexFile).catch(() => [])).filter((e) => e.id !== id);
  index.push({ id, name: design.name, thumbnail: `/configurator/kits/${id}/thumb.webp`, order: design.order ?? 99 });
  index.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  await fs.writeFile(indexFile, JSON.stringify(index, null, 1));

  const total = parts.reduce((s, p) => s + p.bytes, 0);
  console.log(`${id}: ${parts.length} parts, ${leaves.length} leaves (${leaves.map((l) => `${l.label}: closed z-extent ${l.undone} vs ${l.other}`).join('; ')}), ${faces.length} faces, layouts ${layouts.map((l) => l.id).join('/')}, extras ${extras.map((e) => e.id).join('/') || 'none'}, ${(total / 1e6).toFixed(1)} MB → ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
