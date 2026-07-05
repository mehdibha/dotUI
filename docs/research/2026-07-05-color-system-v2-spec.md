# Color system v2 — architecture spec

Status: draft — output of a design discussion on 2026-07-05. Sections marked **Open** need a decision before implementation; everything else is settled direction. Append `> Decision:` lines here as open items get resolved.

> Relation to prior research: supersedes the recommendation (§C) of `2026-07-05-color-model/` (unmerged branch `claude/friendly-nobel-ccf450`, commit `dcdd548b`) — that doc proposed repairing the current kernel; the user has since decided on a from-scratch rewrite, and this spec is the target. Its **diagnosis (§A) and reference-system comparison (§B) remain valid evidence** and are absorbed below as hard requirements. Its comparison artifacts (`ramps-comparison.html`, `generate-comparison.ts`, Tailwind/Radix reference JSONs) should be ported into the v2 playground, not rebuilt.

## Layered model

```
source colors  →  scales (palettes)  →  semantic tokens  →  components
(user input)      (generated ramps)     (roles)             (consume roles only)
```

- The data model is always the full advanced model; the builder's simple mode is a lens over it, never a separate model.
- Dependencies point one way only: components consume tokens, tokens reference scales, scales are generated from sources. Nothing upstream ever depends on what a downstream layer uses (e.g. the token set never changes based on which component styles are selected).

## Scale contract

A scale (palette) is:

- **N ordered steps**, each with a defined job and a target contrast against the mode's background. Lightness is solved from the contrast target in OKLCH; hue is held constant with bounded drift correction.
- **Contrast targets are the source of truth, not a fixed lightness ladder.** For a given mode surface they compile to a lightness ladder — so when the user moves a mode's surface anchor (near-black vs dim dark mode), the whole scale re-solves correctly instead of needing a second hand ladder. The *default* targets are tuned so output matches hand-tuned references (Tailwind/Radix aesthetic), enforced by golden tests. This resolves the anchors-vs-contrast question from the prior doc: taste lives in the default targets, guarantees live in the solver.
- **Chroma is cusp-aware per hue** (prior doc A2, user-ratified via the shipped mustard `--warning-500`): the envelope peaks at the hue's gamut cusp lightness (yellow ≈ L 0.9, blue ≈ L 0.45), never a fixed mid-scale sine. A single envelope for all hues is a rejected design.
- **Seed fidelity is a default, not a knob** (prior doc A3): the brand color the user picks appears in the ramp (anchored at the solid step) unless they opt out. No silent chroma boosts on muted seeds without a visible indication; neutral tinting range must reach warm-cream/Solarized territory.
- **Computed contrast color(s)** shipped with the scale — at minimum `<palette>-contrast`, the correct foreground for the scale's solid step. Computed by the engine at generation time with an enforced contrast floor (the current `onBlackWhite` picker has none — prior doc A5), never hand-authored. Must stay value-identical to what `tailwindcss-autocontrast` computes where both apply (preview = export parity).

Guarantees (these become property tests, replacing snapshot tests):

- Monotonic lightness across steps.
- Every value in-gamut (sRGB, with P3 as a later option).
- Hue drift within a fixed bound.
- Declared contrast targets met (e.g. text steps pass their ratio against step-1/mode background).
- Adjacent steps always exist in the direction the engine needs for hover/active walking (walk toward scale middle at the ends).
- Same config solved against a different mode background yields the mode's scale — dark mode is a re-solve, not an inversion.

**Default contrast targets — measured, not invented** (2026-07-05, from the reference JSONs in `dcdd548b`, WCAG 2.1 vs the mode surface, chromatic hues, mean across hues):

| step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tailwind vs white | 1.06 | 1.15 | 1.31 | 1.62 | 2.34 | 3.41 | 4.95 | 6.82 | 9.29 | 11.22 | 15.87 |

Notes from the measurement:
- The WCAG anchors emerge naturally: 500 ≈ 3.4 (≥ 3:1 non-text UI), 600 ≈ 5.0 (≥ 4.5:1 text). The ladder is roughly geometric. These means are the proposed v2 default light targets.
- Per-hue spread is real (500 ranges 1.9–5.1 — yellow's cusp): targets are the spine, hue-specific latitude at the solid step is absorbed by the computed `-contrast` foreground (dark text on yellow), exactly as Tailwind/Radix do it.
- **Radix dark is empirically not a mirror of light** (same step, different target: step 6 = 1.45 light vs 1.89 dark; step 8 = 2.20 vs 3.35). Dark needs its own measured target ladder (derive from Radix dark scales — Tailwind ships no dark ramps); this independently confirms "dark is re-solved, never reversed."

**Open:**
- Step count and naming: 10 Tailwind-style numbers vs 12 Radix-style jobs. Leaning: Tailwind numbering (registry already uses it) with documented Radix-style jobs per step.
- Contrast metric: WCAG 2.1 ratios vs APCA. Leaning: WCAG 2.1 as the enforced floor (the auditable standard), APCA as advisory readout.
- The dark-mode target ladder (measure from Radix dark in the playground phase).

## Generation

- **One contrast-first producer** is the default engine, plus a **fixed producer** for pasted/exact scales — paste-my-palette and "start from Tailwind `<hue>` / Radix `<scale>`" are first-class product paths (prior doc A4: the current product rejects exactly these). Editing any step of a generated ramp converts that ramp to fixed — no half-generated ramps.
- **Dark is generated, never derived.** Every mode's scales are re-solved against that mode's surface anchor. Ramp reversal and post-hoc lightness stretching are rejected designs (prior doc A1 — the single biggest defect of v1).
- Algorithms are **not a user-facing axis**. Users pick looks, not math — presets over producers. Leonardo/Material/naive-OKLCH differ only in how they pick per-step lightness; contrast-solving subsumes them.
- Golden reference: seeding with a Tailwind color should reproduce that Tailwind scale within a small ΔE tolerance.

> Decision (2026-07-05): from-scratch rewrite of the package's API and contract. Salvage policy: kernel code (color math, zod schemas, verify layer) may be reused where it passes the new property tests, but the producer zoo (`material`/`oklch`/`contrast` as user-visible algorithms) is not carried over.

## Modes

- A mode is a named context with its own background anchor: `{ id, bgAnchor }`. Never a `darkMode` boolean.
- Default: `light` + `dark`, both generated. User may remove one.
- Custom modes (high-contrast, dim, …) are architecturally free (one more solve against another anchor) — supported in the model, no builder UI in v1.

## Palettes

- **Structural, always present:** `neutral`, `accent`.
- **Semantic, curated list, optional:** `danger` (on by default — components reference it), `success`, `warning`, `info`. Removing one requires a defined fallback role.
- **User palettes:** arbitrary named scales, no component wiring.
- **Renaming** is a display label + export-time slug; internal role ids are stable so component styles never break.
- The shadcn/monochrome look is **not** "no accent" and **not** accent-aliases-neutral — it's a role assignment (see below). Unused palettes are harmless.

## Semantic tokens

- **Small set (~25–40), semantic only.** No component-token layer. Shared-surface tokens where values would always agree: `--bg-overlay` for popover/menu/modal, not three tokens.
- **A role is a `(palette, step)` assignment.** Vibrant: `primary → (accent, solid)`. Monochrome/shadcn: `primary → (neutral, 900)`. Presets are bundles of role assignments.
- `ring`, `selection`, link-ish roles **follow primary by default** unless overridden, so one personality toggle moves coherently.
- **Interactive states are tokens:** `--primary-hover`, `--primary-active`, etc. The engine resolves them by walking adjacent scale steps (direction-aware at scale ends). No `color-mix` in component source. Components write `bg-primary hover:bg-primary-hover` — never scale steps.
- **Foreground pairs** (`--primary-fg`) are engine-computed by contrast test against the resolved value; user-overridable in advanced mode.
- The token set is the **union** of what curated styles can need — a style not using `--primary-active` (e.g. scale-down press) is a non-event. Press effects and similar mechanics live in `styles.ts` as style params, not in the color system.

## Draft token map (v0 — ratify after the playground freezes step numbers)

Step numbers below are provisional (Tailwind-style 50–950 numbering per the open-item call). Every token is a `(palette, step)` assignment unless marked *computed*. Naming: `bg-*` surfaces, `fg-*` text/icons, `border-*`, interactive roles bare.

**Page & surfaces**

| Token | Default | Notes |
|---|---|---|
| `--bg` | neutral-50 | page background — *is* the mode surface by construction |
| `--bg-muted` | neutral-100 | wells, subdued sections, ghost-hover territory |
| `--bg-overlay` | neutral-50 light / neutral-100 dark | popover + menu + modal shared surface; per-mode delta (overlays lighten in dark); the translucency grouped-tweak retargets this one token |
| `--bg-inverse` | neutral-950 | tooltips, inverse chips |

**Foregrounds**

| Token | Default | Notes |
|---|---|---|
| `--fg` | neutral-950 | primary text |
| `--fg-muted` | neutral-600 | secondary text; expect a per-mode delta (prior doc showed one step can't serve both modes) |
| `--fg-inverse` | *computed* | on `--bg-inverse` |

**Borders & focus**

| Token | Default | Notes |
|---|---|---|
| `--border` | neutral-200 | dividers, card hairlines |
| `--border-field` | neutral-300 | form-control borders (conventionally darker) |
| `--ring` | follows `primary` | focus ring; follows primary unless overridden (personality coherence) |

**Neutral interactive** (secondary/ghost buttons, list & menu item hover)

| Token | Default |
|---|---|
| `--neutral` | neutral-200 |
| `--neutral-hover` / `--neutral-active` | neutral-300 / neutral-400 |
| `--neutral-fg` | *computed* |

**Interactive roles.** `primary` and `danger` get the full set; `success` / `warning` / `info` get the display subset (they're rarely buttons — add hover/active per role only when a curated style needs it):

| Token | Default | In display subset |
|---|---|---|
| `--{role}` | (palette, solid ≈ 500; monochrome preset: (neutral, 900) for primary) | ✓ |
| `--{role}-fg` | *computed, contrast-floored* | ✓ |
| `--{role}-muted` | (palette, 100) — badges, subtle alerts | ✓ |
| `--{role}-muted-fg` | (palette, 700) | ✓ |
| `--{role}-hover` / `--{role}-active` | adjacent steps, engine-walked | full set only |

Count: ~38. Deliberately absent: `--fg-disabled` (disabled is opacity, a style decision, not a color), per-component tokens (`--bg-popover` etc. — covered by `--bg-overlay`), selected-state tokens (list/menu selection uses `--{role}-muted` or `--{role}`), per-step on-colors (covered by `<palette>-contrast` + autocontrast plugin).

**Ratification gate:** before freezing, walk the registry styles (Button, Menu, ListBox, Field, Table, Tooltip at minimum) and confirm every color they currently reference maps to exactly one token here. Any orphan = missing token or missing axis — decide which, explicitly.

## CSS emission

```css
:root  { /* light palette values + semantic mappings (mode-invariant form) */ }
.dark  { /* dark palette values + only the semantic deltas */ }
@theme inline { --color-primary: var(--primary); /* … bridge, static */ }
```

- Mode-variance is pushed into the palette layer: semantic tokens reference palette vars (incl. `<palette>-contrast`), so most of the semantic layer is written once. `.dark` redefines palettes fully (every value changes) and semantics only where the *mapping* differs.
- Generated CSS verbosity is fine — the single source of truth is the builder config; the CSS is compiler output nobody maintains.

## shadcn compat

- An **export target in the publisher**, not an internal mode. Resolve semantic tokens to raw values, emit shadcn variable names, degrade what shadcn can't express (hover tokens → opacity modifiers in emitted component code).
- Explicitly caps output quality at shadcn's ceiling — acceptable, it's what the user asked for. Touches component class strings, so it's a publisher transform; account for it in the publisher rewrite.
- Optional `codeOptions` transform: prune tokens unreferenced by exported components. **Default is ship the full vocabulary** — users build their own components against it.

## Builder UX (direction, not design)

- Simple mode: brand color, preset picker, a "Primary: Brand / Monochrome" style choice with live swatches. Advanced mode: per-palette curves, role → (palette, step) pickers, per-token overrides.
- Every axis switchable at runtime (CSS variables), per the repo rule.

## Execution order

1. Resolve the **Open** items above (step count/jobs, contrast metric).
2. **Comparison playground** (dev-only route): seed color → v2 scale beside Radix / Tailwind / current engine, with contrast tables. Port the existing artifacts from `dcdd548b` (`ramps-comparison.html`, `generate-comparison.ts`, reference JSONs) rather than rebuilding. Visual + numeric verification before trusting the engine.
3. **Build the v2 engine against this contract**, property tests first (the contract guarantees above), golden tests against Tailwind/Radix references. Salvage v1 kernel code opportunistically per the salvage policy.
4. **Token map**: the concrete ~30 tokens, default (palette, step) per role per mode.
5. Builder UI last, on top of the settled model.
