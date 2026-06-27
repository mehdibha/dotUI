# /create redesign — "Studio" (experiment)

> Status: experiment, 2026-06-27. UI-first redesign of the `/create` builder. Branch `claude/nifty-wu-d32c29`. Built and verified live in-browser; not yet a PR. This is a point-in-time report, not kept current.

## Brief

Remove everything in the old left panel of `/create` and redesign the whole experience from scratch — aiming at "the most advanced design-system builder on the web." It must serve, in one product, the founder who wants a clean branded system in two minutes AND the design engineer who wants to tweak every detail. Specific must-haves: seed one color → a full color system; OR fully decide how the color system is built; palettes-as-foundations optional; tweak any component; control anything. UI only — no obligation to wire every axis to real logic.

## How the design was chosen

Rather than design from a single instinct, a multi-agent design workflow generated five independent principal-designer visions through distinct lenses (magic-funnel · pro-studio · token-graph · direct-manipulation · adaptive-depth), an adversarial three-judge panel scored them (craft / coverage / feasibility / novelty), and a synthesis merged the best into one buildable spec. The winning thesis — **"Depth: one living surface that sharpens as you lean in"** — drove the build, grafting the strongest ideas from the runners-up (the auto/derive color model, the token-altitude framing, schema-derived ⌘K, binding honesty). The full synthesis is in the workflow output; this document records what was actually built.

## What was removed

- `www/src/modules/create/customizer-panel.tsx` — the old 288px drill-down navigation stack (Colors → Typography → … → Components).
- `www/src/modules/create/panel/` (whole directory) — the in-progress `?lab` exploration (5 swappable layouts, the floating "panel lab" meta-tool, the data-driven schema, macros, control-panel, config).
- The `panel` and `lab` search params and their branching in `routes/_app/create.tsx`.

`/create` now always renders the new experience. The right-side live-preview iframe (`preview/preview-panel.tsx`) and the export/code-options modules were kept and reused.

## The new architecture — "Studio"

One living surface. Lives in `www/src/modules/create/studio/`.

- **Shell** (`index.tsx`) — a left column (`bg-card`, rounded, `lg:w-96`) beside the live preview. Below `lg` they collapse to a single switchable pane (Customize / Preview), both kept mounted so the iframe never reloads. This fixes the old "15px preview sliver" mobile break.
- **Header** (`header.tsx`) — a live brand-color swatch (edit the accent from anywhere), the editable system name, a ⌘K search trigger, the **Quick / Studio depth toggle**, and Re-roll / Undo / Redo / Reset / theme actions. The undo/redo and re-roll are genuinely wired (the old header's Shuffle/Undo were dead buttons).
- **Rail** (`rail.tsx`) — a thin icon spine of nine chapters, grouped (foundations · surface · parts) with hairline dividers. A stable map of the system that never scrolls away, replacing the drill-down stack.
- **Inspector** (`inspector.tsx`) — renders the active chapter. Chapters fade in on switch via a transform-only CSS keyframe (never opacity — see Bugs).
- **Command palette** (`command-palette.tsx`) — ⌘K opens a search over chapters, presets, components, and actions. The index is derived from the same data the panel renders, so it can't drift.
- **Footer** — Code style + Export (shadcn install command, Open in v0), always reachable.

State is split cleanly: the **design system** stays in the shareable `?preset=` URL (via the existing `useDesignSystem`), so every real edit drives the live preview through the existing postMessage channel; the **studio ergonomics** (active chapter, depth, name, color mode, palettes toggle) live in a small `StudioProvider` (`store.tsx`) and are intentionally not serialized.

### Quick vs Studio (the "Depth" mechanic)

There is one panel, not two apps. Every chapter declares its controls as macro or micro. In **Quick**, only macros show — the few decisions that re-skin the whole system. In **Studio**, the micros reveal in place. Lowering the depth never discards values (they live in the URL). Verified live: in Material, "Shadow intensity" (micro) shows in Studio and hides in Quick while "Style family" (macro) stays.

## The chapters and axis inventory

Nine chapters. Live = drives the preview today; UI = polished control, not yet wired to a preview consumer (honest "live dot" on each).

- **Brand** — the one-seed magic entry. One color → the engine generates the full accent ramp, neutral, and status families (shown live). Quick-swatch chips, a Guided-vs-Full-control fork, a palettes-as-foundations switch, and a preset gallery (dotUI / Linear / Vercel / Material / Stripe / Editorial / Playful). *(live: seed, presets)*
- **Color** — Guided/Advanced. Seeds (accent, base) + neutral temperature (pure/warm/cool/tinted). Generation algorithm with outcome-oriented labels (Perceptual / Tailwind / Material / Contrast-locked), Vibrancy, Contrast target. Advanced reveals status seeds, the full engine knobs + WCAG contrast readout, and dark-mode strategy. Palettes-as-foundations shows the raw generated scales. *(live: seeds, algorithm, vibrancy, knobs; UI: contrast target, dark strategy)*
- **Typography** — curated pairings, display/body fonts (rendered in their own face), and a Studio-only rhythm group (scale ratio, base size, heading weight, tracking) with a live specimen. *(UI)*
- **Shape & density** — corner radius (live, with a visual), border width, density option-grid (live), spacing scale. *(live: radius, density; UI: border, spacing)*
- **Material** — the big re-skin: Style family (Flat / Soft / Elevated / Glass) as preview cards, shadow intensity, surface contrast, and a grouped translucent-overlays switch with backdrop blur. *(UI)*
- **Motion** — tempo, easing personality (with curve previews), animations + reduced-motion toggles. *(UI)*
- **Icons** — library (Lucide / Remix / Tabler / Hugeicons) + stroke width, with a live sample row. *(UI)*
- **Components** — group-first index (synced groups surfaced with a chain icon + member count), search, and per-component param editors reusing the existing typed editors. Editing a grouped component **fans the change out to every member in one undo step** (Button ⇄ ToggleButton stay in sync), and opening a component **switches the preview to it** (fixing the old config↔preview decoupling). *(live)*
- **Interaction** — interactive/disabled cursors (live, with cursor previews) + focus-ring width. *(live: cursors; UI: focus ring)*

UI-only axes write namespaced `--ds-*` CSS vars through the same token channel, so each one becomes live the moment a component consumes it — no rewiring.

## Signature interactions (verified)

- **One-seed → full system** — pick/seed a color, the accent ramp + neutral + status generate live; the preview blooms.
- **Re-roll** — reshuffles accent + radius + density + style family as a single undoable step.
- **Live everything** — every real control updates the preview iframe through the existing channel (verified: re-roll moved the preview's `--accent-500` hue 251 → 279 and the brand swatch to `#635bff`).
- **Quick ⇄ Studio depth** — the same panel reveals/hides micro controls without losing state.
- **⌘K command palette** — 34 indexed entries (chapters, presets, actions, components); opening a component also couples the preview.
- **Synced-group fan-out** — one edit lands on every member of a component group.

## Bugs found and fixed during verification

Two real robustness bugs were caught by driving the UI in-browser, not just by building it:

1. **Inspector stalled blank on chapter switch.** `AnimatePresence mode="wait"` blocked the incoming chapter on the outgoing one's exit animation resolving; when the exit never completed (throttled rAF / reduced motion / background tab), the panel went empty. Replaced with a keyed remount.
2. **Entrance animation stranded content invisible.** Any enter animation starting from `opacity: 0` (framer-motion's persistent inline style, or a CSS keyframe frozen at its first frame) can pin the panel blank if the animation doesn't advance. Fixed by making the chapter entrance a **transform-only** CSS keyframe (`.studio-enter` in `styles.css`): the resting state is fully visible, so the worst case is a 6px offset, never a blank panel.

Both reproduced on mobile-after-reload and are now fixed and re-verified.

## Verification

Run live at 1440×900 and 390×844, dark mode, on the dev server.

- Renders with no console errors; `pnpm typecheck` clean (0 errors); `pnpm check` formatting clean.
- All nine chapters mount and switch (keyboard-activated to bypass a synthetic-pointer limitation in the test harness).
- Write path end-to-end: control → `?preset=` URL → postMessage → preview iframe tokens regenerate.
- Undo reverts state + URL; redo re-applies; both buttons enable/disable correctly.
- Mobile: full-width pane with a Customize/Preview toggle (no sliver).
- ⌘K opens and indexes 34 entries.

## Deferred / next (not in this experiment)

- Wiring the UI-only axes to real preview consumers + the publisher (Typography fonts are the biggest: they need a font-loading channel into the iframe). Each new axis is a product decision — propose before wiring per `CLAUDE.md`.
- The pin model (auto vs user-pinned values so Re-roll only perturbs untouched axes) — needs a small codec field.
- Live semantic-token re-pointing and per-mode (context-aware) token overrides as an explicit "Tokens" depth.
- Import-a-brand (logo/URL → dominant color) and the reviewable natural-language intent bar.
- Click-the-canvas-to-inspect — needs a reverse iframe channel that doesn't exist today.
