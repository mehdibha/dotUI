# `/create` left-panel redesign — "Studio"

> Status: built + browser-verified on branch `claude/dazzling-dubinsky-609c3e`, 2026-06-27. UI-only experiment (no publisher/back-end work). Live axes are genuinely wired to the preview; new axes are captured as design intent (see Binding model).

## Goal

Make the left panel of `/create` the most advanced design-system builder on the web: feed in a brand, walk away with a complete, on-brand component library — openable in a codebase, v0, Claude or Bolt. It has to serve the whole spectrum in one surface:

- **"Give me a clean system, fast."** Seed one colour (or a logo, or a pasted palette) → a full, contrast-checked system. Pick a vibe. Done in a minute.
- **"Let me control every detail."** Decide *how* the colour system generates, tune every palette by hand, restyle any single component, shape the exported code.

## What was removed

`www/src/modules/create/customizer-panel.tsx` (the old `CustomizerPanel`) is **deleted**. It was a flat stacked-list of cards (Colors, Chart colors, Typography, Icon Library, Radius, Density, Cursor) + a components list, with a header (shuffle/undo) and an export footer. Everything in it is superseded by the new `studio/` module. The `?lab=true` exploration (`panel/`) is left untouched — it's a separate prototype.

## The new IA — `studio/`

A single cohesive panel built from one source-of-truth registry, so home cards, the command palette and the detail views can never drift.

```
Header        brand swatch · editable name · ⌘K search · undo · ⋯ (re-roll / reset)
Posture       Simple ⇄ Pro            ← the audience spectrum, one switch
Body (home)
  Brand       seed swatch · live generated ramps · extract from image/palette · 8 vibes · surprise me
  Foundations Color · Typography · Shape · Spacing  (+ Elevation · Motion · Icons · Interaction · Modes · Chart in Pro)
  Components  → grouped, searchable, synced-family aware
Footer        Code style (Pro) · Export (shadcn CLI + v0), themed to the live preset
Overlay       ⌘K command palette → jump to any foundation / component / macro
```

Detail editors slide in over home (parallax stack), exactly like the old panel but richer.

### How each requirement is met

| Requirement | Where |
| --- | --- |
| Seed **one** colour → complete system | Brand front door: one seed swatch → live ramps for every palette, WCAG readout in the Color editor |
| Decide **how** the colour system generates | Color editor mode switch: **Auto** (1 seed) · **Guided** (algorithm + engine knobs) · **Manual** (every seed + status + palettes) |
| Palettes or not as foundations | Manual mode → "Expose palettes as tokens" switch + per-ramp display |
| Tweak a **specific component** | Components browser → per-component param editor, with synced-family banner (Button ⇄ Toggle Button) |
| Control **anything** | Pro mode reveals all 10 foundations; ⌘K reaches every control + every component instantly |
| Fast clean output **or** deep tweaking | Simple/Pro posture; vibes + surprise-me for speed, full editors + code-style for depth |
| Open anywhere | Footer keeps the existing export targets (shadcn CLI, v0), URL baked live from the preset |

### Brand front door (the magic)

- **Seed swatch** — the one real colour; opens the full colour picker.
- **Generated proof** — a tonal ramp per palette (neutral, accent, status) regenerated live from the single seed, so the "1 colour → whole system" promise is visible immediately.
- **Extract from image or palette** — drop a logo (client-side average-colour grab via a 1×1 canvas downscale) or paste any list of hex codes (parsed → accent/neutral/status seeds). Makes "feed in your brand" tangible with zero backend.
- **8 vibes** — Minimal, Corporate, Playful, Editorial, Vivid, Aurora, Brutalist, Warm. Each is a coherent point in the design space (accent + neutral + radius + density + style family + fonts) applied in one atomic update (one undo step).
- **Surprise me** — re-rolls the legible axes.

## Binding model (honesty)

Following the lab's convention, controls carry a **Live** dot (filled = drives the preview now; hollow = captured design intent, applied on export). This is deliberate: new axes write through the *same* token channel as the live ones, so the moment a component reads the var they light up with zero rewiring.

- **Live in the right-hand preview:** brand/base/status seeds, generation algorithm, engine knobs, radius factor, density, cursors, chart palette, every per-component param. (Verified reacting in the iframe.)
- **Captured intent (persisted in the preset, ship on export, no iframe consumer yet):** typography (fonts/scale/weight/tracking), elevation (style family/shadow/blur/border), motion (duration/easing/hover lift/toggle), icon library + stroke, focus-ring width, spacing scale, default mode, "expose palettes." Wiring these into the iframe is preview/publisher work, deliberately out of scope for this UI-only pass.
- **Live in-panel proof:** even the captured-intent editors render a *real* preview of their own setting inside the panel — Typography (weight/scale/tracking on live sample text), Elevation (real CSS shadow/blur tiles that react to the style family), Motion (a slide + hover chip that replay at the chosen duration/easing), Icons (a sample row at the chosen stroke width). So nothing feels dead while staying honest about the iframe.

## Files

```
www/src/modules/create/studio/
  index.tsx              panel shell: header, Simple/Pro, animated nav stack, footer, undo
  store.tsx              StudioProvider — posture, name, nav stack (kept out of the URL)
  actions.ts             atomic multi-axis ops: applyVibe / reroll / applySeeds / resetAll
  data.tsx               token vars (live + stub), vibes, style families, easings
  primitives.tsx         SectionCard, DetailHeader, Field, Segmented, SliderRow, LiveDot
  brand.tsx              the Brand front door (seed, ramps, extract, vibes)
  foundations.tsx        Color (3-mode) · Typography · Shape · Spacing · Elevation · Motion · Icons · Interaction · Modes · Chart
  components-browser.tsx grouped/searchable component list + per-component editor with sync banner
  command.tsx            ⌘K command palette
  views.tsx              single registry: foundation index + resolveView() used by home/command/shell
```

Route change: `www/src/routes/_app/create.tsx` now renders `<StudioPanel>` instead of `<CustomizerPanel>`. Reuses the existing `useDesignSystem`, color engine (`ColorKnobsControls`, `ContrastReadout`, `resolveColorConfig`), `ComponentDetailView`, `ChartColorsConfig`, `CursorConfig`, export footer and code-options dialog — so the deep, proven logic is untouched.

## Verified (browser, dark + light)

- No console errors; `pnpm typecheck` and `pnpm check` clean (2 warnings are pre-existing, in test/script files).
- Vibe click → preview accent + radius + density update + export URL re-baked live.
- Color editor Auto/Guided/Manual all render; live WCAG contrast readout; engine knobs; status seeds.
- Typography editor reflects the vibe's fonts; in-panel sample text updates with weight/scale/tracking.
- Elevation tiles react to the style family (Soft → 3D pronounced depth); Motion + Icons previews render.
- Components browser shows synced-group badges; opening a component swaps the preview and shows the sync banner + param editor.
- ⌘K palette indexes actions + foundations + components.
- Simple shows 4 foundations; Pro reveals all 10 + the Code-style footer button. Light mode adapts.
- Fixed a render-phase `setState` (the store called the router navigate inside a `setStack` updater); confirmed no recurring console errors across repeated component opens.

## Honest limitations / next steps

- The captured-intent axes need preview consumers + publisher emission to become live (typography is the highest-value next target).
- Image extraction is average-colour only; a k-means palette extractor would be a stronger "from your brand."
- The command palette's filtering is react-aria autocomplete (works for real typing; the headless `fill` harness didn't drive it — not a product bug).
- Vibes/typography fonts are presets; wiring fonts to actual `@fontsource`/next-font loading is follow-up.
- Adding any *new* axis or vibe is a product decision — these are proposed within the experiment, not slipped into a component PR.
