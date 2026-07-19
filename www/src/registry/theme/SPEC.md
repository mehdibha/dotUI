# Token system v2 — semantic layer spec

Companion to `packages/colors/SPEC.md` (the engine). That spec owns ramp
generation; this one owns everything between the engine and a rendered
component: the semantic vocabulary, CSS emission, the persisted config, the
live preview, and export. Same status legend: ✅ locked · 🟡 proposed ·
🔬 open.

The prime directive is inherited from the product: **one component styling,
many design systems.** Components consume semantic utilities; every visual
decision behind those utilities is a config axis.

---

## T1. Layering ✅

Three tiers, one direction of reference, no skips upward:

1. **Primitives** — per-mode ramps from the engine: `--{palette}-{step}`,
   `--{palette}-a{step}` (alpha twins), `--on-{palette}-{step}` (solved
   foregrounds). Emitted into `:root` (light) and `.dark`. Light and dark are
   **independent engine passes** — the reversal hack and `stretchLightness`
   die with v1.
2. **Semantic tokens** — `--color-*` vocabulary in Tailwind's `@theme`,
   defined as data (`semantics.ts`) and **generated** into CSS. The hand-
   authored `theme.css` color block dies; the parity test becomes a build
   step.
3. **Components** — Tailwind utilities over tier 2 only. The known raw-
   primitive escapes (button disabled vars, menu/list-box/tooltip highlight
   overrides, tag-group, `::selection`) get semantic tokens and are migrated
   in this rewrite; new escapes are a review error.

## T2. Steps are jobs, semantics are projections ✅

Primitives use the engine's 12-job ladder (`25…950`, engine SPEC D1). The
semantic vocabulary maps roles onto jobs, not onto magic numbers: a token
definition says `{ role: 'accent', job: 'solid' }` and the resolver picks the
step. Jobs: `app-bg, subtle-bg, ui-rest, ui-hover, ui-active, border-subtle,
border-interactive, border-emphasized, solid, solid-hover, text-muted, text`.

This is what makes the vocabulary portable across generated systems and lets
the customizer offer meaningful choices ("solid" vs "a step number").

## T3. Vocabulary ✅ (names) / 🟡 (additions)

The component-facing utility names are the stable contract — `bg-bg`,
`text-fg`, `bg-primary`, `border-border`, the status clusters — and survive
unchanged; 80 components consume them. Changes:

- **Per-mode targets are first-class.** Any token may resolve to different
  (palette, job) pairs per mode. The emitter routes: base value in `@theme`,
  dark overrides in a generated `.dark` block. `color-fg-muted`'s
  "one step can't serve both modes" comment becomes a solved problem.
- **`on-*` foregrounds come from the engine** (per hue, per mode, dual-meter
  solved — engine SPEC D2), never from a black/white rule. The
  `tailwindcss-autocontrast` plugin is dropped from the pipeline and from
  exported dependencies; `--on-*` ship as literals.
- **Muted tint surfaces become real tokens** (`color-primary-muted` etc.
  re-derived from alpha twins or subtle-bg jobs); the ad-hoc
  `color-mix(...)` recipes in checkbox/radio/calendar migrate onto them.
- **New tokens** 🟡: `color-overlay` (modal/drawer scrim — today hardcoded
  `bg-black/70`) and `color-fg-on-overlay`; `color-thumb` (switch/slider
  thumb — today `bg-white`). Flagged as the missing axes recon found; two
  design systems disagree on both.
- **Broken/dead cleanup**: `fg-onMutedDanger` (broken camelCase class) fixed
  to a real token; `--shadow-shine`/`--color-shine` dead pair removed;
  zero-consumer tokens either wired to their intended components or dropped
  from the default vocabulary (kept expressible).
- **Chart tokens are generated** (engine SPEC D11): `--chart-1..N`
  categorical from the theme's seeds, CVD-gated — no longer status-500
  aliases.

## T4. Primary is a role mapping, not a special case ✅

`primary` resolves through one table: `roles: { primary: 'neutral' | 'accent' }`
(default `neutral` — Vercel-style black/white actions). Every emitter
(preview, scoped, publisher, v0 bundle) resolves roles through the same
resolver; the four hand-maintained `primary === 'accent'` branches die. The
model generalizes to future role remaps (e.g. `info → accent`) without new
emitters.

## T5. Config schema v2 + migration ✅

```ts
interface ColorConfig2 {
  v: 2
  seeds: {
    accent: string
    neutral?: string // absent → auto-tinted from accent (engine D8)
    success?: string
    warning?: string
    danger?: string
    info?: string
  } // absent status seeds → engine defaults (CVD-gated)
  background?: { light?: number; dark?: number } // bg lightness, engine D9/D12
  vividness?: number // scales the fitted chroma curve (engine D5)
  hueShift?: number // scalar on the family bend table (engine D6)
  neutralTint?: number // whisper-tint amount (engine D8)
  preserveSeed?: boolean // exact-seed pin, prints its ΔEok price (engine D7)
  guaranteePolicy?: 'relaxed' | 'strict' // border misses → warnings / AA on solids (engine D2)
  borders?: Record<string, BorderTargets> // per-palette border placement targets (engine D2)
  primary?: 'accent' // role mapping; absent = neutral
  overrides?: Record<string, { palette: string; job: string }> // per-token remap (advanced)
}
```

Old presets (`c.algorithm` present) migrate in `decodePreset`: seeds carry
over, `primary` carries over, `chromaMult → vividness`, `hueTorsion →
hueShift`; other knobs drop. Old URLs/localStorage/components.json keep
producing a sensible theme — never silent `DEFAULTS` wipes. `sanitizeColor`
validates the full shape (zod), not just the discriminant.

## T6. Emission ✅

- `resolveColorConfig(config)` → engine `createTheme` (both modes, one call)
  → `{ light, dark }` primitives incl. `on-*` + alpha twins.
- `emitPrimitivesCss` — `:root` + `.dark` (or scoped selectors), always with
  `on-*`; no compile-time/plugin dependency, so static CSS, live preview,
  and v0 bundle are the same code path.
- `emitCss(semantics)` — `@theme` block + generated `.dark` re-points for
  per-mode tokens; arbitrary selector for scoped previews.
- `base/colors.css` and the theme block of `base/theme.css` are both
  generated by `pnpm build:registry`; drift is a CI diff, not a parity test.
- Export: shadcn item shape unchanged (`cssVars.theme` + `css[':root']` /
  `css['.dark']`); `tailwindcss-autocontrast` removed from
  `DEFAULT_DEPENDENCIES`.

## T7. /create color experience 🟡

Two tiers (the panel/schema.tsx lab prototype had the right instinct; it and
the current flat section are both replaced):

**Simple** — the Radix-proven minimal input set:

- Brand color (accent seed; "your hex appears in the output" guaranteed)
- Gray: auto (tinted from accent) / pure / custom, one control
- Background: a per-mode lightness slider with a live swatch (light 90–100
  L\* — pure white → soft gray canvas; dark 0–20 — OLED black at 0 → dim).
  Background _color_ (cream/sepia tints) is the planned superset (engine
  SPEC D9); the sliders then become an L\*-only shortcut on that color.
- Primary actions: neutral (black/white) vs brand
- Status: auto (CVD-gated defaults) with per-status override
- Randomize-within-quality-rules + per-seed locks (lock-and-reroll)

**Advanced** — the engine's real axes: `vividness`, `hueShift`,
`neutralTint`, `preserveSeed`, guarantee policy + border-contrast targets
(the `'*'` tier of `borders`; per-palette entries stay preset-level),
per-token remapping ✅ (the `scales` picker pools as a UI — mode-agnostic
`{palette, job}` rows; per-mode pairs stay config/preset-level), chart
palette controls.

**Verification in the panel**: the contrast readout covers the actually-
shipped guarantee pairings (engine D2) in both modes — not just fg-on-500 in
light — with pass/fail against the dual meters.

Chart colors move inside the color section (generated, theme-derived,
override-able) instead of writing `var(--accent-500)` strings into flat
token overrides.

## T8. Playground first 🔬

`/internal/colors` (dev-only route): old vs new vs Radix side-by-side ramps,
APCA/WCAG grids per pairing, CVD simulation, and real component compositions
(the yellow warning-banner test). It is the acceptance surface for the
engine rewrite and stays after it ships.

## Non-goals (this rewrite)

- No component-tier tokens (Primer/Carbon tier 3); semantic tier suffices.
- No renaming of the semantic utility contract consumed by components.
- No multi-theme/brand-switching runtime; one theme, two modes.
- Custom step naming (`steps` option) drops — the job ladder is the contract.
