// Kit shapes are `screenery.kit/v1` (see configurator/KIT-SCHEMA.md). Only the
// fields the app reads are typed; the exporter writes more.

export type KitPart = {
  id: string;
  label: string;
  kind: "wall" | "support" | "extra" | "topper" | "leaf" | "backing" | "flap";
  glb: string;
  variant_of?: string | null;
  extra_id: string | null;
  leaf_of?: string | null;
  hinge?: { origin: [number, number, number]; axis: [number, number, number]; open_deg: number } | null;
};

export type ChainSide = {
  part_ids: string[]; // move with copy k
  inner_part_ids: string[]; // the joint flap when it belongs to the panel inside the copy (copy k-1)
  linked_parts: Record<string, string>; // intermediate variant when an outer panel is attached
  step_x_mm: number;
  step_mm: number;
  hinge_mm: [number, number, number];
  joints: Record<string, { angle_deg: number; alternate: boolean }>;
};

export type Kit = {
  id: string;
  name: string;
  palette: { front: string; middle: string; back: string };
  bounds_mm: { min: [number, number, number]; max: [number, number, number] };
  parts: KitPart[];
  layouts: { id: string; label: string; transforms: Record<string, number[]> }[];
  extras: { id: string; label: string; part_ids: string[]; default_on: boolean }[];
  cameras: Record<string, { azimuth_deg: number; elevation_deg: number }>;
  logo_slots: { id: string; label: string }[];
  chain?: {
    max_extra: number;
    sides: Partial<Record<"left" | "right", ChainSide>>;
  } | null;
};

export type DesignSummary = { id: string; name: string; thumbnail: string };

export type Config = {
  kitId: string;
  layout: string;
  extras: string[];
  doors?: "closed" | "open";
  wings?: { left: number; right: number }; // extra repeatable panels per side
  theme: { preset?: string; text?: string };
  palette: string[];
  logo?: { name: string; dataUrl: string; slotId?: string };
};

export function defaultConfig(kit: Kit): Config {
  return {
    kitId: kit.id,
    layout: kit.layouts[0]?.id ?? "straight",
    extras: kit.extras.filter((e) => e.default_on).map((e) => e.id),
    doors: "closed",
    wings: { left: 0, right: 0 },
    theme: {},
    palette: [],
  };
}

export const THEME_PRESETS = ["Classic", "Playful", "Calm", "Bold", "Seasonal"];

export const SWATCHES = ["#d9d2c5", "#8b7355", "#c4a97d", "#6b6b6b", "#1a1a1a", "#f5f3ef"];
