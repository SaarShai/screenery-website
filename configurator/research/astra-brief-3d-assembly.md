# Brief: 3D modelling and panel assembly for the Screenery configurator

Owner: Saar Shai. Date: 2026-09-10. You are Codex (gpt-6-astra) working in this
git worktree on branch `codex/configurator`. Do not touch the main checkout at
`/Users/za/Documents/screenery fresh codex` (another session works there).
Read AGENTS.md, BEHAVIOR.md and RULES.md — Core first; they are the house rules.

## What the owner wants

Own the 3D side of the web configurator (`configurator/app`, Next.js 16 +
react-three-fiber): every design's panels must render as a correctly assembled
set, with each joining flap physically inserted into the neighbouring panel's
sockets, and with the wall angle (straight / concave / convex / concertina)
produced by folding about the flap hinge. Then make panel add/remove work on
that same joint model (Birthday first: up to 2 extra narrow panels each side).

The previous attempt (Claude) got it wrong twice. The owner's verdict:
"the flaps are not in the sockets" and "the panels are not at 45 degrees to
each other". Do not trust that attempt's geometry reasoning; verify it against
the assembled source models and rewrite what is wrong.

Deliverables, in this order:

1. A written model of the joint (flap, sockets, hinge axis, which rig group the
   flap moves with, fold sign per layout) derived from the assembled source
   models and the existing fold code, with numbers measured from Birthday.
2. `configurator/export/export_kit.mjs` producing kits where every declared
   joint is seated and every layout folds about the hinge. Re-export all five
   kits (birthday, police, fire-station, princess, space).
3. `configurator/app/src/app/Viewer.tsx` (and `src/lib/config.ts`,
   `controls/SetGroup.tsx` as needed) rendering those kits, plus the Birthday
   extra-panel mechanism: copies must be connected flap-in-socket, hinged at
   45° for the folded layouts, alternating for concertina.
4. Evidence: rendered captures (viewer or offline three.js/Blender) of Birthday
   base and +2/+2 in all four layouts, with a close-up of one joint, plus a
   numeric check (flap tab centre inside socket notch bounds, gap, angle).
5. Update `tasks/todo.md` (worktree) and `configurator/PLAN.md` §3D notes.
   Do not commit; the owner commits.

## Where the truth is

- `ground truth/GROUND-TRUTH.md` § "Flaps and sockets"; `ground truth/rules.json`.
  A joining flap is the panel's back ply extended past the edge with dovetail
  tabs; it slides into dovetail socket notches cut in the outer contour of the
  neighbour's back ply. The hinge is a V-groove at the flap root on the donor.
- Assembled 3D sources (Illustrator-derived rigs) and the fold generator:
  `output/catalog-all/` — `README.md`, `STATE.md`, `prepare_birthday_folds.py`,
  `flap_fold.py`, `check_flap_attachment.py`, `birthday-rigged.json`,
  `birthday-fold-check.json`, `birthday-flap-material-check.json`,
  `birthday-joint-detail.png`, `export-catalog-all.cjs`, `*-rigged.json` for
  the other designs. README § "Doorway corrections — 2026-09-08" documents the
  Birthday flap receiver-group and pivot fixes.
- Raffles, the design whose panels were tilted correctly:
  `output/raffles-assembly-manual/fold_complete.py`, `assembly.json`,
  `build_meshes.py`, `check_motion.py`. Codex thread
  codex://threads/01a089f7-7e0b-7df0-b383-b52da6bac81f did that work.
- Assembly manuals for the five kit designs: `ground truth/<design>-assembly-manual.md`.
- Kit format: `configurator/KIT-SCHEMA.md`; exporter `configurator/export/designs.mjs`
  (declarations incl. the Birthday `chain` block) and `export_kit.mjs`.
- App plan: `configurator/PLAN.md`; earlier research: `configurator/research/`.

## Known defects to check, found by the previous attempt (verify, do not assume)

- catalog-all Birthday "straight" pose: left narrow panel's flap ~92 mm from
  its sockets (unseated); both wings yawed −12° in the same sense; stabilizers
  world-aligned under tilted panels; the two narrow panels' part_id names
  mirrored relative to row ids.
- The current exporter "seats" joints into a flat chain with a 21.6 mm edge
  gap and writes a per-side joint transform `chain.sides.<side>.step`
  (col-major 4×4) plus `joints[layout].{angle_deg,pivot_z_mm,alternate}`;
  the viewer applies `place[k]=Q^k` and folds about `hinge` transformed by
  `place[k-1]`. The owner still sees flaps outside sockets and wrong angles.
  Establish independently whether the socket notches and flap tabs overlap in
  the exported GLBs (measure the meshes, do not infer from bounding boxes).
- Birthday's source keeps 24 mm back stock and 9 mm front/leaf patch; do not
  convert to a three-ply stack. README notes a ~58.84 mm straight-pose panel
  gap with an exposed flap in the accepted source — reconcile with the 21.6 mm
  used by the exporter and state which is right and why.

## Environment

- Worktree: `/Users/za/Documents/screenery-configurator`. App:
  `configurator/app` (`npm run dev` on port 3100 may already be running;
  `npm run build` must pass, lint clean). Exporter: `cd configurator/export &&
  node export_kit.mjs <design>` (see its header for usage). Kits land in
  `configurator/app/public/kits/<design>/` (gitignored, ~48 MB total).
- Python 3 with trimesh/numpy is available for mesh checks; Blender if needed.
- Secrets live only in `configurator/app/.env.local`; never commit them.
  Local dev must not write to the production Blob store (leave
  `BLOB_READ_WRITE_TOKEN` unset locally).
- Deploy is `npx vercel deploy --prod --yes` from `configurator/app`; do not
  deploy — the owner will after review.
- Write in Simplified Technical English. Keep the diff minimal; fix root
  causes; no new dependencies without a stated reason.

Report back with: the joint model, what was wrong in the previous attempt,
what you changed, and the evidence images/numbers.
