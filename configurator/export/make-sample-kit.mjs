// Writes public/configurator/kits/sample: kit.json, parts/*.glb, thumb.png.
// Placeholder kit so the page runs before the real catalog-all exporter exists.
// Units are mm, Y up, floor at y = 0, +Z is the front of the set.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Document, NodeIO } from "@gltf-transform/core";
import { PNG } from "pngjs";

const out = path.join(fileURLToPath(new URL("..", import.meta.url)), "../../public/configurator/kits/sample");

const PALETTE = { front: "#d9d2c5", middle: "#8b7355", back: "#d9d2c5" };

const WALL = { w: 600, h: 1200, d: 24 };
const GAP = 24;
const OFFSET = WALL.w + GAP; // 624 mm between wall centres

// [w, h, d] and the centre of the box, in mm.
const PARTS = [
  { id: "wall-left", label: "Left wall", kind: "wall", size: [WALL.w, WALL.h, WALL.d], at: [-OFFSET, WALL.h / 2, 0], colour: PALETTE.front },
  { id: "wall-middle", label: "Middle wall", kind: "wall", size: [WALL.w, WALL.h, WALL.d], at: [0, WALL.h / 2, 0], colour: PALETTE.front },
  { id: "wall-right", label: "Right wall", kind: "wall", size: [WALL.w, WALL.h, WALL.d], at: [OFFSET, WALL.h / 2, 0], colour: PALETTE.front },
  { id: "support-left", label: "Left stabiliser", kind: "support", size: [200, 24, 300], at: [-OFFSET, 12, -162], colour: PALETTE.middle },
  { id: "support-right", label: "Right stabiliser", kind: "support", size: [200, 24, 300], at: [OFFSET, 12, -162], colour: PALETTE.middle },
  { id: "figure", label: "Figure", kind: "extra", size: [300, 400, 24], at: [0, 200, 212], colour: PALETTE.middle, extra_id: "figure" },
];

const RAD = Math.PI / 180;

// Rotate about the vertical axis through (px, *, 0); column-major 16 floats.
function pivotYaw(px, deg) {
  const c = Math.cos(deg * RAD);
  const s = Math.sin(deg * RAD);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, px - px * c, 0, px * s, 1].map((n) => Number(n.toFixed(6)));
}

// Outer walls swing 45 deg about their inner vertical edge, so the set forms a shallow U
// that opens toward the viewer (+Z). Each stabiliser follows its wall.
const innerLeft = -OFFSET + WALL.w / 2;
const innerRight = OFFSET - WALL.w / 2;
const CONCAVE = {
  "wall-left": pivotYaw(innerLeft, 45),
  "support-left": pivotYaw(innerLeft, 45),
  "wall-right": pivotYaw(innerRight, -45),
  "support-right": pivotYaw(innerRight, -45),
};

function srgbToLinear(v) {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearRgba(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => srgbToLinear(c / 255)).concat(1);
}

const FACES = [
  { n: [0, 0, 1], v: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
  { n: [0, 0, -1], v: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] },
  { n: [1, 0, 0], v: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
  { n: [-1, 0, 0], v: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
  { n: [0, 1, 0], v: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
  { n: [0, -1, 0], v: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
];

async function writeBox(part) {
  const [w, h, d] = part.size;
  const [cx, cy, cz] = part.at;
  const pos = [];
  const nrm = [];
  const idx = [];
  for (const f of FACES) {
    const base = pos.length / 3;
    for (const [x, y, z] of f.v) {
      pos.push(cx + (x * w) / 2, cy + (y * h) / 2, cz + (z * d) / 2);
      nrm.push(...f.n);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  const doc = new Document();
  const buffer = doc.createBuffer();
  const material = doc
    .createMaterial(`${part.id}:felt`)
    .setBaseColorFactor(linearRgba(part.colour))
    .setMetallicFactor(0)
    .setRoughnessFactor(0.85);
  const prim = doc
    .createPrimitive()
    .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(new Float32Array(pos)).setBuffer(buffer))
    .setAttribute("NORMAL", doc.createAccessor().setType("VEC3").setArray(new Float32Array(nrm)).setBuffer(buffer))
    .setIndices(doc.createAccessor().setType("SCALAR").setArray(new Uint16Array(idx)).setBuffer(buffer))
    .setMaterial(material);
  doc.createScene().addChild(doc.createNode(part.id).setMesh(doc.createMesh(part.id).addPrimitive(prim)));
  await new NodeIO().write(path.join(out, "parts", `${part.id}.glb`), doc);
}

async function writeThumb() {
  const png = new PNG({ width: 400, height: 300 });
  const bars = [
    [90, 170, "#d9d2c5"],
    [175, 225, "#8b7355"],
    [230, 310, "#d9d2c5"],
  ];
  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 400; x++) {
      const bar = y > 70 && y < 240 ? bars.find(([a, b]) => x >= a && x < b) : undefined;
      const n = parseInt((bar ? bar[2] : "#f5f3ef").slice(1), 16);
      const i = (y * 400 + x) * 4;
      png.data[i] = (n >> 16) & 255;
      png.data[i + 1] = (n >> 8) & 255;
      png.data[i + 2] = n & 255;
      png.data[i + 3] = 255;
    }
  }
  await writeFile(path.join(out, "thumb.png"), PNG.sync.write(png));
}

// Straight layout, all default parts on.
const bmin = [Infinity, Infinity, Infinity];
const bmax = [-Infinity, -Infinity, -Infinity];
for (const p of PARTS) {
  for (let i = 0; i < 3; i++) {
    bmin[i] = Math.min(bmin[i], p.at[i] - p.size[i] / 2);
    bmax[i] = Math.max(bmax[i], p.at[i] + p.size[i] / 2);
  }
}

const kit = {
  schema: "screenery.kit/v1",
  id: "sample",
  name: "Sample set",
  units: "mm",
  up: "y",
  source: { catalog_all: "(placeholder, not exported from catalog-all)", pins: {} },
  palette: PALETTE,
  rear_artwork_policy: "mirrored",
  bounds_mm: { min: bmin, max: bmax },
  parts: PARTS.map((p) => ({
    id: p.id,
    label: p.label,
    kind: p.kind,
    glb: `parts/${p.id}.glb`,
    quantity: 1,
    extra_id: p.extra_id ?? null,
    leaf_of: null,
    hinge: null,
    plies:
      p.kind === "wall"
        ? [
            { id: `${p.id}:front`, role: "front" },
            { id: `${p.id}:middle`, role: "middle" },
            { id: `${p.id}:back`, role: "back" },
          ]
        : [{ id: `${p.id}:middle`, role: "middle" }],
  })),
  faces: [],
  layouts: [
    { id: "straight", label: "Straight", transforms: {} },
    { id: "concave", label: "Concave", transforms: CONCAVE },
  ],
  extras: [{ id: "figure", label: "Figure", part_ids: ["figure"], default_on: true }],
  cameras: {
    front: { azimuth_deg: 0, elevation_deg: 0 },
    oblique: { azimuth_deg: 25, elevation_deg: 7 },
    low_hero: { azimuth_deg: 15, elevation_deg: 0 },
    rear: { azimuth_deg: 180, elevation_deg: 4 },
  },
  logo_slots: [],
};

await mkdir(path.join(out, "parts"), { recursive: true });
await Promise.all(PARTS.map(writeBox));
await writeThumb();
await writeFile(path.join(out, "kit.json"), JSON.stringify(kit, null, 2) + "\n");
await writeFile(
  path.join(out, "..", "index.json"),
  JSON.stringify([{ id: "sample", name: "Sample set", thumbnail: "/kits/sample/thumb.png" }], null, 2) + "\n",
);

// Self-check: the concave pivot must not move the wall's inner edge.
const m = CONCAVE["wall-left"];
const px = innerLeft;
const x = m[0] * px + m[8] * 0 + m[12];
const z = m[2] * px + m[10] * 0 + m[14];
if (Math.abs(x - px) > 1e-3 || Math.abs(z) > 1e-3) throw new Error(`concave pivot moved: ${x}, ${z}`);
// ...and must swing the outer edge forward (+z).
const ox = -OFFSET - WALL.w / 2;
const oz = m[2] * ox + m[14];
if (oz < 100) throw new Error(`concave did not open toward the viewer: ${oz}`);

console.log(`wrote ${out} (${PARTS.length} parts, outer edge at z=${oz.toFixed(0)} mm)`);
