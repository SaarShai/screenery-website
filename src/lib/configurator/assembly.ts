import * as THREE from "three";
import type { Config, Kit, KitPart } from "./config";

export type PartInstance = { key: string; part: KitPart; matrix: THREE.Matrix4 };

/** One seated joint model for the viewer, numeric checks and offline captures. */
export function partInstances(kit: Kit, config: Config): PartInstance[] {
  const transforms = kit.layouts.find((l) => l.id === config.layout)?.transforms ?? {};
  const byId = new Map(kit.parts.map((p) => [p.id, p]));
  const shown = kit.parts.filter((p) => !p.variant_of && (!p.extra_id || config.extras.includes(p.extra_id)));
  const visible = new Set(shown.map((p) => p.id));
  const linked = new Map<string, string>();
  const copies: PartInstance[] = [];
  for (const side of ["left", "right"] as const) {
    const c = kit.chain?.sides[side];
    if (!c) continue;
    const count = Math.max(0, Math.min(Math.trunc(config.wings?.[side] ?? 0), kit.chain?.max_extra ?? 0));
    if (count === 0) continue;
    for (const [base, variant] of Object.entries(c.linked_parts)) linked.set(base, variant);
    const joint = c.joints[config.layout];
    const lead = c.part_ids.find((id) => byId.get(id)?.kind === "wall")!;
    let inner = new THREE.Matrix4().fromArray(transforms[lead]);
    for (let k = 1; k <= count; k++) {
      const placement = new THREE.Matrix4().makeTranslation(k * c.step_x_mm, 0, 0);
      // The mesh AND its joint are at step k. The previous code used k-1
      // for the joint, so the added panel rotated around the previous seam.
      const pivot = new THREE.Vector3(...c.hinge_mm).applyMatrix4(placement);
      const angle = joint.angle_deg * (joint.alternate && k % 2 ? -1 : 1);
      const turn = new THREE.Matrix4().makeTranslation(pivot)
        .multiply(new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(angle)))
        .multiply(new THREE.Matrix4().makeTranslation(pivot.clone().negate()));
      const outer = inner.clone().multiply(turn);
      for (const [ids, frame] of [[c.part_ids, outer], [c.inner_part_ids, inner]] as const) {
        for (const id of ids) {
          if (!visible.has(id)) continue;
          const part = byId.get(k < count ? (c.linked_parts[id] ?? id) : id)!;
          copies.push({ key: `${id}#${side}${k}`, part, matrix: frame.clone().multiply(placement) });
        }
      }
      inner = outer;
    }
  }
  const base = shown.map((p) => ({ key: p.id, part: byId.get(linked.get(p.id) ?? p.id)!, matrix: new THREE.Matrix4().fromArray(transforms[p.id]) }));
  return [...base, ...copies].map((instance) => {
    const { part, matrix } = instance;
    if (part.hinge && config.doors === "open") {
      const origin = new THREE.Vector3(...part.hinge.origin);
      const swing = new THREE.Matrix4().makeTranslation(origin)
        .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(...part.hinge.axis).normalize(), THREE.MathUtils.degToRad(part.hinge.open_deg)))
        .multiply(new THREE.Matrix4().makeTranslation(origin.clone().negate()));
      matrix.multiply(swing);
    }
    return instance;
  });
}
