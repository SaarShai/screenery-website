# Kit schema v1 (`screenery.kit/v1`)

A kit is the web asset package for one design variant. The exporter writes
it from `output/catalog-all`; the app only reads it. Units are mm, Y up,
floor at y = 0, straight layout seated from actual tab/socket contours.

```
kits/<id>/kit.json
kits/<id>/parts/<part-id>.glb
kits/<id>/textures/<face-id>.webp
kits/<id>/contact-sheet.png          exporter check image, not served
```

```jsonc
{
  "schema": "screenery.kit/v1",
  "id": "space",                       // slug, folder name
  "name": "Spaceship",
  "units": "mm", "up": "y",
  "source": { "catalog_all": "output/catalog-all/<file>", "pins": { "<path>": "<sha256>" } },
  "palette": { "front": "#RRGGBB", "middle": "#RRGGBB", "back": "#RRGGBB" },
  "rear_artwork_policy": "mirrored",   // owner default 2026-09-10
  "bounds_mm": { "min": [x, y, z], "max": [x, y, z] },   // straight layout, default parts

  "parts": [
    {
      "id": "left-panel",               // slug of the catalog-all part_id
      "label": "Left panel",
      "kind": "wall" | "support" | "extra" | "topper" | "leaf" | "backing" | "flap",
      "variant_of": null | "<terminal part id>", // linked intermediate; hidden unless selected
      "glb": "parts/left-panel.glb",   // geometry in kit world space, straight layout
      "quantity": 1,
      "extra_id": null | "rocket",     // set when the part belongs to an optional extra
      "leaf_of": null | "<part id>",   // leaves and backings attached to a wall
      "hinge": null | { "origin": [x, y, z], "axis": [x, y, z], "open_deg": 35 },
      "plies": [ { "id": "left:front", "role": "front" | "middle" | "back" | "door-back" } ]
    }
  ],

  "faces": [
    { "id": "left-panel:front", "part_id": "left-panel", "ply_id": "left:front",
      "role": "front", "texture": "textures/left-panel-front.webp",
      "rect_mm": [x0, y0, x1, y1] }    // printed rectangle in the ply's plane, for logo slots
  ],

  "layouts": [
    { "id": "straight", "label": "Straight",
      "transforms": { "<part id>": [16 numbers, column-major, relative to straight] } }
    // ids: straight | concave | convex | concertina — checked after kit corrections
  ],

  "extras": [ { "id": "rocket", "label": "Rocket", "part_ids": ["rocket", "rocket-base"], "default_on": true } ],

  "cameras": {
    "front":    { "azimuth_deg": 0,   "elevation_deg": 0 },
    "oblique":  { "azimuth_deg": 25,  "elevation_deg": 7 },
    "low_hero": { "azimuth_deg": 15,  "elevation_deg": 0 },
    "rear":     { "azimuth_deg": 180, "elevation_deg": 4 }
  },

  "logo_slots": []                     // owner-authored later: { id, label, face_id, rect_mm, max_logo_mm }
}
```

GLB rules:

- One glTF node per part, one mesh primitive per ply face group. Triangles
  listed in the catalog-all `art_faces` of a printed ply form a textured
  primitive; all other triangles of that ply form a plain primitive.
- Textured primitives use an opaque `baseColorTexture` in which the artwork
  is already composited over the ply's felt colour, so alpha blending is
  never needed at runtime. Pixels whose UV fell outside the source image
  are felt colour.
- Plain primitives use `baseColorFactor` = the ply role's palette colour.
- Meshopt compression with lossless float32 positions; WebP textures ≤ 2048 px.
  Do not quantize positions coarsely or simplify mating contours.
- Names: node name = part id; primitive material name = `<ply id>:<art|felt>`.

## Seated joints and panel repeats

`joints[]` contains `{donor, receiver, flap, hinge_mm, seating}`. IDs refer to
parts; `hinge_mm` is a point on the vertical axis in the straight kit frame.
`seating` records contour refinement. `geometry_repairs[]` records targeted
source corrections. Source pins include geometry rules and exporter code.

Optional `chain` is `{max_extra: 2, sides: {left, right}}`. Each side contains:

- `part_ids`: parts following the outer copied wall.
- `inner_part_ids`: parts following the inner wall (receiver-owned flap).
- `linked_parts`: original ID → intermediate variant ID; used only when another
  panel is attached outside that panel. Variants have `variant_of` in `parts`.
- `step_x_mm`: signed straight translation per copy; `step_mm`: its magnitude.
- `hinge_mm`: base joint point, translated by k steps for copy k.
- `joints[layout]`: `{angle_deg, alternate}`; concertina alternates relative turns.

`app/src/lib/assembly.ts` is the single pose implementation. It composes each
outer fold with the inner frame, then applies copy placement; optional leaf
opening is composed last. The base terminal changes to a linked variant when
copies are present, and the outermost copy remains terminal. See the
[joint model](research/joints/joint-model.md) for geometry and verification scope.
