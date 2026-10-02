# Configurator notes (moved from screenery-configurator worktree, 2026-09-29)

Joint-study renders: Dropbox/Screenery/configurator research/joints/

## ground truth/GROUND-TRUTH.md additions
**Configurator assembly correction (2026-09-11, display kits only).** The local
Birthday, Police, Fire Station, Princess and Space kits seat actual tab/socket
contours and use the universal 90° V-groove with 2 mm hinge skin, with the rigid
axis at the skin mid-plane and the flap following its receiver. Birthday keeps
24 mm back/9 mm front stock; measured seated exposed gaps are 17.421/17.451 mm.
Its 0–2 added panels per side use derived intermediate mating ends. Targeted
pose/glue-depth corrections and Fire Station's 0.731 mm middle-ply hinge trim
are recorded in the kit evidence. These are configurator geometry changes,
not revisions to source AI, assembly-manual approvals or manufacturing release.
Space also supports 0–2 added narrow panels independently per side; its
intermediate ends use Space's own socket/flap contours, with the donor/receiver
roles reversed from Birthday. [Space repeat evidence](../configurator/research/joints/space/repeat-model.md).
Princess supports 0–2 added left panels using its own mating contours. Right
repeats are unavailable with the existing P002 window: the upper added socket
merges into that opening. [Princess evidence](../configurator/research/joints/princess/repeat-model.md).
Model, measurements and bounded checks:
[configurator joint model](../configurator/research/joints/joint-model.md).

## tasks/todo.md additions
## Completed: Princess repeatable panels — 2026-09-11
- [x] Declare left/right units from source groups, including the repeated window leaf; derive Princess-native intermediate ends.
- [x] Export and check 0–2 per side in four layouts; verify seated joints, folded contacts and clearance to the right panel's window leaf.
- [x] Render base/+2+2 in four layouts and joint detail; inspect images, update evidence, pass lint/build. No commit or deploy.
Result: left supports 0–2; right is unavailable because its added upper socket merges into the P002 window (190.837 mm missing retaining-floor witness). Final kit preserves P002 and has only a left chain. [Evidence and renders](../configurator/research/joints/princess/repeat-model.md): 12 configurations, 36 joint poses, 144 contact pairs with zero failures, 11 current renders inspected. Birthday/Space regressions, lint and Webpack build pass. No commit or deploy.
## Completed: Space repeatable panels — 2026-09-11
- [x] Map Space wing units and native mating ends; extend the shared variant exporter only where needed.
- [x] Export Space with 0–2 extra panels independently per side; verify all nine counts in four layouts, seating, hinge angles and affected contacts.
- [x] Render base/+2+2 in four layouts plus joint detail; inspect images, update verification, run lint and build. No commit or deploy.
Evidence: [Space repeat model](../configurator/research/joints/space/repeat-model.md), [mesh receipt](../configurator/research/joints/space/mesh-check.json), and [renders/verification](../configurator/research/joints/verification.md). Both sides work: 36 configurations, 144 joint poses, 192 contact pairs with zero failures. Eleven images inspected and hash-bound. Birthday meshes/poses unchanged by the generalized exporter; its 128 contact pairs pass the updated checker. Lint and Webpack build pass.
## Completed: Configurator joint correction — 2026-09-10
Owner reopened the previous flap seating and angle result. Earlier completion claims below are superseded for this scope.
- [x] Measure Birthday tab/socket mesh contours and native hinge; write the joint model and resolve the 58.84/21.6 mm gap conflict.
- [x] Correct exporter joint placement and fold ownership; export all five kits using this worktree only.
- [x] Correct viewer repeat joints; verify Birthday base and +2/+2 in all four layouts.
- [x] Save rendered views and joint close-up; check actual mesh tab centres, notch bounds, depth gap and adjacent wall angles. Run lint and build with local Blob token unset.
- [x] Update configurator/PLAN.md 3D notes and report evidence. No commit or deploy.
Failure cases: swapped part labels, wrong flap rig owner, unseated source pose, bound-based false seating, wrong pivot depth/sign, accumulated copy angle error, and supports detached by flattening.
Evidence: [joint model](../configurator/research/joints/joint-model.md) and [verification with image links](../configurator/research/joints/verification.md). All five exports pass decoded-GLB seating/angle checks and 368 static contact pairs with zero failures. Birthday: 36 configurations, 144 joint poses; eight final renders plus joint/rear details inspected. Lint and Webpack production build pass with Blob token empty. Browser access declined; offline geometry renders used. No commit or deploy.
## Deferred: Configurator (owner-parked, 2026-09-10)
- Logo slots per design (`kit.owner.json` rectangles); until then the logo is placed by the image model from the brief.
- Room placement from a client photo; Magnific upscale of hero photos.
- Rotate OPENAI, Magnific, Porkbun and ADMIN_PASS secrets (pasted in chat / generated).
## Active: Configurator build — phase 0/1, 2026-09-10
- [x] Exporter `configurator/export/export_kit.mjs`: reads catalog-all `<design>-opened.json` + fold/opening/view files, undoes the baked 35° leaf opening (closed z-extent equals ply stock for all 11 leaves), bakes RGBA artwork over felt colour, writes meshopt/WebP GLB per part plus `kit.json` (layouts as rigid per-rig-group matrices, leaves with hinges, extras, pins) for Birthday, Police, Fire Station, Princess, Space; 1.1–9.3 MB per design.
- [x] Next.js app `configurator/app` (delegated scaffold, opus): catalog strip, three.js viewer (meshopt, RoomEnvironment, contact shadow, flat shading), layout / extras / doors controls, share links, quote sheet with local JSON store, generation and interpret routes behind `GENERATION_ENABLED`, sign-up stub, basic-auth admin. `npm run lint` and `npm run build` pass.
- [x] Browser check on port 3100: all five kits render with artwork and match the catalog-all look; Princess concave, Space concertina and open doors, Birthday extras toggle verified by screenshot; no console errors. Kits load in 10 s or more on the dev server — measured below, to be tightened in phase 1.
- [x] Generation pipeline (phase 2, first cut): keys in `configurator/app/.env.local` (gitignored). `/api/generate` = gpt-5.4-nano strict-JSON brief (summary echo, artwork instructions, logo placement, unsupported list) → gpt-image-2.5-sunburst `images/edits` on the viewer's own WebGL capture, logo passed as a second image; result saved under `data/renders/` and shown in the Photo tab with a stale marker; one free preview per browser, then an email sign-up whose verify link sets `sc_user`. Verified: Princess "sage, gold crowns, six panels" → photo in 34 s with "six panels" flagged unsupported; Police with a logo "above the main door" → placed correctly in 43 s. Lint and build pass.
- [x] Deployed: Vercel project `screenery-configurator` (Hobby, team saars-projects), private Blob store for renders/configs/quotes/signups (`src/lib/store.ts` switches on `BLOB_READ_WRITE_TOKEN`), env vars set for production+preview, Porkbun CNAME `design` → cname.vercel-dns.com. https://design.screenery.design serves kits, admin basic-auth works, a real generation with logo completed in 42 s and its render was read back from Blob. `.vercelignore` keeps `public/kits` in the upload (48 MB).
- [x] Repeatable panels, corrected after owner review (flaps not seated, angles wrong): research of the Raffles concertina session (`output/raffles-assembly-manual/fold_complete.py`) and `output/catalog-all/prepare_birthday_folds.py` established the joint model — hinge at the donor's flap root, flap moves with the socket owner, sockets are dovetail notches in the receiver's back ply — and showed catalog-all's banked Birthday pose leaves the left joint unseated (flap 92 mm from its sockets, both wings tilted −12° the same way, stabilizers world-aligned under tilted panels). The exporter now declares each joint (unit, flap, donor, receiver) in `designs.mjs`, seats it (unit wall coplanar with the fixed wall, joint edges 21.6 mm apart as measured on the seated right joint), squares stabilizers/toppers to their panel, folds layouts about the flap root with the catalog's ±45°, and writes a joint transform Q per side; the viewer chains copy k through Q^k and folds it about copy k-1's outer root. Verified by full-resolution captures: base and +2/+2 straight are flat and connected, concertina alternates 45°, concave/convex arc 45° per joint. Redeployed.
- [x] Repeatable panels (Birthday first, superseded): `designs.mjs` declares each side's wing unit (walls, stabilizer, topper, hinge flap; `inner_parts` for a flap that hinges with the panel inside); the exporter measures the step (neighbour edge to wing outer edge: 631 mm left, 591 mm right), the hinge line (fixed point of the wing/neighbour motion in each folded layout; −313 / 774 mm, matches a direct numpy check) and the joint angle per layout, and writes `kit.chain`. The viewer places copy k as the unit translated k steps then chained through joint k (same angle for concave/convex, alternating for concertina); GLTF scenes are cloned per instance. Set → Panels shows left/right steppers up to +2; quote summary carries the counts. Verified in the browser for all four layouts, no console errors; deployed.
- [ ] Next: face-texture generation (artwork consistent across cameras/layouts) per PLAN §6.1; logo slots once declared; Vercel hosting + `design.screenery.design` (needs Porkbun secret API key + Vercel access); real mail provider; moderation on uploads.
Note: the Claude preview runner is sandboxed to the main checkout, so the worktree dev server is started with `npm run dev -- -p 3100` from `configurator/app` and attached by URL.
- [ ] Exporter from `output/catalog-all` meshes/textures/poses → GLB parts + `kit.json` for Birthday, Police, Fire Station, Princess, Space; contact sheet check against catalog-all renders.
- [ ] Next.js app `configurator/app`: catalog, three.js viewer, layout/extras controls, share links, quote form stored locally; generation routes wired behind `GENERATION_ENABLED=false`; sign-up gate stub.
- [ ] Verification: each kit loads and matches its catalog-all render side by side; controls change geometry deterministically; quote round-trips to storage; browser check with screenshots.
## Completed: Configurator web app — plan, 2026-09-10
- [x] Survey brief inputs: image library categories, banked 3D references and `output/catalog-all` normalized meshes, render pilot, current site hosting (Next.js on Vercel, Porkbun DNS), current image/text model APIs and the Magnific API.
- [x] Independent GPT-6 Astra plan (codex exec, read-only) on the same brief, saved with the research notes under `configurator/research/`; each difference adopted, changed or rejected with a reason in PLAN.md §14.
- [x] `configurator/PLAN.md` v3: geometry-first architecture, data model, exporter from catalog-all, generation pipeline, one-page UX, phases, risks, costs, owner decisions.
- [x] Verification: external model/price/API claims carry sources in the research notes; repo claims carry paths; catalog-all and the Magnific Nano Banana Pro endpoint were verified directly. No code written, no commits.
- [ ] Survey brief inputs: image library categories, banked 3D references, render pilot, current site hosting, current image/text model APIs and Magnific API.
- [ ] Launch an independent GPT-6 Astra plan (codex exec, read-only) on the same brief; compare with own plan and adopt or reject its differences explicitly.
- [ ] Write `configurator/PLAN.md`: architecture, data model, 3D reuse, generation pipeline, UX, phases, risks, costs, owner questions.
- [ ] Verification: every external model/price/API claim carries a source; every repo claim carries a path; the Astra comparison lists each adopted/rejected item.

## Moved into the website (2026-10-01)

The configurator now lives in the main site repo as a temporary, unlinked section at `/configurator`
(pages `src/app/configurator/`, APIs `src/app/api/configurator/`, code `src/lib/configurator/`, admin basic
auth in `src/proxy.ts`, kits in `public/configurator/kits/`). The exporter and checks are in
`configurator/export/` and write kits there; geometry, artwork and rules still come from the codex checkout.
Local-only (gitignored): `configurator/local/` holds the old env files, Vercel link and runtime test data;
runtime data now goes to `data/configurator/`. Its env keys were merged into the site's `.env.local`;
the site's Vercel project does not have them yet, so generation, Blob storage and admin are off on previews.
The separate repo `~/Documents/screenery-configurator-app` was deleted; its backup mirror remains at
`~/git-mirrors/screenery-configurator-app.git`. The old deployment at design.screenery.design (Vercel project
`screenery-configurator`) is still live.
