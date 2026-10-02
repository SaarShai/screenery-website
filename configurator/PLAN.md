# Screenery configurator — build plan

Status: v3, 2026-09-10. Written after six parallel research passes
(§13, notes in [research/research-2026-09-10.md](research/research-2026-09-10.md))
and an independent GPT-6 Astra plan on the same brief
([research/astra-plan-2026-09-10.md](research/astra-plan-2026-09-10.md), compared in §14).
Owner decisions are collected in §12. Branch `codex/configurator`,
worktree `~/Documents/screenery-configurator`.

## 1. Goal and scope

A one-page web app under `screenery.design` where a hotel client picks a
Screenery design or describes a bespoke one, customizes it, sees it in 3D
and in generated photos, and sends the result to Screenery as a quote
request. The current site already sells this way: "Request Quote" posts
name, company and email to `/api/contact`; there is no checkout.

v1 scope:

- Catalog of standard designs with a 3D viewer.
- Customization: theme and style (chips plus one free-text box), palette,
  logo in owner-defined slots, panel count from allowed variants, extras,
  bounded dimensions, wall layout (straight, concave, convex, concertina).
- Generated mockup photos of the configured product (studio shot).
- Quote request carrying the frozen configuration and images.

Later: hotel-room placement from a client photo, new silhouettes, accounts,
payment.

## 2. Guiding decision: geometry is deterministic, artwork is generative

The product is a set of cut felt plies. Panel count, dimensions, extras,
layout and logo placement are geometric facts, so no diffusion model is
asked to get them right. Artwork is where creativity is wanted.

| engine | owns | technology |
|---|---|---|
| Kit engine (3D) | parts, chain, layout poses, dimensions, extras, logo slots, cameras | three.js; GLB parts exported from the banked geometry already normalized in `output/catalog-all/` |
| Art engine (generative) | artwork textures per printed face, restyles, hero and room photos | gpt-image-2.5 (OpenAI) with pixel masks; Nano Banana Pro via Magnific as the alternative; Magnific upscale, relight, style transfer |

The art engine paints textures for the 3D model. The 3D model is rendered
for the mockup. Consequences:

- One generation gives artwork consistent across every camera, layout and
  panel count. Adding a panel or folding a wall needs no regeneration.
- Logos and exact wording are composited into the texture at an exact
  rectangle, with real fonts for text. The image model never touches them
  (§13.5: no diffusion route keeps small marks pixel-faithful).
- Unprinted regions (slots, flaps, margins) are masked exactly as production
  requires, from the existing artwork masks.
- A "photo" is a second, low-strength pass over the 3D render, then a
  Magnific Precision upscale. Geometry cannot drift because the render is
  the reference; the logo is re-composited from projected slot corners if
  the pass moved it.

This reuses owner-approved assembled models instead of asking an image model
to invent the product.

## 3. Architecture and stack

```
browser: Next.js page + three.js viewer (also captures the reference render)
   │ config JSON, uploads, render PNG
   ▼
Next.js route handlers (TypeScript)
   /api/interpret          free text + chips → strict JSON + one-line echo
   /api/generate           enqueue job (textures | photo | room)
   /api/jobs/:id           poll
   /api/webhooks/magnific  HMAC-verified callback
   /api/quote              freeze revision, store, email Screenery
   /api/c/:id              load a shared configuration
storage: R2 or Vercel Blob (uploads, textures, renders); Postgres (Neon) for revisions, jobs, quotes
offline: Node exporter in this repo → kit.json + GLB parts + masks, published as static assets
```

Decisions:

- **Frontend.** Next.js App Router, TypeScript, three.js with
  react-three-fiber and drei (GLB loading, RoomEnvironment lighting,
  contact shadows). Viewer bundle about 189 KB gzipped plus lazy decoders.
  Tailwind with the site's tokens (§8). Poster image shows before 3D loads;
  image-only path when WebGL is unavailable.
- **Backend.** Same Next.js project. Generation calls take 5–120 s, so jobs
  run in background functions with polling; Magnific results arrive by
  webhook. The reference render for a job is captured from the client's
  own canvas and uploaded with the job, so v1 needs no server-side WebGL.
  A worker with headless Chromium is added only when server renders are
  required (room placement v2).
- **Hosting.** The marketing site is Next.js on Vercel with DNS at Porkbun
  (§13.3). Deploy the configurator as a separate Vercel project on
  `design.screenery.design` (one CNAME, no change to the marketing site).
  If the owner wants one domain, a `vercel.json` rewrite from `/design/*`
  with `basePath` is the documented alternative; it needs a commit in the
  site repository.
- **Models.** Images: `gpt-image-2.5-sunburst` (editing precision, alpha
  masks, high input fidelity) and `gpt-image-2.5-flare` (fast previews);
  Nano Banana Pro through Magnific's `text-to-image/nano-banana-pro`
  endpoint (14 references, 1K–4K, webhook) as the evaluated alternative and
  operational fallback, which the repository already used for Raffles.
  Text: `gpt-5.4-nano` non-reasoning with strict JSON schema; `gpt-5.6-luna`
  is the same price and is tested alongside it in Phase 0. One OpenAI
  account plus the existing Magnific account cover everything.
- **Secrets.** Keys live in `.env.local` and the Vercel secret store only.
  The Magnific key and webhook secret shared in chat are not written to
  this repository and should be rotated, since they were pasted in plain
  text.
- **No accounts.** A configuration gets a short id and a share URL. Admin
  is basic auth. Generation has an environment kill switch that leaves the
  catalog, saved previews and quotes working.

## 4. Data model

```
Design      id, name, family (screen|pod|bedwrapper|xl), tags (standard|city|bespoke-base),
            variants[] → Kit, thumbnail, site_price_from, default_config
Kit         id (design+variant), source_pin (catalog-all receipt hashes), manifest_url,
            parts[], chain, layouts[], extras[], dimensions, cameras, palette, rear_artwork_policy
  part      id, role (panel|subpanel|stabilizer|topper|extra|backing|leaf), glb_url,
            matrix_world, quantity, hinge? {axis, range}, printed_faces[]
              {face_id, rect_mm, mask_url, logo_slots[] {id, label, rect_mm, max_logo_mm}}
  chain     repeatable_part_ids[], min_panels, max_panels        (owner-authored)
  layouts   named validated poses from catalog-all (straight, concave, convex, concertina)
  extras[]  id, name, part_ids[], default_on
  dimensions size_variants[] | height_band {min, max}            (owner-authored)
Revision    id, parent_id, kit_id, panels, layout, extras[], dimensions{}, theme{preset?, text?},
            palette[], logo{asset_id, slot_id, fit}, exact_text[], art_version_id, created_at
            (immutable; every change is a new revision; a job binds to one revision)
ArtVersion  id, revision_id, brief, prompt_template_version, model, references[], textures[] {face_id, url}, cost
Render      id, revision_id, art_version_id, camera, kind (studio|photo|room), url
Asset       id, kind (logo|room_photo|texture|render), url, sha256, session_id, retention_at
Quote       id, revision_id (frozen), contact {name, company, email}, sets, country, target_date,
            notes, renders[], status
Job         id, kind, revision_id, status, provider_task_id, attempts, cost, timings, error
```

Rules: a panel is a physical wall (a modular panel with subpanels counts
as one); manufacturing rules (variants, extras, bands, slots, rear artwork
policy) are owner-authored fields in `kit.owner.json`, never model
guesses; a quote freezes its revision and assets so later catalog updates
cannot change what was requested. Persisted assets, not seeds, make a
selected design reproducible.

## 5. 3D pipeline (kit engine)

### 5.1 What exists

`output/catalog-all/` (2026-09-07/08) already normalized the banked designs
into one shape for Blender: `<design>-meshes.json` is a list of plies with
`id, part_id, role, vertices_mm, normals, triangles, uv, image, art_faces,
cut_loops_mm`, plus baked artwork textures, per-design felt palettes
(`material-palettes.json`), validated wall layouts (straight, concave,
convex, concertina), hinge axes and camera-specific leaf poses, and 53
studio renders across 14 designs. That is the exporter's input; the older
per-design schemas in `references/` are no longer the starting point.

| status | designs |
|---|---|
| meshes.json on disk | Birds Nest, Cafe 2-Hatches, Castle XL (unprinted, no artwork), Great Wall, Hospital, Kitchen, Marine Bedwrapper, Munich Airport, Princess, Water Cube, Zurich |
| produced by the same adapters at render time | Space, Police, Fire Station, Birthday (re-run the adapter to write meshes.json) |
| newer manuals with their own `meshes.json` | Raffles, Arabian Nights, St Regis Rome, Anantara (schema check first) |
| no banked assembly | Reading Corner, Gingerbread (Festive), city sets |

Castle XL's source model has no mapped print artwork, so the catalog shows
it with photos and a stone palette until textures are banked.

### 5.2 Exporter

`node configurator/export/export_kit.mjs <design>` reads catalog-all opened
meshes and fold/opening/view receipts from this worktree. It closes leaves,
seats actual tab/socket contours, restores the universal 90° groove with 2 mm
hinge skin, and folds about the skin mid-plane with receiver-owned flaps.
Python geometry operations use the repository's existing numpy/shapely/manifold
packages. No source AI is modified.

All five local kits now provide straight, concave, convex and concertina.
Princess supports 0–2 left panels; its right window prevents a complete added
socket ([evidence](research/joints/princess/repeat-model.md)). Birthday and Space
support 0–2 added panels independently on each side, with derived
intermediate mating ends and unchanged terminal contours. The viewer and
checks share `app/src/lib/assembly.ts`; each copy folds at its own translated
hinge. Leaves use separate IDs and native 35° opening axes.

One GLB per part contains registered artwork composited over felt, WebP
textures ≤2048 px, and meshopt with lossless float32 positions. No contour
simplification or coarse position quantization is applied. `kit.json` records
joints, variants, transforms, geometry corrections, and source/code hashes.

The [joint model](research/joints/joint-model.md) supersedes earlier 21.6 mm
seating and copy-pivot claims. Each design folder contains decoded-GLB numeric
checks and static exact-solid contact checks. Birthday has eight base/+2+2
renders plus rear/joint details; all nine count combinations are checked in
all four layouts. Images use offline decoded geometry and shared Three.js
poses; browser permission was declined. This checks display assembly, not a
manufacturing release or continuous-motion safety envelope.

Reproduce from repository root:

```sh
node configurator/export/export_kit.mjs birthday
node configurator/export/check_kit.mjs birthday
.venv/bin/python configurator/export/check_contacts.py birthday
.venv/bin/python configurator/export/render_meshes.py birthday
```

Repeat the first three commands for police, fire-station, princess and space.
Local app checks use an empty `BLOB_READ_WRITE_TOKEN`; lint and a Webpack
production build are required. Default Turbopack cannot bind its internal port
in this sandbox. No deployment is included in this correction.

### 5.3 Parametrization

| change | how | boundary |
|---|---|---|
| layout | switch between the design's validated poses | catalog-all poses only |
| panel count | repeat the owner-declared repeatable wall(s) with their stabilizers along the chain | `min_panels`–`max_panels`; the quote is flagged "structural variant, design review before manufacture" |
| extras | toggle complete extra assemblies (part plus its stabilizers) at manifest positions | owner list only |
| dimensions | pick an approved size variant; where the owner declares a height band, uniform scale within it with slots and stock fixed and the footprint shown live | owner variants and bands; other numbers are recorded as a request with units |
| bedwrapper | bed width, length and mattress height inputs → fit template (later) | owner fit rules |
| logo and exact text | write into the face texture at the slot rectangle, contain-fit, clear space, readable on rear faces | owner slots only |
| artwork | swap face textures for an ArtVersion | printed faces only |

The 3D view is a visual mockup. Anything structural still passes the
production workflow (cardify, check, release) before manufacture, which is
how the repository already treats structural variants.

A "3D model of a bespoke design" means, in order of delivery: a base kit
with new artwork and the changes above (v1); a new configuration within an
approved modular family (family by family); a new silhouette, which the app
turns into a concept image and a bespoke quote for design review.

### 5.4 Viewer

Orbit with limits, named cameras (front, oblique, low hero, rear), room
environment lighting, soft contact shadow, matte felt material using the
catalog-all palette with a subtle fuzz normal map. The client's canvas
capture is the reference render for generation, so the reference always
matches what the client sees.

## 6. Image generation pipeline (art engine)

Inputs per job: printed and clay renders of the current revision, face
masks, the structured brief (§7), palette, family style notes, and two or
three catalog photos as style references, each reference given an explicit
role in the prompt (geometry, composition, aesthetic, continuity).

1. **Texture generation (default).** One `images/edits` call per design
   with `gpt-image-2.5-sunburst`: the unfolded chain of printed faces is
   laid out as one composition image (so scenes continue across seams), the
   alpha mask limits painting to printed regions, references follow,
   `input_fidelity: high`. The result is cut back into registered face
   textures. Rear faces follow the kit's rear artwork policy (independent,
   mirrored, repeated or unprinted). Flare at low quality for the first
   quick preview. Local edits regenerate the smallest region and composite
   it back; application-side masks enforce the final boundary.
2. **Hero photo.** Studio render of the full assembly → low-strength edit
   "photorealistic product photo, felt texture, soft studio light" → Magnific
   Precision v2 upscale (flavor photo, 2× per pass) → logo re-composite.
3. **Room placement (later).** v1: three stock hotel rooms with known
   camera and floor, rendered deterministically. v2: client photo → metric
   depth (Depth Pro or Depth Anything 3) → floor plane → client marks the
   spot → camera-matched render → composite → Magnific Relight with the
   room as light reference, or a Sunburst / Nano Banana Pro multi-reference
   edit, whichever wins the bake-off → logo re-composite. Scale is labelled
   approximate without a known measurement.
4. **Restyle of existing artwork.** Magnific Style Transfer with high
   `structure_strength`, or a masked Sunburst edit, chosen per case.

Creative changes are batched behind an "Update preview" button; typing
never triggers a paid call. Before generating, the app shows a one-line
interpretation of the brief for inline correction. Jobs persist with
states, bounded retries and duplicate suppression; the last good preview
stays visible and is marked stale when the revision changes. Caches:
catalog assets; renders by (revision, camera, renderer version); artwork by
(brief, base artwork, references, mask, model); composites by (artwork,
logo placement). Client-branded outputs are private. Three anonymous
generations per session, then an email gate with a bounded allowance;
staff can extend it. OpenAI moderation on text and uploads; SVG logos are
sanitized. Outputs carry C2PA (OpenAI) or SynthID (Gemini) provenance.

## 7. Text interpretation

`gpt-5.4-nano`, reasoning off, strict JSON schema. Input: free text, chip
state, the kit's allowed options, current revision, optional logo/photo.
Output: `{intent, option_changes[], artwork_brief{theme, motifs, palette,
style, composition}, preserve[], exact_text[], unsupported_requests[],
ambiguity?, summary}`. The application validates every field against the
kit; an unsupported request (four panels on a three-panel kit, a licensed
character) is kept as a review note and never silently substituted. About
$0.007 per ten calls; ~2.7 s per call measured by third parties, to be
confirmed in Phase 0 against `gpt-5.6-luna`.

## 8. UX (one page)

```
┌────────────────────────────────────────────────────────────────────┐
│ Screenery™ · Design your set                       [Share] [Quote] │
├──────────────────────────────┬─────────────────────────────────────┤
│ 3D viewer (drag to orbit)    │ 1 Design   gallery strip · "Describe"│
│ [Front] [Oblique] [Photo]    │ 2 Look     theme chips + one text box│
│                              │            palette swatches          │
│                              │ 3 Logo     drop zone → slot picker   │
│                              │ 4 Set      panels − 3 +  layout ⌐¬   │
│                              │            extras ☐☐☐   size S M L   │
│                              │ "Sage palette, logo on the sign." ✎  │
│                              │ [Update preview] ~30 s   ↶ history   │
└──────────────────────────────┴─────────────────────────────────────┘
```

Rules: no wizard, no modal chains, no login. Every control has a default so
the first view is a finished product. Deterministic changes apply
instantly; creative changes wait for "Update preview". Free text is one
box ("What would you like to change?"). A short history strip and undo.
"Quote" opens name, company, email, number of sets, delivery country,
target date and notes, and submits the frozen revision with renders.
Mobile: viewer on top, controls in a sheet, persistent primary action.
Keyboard and screen-reader usable; dimensions and selections are also
shown as text. Marketing-site collection cards deep-link into the
configurator with the design preselected, so the site stays the gallery.

Visual language matches the site: off-white `#fafaf8`, ink `#1a1a1a`,
bronze accent `#8b7355`, gold hover `#c4a97d`, hairline borders `#e5e2dc`,
Helvetica Neue stack at light weights, uppercase tracked micro-labels, ghost
buttons. Reuse `/images/screenery logo.svg` and the model thumbnails.

## 9. Quote and back office

Quote email to Screenery, sent the way the site's contact API sends today
(SES, to confirm) or via Resend, with a handoff package: original brief and
interpreted selections, frozen revision, selected renders, original logo
and exact text with placements, generated flat artwork with face mappings,
dimensions and supplied inventory, unsupported requests and open
approvals. `/admin` (basic auth): quotes with status, cost per quote, and
allowance extension. Prices stay "From £…" as on the site unless the owner
supplies rules (§12).

## 10. Phases

| phase | deliverable | check |
|---|---|---|
| 0 Foundation (wk 1) | Next.js app on `design.screenery.design`; exporter from catalog-all for Space, Princess, Great Wall; static viewer; billed smoke tests: Magnific key on `api.magnific.com`; Sunburst vs Flare vs Nano Banana Pro on 24 briefs (masked faces, coordinated scenes, logo re-composite, three room photos), two attempts each, blinded owner pick; nano vs luna latency | kits load under 3 s; side-by-side match with catalog-all renders; measured cost and latency per operation; budget $50–150 |
| 1 Kit controls (wk 2–3) | all catalog-all designs exported; `kit.owner.json` for slots, chain, layouts, extras, bands; controls; logo and exact-text compositing; share links; quote email and admin | each control changes geometry deterministically; logo pixel-identical in texture and render; a staff member can reconstruct any quote exactly |
| 2 Art engine (wk 3–5) | interpret → JSON with echo; coordinated texture generation; hero photo + upscale; jobs, cache, caps, moderation, kill switch | ten themes × three designs reviewed by owner; multi-edit sequences show no drift; cost per accepted result logged |
| 3 Bespoke and remaining designs (wk 5–7) | "Describe your design" on base kits; Raffles, Arabian Nights, Rome, Anantara kits; photo-only entries for designs without assemblies | owner review |
| 4 Room placement (later) | stock rooms → client photo with depth-assisted placement and relight | owner review on 10–20 real rooms |
| 5 Polish | analytics (select → customize → generate → quote), performance, accessibility | Lighthouse ≥ 90; keyboard use; first visual under 2 s |

Roughly six to seven weeks to a public launch with phases 0–3; room
placement follows. Staging and production use separate credentials;
catalog kits are released independently of app deploys.

## 11. Risks

| risk | mitigation |
|---|---|
| image model alters geometry or logos | geometry-first pipeline; masks; fonts for text; homography re-composite |
| preview implies an unsupported product | owner-declared capabilities per kit; visible "review required" status; staff approval before a binding quote |
| artwork drifts over repeated edits | edit the persisted artwork locally; history; same reference composition |
| designs without banked assemblies | ship catalog-all designs first; others via cardification or photo-only entries |
| cost runaway or abuse | per-session, email and IP limits; cache; low-quality previews; daily spend cap; kill switch |
| latency 30–120 s per photo | instant 3D first; photo is optional and async; stages shown truthfully |
| serverless limits | background functions; client-captured renders; worker only for v2 room placement |
| licensed characters, third-party marks | moderation; catalog rules in the interpreter; client confirms it owns the logo |
| client data (room photos, logos) | private bucket, signed URLs, 90-day retention for abandoned uploads, delete on request; provider retention stated accurately |
| screen colour differs from felt and print | stock felt colours separated from artwork palettes; proof review at quoting |
| vendor model or billing changes | versioned prompt templates; small regression set; evaluated fallback (Nano Banana Pro via Magnific); use `api.magnific.com` from day one |

## 12. Owner decisions (answered 2026-09-10)

| decision | answer |
|---|---|
| Order meaning | quote request, no checkout |
| Launch catalog | Birthday, Police, Fire Station, Princess, Space first |
| Panel counts and dimensions clients may change | decide later; none exposed until declared, requests recorded |
| Logo slots per design | decide later; mechanism built, control hidden until `kit.owner.json` declares slots |
| Pods, XL, bedwrappers | ignore for now |
| Rear artwork policy | as in each design's data; mirrored front by default |
| Domain | decide later; build for `design.screenery.design`, subpath stays possible |
| Prices | not yet |
| API accounts and budget | owner supplies keys soon; generation stays behind the kill switch until then |
| Free allowance | one anonymous generation, then sign-up with email verification for more |
| Still open | felt colours vs palettes, illustration styles, retention, reviewer, provenance marks (defaults from v3 apply) |

## 13. Research results (2026-09-10)

Full notes with sources: [research/research-2026-09-10.md](research/research-2026-09-10.md).

### 13.1 Text model

| model | in / out per 1M tokens | JSON schema | vision | ~cost per 10 calls |
|---|---|---|---|---|
| `gpt-5.4-nano` (reasoning off) | $0.20 / $1.25 | strict | yes | $0.007 |
| `gpt-5.6-luna` | $0.20 / $1.20 | yes | yes | $0.007 |
| `gpt-5-nano` | $0.05 / $0.40 | strict | yes | $0.002 |
| `claude-haiku-4-5` | $1.00 / $5.00 | yes | yes | $0.030 |
| `gemini-3.1-flash-lite` | $0.25 / $1.50 | yes | yes | $0.008 |
| Groq `openai/gpt-oss-20b` | $0.075 / $0.30 | strict | no | $0.002 |

Third-party latency: gpt-5.4-nano ~2.7 s per 300-token call; nothing is
verified under 2 s; Haiku 4.5 is the slowest generator of the set; no
Claude 5 small model exists.

### 13.2 Magnific API

One API at `https://api.magnific.com/v1`, header `x-magnific-api-key`,
OpenAPI YAML published; Freepik rebranded to Magnific in April 2026. Async
tasks with `webhook_url`; signature HMAC-SHA256 over `id.timestamp.body`,
base64, in `webhook-signature`. Uploads via pre-signed URLs. Endpoints
used: Precision v2 upscaler (€0.10–0.50 by output area per the docs FAQ),
Relight (€0.10), Style Transfer (€0.10), Nano Banana Pro text-to-image
(14 references, 1K–4K), remove background, image expand, change camera.
Working upload + Precision v2 + poll script already in the repository:
`output/raffles-artwork-300dpi/magnific_upscale.py`. Unverified: which host
the "MS…" key is bound to, credit-to-EUR rate, output URL expiry.

### 13.3 Current site

`www.screenery.design` is Next.js on Vercel, DNS at Porkbun, Google
Workspace mail with SES in SPF. One page: nine models at "From £995–£1,350"
plus "Bespoke Design, prices upon request"; quote form posting to
`/api/contact`; no checkout or login. `design.`, `app.`, `configurator.`
are unclaimed. Site source is not in this repository.

### 13.4 Banked 3D data

`references/` holds 13 designs in three schemas; `output/catalog-all/`
normalizes them (§5.1). Space schema: plies with `vertices_mm`,
`triangles`, `artwork[] {image, uv, layer_order}`, `matrix_world`,
`machining[] {kind: bevel|hinge}`; vertices already world space; artwork
UV is an exact affine of in-plane mm, giving the printed rectangle for
free. Missing everywhere: logo slots, parametric panel count, part kind
(Zurich only). Hinge axes and leaf poses exist in catalog-all. No "pod"
design exists in the data. three.js r160 is inlined in the banked viewers;
GLTFLoader supports Draco, meshopt, KTX2.

### 13.5 Image models, logo insertion, room placement, viewer

"OpenAI image 2.5" exists: `gpt-image-2.5-sunburst` (editing precision)
and `gpt-image-2.5-flare` (about half the latency of Images 2.0), released
2026-09-08; up to 16 input images, alpha-mask edits, `input_fidelity:
high`, transparent background; token-priced ($8/M image in, $30/M out;
third-party estimates $0.006 low to $0.21 max per 1024² image). Gemini 3
Pro Image ($0.134, 14 refs, semantic masks only, SynthID) is the strongest
alternative and reads better in third-party room-scene comparisons; it is
reachable through Magnific. FLUX.2 pro, Seedream 5.0 Pro, Ideogram 4.0 and
Recraft are secondary; Midjourney has no API; Imagen 4 retired 2026-08-17.

Logo insertion: bake into the texture before render; safety net is
OpenCV.js `warpPerspective` from projected corners (verified in Node) and
`sharp.composite`; diffusion inpainting rejected for marks. Room placement:
multi-reference edit + Magnific Relight now; metric depth (Depth Pro,
Depth Anything 3) → floor plane → matched render later. Viewer: three.js
0.186 core set 189 KB gzipped; `<model-viewer>` 290 KB gzipped if zero
custom code is preferred.

## 14. GPT-6 Astra comparison

Astra (codex exec, `gpt-6-astra`, xhigh, read-only) independently reached
the same core: approved geometry controls the product, AI adapts artwork,
deterministic compositing protects logos, enquiry-led launch, phased
delivery. Differences and the decision on each:

| Astra proposal | decision | reason |
|---|---|---|
| Use `output/catalog-all/` (53 renders, 14 designs, normalized meshes, palettes, poses) as the asset source | **adopted** — reshaped §5 | verified on disk; collapses four exporter tiers into one input |
| Immutable configuration revisions; jobs bind to a revision; quotes freeze it | **adopted** §4 | prevents stale-preview and changed-quote bugs at no cost |
| Batch creative changes behind "Update preview"; echo the interpreted brief for inline correction | **adopted** §6, §8 | cost control and clarity for one button |
| Coordinated scene generated across the panel chain, then cut into faces; explicit rear artwork policy | **adopted** §6 | matches how city and bespoke scenes actually look |
| Panel = physical wall; extras include their stabilizers; named validated layout poses | **adopted** §5.3 | catalog-all already holds the poses |
| Bake UV-outside-[0,1] pixels transparent in export | **adopted** §5.2 | avoids edge smearing the banked viewer hides with a shader |
| Assets, not seeds, make a design reproducible; staff handoff package; generation kill switch; retention and provider-data statements | **adopted** §4, §9, §3, §11 | small, correct |
| Phase 0 evaluation of ~24 briefs, blinded owner pick, $50–150 | **adopted** §10 | replaces my one-face smoke test |
| Enquiry fields: sets, delivery country, target date; success metrics; felt colours vs artwork palettes; who reviews quotes | **adopted** §8, §12 | good owner questions |
| Nano Banana Pro through Magnific as the alternative provider | **adopted** §3 | endpoint verified; the repository already used it for Raffles; one vendor fewer |
| Supabase Postgres + Storage + Auth, Render Docker worker, pg-boss, Vercel Pro (~$90–180/month) | **rejected for v1** | no accounts needed; client-captured renders remove server WebGL; Neon + R2 on Vercel is enough. Upgrade path when room placement v2 needs server renders |
| Anonymous auth sessions, email "save my design", MFA staff login | **rejected for v1** | share id and basic-auth admin cover it |
| Same-domain `/configure` as the default | **changed** | site repo is not ours; subdomain is zero-risk; subpath kept as the option in §12 |
| Two screens (Collection, Configurator) plus enquiry sheet | **changed** | the marketing site is already the collection; one page with a gallery strip and deep links |
| `gpt-5.6-luna` for text | **partly adopted** | same price as `gpt-5.4-nano`; Luna's non-reasoning latency is unverified, so both go into the Phase 0 test |
| "Avoid a generic scale control as a physical customization" | **partly adopted** | approved size variants first; uniform scale only inside an owner-declared band, footprint shown |
| USDZ/AR export, GLTFExporter downloads | **deferred** | no request; GLB parts already exist as static assets |
| 6–9 weeks focused launch, 12–18 with structural options and room uploads | **noted** | consistent with §10 given owner data arrives on time |
| Cost per customized session ≈ $0.94 ($0.60–1.80) | **consistent** | my range $0.5–2.5 includes the upscale |
