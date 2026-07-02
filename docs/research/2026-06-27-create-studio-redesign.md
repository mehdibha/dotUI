# /create studio redesign — report

> Status: experiment (UI-only), branch `claude/elastic-clarke-fba9d3`, UNMERGED. 2026-06-27.
> Scope: gut the old left control panel and redesign the whole `/create` experience as the most advanced design-system builder we can — brand in, complete on-brand library out, openable anywhere. Logic was explicitly out of scope; the brief was the experience and the surface area.

## What was removed

The old `/create` was a 288px left `CustomizerPanel` (a stacked push/pop menu) beside the iframe preview. The route no longer renders it. `routes/_app/create.tsx` now renders `<Studio/>`; `?lab=true` still renders the legacy `LabExperience` so nothing that depended on it broke. The old files (`customizer-panel.tsx`, `panel/*`) remain on disk but are unwired — safe to delete in a follow-up.

## The new experience: a design-system **studio**

A pro three-zone layout, canvas-first, so "preview every change live on real components" is literally the center of the screen.

- **Top bar** — brand mark, editable system name, Draft chip; Surprise-me / Undo / Reset; Share (copies the deep-link URL); **Export** (popover: shadcn CLI command + Open in v0, both live; Bolt / Lovable / Claude / Figma shown as "Soon").
- **Left rail** — the *axes* of the system as a slim icon nav: Brand · Color · Type · Shape · Space · Depth · Motion · Icons · Cursor · Components. Animated active indicator, tooltips. This is navigation, not a control stack — the opposite of the old fat left panel.
- **Canvas** — the live iframe, elevated: scene switcher (Cards block + every component, searchable), device sizes, zoom, **light/dark split view** (two synced iframes), open-in-tab, fullscreen. Reuses the existing postMessage sync, so every token edit streams in without a reload.
- **Inspector** — a context-sensitive panel per axis. This is where *all* tweaking lives. Each control carries an honest binding dot: filled = drives the preview now, hollow = designed, wires up as the engine grows.
- **Onboarding overlay** — "Generate your design system": seed by one color (swatches + picker) or logo/URL (stubs), pick a vibe (Minimal / Modern / Playful / Soft glass), Generate → applies color + radius + density + depth and dissolves into the studio. Greets first-time visitors once per session; reopenable from the Brand axis.

## How it meets the brief

Two speeds, one product — quick clean output **and** tweak-everything:

- **Seed one color → a complete system.** Color → Seed strategy → *One color*: a single brand seed; neutrals + every status family derive automatically (real OKLCH engine). The onboarding flow is the same promise in one screen.
- **Decide how the color system is structured.** Seed strategy toggles One color / Custom seeds / Import; Foundation toggles **Palettes** (exposed 50–950 ramps) vs **Semantic only** (roles: bg/fg/border/primary/…); plus algorithm (OKLCH / Tailwind / Material / Contrast-locked), per-algorithm knobs, a context-aware-tokens switch, light/dark ramps, and a live WCAG readout.
- **Palettes or not as foundations.** The Foundation toggle is exactly that choice.
- **Tweak a specific component.** Components axis → searchable, grouped list → real per-component param editors (the registry's own `params`), with a **synced-group** note (e.g. Button ⇄ ToggleButton) so the user knows changes apply group-wide. Selecting a component also switches the canvas to it.
- **Control anything.** Every visual axis has an inspector: type (font pairing, scale, base size, tracking, live specimen), shape (radius factor + borders), space (density + scale), depth (flat/soft/3D/glass + shadow + blur), motion (duration + easing + a live travelling-dot specimen), icons (library + stroke), cursor (interactive/disabled).

## Live vs designed (honest)

- **Live now** (reuses existing pure engine/state — no new "logic" written): color (seeds, algorithm, knobs, ramps, contrast), radius factor, density, cursor, per-component params, shuffle / undo / reset, export URLs.
- **Designed** (writes real `--ds-*` CSS vars through the same channel, same names as the old `panel/schema.tsx`, so they go live the moment a consumer reads them): typography, depth, motion, icon stroke, spacing scale, border width. Each is marked with a hollow binding dot.

## Files

- New module `www/src/modules/create/studio/`: `index`, `top-bar`, `navigator`, `canvas`, `inspector`, `export-menu`, `onboarding`, `store`, `axes`, `primitives`, `tokens`, and `inspectors/{brand,color,typography,shape,spacing,elevation,motion,icons,cursor,components}`.
- Edited `routes/_app/create.tsx` (render `<Studio/>`), `styles.css` (added a `studio-rise` enter keyframe).

## Verification

- `pnpm typecheck` — passes. `pnpm check` (oxlint + oxfmt) — 0 errors, 0 new warnings (2 pre-existing remain).
- Browser (dev server): onboarding overlay, full studio, axis switching, Color inspector (engine + ramps + foundation), Components list → Alert detail with real params + canvas switch, Type specimen, light/dark split, mobile layout, and a live shuffle visibly recoloring the preview end-to-end (inspector → URL preset → iframe).
- Two bugs found and fixed during verification: Framer Motion `AnimatePresence mode="wait"` stranded the inspector body, and an SSR'd `motion.div` with `initial={{opacity:0}}` stuck at opacity 0 — both replaced with a CSS `.studio-rise` keyframe (can't strand content). Mobile top-bar overflow fixed.

## Round 2 — going deeper

Four more "advanced builder" capabilities, all verified live:

- **Command palette (⌘K)** — a global Modal+Command: jump to any axis, jump to + open any component (switches the canvas too), or run actions (Generate, Surprise me, Reset). Also opened from a top-bar Search affordance. Shared shuffle/reset live in `actions.ts` (used by the top bar too).
- **Canvas view modes — Preview / Tokens / Code** — the stage is now multi-modal (the iframe stays mounted/hidden, so switching never reloads it):
  - **Tokens** — a live, searchable browser of the resolved tokens: all six palettes as 50–950 swatch ramps (light/dark), plus the foundation tokens; click to copy.
  - **Code** — the *real* generated `theme.css` via `emitPrimitivesCss(resolveColorConfig(...))` (with `--on-*` foregrounds), tabbed with the shadcn install command; updates live as the system changes. "The code you own," shown honestly.
- **Vision simulation** — an eye control over the live preview: Protanopia / Deuteranopia / Tritanopia (SVG `feColorMatrix`) + Grayscale (CSS filter). A real accessibility lens on the whole system.
- **Presets gallery** — a top-bar "Presets" dialog of eight curated complete systems (cool product, monochrome, fintech, developer-green, Material, warm editorial, glass, bold). Each has a live mini-specimen; clicking forks it (seeds + algorithm + radius + density + depth) through the real engine.

New files: `actions.ts`, `command-palette.tsx`, `presets.tsx`, `tokens-view.tsx`, `code-view.tsx`; `store.tsx`/`top-bar.tsx`/`canvas.tsx`/`index.tsx` updated.

## Known limitations / next steps

- Designed axes need engine consumers to become live (the var names are already aligned).
- Import-from-logo/URL and the "More targets" exports are visual stubs.
- Fonts apply by `font-family` name only (no webfont loading yet), so the type specimen falls back if the font isn't installed.
- System name and the onboarding vibe selection are local UI state (not yet persisted into the preset).
- Headless preview screenshots intermittently show the iframe blank/zoomed — a compositing artifact, not a regression (content confirmed via DOM + curl). See `project-worktree-dev-publishables-500` memory.
