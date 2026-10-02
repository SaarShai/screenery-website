**Screenery web app build plan**  
*Planning date: 10 September 2026. Costs are in USD unless stated otherwise.*

Build Screenery as a visual product configurator: clients choose a design, adjust supported properties, see the result, and request a quote. Use approved geometry to control the physical product, AI to create or adapt artwork, and deterministic compositing to preserve logos and exact text.

The first release should offer a small, carefully prepared collection, customization on existing structural templates, interactive 3D, and saved enquiries. Broader structural customization and hotel-photo placement should follow once the core experience is reliable.

This plan is based on read-only inspection of the repository, representative catalog images, the public website, and current official API documentation. No files were modified, code written, or paid generation tests run. Performance and generation-quality targets below require measurement during implementation.

**Planning basis**

Screenery’s product contract describes layered PET-felt products with design-specific parts, joints, printed faces, and exclusions. The app must preserve the distinction between a physical panel, its subpanels, its plies, and supplied accessories. The design index also distinguishes accepted display components from manufacturing release. [Product contract](</Users/za/Documents/screenery fresh codex/ground truth/GROUND-TRUTH.md>), [design index](</Users/za/Documents/screenery fresh codex/knowledge/designs.md>).

I inspected one image from each category in the supplied `originals` folder:

| Category | Sample inspected | Implication for the app |
|---|---|---|
| Standard | `standard/castle/best-new-old-castle-front.jpg` | Preserve felt texture, exposed layers, openings, and stabilizers in close product views. |
| Cities | `cities/berlin/good berlin texture and layers.png` | Support artwork that continues across panels and coordinated shaped tops. |
| Bespoke | `bespoke/forte front.jpeg` | Treat an illustrated scene as a coordinated composition across panels, doors, and seams. |
| Bedwrappers | `bedwrappers/chinese new year bed wrap w bed.png` | Use a separate structural family with bed-fit dimensions and corner relationships. |
| Pod | `pod/best-marriott-lobby-pod-with-elephant.jpg` | Represent enclosure layouts and independent extras explicitly. |
| In room | `in room/best-space-in-room-w-boy-(large).jpg` | Match perspective, lighting, scale, and floor contact when placing products in rooms. |
| Extras | `extras/best render angled.jpeg` | Preserve independent silhouettes, thickness, and supporting feet. |
| XL | `XL/best-boy-in-castle-pod-(large).jpg` | Treat XL as an approved construction or configuration, rather than assuming uniform enlargement. |

These older generated images are useful aesthetic references. Their filenames and appearance do not establish current dimensions, construction, or approval.

The repository contains more reusable work than the original pilot alone: a subsequent collection documents **53 studio renders across 14 designs**, including corrected artwork, supported layouts, and rejected poses. Use that collection’s current recipes and limitations when preparing app assets. [Render pilot](</Users/za/Documents/screenery fresh codex/output/catalog-render-pilot/README.md>), [subsequent catalog renders](</Users/za/Documents/screenery fresh codex/output/catalog-all/README.md>).

---

**1. Recommended architecture and stack**

Use one web application, one managed database/storage service, and one background worker.

| Layer | Recommendation | Reason |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Supports the public collection, interactive configurator, server endpoints, and staff interface in one application. |
| UI | Tailwind CSS with a small set of accessible components | Allows a distinctive Screenery design without building every control from scratch. |
| Product viewer | Three.js, wrapped in a focused React component | Directly reuses the existing Three.js asset work and supports materials, cameras, lighting, and exports. |
| Backend | Next.js server endpoints and shared TypeScript validation | Keeps authentication, configuration rules, enquiries, and job submission together. |
| Database | Supabase Postgres | Relational data suits designs, revisions, projects, enquiries, quotes, and asset relationships. |
| Asset storage | Supabase Storage | Stores catalog assets, private uploads, generated artwork, previews, and GLBs alongside the same authorization model. |
| Background processing | A Docker worker on Render | Handles image requests, image processing, model conversion, and server rendering without tying them to a browser request. |
| Queue | `pg-boss`, using Postgres | Provides persistent jobs and retries without introducing Redis. |
| Web hosting | Vercel Pro | Straightforward Next.js deployment, preview environments, and CDN delivery. |
| Authentication | Supabase Auth | Anonymous configuration sessions, optional email sign-in, and restricted staff access. |
| Email | A transactional email provider such as Resend | Sends requested save links, enquiry acknowledgements, and staff notifications. |
| Monitoring | Structured application logs, error reporting, and a small usage dashboard | Makes failed generations, spend, and conversion problems visible. |

These choices use established capabilities in [Next.js](https://nextjs.org/docs/app), [Supabase Storage](https://supabase.com/docs/guides/storage/security/access-control), and [pg-boss](https://github.com/timgit/pg-boss).

**Application boundaries.** Keep five responsibilities clear: catalog, configuration rules, visual assets, generation jobs, and enquiries/quotes. A text model may suggest configuration changes; the configuration service decides whether they are supported. The generation service receives an already validated request.

The principal flow is:

**Client choices → validated configuration revision → immediate 3D preview → background artwork generation → composed preview → saved enquiry.**

**Domain and existing website.** Add the configurator at `www.screenery.design/configure`, with links from the existing collection and bespoke sections. Confirm the current website’s hosting and source access in the first phase. Use supported path routing or bring the existing marketing pages into the same deployment while preserving their URLs, content, and SEO.

The current website already presents a collection and a bespoke quote journey, so an enquiry-led launch fits its existing sales flow. [Screenery website](https://www.screenery.design/).

**Client access.**

- Browsing requires no account.
- Create an anonymous session when a visitor starts configuring, rather than for every page view.
- Offer email-based recovery when the client selects “Save my design.”
- Use a separate, revocable link for sharing a read-only preview.
- Restrict the staff interface to invited users, with MFA.

Supabase supports anonymous users that can later be linked to an identity. Apply authorization rules to these users just as to registered users. [Anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous).

**Production repository integration.** Build the web app in a separate application repository. Publish selected, versioned asset packages from the production repository into web storage. The website consumes those packages; it does not edit Illustrator masters or infer manufacturing approval from a rendered asset.

Each published package should include its source revision, checksums, approved display capabilities, supported options, and relevant exclusions. This keeps the web app operationally independent of Drive and the owner’s workstation.

---

**2. Data model**

Use relational tables for identities, ownership, relationships, and commercial records. Use versioned JSON documents for configuration snapshots and asset manifests.

| Entity | Essential data |
|---|---|
| **Design** | Stable ID, name, slug, description, category tags, product family, catalog visibility, hero image, current published revision. |
| **Design revision** | Revision ID, source package/hash, geometry version, artwork version, material palette, approval scope, exclusions, publication date. |
| **Variant template** | Approved starting configuration: panel arrangement, installed parts, supplied quantities, extras, available dimensions, supported poses. |
| **Part definition** | Stable physical-part identity, family, geometry reference, printed faces, attachment points, relevant construction metadata. |
| **Assembly recipe** | Part instances, parent/child relationships, transforms, connector requirements, installed/spare status, allowed layout states. |
| **Customization option** | Label, type, default, allowed values/range, units, dependencies, incompatible choices, affected parts/faces, approval requirement. |
| **Style preset** | Name, thumbnail, reference assets, palette guidance, prompt instructions, allowed editing regions, version. |
| **Branding zone** | Part and face, printable region, local placement coordinates, safe area, permitted scale, orientation, excluded cuts/features. |
| **Client project** | Owner/session ID, chosen design, current configuration revision, selected concept, creation/update dates, recovery/share settings. |
| **Configuration revision** | Immutable snapshot of physical selections, artwork choices, branding placements, user request, interpreted changes, validation result, parent revision. |
| **Uploaded asset** | Owner, storage key, hash, file type, dimensions, sanitized derivative, asset purpose, consent/rights record, retention date. |
| **Generated asset** | Asset type, configuration revision, source assets, model/version, prompt version, quality/size, storage key, hash, review state. |
| **Generation job and attempts** | Job status, request key, provider request/task IDs, attempt count, timestamps, token/credit usage, cost, failure reason. |
| **Enquiry** | Contact, company/hotel, configuration snapshot, selected visuals, quantity, delivery country, target date, notes, assigned staff, status. |
| **Quote and order** | Versioned line items, currency, prices, tax/shipping treatment, validity, accepted configuration, approval records, order/payment references. |

**Important distinctions**

- Category tags such as “cities” or “bespoke” describe discovery. Product families such as screen, pod, and bedwrapper determine behavior.
- An approved commercial variant differs from a client’s saved customization.
- Count panels as physical walls. A modular panel with several subpanels still counts as one panel in the client interface.
- Record installed, supplied, and spare quantities separately.
- Keep geometry acceptance, artwork acceptance, client selection, and manufacturing release as separate states.
- Store money in integer minor units with an explicit currency.
- Store physical dimensions in millimetres; convert only for display.

**Revision behavior.** Every generation binds to an immutable configuration revision. Changing the panel count while an image is generating creates a new revision. The older result may enter history, but cannot silently replace the current preview.

An enquiry freezes the selected configuration and images. A later catalog update must not alter what the client requested. A quote identifies the exact reviewed revision; client acceptance creates an order against that revision.

**Commercial workflow.** Launch with:

**Draft → enquiry submitted → staff review → quote issued → client acceptance → order confirmed.**

Add payment collection after product pricing, shipping, tax treatment, and acceptance terms are settled. AI should never calculate a binding price or approve an order’s manufacturability.

---

**3. Image generation pipeline**

**Model recommendation.** The owner’s “image 2.5” reference is current. OpenAI now documents two models:

| Role | Recommended model | Use |
|---|---|---|
| Primary product/artwork editor | **GPT Image 2.5 Sunburst** | Local changes, preserving existing compositions, and more demanding customization. |
| Fast concept candidate | **GPT Image 2.5 Flare** | Initial concepts and exploratory artwork where speed matters. |
| Alternative provider | **Nano Banana Pro through Magnific** | A benchmark competitor and operational fallback after passing Screenery’s quality checks. |
| Optional enlargement | **Magnific Precision V2** | Selected final previews or artwork derivatives when larger output is useful. |

OpenAI positions Sunburst for editing precision and Flare for faster generation. That makes Sunburst the stronger initial choice for Screenery’s customization workflow; superiority on Screenery assets remains an evaluation question. [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst), [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare).

Magnific exposes reference-guided Nano Banana Pro generation and a separate Precision V2 upscale API. Use the existing environment-held credential during implementation, keeping it server-side. [Magnific generation API](https://docs.magnific.com/api-reference/text-to-image/post-nano-banana-pro), [Precision V2](https://docs.magnific.com/api-reference/image-upscaler-precision-v2/overview).

**Route each change to the appropriate operation.**

| Change | Processing route |
|---|---|
| Select an existing design or material color | Load existing geometry/textures and update the renderer. |
| Add/remove an approved panel or extra | Update the validated assembly and render it. |
| Insert a logo or exact wording | Deterministic artwork composition. |
| Change illustration style, theme, or illustrated content | Generate/edit flat artwork, then apply it to the product. |
| Request an unsupported silhouette or construction | Create a clearly identified bespoke concept and flag it for design review. |
| Create a hotel lifestyle image | Use the separate placement pipeline described below. |

This routing gives clients immediate feedback for common changes and concentrates generation spend on changes that need it.

**Recommended generation sequence**

1. **Validate the configuration.** Resolve the exact design revision, part inventory, dimensions, materials, extras, and branding zones.
2. **Normalize the brief.** Convert free text into a bounded customization request using the text model.
3. **Prepare conditioning assets.** Select the matching product render, flat artwork template, mask, and a small number of relevant style references.
4. **Generate editable artwork.** Prefer a flat illustration or coordinated artwork sheet that fits the approved surface layout.
5. **Apply deterministic masks and branding.** Clip artwork to printable regions; place the original logo and exact text.
6. **Update product textures.** Reuse the registered surface coordinates.
7. **Render the product.** Produce an accurate preview from the same configuration used by the live viewer.
8. **Validate and save.** Check the output, store provenance and costs, and associate it with the correct revision.

For scenic designs, generate a coordinated composition spanning the intended panels, then cut it into registered face textures. Use one scene layout to control continuity across seams. Generate the rear face according to an explicit rear-artwork policy.

A polished product mockup can be entirely a 3D render of generated artwork. Whole-image generative restyling should be an optional presentation treatment because it can change product features.

**Reference strategy**

Assign each reference a specific role:

- **Geometry:** exact current product render.
- **Composition:** flat panel artwork layout and printable boundaries.
- **Aesthetic:** selected older catalog image or approved style reference.
- **Continuity:** the client’s selected previous artwork when making an edit.

Use the newer catalog render collection for existing supported poses. Prepare a new deterministic render when the configuration changes.

The earlier pilot’s printed, clay, and outlined render styles are useful evaluation candidates. Compare their conditioning performance on a small test set before choosing a standard recipe.

Depth, silhouette, and part-ID images can aid prompting and validation. Treat them as reference images unless the selected API explicitly exposes a dedicated conditioning mechanism.

**Prompt construction**

Build prompts from versioned templates with:

- Product and material description.
- Exact requested artwork change.
- Theme, palette, and illustration style.
- Reference-role descriptions.
- Features and regions to preserve.
- Editable regions.
- Required empty branding areas.
- Output purpose, dimensions, and composition.

Keep arbitrary client text separate from application instructions. The model receives a validated creative brief, with any unsupported physical requests retained as review notes.

For local edits, edit the smallest relevant artwork region and composite that region back into the original texture. A provider’s edit mask helps direct generation; application-side composition enforces the final boundary.

**Logo and exact-text handling**

- Accept transparent PNG and sanitized SVG initially; allow JPEG with a background-removal/cropping step.
- Preserve the original uploaded asset privately.
- Maintain aspect ratio and owner-defined clear space.
- Offer designated placements with automatic sizing.
- Keep placement coordinates attached to the physical face, so branding follows different cameras and configurations.
- Render supplied text with fonts, rather than asking the image model to spell it.
- Keep front/rear orientation explicit, including readable branding on rear faces.
- Composite branding after generative processing or upscaling.
- Store the final source logo and placement separately for production handoff.

**Consistency across regenerations**

Persist the selected artwork, palette, composition, template version, input references, and model version. Subsequent requests should edit that selected artwork instead of restarting from an unrelated full-product image.

Keep the camera and lighting stable during comparisons. Provide “Undo” and a short history of selected alternatives.

Do not depend on a seed for exact reproduction. Retaining the actual generated assets and the deterministic assembly is what makes a selected design reproducible.

**Failure behavior**

Persist jobs with statuses such as queued, preparing, generating, composing, completed, failed, and cancelled.

- Retry transient provider failures with bounded backoff.
- Preserve the last successful preview while a new attempt runs.
- Prevent duplicate submission from double-clicks or reconnects.
- Record provider task IDs before polling or processing callbacks.
- Treat callbacks as notifications; authenticate them where supported and verify task ownership/status.
- Bound any automatic visual-repair attempt.
- Show a clear recovery action for blocked or invalid requests.
- Use the alternative provider for qualifying operational failures only after evaluating its output quality.
- A client cancellation stops later work; an already submitted provider request may still incur a charge.

**Caching**

Use separate caches for:

1. Published catalog images and web geometry.
2. Geometry renders, keyed by configuration, camera, and renderer version.
3. Generated artwork, keyed by normalized brief, base artwork, references, mask, model, and settings.
4. Final composites, keyed by artwork plus logo/text placement.

Keep client-branded outputs private. Cross-client reuse should be limited to explicitly published generic assets. A deliberate “Try another” action should produce a new candidate; returning to an existing saved choice should reuse its asset.

**Quality evaluation before launch**

Create approximately 24 representative briefs and compare Sunburst, Flare, and Magnific Nano Banana Pro with two attempts each. Include local edits, coordinated artwork, constrained bespoke designs, and a small hotel-placement sample.

Evaluate:

- Requested change applied.
- Existing illustration retained where requested.
- Panel boundaries and openings respected.
- Scene continuity.
- Felt/material appearance.
- Logo fidelity after composition.
- Visible artifacts.
- Acceptance rate, latency, and cost per accepted result.

Follow with several multi-edit sequences to expose cumulative drift. The owner should select the preferred aesthetic from blinded comparisons. Budget roughly **$50–$150** for the initial API evaluation, subject to measured request costs.

---

**4. 3D approach**

**Reuse the banked models through a publishing pipeline.** Three.js is a suitable viewer. Its role is to display and manipulate geometry; the configuration rules and geometry preparation create the model.

The inspected files demonstrate at least two import patterns:

- Space has a roughly **55.7 MB** assembly JSON containing baked vertices, triangles, part identities, machining information, and artwork overlays.
- Police uses a smaller contour-based geometry file with separate poses and extrusion behavior.

Normalize these source formats into one web asset format. Reuse the current render adapters where they contain documented corrections.

**Asset preparation**

For each launch design:

1. Identify its accepted source package and current display corrections.
2. Map source records to physical parts and client-facing panels.
3. Resolve units and coordinate systems.
4. Preserve the distinction between baked world coordinates and transforms to avoid applying a pose twice.
5. Preserve per-face artwork, layer order, transparency, and printing exclusions.
6. Export a lightweight GLB plus a configuration manifest.
7. Compare front, rear, and oblique views against the accepted reference.
8. Publish only the supported layouts and options.

An important observed detail: Space’s artwork includes UV coordinates outside the source image bounds, and its viewer discards those pixels. The web conversion must preserve that behavior through trimmed geometry or baked transparency. Ordinary texture clamping could produce visible smearing.

Keep exact source geometry in the production archive. Optimize only the derived display assets, retaining separate moving parts and meaningful boundaries.

**Browser performance targets**

Treat these as initial acceptance budgets:

- Product poster appears before 3D loads.
- Initial product download preferably below 5 MB; investigate designs exceeding 10 MB.
- Load only the selected design.
- Target at least 30 fps on a representative midrange mobile device.
- Use smaller initial textures and load detail on demand.
- Render only when the camera, lighting, or configuration changes.
- Provide a complete image-based path when WebGL is unavailable.

Use mesh compression and texture atlases where they improve measured loading and memory use. Verify alpha edges, text, and thin material features after optimization.

**Parameterizing panels, dimensions, and extras**

| Property | Recommended implementation |
|---|---|
| Panel count | Choose from approved assembly recipes using compatible panel modules. |
| Panel order | Permit only arrangements supported by the design’s artwork and connections. |
| Layout/fold | Expose named, validated poses for that design. |
| Width/height | Start with approved size variants; introduce parameterized families individually. |
| Material thickness | Resolve from the selected construction; keep fixed unless an approved construction variant exists. |
| Extras | Add complete compatible assemblies, including their stabilizers. |
| Toppers | Use approved receiving regions and quantities. |
| Bedwrapper dimensions | Derive from a dedicated fit template using bed dimensions, clearances, corners, and supports. |

Adding a panel may require additional connectors, stabilizers, artwork continuation, and a different footprint. Those consequences must be part of the recipe.

For dimension changes, resize appropriate spans while preserving functional feature sizes and recomputing affected positions. Revalidate mating parts, openings, artwork, stock limits, and footprint. Avoid exposing a generic model-scale control as a physical customization tool.

The existing assets already document unsupported layouts: some folds were rejected for collisions, and Castle XL uses a fixed pentagonal assembly. Publish capabilities per design.

**What “generated bespoke 3D” can mean**

| Bespoke request | Realistic result |
|---|---|
| New theme on an existing construction | Exact existing geometry with new artwork and branding. |
| New configuration within an approved modular family | Deterministically assembled model from validated modules and parameters. |
| New silhouette, opening arrangement, or connection system | Concept visualization followed by structural design, geometry preparation, and approval. |

Launch with the first category. Add the second family by family. The third requires a design-service workflow; an attractive generated mesh does not establish ply construction, joints, stability, or manufacturing readiness.

When a concept image introduces geometry that the app cannot represent accurately, identify the 3D view as the chosen base construction and keep the concept separate.

**Exports**

- **GLB:** primary portable product model.
- **glTF:** optional unpacked exchange format.
- **PNG/WebP:** product previews and transparent cutouts.
- **USDZ:** later, for supported AR/viewing workflows.
- **Configuration manifest:** exact revision, dimensions, selections, and asset relationships.

Three.js provides [GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html) and [USDZExporter](https://threejs.org/docs/pages/USDZExporter.html). Exported materials and alpha behavior still need format-specific checks.

Manufacturing AI/PDF files remain outputs of Screenery’s reviewed production workflow.

---

**5. Minimal UX flow**

Use **two primary screens and one enquiry sheet**.

| Surface | Purpose | Main action |
|---|---|---|
| Collection | Choose a starting design or “Create something bespoke.” | Customize |
| Configurator | Adjust the product and artwork around one large preview. | Update preview |
| Enquiry sheet | Review the selected design and provide commercial details. | Request a quote |

**Collection**

Show a curated selection with generous images, short names, and approved starting prices where available. Keep filters lightweight. A single “Bespoke” card opens the same configurator with an appropriate base template.

Do not require clients to understand the repository’s categories or construction terminology.

**Configurator**

On desktop, give most space to the product preview with a compact control column. On mobile, place the preview above a collapsible control sheet and a persistent primary action.

Organize controls into three simple groups:

- **Design:** theme, style, colors, and optional free text.
- **Size & extras:** supported panel count, size, and accessories.
- **Your branding:** upload and placement.

Show only controls supported by the selected design. Expand secondary detail on demand.

Provide:

- Image/3D toggle.
- Front/rear view where relevant.
- Undo and a small history strip.
- Save/share.
- “Request quote” as the persistent commercial action.

A useful free-text prompt is: “What would you like to change?” Suggested examples can appear beneath it.

**Presets versus typing**

| Use presets for | Allow free text for |
|---|---|
| Structural family and starting design | Theme and story |
| Supported panel counts | Preferred motifs, landmarks, or characters |
| Size variants | Desired mood and illustration treatment |
| Material colors | Details to include or avoid |
| Compatible extras | Hotel-specific design direction |
| Branding zones | Exact wording, handled as a text layer |
| A small set of illustration styles | Special requirements for staff review |

Use numeric fields with units for dimensions. If a requested value is outside supported limits, retain it as a custom requirement and explain that it needs review.

**Feedback and generation**

Apply deterministic changes immediately. Batch creative changes behind “Update preview” so typing or dragging does not trigger repeated paid calls.

Before generation, show a short interpretation such as: “Softer woodland artwork, sage palette, hotel logo on the center sign.” Let the user correct it inline.

During processing, retain the existing preview and show truthful stages. Mark an older preview as needing an update when the configuration has changed.

Use concise labels such as “Design preview” and “Custom structure — review required” where relevant.

**Enquiry sheet**

Ask for name, work email, hotel/company, quantity of sets, delivery country, and optional deadline/notes. Include the selected configuration and preview automatically.

Keep design selection and quote submission usable with a keyboard and screen reader. Provide textual dimensions and selected options independently of the canvas.

---

**6. Text-preferences model**

Use **GPT-5.6 Luna**, with reasoning disabled for routine extraction and a strict structured-output schema.

It is documented for cost-sensitive workloads, supports structured outputs, and currently costs **$0.20 per million input tokens and $1.20 per million output tokens**. [Luna documentation](https://developers.openai.com/api/docs/models/gpt-5.6-luna).

The model should interpret preferences and produce a proposed change set, rather than operate the application autonomously.

Its output should contain:

| Output | Purpose |
|---|---|
| Intent | Select, customize, restyle, brand, resize, or request bespoke work. |
| Proposed option changes | Valid option identifiers and requested values. |
| Artwork brief | Theme, motifs, palette, style, and composition instructions. |
| Preserve list | Elements the user explicitly wants retained. |
| Exact text | Wording to render deterministically. |
| Unsupported requests | Requirements outside current configuration capabilities. |
| Ambiguities | Missing information that prevents a reliable interpretation. |
| User summary | One short sentence explaining the proposed changes. |

For example, “Make it calmer, use sage green, add our hotel logo, and make it four panels” becomes:

- A quieter illustration treatment.
- A proposed sage palette.
- Branding in an allowed zone.
- A four-panel request checked against that design’s options.

If four panels are unsupported, the application keeps that requirement for staff review. It does not silently substitute a different count.

**Controls**

- Supply only the relevant catalog options and current configuration.
- Validate all output independently.
- Require explicit numeric units.
- Preserve omitted fields.
- Ask one focused clarification only when necessary.
- Keep prices, approval status, part compatibility, and manufacturing decisions outside the model.
- Fall back to preset controls if text interpretation fails.
- Escalate difficult interpretation to GPT-5.6 Terra only when it materially improves the result.

Target **1–3 seconds** for routine interpretation, to be verified. A 2,000-input-token, 500-output-token request costs about **$0.001** before retries.

---

**7. Hotel-room placement — lower priority**

Deliver this in two steps.

**First: curated room settings.** Offer a few licensed room photographs or prepared 3D environments with known camera and floor settings. Render the configured product into them. This gives a useful lifestyle preview with little client effort.

**Second: uploaded hotel photograph.**

1. Validate and normalize the upload; remove metadata.
2. Identify the likely floor plane and perspective.
3. Ask the client to indicate placement.
4. Obtain one known measurement when meaningful scale accuracy is needed.
5. Render the exact configured product with a matching camera.
6. Add contact shadows and necessary foreground occlusion.
7. Optionally use localized image editing to improve environmental integration.
8. Preserve the product’s geometry, artwork, and branding through protected compositing.

Keep correction controls limited to placement and rotation. A simple foreground mask can be offered only when automatic occlusion is wrong.

Without a known measurement, label placement scale as approximate. A single image does not establish clearance around beds, doors, or circulation routes.

Use generation mainly for shadows, reflections, and nearby environmental blending. If it changes the product or room materially, return the deterministic composite.

Room uploads should be private, excluded from public galleries by default, and subject to a short retention policy. Avoid requiring photographs containing guests.

---

**8. Phased delivery, milestones, and effort**

Assume one experienced full-stack developer, part-time 3D/asset assistance, part-time UX design, and regular owner review. The estimates exclude extensive new physical-product engineering.

| Phase | Scope | Completion evidence | Rough effort |
|---|---|---|---|
| **0. Scope and feasibility** | Select launch designs/options; map revisions; confirm hosting; compare image models; test one web asset conversion. | Agreed capability matrix, sample GLB, model comparison, measured cost/latency, reviewed UX. | 1–2 weeks |
| **1. Working configurator** | Collection, 3–5 designs, 3D, fixed supported variants, material options, logos, saving, enquiries, staff review. | A client can configure and submit; staff can reconstruct exactly what was selected. | 2–3 weeks |
| **2. AI artwork beta** | Text interpretation, generated artwork, style presets, constrained bespoke themes, job recovery, history, quotas, selected fallback. | End-to-end artwork generation passes agreed quality tests and preserves branding/configuration. | 2–3 weeks |
| **3. Broader catalog and structural options** | Import remaining eligible designs; approved panel-count recipes; selected dimension families; richer extras; GLB downloads. | Every exposed configuration has matching geometry, inventory, artwork behavior, and validation. | 3–6 weeks |
| **4. Room placement** | Curated rooms, then uploaded-photo placement and localized blending. | Placement works across representative room photographs with clear scale limitations. | 2–4 weeks |

Allow approximately **6–9 calendar weeks for a focused public launch**, including integration and stabilization. A broader release with selected structural customization and room uploads is more plausibly **12–18 weeks**, depending on asset readiness and owner decisions.

A novel structural family can add several weeks of design and validation. Estimate it separately after defining the allowed geometry changes.

**What ships first**

- A small approved collection.
- Existing structural templates.
- Supported sizes and extras.
- Exact logo placement.
- Immediate 3D.
- Artwork customization and bespoke themes on those templates.
- Saved projects and quote requests.
- Staff review with complete configuration records.

Select launch designs for both commercial relevance and clean asset readiness. Model availability alone should not decide the collection.

**Verification plan**

| Area | Required checks |
|---|---|
| Configuration | Supported combinations work; incompatible choices fail clearly; boundary dimensions are validated. |
| Product assets | Correct part inventory, units, front/rear artwork, openings, alpha, and supported poses. |
| Branding | Aspect ratio, safe areas, exact text, rear orientation, and final exports. |
| Generation | Model comparison, multi-edit consistency, failed requests, moderation errors, duplicate submissions, stale results. |
| Ownership | One client cannot read another client’s projects, uploads, or generated assets. |
| Enquiries | Submission is durable; notifications retry; selected revision and assets remain reconstructible. |
| Browser experience | Desktop/mobile browsers, keyboard navigation, touch controls, slow network, and WebGL failure. |
| Operations | Spend limits, worker restart, provider outage, storage cleanup, and restoration of a saved project. |

Aim for a first useful visual within roughly **2 seconds** on a typical connection, with 3D progressively loading afterward. Measure generation median and 95th-percentile latency during beta.

Track conversion through design selection, customization, generation, saving, and enquiry. Also track cost per accepted concept and cost per submitted enquiry.

Use isolated staging and production credentials. Release catalog revisions independently of application releases. Provide a switch to disable generation while preserving catalog browsing, saved previews, and enquiries.

---

**9. Risks and mitigations**

| Risk | Mitigation |
|---|---|
| AI changes panel count, openings, or support geometry | Generate artwork separately and render it on controlled geometry. |
| A preview suggests an unsupported physical product | Capability rules, visible review status, and staff approval before a binding quote. |
| Logos or wording change | Deterministic placement using the original assets and font rendering. |
| Artwork drifts after repeated edits | Persist selected artwork, edit locally, retain history, and keep the same reference composition. |
| Artwork crosses seams or functional exclusions incorrectly | Registered face templates, deterministic masks, and front/rear checks. |
| Large models overload mobile devices | Offline conversion, texture budgets, lazy loading, memory checks, and image fallback. |
| Banked assets contain unresolved or superseded behavior | Publish from pinned packages with current corrections and explicit per-design limitations. |
| Dimensions appear adjustable before engineering is ready | Ship approved sizes first; add parameterized families only after their constraints are defined. |
| Generation latency causes abandonment | Immediate deterministic previews, saved jobs, progress stages, and bounded retries. |
| Automated abuse creates excessive spend | Per-session/email/IP limits, progressive bot checks, concurrency limits, budget reservation, and daily spending caps. |
| Private logos or hotel photos leak | Private storage, ownership checks, short-lived provider URLs, redacted logs, and deletion policies. |
| Vendor models or billing change | Versioned recipes, a small regression set, measured usage, and an evaluated alternative provider. |
| Screen color differs from print/material | Separate stock colors from printed colors; provide sample/proof review during quoting. |
| A quote refers to an obsolete preview | Immutable enquiry and quote revisions with explicit selected assets. |
| Scope expands into automatic manufacturing | Maintain a deliberate handoff from client configuration to the existing production workflow. |

For uploads, enforce file type, pixel count, and size limits; sanitize SVGs and reject active content. Keep provider credentials and privileged storage keys server-side.

State provider processing and retention accurately. OpenAI documents that API data is not used for training by default, while ordinary abuse-monitoring retention can still apply. Application deletion does not automatically imply immediate deletion everywhere a provider processed the asset. [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

**Staff handoff package**

Every qualified enquiry should provide:

- Client’s original brief and interpreted selections.
- Exact configuration revision.
- Selected preview and available 3D model.
- Original logo, exact text, and branding placements.
- Generated flat artwork and face mappings.
- Dimensions and supplied inventory.
- Unsupported requirements and outstanding approvals.

This allows the production team to develop the selected result without reconstructing it from a screenshot.

---

**10. Rough running costs**

**Published image rates**

Both OpenAI Image 2.5 models currently use these standard token rates:

| Usage | Price per million tokens |
|---|---:|
| Text input | $5 |
| Image input | $8 |
| Cached image input | $2 |
| Image output | $30 |

Actual cost depends on the input images, output dimensions, and generation settings. Equal token rates do not imply equal cost per accepted result. [OpenAI Image 2.5 pricing](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst).

For comparison, Google lists direct Gemini 3 Pro Image output at **$0.134 for 1K/2K** and **$0.24 for 4K**, plus input and any text/thinking charges. Magnific’s reseller/account billing must be checked separately. [Google image pricing](https://ai.google.dev/gemini-api/docs/pricing).

**Planning allowances per operation**

These are provisional budgets and latency expectations, not measured Screenery results.

| Operation | Cost allowance | Latency expectation |
|---|---:|---|
| Text interpretation | $0.001–$0.003 | Target 1–3 seconds |
| Preset/color/logo update in browser | No model charge | Immediate once assets load |
| Draft artwork generation/edit | $0.05–$0.20 | Budget 10–45 seconds |
| Higher-quality selected artwork | $0.20–$0.60 | Budget 20–90 seconds |
| Room composition with generation | $0.20–$0.80 | Budget 30–120 seconds |
| Optional Magnific upscale | Reserve $0.10–$0.40 pending account measurement | Additional asynchronous job |

Complex OpenAI image requests may take up to two minutes; queue time adds to that. Measure actual throughput before setting client expectations. [Image-generation limitations](https://developers.openai.com/api/docs/guides/image-generation).

Magnific currently describes credit-based API billing. Convert actual credits consumed into money using the account’s effective credit cost. Existing subscription credits still have an opportunity cost; do not assume website “unlimited” allowances apply to API activity. [Magnific API billing](https://www.freepik.com/api).

**Worked client-session estimate**

Assume:

- Three draft generations at $0.13 each: **$0.39**.
- One selected higher-quality generation at $0.34: **$0.34**.
- Six text calls at approximately $0.001: **$0.006**.
- A 25% allowance for extra image attempts: **$0.183**.
- A small variable delivery/processing allowance: **$0.02**.

**Estimated variable cost: approximately $0.94 per customized session.**

The illustrative $0.13 request corresponds to about 1,000 text-input tokens, 4,000 image-input tokens, and 3,000 image-output tokens at the published rates. The $0.34 example increases output usage to about 10,000 tokens. These are usage assumptions, not claimed token counts for a particular quality setting.

| Session type | Practical initial budget |
|---|---:|
| Browse and select existing options | Pennies in delivery costs; no image-model charge |
| Typical customized session | **$0.60–$1.80** |
| Customized session with room placement/upscale | **$1–$3** |
| Heavy exploratory session | **$2.50–$5**, controlled by quotas |

Upscaling flat artwork does not establish production readiness or restore missing source detail. Large-format print preparation remains a reviewed production task.

**Monthly infrastructure**

| Item | Initial monthly budget |
|---|---:|
| Vercel Pro | From $20, plus applicable usage/seats |
| Supabase Pro | From $25, plus additional compute/storage/egress |
| Background worker | Reserve $25–$85, sized after rendering tests |
| Email, monitoring, staging allowance | $20–$50 |
| **Practical starting envelope** | **Approximately $90–$180/month**, before model usage and larger overages |

Published entry prices are available from [Vercel](https://vercel.com/pricing) and [Supabase](https://supabase.com/pricing). Worker requirements need measurement against the selected rendering workload.

At **1,000 customized sessions per month** using the worked $0.94 example, budget approximately **$1,030–$1,120/month** including that infrastructure envelope, before taxes, substantial browsing traffic, optional upscaling, or unusual workloads.

**Cost controls**

Start with three anonymous generated previews, then offer email verification for a modest additional allowance. Give staff a way to extend it for qualified clients.

Cache public catalog outputs, generate one candidate at a time, and use higher quality only for selected concepts. Record the cost of every attempt, including rejected outputs and retries. Review cost per enquiry alongside raw generation cost.

---

**11. Owner questions and decisions**

The following decisions materially affect scope, timing, and implementation. The recommendations provide working defaults for planning.

| Decision | Recommended starting position | Needed |
|---|---|---|
| Which designs launch first? | Choose 3–5 commercially important designs with clear geometry/artwork provenance. | Before asset preparation |
| Which products are directly selectable? | Publish an explicit list of standard designs and approved variants. | Before catalog build |
| How broad is “bespoke” at launch? | New artwork and branding on existing structures; novel construction enters design review. | Before UX and generation work |
| Which panel counts and dimensions may clients change? | Define allowed values per family and design, including dependencies. | Before exposing structural controls |
| How are pods, XL sets, and bedwrappers sold? | Treat them as distinct approved templates/families with their own fit rules. | Before adding those families |
| What are the material and print-color choices? | Separate stocked felt colors from artwork palettes. | Before visual calibration |
| Where may logos appear? | Define approved zones, sizes, clear space, faces, and rear-orientation rules. | Before branding implementation |
| Which illustration styles represent Screenery? | Start with 3–4 owner-selected styles and approved examples. | Before image-model evaluation |
| How should rear artwork behave? | Define per design: independent artwork, repeated artwork, selected mirroring, or unprinted faces. | Before texture generation |
| What does the client submit? | A quote request with a frozen configuration and selected visuals. | Before commercial workflow build |
| Should public prices appear? | Use owner-maintained starting prices or estimates; binding quotes follow review. | Before launch |
| Who reviews enquiries and approves production handoff? | Name the responsible person and expected response time. | Before beta |
| What is the free-generation allowance? | Three anonymous previews, then email verification and a bounded allowance. | Before public AI access |
| What is the monthly model-spend limit? | Set a conservative pilot cap, then adjust using cost per qualified enquiry. | Before public AI access |
| Which markets, currencies, and languages come first? | Start with the existing sales market and English; confirm currency explicitly. | During initial scope |
| What is the upload retention policy? | Short retention for abandoned room uploads; longer retention for active projects and orders. | Before uploads launch |
| May client designs become public examples? | Private by default; obtain separate publication permission. | Before sharing/gallery features |
| What is the current website platform? | Confirm source access and support for the same-domain configurator route. | During feasibility |
| When should hotel-photo placement ship? | After the core configurator demonstrates reliable previews and enquiries. | Roadmap agreement |
| What constitutes a successful first release? | Agree targets for accepted previews, enquiry conversion, staff handling time, and cost per enquiry. | Before development starts |