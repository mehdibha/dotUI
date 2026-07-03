# 005 — Topic deep-dive pages + interactive widget kit

Planned at `9c86ac02`. Depends on [003](003-app-scaffold.md) (app + index) and ≥3 systems of data from [002](002-schema-and-question-bank.md)/[004](004-research-execution.md). Read [README.md](README.md) Phase 0 first.

## Goal

The crown jewels: **interactive-first topic pages** (maintainer's explicit choice — showpieces, not static tables) that answer one canonical question across all researched systems, with explorable widgets no other publication can build — because we own an OKLCH engine and can run every system's palette algorithm live.

## Guardrails (binding — this is where the month-eating risk lives)

- **Widget kit first, showpieces second.** Build shared primitives once (below); every topic page composes them. A topic page may add at most ONE bespoke widget.
- **Timebox per topic page: ~1 week equivalent.** If a page wants more, cut the widget, ship prose+tables+existing widgets, file the idea.
- **Widgets are renderers over `facts` data + algorithm functions.** No widget owns hand-entered data; if a widget needs data the schema lacks, that's a 002/004 change first.
- **Static fallback always**: every widget SSRs/prerenders a meaningful static state (SEO + no-JS + link previews). No blank-div-until-hydration pages.

## The widget kit (`ds/src/components/widgets/`)

1. **`PaletteRamp`** — render any system's ramp(s) with step labels, hover→OKLCH/hex/contrast readouts, light/dark toggle. Data: facts + sampled palettes stored per system.
2. **`AlgorithmPlayground`** — the flagship: pick a seed color, watch each system's generation algorithm produce its palette side by side. Backed by a common interface, `packages/`-worthy if it grows: `PaletteAlgorithm { id, systemSlug, generate(seed, options) → ramps }`, with adapters: `@dotui/colors` (ours), `@material/material-color-utilities` (HCT), `@adobe/leonardo-contrast-colors` (Spectrum), static-scale adapters (Radix, Tailwind — no algorithm, shown as fixed references), plus faithful reimplementations only when a system documents its math and no package exists (cite the doc in the adapter).
3. **`ContrastMatrix`** — for a system's guaranteed pairings: measured WCAG 2.x + APCA values against the claimed guarantees. "Claimed vs measured" is exactly the truth-seeking flex the site exists for.
4. **`TokenLayerDiagram`** — primitive→semantic→component layer visualization from `tokens.layers` facts, per system, with real token names.
5. **`FactTable` / `Matrix`** — the generated comparison table over any `matrixable` question; every cell carries its citation popover + verified-date. (Shared with 006.)

## Topic pages for v1 (one per question-cluster; each ends with "Implications for builders" → feeds 006's issues pipeline)

1. **How the best design systems generate color** (`palette.generation` + `palette.colorspace`) — flagship, uses AlgorithmPlayground.
2. **The anatomy of a palette** (`palette.structure`) — ramps/steps/semantics compared; PaletteRamp gallery.
3. **Contrast: guaranteed, checked, or vibes** (`contrast.strategy`) — ContrastMatrix; claimed-vs-measured.
4. **Semantic tokens, component tokens, and who actually uses them** (`tokens.layers` + `tokens.naming`) — TokenLayerDiagram.
5. **What gets tokenized** (`tokens.scope`) — matrix-led, lightest page.
6. **Dark mode architectures** (`modes.support`).
7. (v1-optional, maintainer interest) **How focus rings are built** (`focus.construction`) — only if roster data for it lands in 004.

Fun awards (Phase-0 decision 5) live inside relevant topic pages as small evidence-backed callouts, not standalone leaderboard pages.

## Done criteria

- Widget kit primitives 1–5 exist, SSR a static state, and are data/algorithm-driven end-to-end.
- Topic pages 1–5 published to citation standard, each with an implications section.
- Each page's widgets render correctly with *partial* data (systems not yet researched simply absent — progressive launch).
- `pnpm check`/`typecheck` green; pages prerender.

## STOP conditions

- If an algorithm adapter requires reverse-engineering *undocumented* math (vs documented math without a package), STOP — present the fidelity risk to the maintainer; a mislabeled approximation would violate the truth standard. Approximations must be labeled as such in the UI.
- If any single topic page exceeds its timebox by 2×, STOP, ship the static version, and log the widget as follow-up.
