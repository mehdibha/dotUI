# /create builder redesign — "Bloom" (experiment)

> Status: built + verified on `claude/festive-kepler-abc079` (commit `5dd157c1`). UI-only experiment — real axes drive the live preview, proposed axes are surfaced honestly. Not wired to the publisher.

## Goal

Remove everything in the old `/create` left panel (the customizer + the `?lab` prototype) and rebuild the experience from scratch as the most advanced design-system builder on the web: feed a brand, walk away with a complete, on-brand component library you can open anywhere. Must serve two moods at once — "clean output fast" and "tweak every detail" — and let the user control any axis: seed one colour into a full system, decide how the colour system is built, expose palettes as foundations or not, and tune any component.

## How the design was chosen

Ran a multi-agent design workflow: 5 independent world-class visions (two-speed wizard, AI brand intake, token pyramid, canvas-contextual inspector, command surface), each adversarially judged by 3 critics on a 7-axis rubric, then synthesized into one blueprint. **Bloom** won (avg 60/70) and became the backbone, grafting the best of the rest:

- **Bloom** — one never-reloading column that grows from one decision to two hundred (expand-in-place, zero stack depth).
- **Atelier** — brand intake as a zero-state that collapses into a provenance chip; generation theater.
- **Atlas** — panel-as-data; honest live/stub binding dots; settable ⌘K.
- **Inspector** — non-destructive Simple/Advanced; live-instrument summaries; contrast guardrail.
- **Strata** — palettes-as-foundations that bloom in; an early-finish "you're done" ribbon.

## What shipped

The old `customizer-panel.tsx` and the whole `panel/` lab are deleted. New module: `www/src/modules/create/builder/`.

- **First-run intake** (`intake.tsx`) — auto-opens with no preset (a shared `?preset=` link skips it). Four modes: **Color** (the hero — a `ColorArea`/hex picker that streams the 11-step ramp + 4 auto-derived status seeds in with a staggered "birth" animation via the real `resolveColorConfig`), **URL**, **Logo** (simulated extraction), **Vibe** (six bundles), plus a row of starter systems (Geist/Material/Linear/Vercel/Sunset). "Build my system" morphs the card away into the Spine; the brand chip in the header reopens it.
- **The Spine** (`builder-panel.tsx`, `spine-row.tsx`) — header (provenance chip · inline system name · ⌘K pill · shuffle · undo), a one-open accordion of axis rows (one open per namespace so the column never runs away), a completion ribbon, and a persistent export footer. Each row is both a live spec-sheet summary (swatches, font name, density word, ramp gradient) and, when expanded in place, its own inspector.
- **Foundations** (`foundations.tsx`, `axis-colors.tsx`, `axes.tsx`) — Colors (Simple/Advanced tabs; six seeds with AUTO ghost states on untouched ones; plain-language algorithm relabel Natural/Vibrant/Material/Accessible; knobs; generated ramps; contrast readout + one-tap "nudge to AA"; **expose-palettes-as-foundations** switch that blooms editable per-ramp rows into the column), Typography, Iconography, Density, Radius, Borders, Elevation & surfaces, Motion, Interaction, Appearance, Chart colors.
- **Components** (`components-zone.tsx`) — searchable, grouped list of the components that expose builder params; expanding one renders the real `ComponentDetailView` inline and switches the live preview to it. Synced groups show a badge + sibling avatars + "editing X also updates Y", and edits **fan out to every group member in one undo step** via the new `setGroupParam`.
- **⌘K palette** (`command-palette.tsx`) — settable, indexes every axis + component + actions (set density, toggle palettes, shuffle, set radius), with keyboard nav.

## Wired vs proposed (honest binding dots)

- **Live** (drives the preview + export): colour seeds/algorithm/knobs, density, radius, cursors, per-component params + synced-group fan-out, chart colours, code-style, export targets, undo/shuffle.
- **Proposed** (polished UI, no token consumer yet — green vs hollow dot, never silently shipped per CLAUDE.md): typography fonts/scale/base, icon library/stroke, border width, elevation family/shadow/blur/translucency, motion, focus-ring, default mode, context-aware tokens. These write to `--ds-*` vars and become live the moment a component reads one.

## Plumbing changes (outside `builder/`)

- `preset/use-design-system.ts` — added `setGroupParam(members, param, value)` (atomic group fan-out).
- `components/index.tsx` — exported `getComponentsInGroup`, `getComponentMeta`, `getSyncedGroup`, `allGroups`.
- `routes/_app/create.tsx` — swapped the panel for `BuilderPanel`; dropped the `panel`/`lab` search params.

No registry source changed → no generated drift.

## Problems hit + resolved during the build

- **Intake flex column squashed its content** (overflow overlap) → `*:shrink-0` + scrollable column.
- **Rows wouldn't expand on click** → root cause was a React-Aria `Tooltip` (the binding dot) nested inside each row's React-Aria trigger button; a nested press context swallows the outer `onPress`. Fixed by making the binding dot a native `title` tooltip and the row trigger a native `<button onClick>`.
- **Expand animation stuck at opacity 0 / partial height** → Framer `height:auto` was interrupted by the preview-switch navigate. Replaced with the bulletproof CSS grid-rows `0fr→1fr` trick.
- **Synced editor said "no options"** → canonical-member rule picked a param-less member; now edits the clicked component and fans out.
- **Component list was a wall of disabled rows** → only ~22 of the registry components expose builder params; the list now shows just those (fan-out still targets the full group).
- Dev-server (TanStack Start SSR) first-compile is slow and HMR after rapid edits degrades interactivity — verification required clean restarts + waits, not a code issue.

## Verified live (preview tools)

First-run intake (+ seed-to-system animation) · applying a starter recolours the live preview · Build → Spine · row toggle + one-open accordion · expand-in-place content (tabs, selects, sliders) · AUTO ghost seeds · synced-group badge + fan-out · palettes-as-foundations bloom · ⌘K open + jump · export footer reflecting the live preset. `pnpm typecheck` + `pnpm check` green.

## Follow-ups worth a product decision

- Greenlight the proposed axes (typography/icons/borders/elevation/motion/appearance/focus-ring) by adding their tokens + publisher support — the UI is ready and flagged.
- Most components expose no builder params; curating params for more components would deepen per-component editing (the surface scales automatically).
- Deferred from the blueprint (non-essential): pin-to-compare two rows, the left minimap gutter, a 52px collapsed rail, and mobile-specific reflow (mobile currently uses the existing customize/preview pane toggle).
