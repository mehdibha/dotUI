# Real-world component blocks — exploration map

> Status: research snapshot, 2026-06-29. Scope: which "real-world use case" components/blocks (media players, editors, chat, kanban, upload, emoji, etc.) dotUI should explore adding beyond its current primitive-heavy registry. Prompted by a request to expand into the components real apps actually need. This is a point-in-time landscape + feasibility assessment, not a commitment; every new axis/tier/component flagged here is a product decision that needs sign-off before implementation.

## TL;DR

- The components you listed split into **two genres**, and only one is dotUI's fight: **(A) real-world app blocks** that wrap a serious functional library (Tiptap, dnd-kit, Media Chrome, Shiki, Embla, wavesurfer…) and **(B) marketing eye-candy** that is ~all Framer Motion decoration (Aceternity, Magic UI, Reactbits…). Target **(A)**. It's where dotUI's React Aria accessibility + theming + builder axes are a real moat; (B) is a commoditized motion-effects race dotUI shouldn't lead with.
- **The blueprint already exists: [Kibo UI](https://www.kibo-ui.com/)** — 41 shadcn-compatible "real app" components, each a thin themeable shell over a proven npm engine. It is the closest thing to what you're describing. We don't need to invent the category; we need to out-execute it on accessibility (RAC) and live theming.
- **The pattern for nearly all of these: own the chrome, depend on the engine.** dotUI ships the themeable control/overlay built on RAC primitives; the heavy stateful engine (editor model, codec/HLS, WebRTC, dnd, tile renderer) stays a documented peer dependency the user installs — exactly how `drop-zone` already leaves upload transport to the user.
- **Recommended first five to explore** (high demand × genuinely feasible, mostly RAC chrome over an engine we already ship or a tiny dep): **Code block** (Shiki — already a dep), **Carousel** (Embla — we have nothing and it's the shadcn standard), **Media player** (audio + video controls on RAC over native `<audio>`/`<video>`), **Voice message / waveform** (wavesurfer + MediaRecorder — pairs with the new chat), **Emoji picker** (frimousse). All EASY–MEDIUM.
- **This likely needs a new registry tier.** Most of these are blocks, not themeable primitives, and several pull peer deps + need a place for "engine is the user's job" docs. Whether that's a `blocks/` tier, a per-item `kind: "block"` flag, or kept in `ui/` is an open product call (see §9).

## 1. Framing: two genres, and where dotUI fits

The research swept ~20 component libraries/registries and the underlying-library landscape. The clearest finding is that "beyond-primitive" components are two different markets:

**Genre A — real-world app blocks.** Functional components that solve an app problem by wrapping a serious engine. The exemplar is **Kibo UI**; the supporting cast is the underlying libraries themselves (Tiptap, dnd-kit, TanStack Table, Embla, Media Chrome, Shiki, wavesurfer, react-easy-crop, Sandpack…). This is what you asked about, and the underlying-lib choices here are essentially settled in 2026 — so dotUI can adopt the same proven engines and compete on the layer it owns: accessible RAC chrome, OKLCH theming, and live builder axes.

**Genre B — marketing/landing eye-candy.** Animated hero sections, beams, text effects, globes, bento grids. Surveyed: Aceternity, Magic UI, Hover.dev, Smoothui, Reactbits, Fancy Components, Motion Primitives, Eldora, Luxe, Syntax UI. The signal is monotone — almost all of it is **Framer Motion (`motion`) + Tailwind**, with a heavy-graphics fringe using Three.js / R3F / GSAP / Matter.js / ogl (Reactbits, Fancy). Accessibility is largely irrelevant to it; it's decoration. dotUI can cherry-pick a few cheap wins (marquee, bento, number ticker) but should not anchor its identity here.

**Primitive vs block.** dotUI's core is themeable *primitives* on RAC (button, select, color suite). The Genre-A items are mostly *blocks*: a themeable RAC shell + a peer-dependency engine. The test from `CLAUDE.md` ("would two design systems disagree on it?") still applies to the *chrome* (radius, color, density go through tokens) but the *engine* is plumbing, not design — it stays a plain dependency, never tokenized. The honest model, proven by Kibo and by dotUI's own `drop-zone`: **package the control/overlay chrome; document the engine as an install-it-yourself peer dep.**

## 2. The Kibo UI blueprint (study this first)

[Kibo UI](https://www.kibo-ui.com/) is the single most useful reference — it is the "real-world blocks on shadcn" library, and it publishes which engine each component wraps. The map (verify exact `package.json` pins in [github.com/shadcnblocks/kibo](https://github.com/shadcnblocks/kibo) before adopting):

| Engine | Kibo components built on it |
| --- | --- |
| **dnd-kit** | Kanban, List, Gantt, event Calendar |
| **Motion** (`motion`) | Comparison (before/after), Reel, Deck (swipe stack), Tree, Theme Switcher |
| **Shiki** | Code Block |
| **Tiptap** (+ lowlight, Tippy.js, Fuse.js) | Editor (rich text) |
| **Sandpack** (`@codesandbox/sandpack-react`) | Sandbox (live code + preview) |
| **TanStack Table** (+ jotai) | Table (data grid) |
| **Embla** | Stories |
| **Media Chrome** (`media-chrome`) | Video Player |
| **react-dropzone** | Dropzone |
| **react-image-crop** | Image Crop |
| **react-medium-image-zoom** | Image Zoom |
| **qrcode + culori** | QR Code |
| **cmdk** | Combobox, Tags |
| **react-fast-marquee** | Marquee |
| **date-fns** | Gantt, Calendar, Mini Calendar |
| **Built from scratch** (no engine) | Cursor (multiplayer), Contribution Graph, Ticker, Credit Card, Rating, Relative Time, Glimpse (OG link-preview) |

Takeaways for dotUI: (1) the engine choices are mostly uncontroversial — adopt them; (2) Kibo leaves transport/data to the user (Cursor needs your realtime layer, Contribution Graph needs your API) — same boundary dotUI already draws; (3) Kibo is **not** built on React Aria — so dotUI's accessible RAC chrome is a concrete, demonstrable differentiator on every interactive one.

## 3. What dotUI already covers vs the gap

**Already shipped** (don't rebuild): full RAC **color suite**, **command** (⌘K), **drop-zone** + **file-trigger**, **charts**, **mention**, **otp-field**, **calendar**/**date-picker**, **table**, **tree**, **sidebar**, **toast**, **tabs**, **number-field**, plus the **chat/conversation** layer ([#300](https://github.com/mehdibha/dotUI/pull/300)/[#301](https://github.com/mehdibha/dotUI/pull/301)) and the **ai-prompt** showcase. dotUI is deep on form primitives + data display, and ahead of most registries on color, command palette, and forms (things Origin UI/others gate or omit).

**The gap** — high-demand real-world blocks dotUI has nothing for: rich text editor, code block/editor, video & audio players, voice/waveform, emoji picker, image crop, carousel, kanban/sortable, advanced data grid, event scheduler, comment threads, notifications/inbox, presence (avatar stack/typing/status), pricing/product/stats blocks, multi-step wizard, maps, PDF viewer.

## 4. Strategic reads (things that change the decision)

- **RAC is a real moat for this category.** Media controls, editor toolbars, device pickers, emoji grids, crop dialogs are exactly what RAC's `Slider`/`ToggleButton`/`Menu`/`Popover`/`GridList` do best — keyboard + ARIA for free. Most competitors (Kibo, Origin, the motion registries) hand-roll this. dotUI gets best-in-class a11y on these almost by construction.
- **Ecosystem default engines are settled** — adopt, don't deliberate: **Embla** (carousel — it *is* the shadcn carousel), **dnd-kit** (kanban/sortable, ~18.6M wk dl, powers every registry kanban), **react-dropzone** (upload primitive, usually as a shadcn block — though dotUI already has RAC `DropZone`), **Shiki** (code highlight — already a dotUI dep), **TanStack Table** (data grid; pairs with your existing `tanstack-form`), **Tiptap 3** (rich text), **wavesurfer.js v7** (waveform), **react-easy-crop**/**react-image-crop** (crop), **frimousse** (headless emoji, Tailwind-first), **Sonner** (toast — now the shadcn default; compare against dotUI's RAC toast), **Media Chrome** (video, as reference).
- **Licensing landmines** (the ones that actually bite): **Mapbox GL JS v2+ is proprietary** → use **MapLibre**/**Leaflet**. **Onboarding-tour libs Shepherd.js and intro.js are AGPL-3.0** (copyleft — unsafe for closed-source) → use **driver.js** (MIT, ~5KB) or **react-joyride** (MIT). **FullCalendar's scheduler/resource views are commercial**; **AG Grid Enterprise** and **MUI X Pro/Premium** (grid grouping/pivot, range pickers) are paid → prefer **TanStack Table** + **Schedule-X**/free FullCalendar base. **Tiptap Cloud/Pro** and **Plate Plus** are paid (cores MIT). **Image full-editors are commercial** (Pintura €169–749/yr; tui-image-editor abandoned) — ship a *cropper*, not an editor. **Video/audio-call kits except LiveKit need paid backends** (Stream/Daily/Agora). Note **`react-image-crop` is ISC** (not MIT — still permissive), and **`@tremor/react` is frozen** (Vercel acquired Tremor; use its copy-paste blocks, not the package). Everything else surveyed is MIT/Apache/BSD and registry-safe.
- **The established suites leave the exact gaps you'd target.** MUI, Mantine, Chakra/Ark, and Ant Design *all* ship advanced grids, date pickers, charts, trees, file upload — but **none ship a video/audio player, kanban, emoji picker, or image cropper** (Ark UI's image-cropper + signature-pad are the lone exceptions). Those four are "specialist-library territory" everywhere — precisely where an accessible, themeable dotUI block differentiates. Counter-signal: **Ant Design X** is the one mainstream suite with a first-class AI-chat set (Bubble/Conversations/Sender/ThoughtChain/Sources + `useXChat`) — a strong reference for dotUI's AI layer, alongside AI Elements/assistant-ui.
- **Timing trap on video:** Vidstack, Media Chrome, and Plyr are **merging into Video.js v10** (rebuilt at Mux, beta ~early 2026). Do **not** anchor a dotUI player on any of those control layers right now. Building the chrome natively on RAC over native `<video>` (+ optional `hls.js`, Apache-2.0) is the hedge — it depends only on stable browser APIs and is immune to that churn. Media Chrome stays the best *conceptual reference*.
- **"Chat" is two markets — keep them separate.** **AI/LLM chat** = Vercel AI SDK (streaming/SSE, `useChat`, MCP tools) + a component layer (**AI Elements** official, or **assistant-ui** backend-agnostic). **Human↔human messaging** = GetStream/Sendbird/CometChat/TalkJS (WebSockets, presence, moderation, MAU billing). dotUI's existing chat is the *display layer* that can serve both; the natural next step is the **AI Elements-style set** (Conversation, Message, Response/streaming-markdown, PromptInput, Reasoning, Sources, Tool, Branch, Citations) — which is itself just shadcn + AI SDK + Streamdown + Shiki, all parallelable on RAC. dotUI already has the seeds (chat + ai-prompt).

## 5. The exploration list — tiered by demand × feasibility

Tiers are about *what to explore first*, not importance. EASY/MED/HARD = effort to package as a themeable registry block. "Engine" = the peer dep the user installs.

### Tier 1 — ship-now wins (EASY, high demand, RAC chrome over an engine we already ship or a tiny dep)

- **Code block** — syntax highlight + copy + filename tabs + line highlight. Engine: **Shiki** (already a dotUI dep). Pure chrome; dotUI's sweet spot. *(EASY)*
- **Carousel** — slides + arrows + dots + autoplay. Engine: **Embla**. Clear gap; the shadcn standard; headless and Tailwind-native. *(EASY–MED)*
- **Audio player** — podcast/music control bar (play/seek/volume/rate/skip + now-playing). Engine: native `<audio>`. ~95% RAC chrome, no required dep. *(EASY)*
- **File-upload block** — drag target + file list + thumbnails + per-file **progress** + remove/retry, built on existing **drop-zone**/**file-trigger** + **progress-bar**. Transport stays the user's job. *(EASY)*
- **Presence set** — **avatar stack/group**, online-status dot, **typing indicator**. Tiny, pairs with chat. *(EASY)*
- **Rating** — star rating, keyboard + hover. Built from scratch (no dep). *(EASY)*
- **Before/after comparison slider** — image reveal on a RAC `Slider`. *(EASY)*
- **Stepper / multi-step wizard** — progress indicator + step flow over existing form primitives. *(EASY–MED)*
- **Stats / KPI cards**, **pricing table**, **product card** — token-driven layout blocks; optional **NumberFlow** (`@number-flow/react`) for animated figures. *(EASY)*
- **Emoji picker** — trigger + popover + category tabs + search + grid. Engine: **frimousse** (headless, Tailwind-first). Wrapped in RAC `Popover`/`SearchField`/grid. *(EASY–MED)*

### Tier 2 — high-value, one engine to wrap (MEDIUM, strong demand)

- **Video player** — full control bar (scrubber w/ buffered + preview, volume, captions, PiP, fullscreen, quality menu) on RAC over native `<video>` (+ `hls.js` only when streaming). *(MED; see timing trap §4)*
- **Voice message / waveform recorder** — record/stop + live meter + waveform scrubber + send. Engine: **wavesurfer.js v7** (BSD-3) + native **MediaRecorder**. Pairs directly with the new chat. *(MED)*
- **Markdown editor** — toolbar + write/preview tabs. Engine: `<textarea>`/CodeMirror + **react-markdown**. (WYSIWYG-markdown via MDXEditor is heavier — defer.) *(MED)*
- **Image cropper** — crop surface + zoom/rotate/aspect controls + dialog, over existing FileTrigger/DropZone. Engine: **react-easy-crop** (or **react-image-crop**, Kibo's pick). *(MED)*
- **Kanban board + sortable list** — columns/cards, drag-reorder. Engine: **dnd-kit**. The registry-ecosystem default; big demand. *(MED)*
- **Advanced data grid** — sort/filter/select/resize/paginate/virtualize over existing **table**. Engine: **TanStack Table** (+ **TanStack Virtual** for big sets). Fits your existing TanStack usage. *(MED–HARD)*
- **Comment thread** + **notifications/activity feed/inbox** — composed display blocks; pair with chat/presence. *(MED)*
- **AI assistant UI set** — Conversation, Message, streaming **Response**, PromptInput, Reasoning, Sources, Tool, Branch, Citations. Engine: Vercel **AI SDK** + **Streamdown** + **Shiki**; or mirror **assistant-ui** primitives on RAC. Extends chat + ai-prompt. *(MED)*
- **Lightbox / media gallery** — grid + fullscreen viewer + keyboard nav (Embla or yet-another-react-lightbox). *(MED)*
- **PDF viewer** — page render + zoom + page nav. Engine: **react-pdf** / pdf.js. *(MED)*
- **Node / flow editor** — drag nodes, typed-handle edges; the canvas behind workflow builders, AI-agent graphs, no-code pipelines. Engine: **React Flow** (`@xyflow/react`, ~8.2M wk dl) — which already ships **React Flow UI** as shadcn-CLI blocks on React 19 + Tailwind v4 (dotUI's exact stack). Rising fast with AI-agent tooling. *(MED–HARD)*
- **Onboarding tour / coachmarks** — spotlight + step popovers, multi-page tours. Engine: **driver.js** (MIT, tiny, framework-agnostic) or **react-joyride** (MIT, React-native, v3 rewrite); **Onborda/NextStep.js** are the shadcn/Tailwind/Framer-native option. Avoid AGPL Shepherd.js/intro.js. *(MED)*

### Tier 3 — high demand but hard/strategic (heavy unownable engine, SDK-lock, or licensing care)

- **Rich text editor / WYSIWYG** — the biggest commitment. Engine: **Tiptap 3** (headless; or **Plate** if you want the shadcn-aligned editor-registry model). Chrome (toolbar, bubble/slash menus, link popover) is RAC-perfect, but editing a11y lives in the engine and the surface is large. *(HARD)*
- **Code editor** (interactive) — Engine: **CodeMirror 6** (Monaco only for full IDE). Thin chrome over a big stateful engine. *(HARD)* — **Live-code sandbox** (Sandpack) is the adjacent Kibo play.
- **Event calendar / scheduler** (not the date picker) — month/week/day grids, drag events. dnd-kit + date-fns, mostly hand-built. *(HARD)*
- **Video/audio call UI** — participant grid, call controls, device picker, screen share. Engine: **LiveKit Components** (the only OSS + self-hostable option; others need paid backends). Chrome is inseparable from the SDK's media tracks, so it's effectively "LiveKit-themed," not portable. *(HARD)*
- **Map / location picker** — Engine: **MapLibre GL** (or **Leaflet**; avoid Mapbox v2+). Heavy renderer + external tile source + canvas a11y limits. *(HARD)*
- **Gantt / timeline** — composed, dnd-kit + date-fns. *(HARD)*

### Tier 4 — marketing/effects (optional; Genre B, different philosophy)

Cheap, on-brand-able wins if wanted: **marquee** (react-fast-marquee), **bento grid**, **number ticker** (NumberFlow), **animated backgrounds/beams**, **globe** (cobe — tiny, vs Aceternity's heavy three-globe), **confetti** (canvas-confetti). Flag: these are Motion-driven decoration, weak fit for dotUI's "every visual decision is an axis" model and largely irrelevant to a11y. Pick a small curated set if at all; don't chase Reactbits/Aceternity breadth.

## 6. Full catalog by domain (so nothing's missed)

- **Media & playback:** video player, audio player, waveform/voice recorder, lightbox/gallery, image crop, image zoom, before/after slider, camera capture, QR code, PDF viewer.
- **Content & editing:** rich text editor, markdown editor, code editor, code block, live-code sandbox, emoji picker, tag input, mention ✅.
- **Communication & social:** chat ✅, AI assistant UI, comment thread, reactions bar, notifications/inbox, presence (avatar stack/status/typing), multiplayer cursors.
- **Commerce & monetization:** pricing table, product card/gallery, cart/checkout/order summary, credit-card input, rating/reviews.
- **Data, dashboards & productivity:** advanced data grid, kanban, sortable list, node/flow editor (React Flow), event calendar/scheduler, gantt/timeline, stats/KPI cards, dashboard widget grid (react-grid-layout), virtualized lists, contribution graph, charts ✅, tree ✅.
- **Navigation, layout & flows:** command palette ✅, multi-step wizard/stepper, onboarding tour/coachmarks, dashboard/app shell, settings patterns, dialog-stack wizard, cookie consent.
- **Auth & account:** login/signup blocks, OTP ✅, password strength, API-key management.
- **Support & feedback:** help center/FAQ, contact/support widget, feedback widget, changelog/what's-new, status page.
- **Maps & location:** map/location picker, address autocomplete.
- **Utility:** phone-number input (intl), color picker ✅, signature pad, relative-time/clock, marquee, bento, number ticker, globe, confetti.

## 7. Recommended first phase + sequencing

1. **Prove the model on an easy, high-value block: Code block (Shiki).** Engine already in-house, pure RAC chrome, immediately useful in docs. Use it to settle the "block tier" structure (§9) and the "engine as peer dep" publisher story.
2. **Carousel (Embla)** + **Audio player** + **File-upload block** + **Presence set** — round out Tier 1; broad coverage, low risk.
3. **Voice message/waveform** + **Emoji picker** + **Video player** — Tier 2 media cluster; leans hard on the RAC moat and directly enriches the shipped chat.
4. **Kanban (dnd-kit)** + **Data grid (TanStack Table)** — the productivity heavyweights, once the block model is proven.
5. Only then consider a **Tier 3** anchor (most likely **Rich text editor / Tiptap**) as a deliberate, scoped project.

## 8. Cross-cutting build rules (carry into any implementation)

- Own the chrome on RAC; declare the engine a peer dependency (document install + wiring), never copy the engine as source — mirrors `drop-zone`.
- Keep registry-item import hygiene (`@/registry/*`, relative, published packages only) — these blocks must stay shadcn-installable and www-free.
- Make every visual decision an axis (radius, color, density, hover) via tokens/variants; keep engine mechanics as plain values.
- Sync grouped components (e.g. audio ⇄ video controls share a control-bar style; toggle-button family) — land style changes across the group.
- Re-run `pnpm build:registry` + references after adding items; new `.mdx` needs a dev-server restart (see add-registry-component memory).

## 9. Open product questions (need your call before building)

1. **Tier/structure:** new `blocks/` (or `patterns/`) registry tier, a per-item `kind: "block"` flag in `ui/`, or keep everything in `ui/`? This decides publisher + docs + builder treatment.
2. **Builder integration:** are blocks live-previewable/themeable axes in `/create`, or a separately-browsed "blocks" gallery that consumes the same tokens? (North-star says everything's an axis — but a Tiptap toolbar is a different beast than a Button.)
3. **Peer-dependency policy:** is "install this engine yourself" acceptable for shadcn-CLI installs, and how do we surface it (registry `dependencies`, install notes, a wiring example)?
4. **Genre B scope:** do we want *any* marketing/motion effects, or is dotUI explicitly the accessible-real-app-blocks library and we cede eye-candy to Aceternity/Magic UI?
5. **Each new block is N axes** (a video player adds caption/PiP/quality options; an editor adds toolbar variants). Per `CLAUDE.md`, those are product decisions — we'll propose axes per block, not slip them in.

## Appendix A — master table (recommended engine · license · feasibility · kind · demand)

| Category | Recommended engine | License | Feasibility | Primitive/Block | Demand |
| --- | --- | --- | --- | --- | --- |
| Code block | Shiki *(already a dep)* | MIT | EASY | Block | High |
| Carousel | Embla (`embla-carousel-react`) | MIT | EASY–MED | Block | High |
| Audio player | native `<audio>` + RAC | — | EASY | Block | High |
| File-upload block | RAC DropZone/FileTrigger (+ react-dropzone opt.) | Apache/MIT | EASY | Primitive/Block | High |
| Presence (avatar stack/status/typing) | from scratch | — | EASY | Block | High |
| Rating | from scratch | — | EASY | Primitive | Med |
| Before/after slider | RAC `Slider` | — | EASY | Block | Med |
| Stepper / wizard | RAC over form primitives | — | EASY–MED | Block | High |
| Stats/pricing/product blocks | tokens (+ NumberFlow opt.) | MIT | EASY | Block | High |
| Emoji picker | frimousse | MIT | EASY–MED | Block→Primitive | High |
| Video player | native `<video>` (+ hls.js) — RAC chrome | Apache | MED | Block | High |
| Voice/waveform recorder | wavesurfer.js v7 + MediaRecorder | BSD-3/native | MED | Block | High |
| Markdown editor | textarea/CodeMirror + react-markdown | MIT | MED | Block | High |
| Image cropper | react-easy-crop / react-image-crop | MIT | MED | Block | High |
| Kanban + sortable | dnd-kit | MIT | MED | Block | High |
| Advanced data grid | TanStack Table (+ Virtual) | MIT | MED–HARD | Block | Very high |
| AI assistant UI | AI SDK + Streamdown + Shiki (ref: Ant Design X) | MIT/Apache | MED | Block | Very high |
| Node / flow editor | React Flow (`@xyflow/react`) | MIT | MED–HARD | Block | High |
| Onboarding tour | driver.js / react-joyride *(avoid AGPL Shepherd/intro.js)* | MIT | MED | Block | Med |
| Comment thread / notifications | from scratch / composed | — | MED | Block | High |
| Lightbox / gallery | Embla / yet-another-react-lightbox | MIT | MED | Block | Med |
| PDF viewer | react-pdf (pdf.js) | MIT/Apache | MED | Block | Med |
| Rich text editor | Tiptap 3 (or Plate) | MIT (paid tiers) | HARD | Block | High |
| Code editor / sandbox | CodeMirror 6 / Sandpack | MIT | HARD | Block | Med |
| Event calendar/scheduler | dnd-kit + date-fns | MIT | HARD | Block | High |
| Video/audio call UI | LiveKit Components | Apache (OSS+self-host) | HARD | Block (SDK-bound) | Med |
| Map / location picker | MapLibre GL / Leaflet *(avoid Mapbox v2+)* | BSD | HARD | Block | Med |
| Gantt / timeline | dnd-kit + date-fns | MIT | HARD | Block | Med |
| Marketing effects (marquee/bento/ticker/globe) | react-fast-marquee / NumberFlow / cobe / Motion | MIT | EASY–MED | Block (Genre B) | Low–Med |

## Appendix B — peer-library landscape notes (2026)

- **Carousel:** Embla is the shadcn carousel engine and the runaway default (~35M wk dl incl. transitive; headless ~7KB). Swiper = feature-rich fallback. react-slick stale; keen-slider decelerating.
- **Drag-and-drop:** dnd-kit is *the* default (~18.6M wk; powers every registry kanban). react-beautiful-dnd is deprecated (archived Apr 2025) → successors `@hello-pangea/dnd` (drop-in migration) or Atlassian **Pragmatic drag-and-drop** (new builds). react-grid-layout for resizable dashboard tile grids.
- **File upload:** react-dropzone is the headless primitive (usually consumed as a shadcn block); Uppy for resumable/multi-source/S3-multipart; uploadthing for Next.js SaaS convenience; FilePond for polished image preprocessing. dotUI already has RAC DropZone/FileTrigger — keep transport out of scope.
- **Toast:** Sonner is now the shadcn default (shadcn deprecated its own toast); best a11y + stacking animation (~9KB, by Emil Kowalski/Linear). react-toastify (most features) and react-hot-toast (smallest/headless) are the incumbents. dotUI's RAC toast is its own take — compare against Sonner's UX.
- **Video/audio:** Vidstack + Media Chrome + Plyr are merging into **Video.js v10** (Mux, beta ~early 2026) — don't anchor on their control layers; build RAC chrome over native elements + `hls.js`. wavesurfer.js v7 (BSD-3) is the uncontested waveform lib; native MediaRecorder for capture.
- **Rich text:** Tiptap 3 (headless, ProseMirror, ~10M wk) is the default; Lexical (Meta) the OSS-pure performance alternative; **Plate** (platejs, shadcn-CLI/registry distributed) and **BlockNote** (Notion-style, batteries-included) are the two shadcn-native precedents to study; Slate losing ground. Caveat: editors are heavy framework deps, not single-file `base.tsx` — treat as integration targets, the clearest test of the peer-dep model (§9).
- **AI chat:** AI SDK (v5+) is the streaming substrate; AI Elements (official, Aug 2025) vs assistant-ui (backend-agnostic, ~10.8k stars, YC) is the component-layer contest; CopilotKit owns the agentic niche; **Ant Design X** is the one in-suite first-class AI set. Human-messaging (GetStream/Sendbird/CometChat/TalkJS) is a *separate* market (WebSockets, not SSE).
- **Node/flow editor:** React Flow (`@xyflow/react`) is the category — ~8.2M wk combined, 37k stars, ships **React Flow UI** shadcn blocks on React 19 + Tailwind v4. rete.js for executable graphs; Cytoscape/Reagraph are *graph-viz*, a separate category.
- **Calendar split:** date *picker* = react-day-picker (the shadcn default; v10 renamed `@daypicker/react`) or RAC's own calendar (dotUI already has this). Event *scheduler* = FullCalendar (scheduler views paid), **Schedule-X** (modern, free-ish), or react-big-calendar (free). Don't conflate the two.
- **Onboarding tour:** driver.js (MIT, ~1.1M wk, 5KB) and react-joyride (MIT, React-native, v3) lead; Onborda/NextStep.js are shadcn/Framer-native. **Shepherd.js + intro.js are AGPL** — avoid for closed-source.
- **Data grid / charts / maps:** TanStack Table (headless, free — the shadcn path) over AG Grid/MUI X (paid tiers); Recharts (dotUI already uses it) with ECharts as the big-data step-up (Tremor is frozen); react-leaflet / react-map-gl+MapLibre over proprietary Mapbox v2+.
- **Forms:** react-hook-form is the dominant state lib; TanStack Form (which dotUI already ships) is the type-safe challenger. Note shadcn deprecated its RHF-coupled `<Form>` for a **form-agnostic `<Field>`** layer (Oct 2025) — the model to mirror if dotUI revisits its form story: own the accessible UI, let the user bring the state engine.
- **Peer registries worth studying:** **Kibo UI** (the Genre-A blueprint), **Origin UI** (500+ input/control variations; uses react-aria for some), **21st.dev** (marketplace + Magic MCP AI generation), **shadcn official blocks**, **Supabase UI**. Genre-B (Aceternity/Magic UI/Reactbits/Smoothui/Fancy/Motion Primitives/Hover/Indie/Luxe/Syntax) are Motion-effect libraries — reference for eye-candy only.
