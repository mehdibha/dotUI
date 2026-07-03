# ds.dotui.org roster selection — which design systems deserve deep color/token analysis

> Status: **DONE** — researched 2026-07-03, tier-1 roster approved by the maintainer the same day (15 systems, an approved deviation from plan 001's 8–12 cap; see Deviations). Snapshot, not kept current.
> Companion machine-readable output: [`roster.json`](roster.json). Executes [plan 001](../../plans/2026-07-03-ds-research-site/001-roster-selection.md).

## Method

~30 candidates were researched by parallel agent recon sessions (8 batches, 2026-07-03). Ground rule: no scoring from memory or reputation — agents had to open docs pages, GitHub source files, npm metadata, or shipped CSS, and every claim below carries the source the agent actually opened. Closed systems (Linear, Stripe, Airbnb) were probed for shipped-CSS extractability specifically.

**Recon ≠ citation-standard research.** These scorecards are selection evidence, good enough to rank candidates. Plan 004's per-system deep dives re-verify everything to the site's per-fact citation standard before anything publishes; treat details below as strong leads, not published facts.

### Criteria (0–3 each, scored for the color/token dimension only)

- **technical-depth** — real architecture (generation, layering, contrast strategy) vs a flat palette
- **originality-lessons** — does studying it teach something the others don't?
- **inspectability** — public repo = 3, docs only = 2, shipped CSS only = 1, effectively closed = 0
- **docs-quality** — can facts be cited to stable URLs?
- **influence** — tiebreaker only

## Tier-1 roster (approved 2026-07-03)

Scores: depth / originality / inspectability / docs / influence.

| # | System | Type | Scores | Why it's in (one line) |
|---|---|---|---|---|
| 1 | Adobe Spectrum 2 (+ Leonardo) | corporate-design-system | 3/3/3/2/3 | Contrast-solved generation (CAM02-UCS), true 3-tier tokens, JSON-Schema-validated pipeline — deepest public color/token stack found |
| 2 | Google Material 3 | corporate-design-system | 3/3/3/2/2 | HCT color space + runtime dynamic color + contrast-by-construction via tone deltas; open in 6 language ports |
| 3 | Radix Colors + Themes | token-or-color-system | 3/3/2/3/3 | The 12-step role semantics everyone imitates; only major system with APCA-by-construction text contrast (Lc 60/90) |
| 4 | USWDS | corporate-design-system | 3/3/3/3/2 | The "magic number" grade system — numeric grade difference deterministically guarantees WCAG contrast |
| 5 | Ant Design | component-library | 3/3/3/3/3 | Fully open, documented parametric HSV ramp algorithm + the seed→map→alias derivation pipeline |
| 6 | Microsoft Fluent 2 | corporate-design-system | 3/3/3/2/2 | Open Lab/LCH curve-based ramp generator (`paletteShadesFromCurve`) + clean global→alias split + public Theme Designer |
| 7 | Shopify Polaris | corporate-design-system | 3/3/2/2/2 | Open HSLuv color factory purpose-built for cross-hue contrast parity |
| 8 | GitHub Primer | corporate-design-system | 3/2/3/2/2 | 3-tier Style Dictionary pipeline, HSLuv Prism authoring tool, automated WCAG token-pair audits, `org.primer.llm` extension |
| 9 | Meta Astryx | corporate-design-system | 3/3/3/3/2 | Semantic-only tokens (no numeric ramps), `light-dark()` dual-mode values, 10 swappable themes; open since June 2026 |
| 10 | Linear | corporate-design-system (closed) | 2/2/1/1/3 | LCH 3-variable theme generation (base/accent/contrast) replacing 98 vars; the reverse-engineering exemplar |
| 11 | Stripe | corporate-design-system (closed) | 3/3/1/2/3 | Canonical CIELAB contrast methodology (2019 post) + 284 extractable custom properties in shipped dashboard CSS |
| 12 | IBM Carbon | corporate-design-system | 2/2/3/2/3 | Mature 3-tier token layering at scale (~235 semantic tokens, 4 built-in themes) — architecture, not generation |
| 13 | Vercel Geist | corporate-design-system | 1/1/1/3/2 | Step-as-role 100–1000 numbering + machine-readable `/design.md` spec; maintainer pick despite thin color science |
| 14 | shadcn/ui | styling-distribution | 1/1/3/2/3 | The ecosystem's reference point; its thin color layer (borrowed static scales, no contrast strategy) is itself a publishable finding |
| 15 | Tailwind palette | token-or-color-system | 2/2/2/3/3 | dotUI's own substrate; the v4 hex→OKLCH migration-preserving-balance and `@theme` namespace design |

Suggested research order for plan 004 (alternating open/closed, algorithm-richest first): Material 3 → Spectrum 2 → Geist → Primer → shadcn → Ant → Fluent → Polaris → USWDS → Astryx → Stripe → Carbon → Tailwind (Radix and Linear are the plan-002 pilot systems).

## Tier-1 scorecards (condensed recon evidence)

### Adobe Spectrum 2 (+ Leonardo)
Three related open projects: [spectrum-design-data](https://github.com/adobe/spectrum-design-data) (ex `spectrum-tokens`; npm `@adobe/spectrum-tokens` 14.13.2), [adobe/leonardo](https://github.com/adobe/leonardo) (the upstream generation tool — authoring-time, not runtime), and the spectrum-css/react-spectrum implementations. Verified by raw JSON inspection: 16-step ramps 100–1600 (`color-palette.json`, 372 keys), each primitive a color-set with **light/dark/wireframe** mode values; semantic aliases (`semantic-color-palette.json`, 94) + layering aliases (`color-aliases.json`, 170: `background-layer-1/2`, `elevated`, `pasteboard`, state tokens) + component color tokens (73) — a real 3-tier. Generation is contrast-solved via Leonardo (WCAG 2 targets; APCA requested in [issue #197](https://github.com/adobe/leonardo/issues/197), open), moved from HSL to **CAM02-UCS** with a Stevens'-Power-Law lightness curve per [adobe.design's "Reinventing Adobe Spectrum's colors"](https://adobe.design/stories/design-for-scale/reinventing-adobe-spectrum-s-colors); contrast ratios tuned per-theme as percentages of available contrast (Nate Baldwin's ["Adaptive Color"](https://medium.com/thinking-design/adaptive-color-in-spectrum-adobes-design-system-feeeec89a2c7)). Tokens carry JSON Schema + uuid, validated by a Rust CLI; an MCP server ships. P3: not found (sRGB `rgb()` shipped). Motion tokens: unverified.

### Google Material 3
[material-color-utilities](https://github.com/material-foundation/material-color-utilities) (Apache-2.0, TS/Java/Swift/Kotlin/Dart/C++): **HCT** — CAM16 hue/chroma + CIELAB L* tone. 5 tonal palettes + error, 13 tones (0–100). Runtime dynamic color from a wallpaper seed with scheme variants (TONAL_SPOT, VIBRANT, EXPRESSIVE…). 3-tier `md.ref → md.sys → md.comp`. Contrast by construction via tone-delta math (Δ40 ≈ 3:1, Δ50 ≈ 4.5:1; WCAG relative-luminance math confirmed in `contrast.ts`). sRGB-only — P3 explicitly out of scope per repo issue #131. Docs SPA is hard to fetch programmatically (noted for plan 004).

### Radix Colors + Themes
[radix-ui/colors](https://github.com/radix-ui/colors): 12 steps × 30 scales × 4 variants (light/dark × solid/alpha) + blackA/whiteA. Step semantics precisely documented (1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solid, 11-12 text) at [radix-ui.com/colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale). **APCA by construction for text**: step 11 = Lc 60, step 12 = Lc 90 against step-2 background — the only major system on APCA. P3 shipped via `@supports`/`color-gamut` (verified in the npm tarball's `blue.css`). Caveat: the repo ships static hand-authored tables — the generation algorithm itself is not public (the custom-palette tool is a black box). Pilot system in plan 002.

### USWDS
[uswds/uswds](https://github.com/uswds/uswds) + [color tokens docs](https://designsystem.digital.gov/design-tokens/color/overview/): 24 families × 10 grades (5–90, + vivid `v` variants), grades **regularized to relative-luminance ranges** so grade difference alone guarantees WCAG contrast ("magic number": 40+ = AA large text, 50+ = AA, 70+ = AAA). Palette explicitly hand-curated ("not generated by an algorithm") on an HSL model. 3 layers: system → theme (`$theme-color-primary: "blue-60v"`) → state; Sass `!default` theming. WCAG 2.0, no APCA. The one system where contrast is a mathematical property of the token grammar itself.

### Ant Design
[ant-design-colors `generate.ts`](https://github.com/ant-design/ant-design-colors): documented parametric **HSV** algorithm — 12 hues × 10 steps, index 5 = base, `hueStep=2`, saturation/brightness step constants, distinct dark-theme blend-with-background map. Token model: **seed → map → alias** ([customize-theme docs](https://ant.design/docs/react/customize-theme)) — map tokens are *algorithmically derived* from seeds (including non-color, e.g. `borderRadiusLG/SM/XS` from `borderRadius`), the closest published analogue to dotUI's own derivation ambitions. CSS-in-JS with an optional CSS-variables mode (dedicated blog post). Contrast: WCAG mentioned, no targets/tooling. Everything open and readable.

### Microsoft Fluent 2
[microsoft/fluentui](https://github.com/microsoft/fluentui) `packages/tokens`: Neutral 51-step grey ramp (2–98+99), Brand 16-step per-product ramps, shared + alpha palettes. Generation open: `paletteShadesFromCurve()` (theme-designer) draws a curved path through **Lab/LCH** with blended log/linear lightness (`defaultLinearity=0.75`), gamut-snapped to sRGB — powers the public Theme Designer (one brand color → full ramp). Two-tier **global → alias** (~180 alias color tokens, `color[Category][Variant][Number][State]`); `createLightTheme/DarkTheme/HighContrastTheme` factories from `BrandVariants`. Motion/spacing/radius/typography tokenized. WCAG by convention/tooling; no APCA.

### Shopify Polaris
[polaris-tokens `color-factory.ts`](https://github.com/Shopify/polaris-tokens) (archived 2022, source folded into the polaris monorepo; npm `@shopify/polaris-tokens` 9.4.2): **algorithmic in HSLuv** — hex → HSLuv → per-variant transforms → RGB — purpose-built so same-lightness steps deliver equal WCAG 2.1 contrast across hues. 12 color roles × 16 shades (v12). Two-tier primitive → semantic (`color-bg-surface-hover`), `--p-` CSS vars, multi-format export. Enforcement mechanism (CI vs design-time) unconfirmed.

### GitHub Primer
[primer/primitives](https://github.com/primer/primitives): 9 scales with deliberately non-uniform step counts (blue 0–9, neutral 0–13). Generation hybrid: hand-authored HSL shaped in **Primer Prism** (HSLuv-based authoring tool, [archived Dec 2024](https://github.com/primer/prism)) + an automated WCAG audit script over ~100+ token pairs per theme ([github.blog writeup](https://github.blog/engineering/user-experience/unlocking-inclusive-design-how-primers-color-system-is-making-github-com-more-inclusive/)). True 3-tier: base → functional (`bgColor`/`fgColor`/`borderColor`, per-theme inline overrides) → component (27 files), built with Style Dictionary from DTCG-style JSON5. Notable: an `org.primer.llm` machine-readable token-usage extension. HSL/hex shipped; no OKLCH/P3 found.

### Meta Astryx
Verified real (resolves plan 001's open question — not a mix-up with StyleX, which it builds on): open-sourced June 2026 at [astryx.atmeta.com](https://astryx.atmeta.com/) / [github.com/facebook/astryx](https://github.com/facebook/astryx), grown internally ~8 years. **Semantic-purpose tokens only** (`--color-text-primary`, `--color-background-surface`) — no numeric ramps except a 5-step categorical data palette. Dark mode via CSS `light-dark()` dual values per token. 10 stock themes as CSS custom-property override sets. Token source `@astryxdesign/core/theme/tokens.stylex`; CLI + MCP server dump the token reference. The strongest counter-model to ramp-based systems on the roster.

### Linear (reverse-engineered)
No public repo (confirmed). First-party evidence: ["How we redesigned the Linear UI"](https://linear.app/now/how-we-redesigned-the-linear-ui) — themes generated in **LCH** (migrated from HSL for perceptual uniformity) from **three variables** (base, accent, contrast), replacing "98 specific variables for each theme"; automatic high-contrast a11y themes; named elevation surfaces. Shipped CSS successfully fetched (`static.linear.app/web/_next/static/css/*`): semantic layer confirmed (`--color-bg-level-1/-3`, `--color-text-primary…quaternary`, `--color-border-translucent`, plus motion/z-layer/radius/shadow tokens); no `lch()`/`oklch()` literals — color math happens in JS. Contrast algorithm and P3: unknown. Pilot system in plan 002 (tests the reverse-engineering method).

### Stripe (reverse-engineered)
No public design system. Two assets: (1) the canonical ["Designing accessible color systems"](https://stripe.com/blog/accessible-color-systems) post (2019, still live) — CIELAB perceptual space, a custom Lab-space visualization tool, WCAG 4.5:1 targets, and a "5 levels apart guarantees text contrast" ramp rule; (2) shipped dashboard login CSS (`b.stripecdn.com/dashboard-fe-statics-srv/…`) exposing **284 color custom properties** — numeric ramps (`--color-blue4`, `--color-slate2/3/6`; non-contiguous digits imply a larger internal scale) plus a composed semantic layer (`--border-color--field--bottom--invalid--focus`). Deep-dive = methodology post + variable extraction, claimed-vs-shipped comparison.

### IBM Carbon
[carbon monorepo](https://github.com/carbon-design-system/carbon): 12 ramps + black/white, 10 steps (10–100) with paired hover shades (~104 swatches); palette explicitly hand-picked (Photoshop grayscale + manual contrast checks, per the [team's Medium retrospective](https://medium.com/carbondesign/because-colors-are-beautiful-52dd4cc39f09)). Value is the architecture: `@carbon/colors` → `@carbon/themes` (~235 semantic tokens in `white.ts`: `layer01`, `borderSubtle01`…) → component tokens; 4 built-in themes (White/g10/g90/g100) over `--cds-*` CSS vars; spacing (01–13 + fluid), type, and motion in dedicated packages. WCAG AA by convention. Hex/RGB.

### Vercel Geist
Docs-only inspectability (no public DS repo; `@vercel/geistcn` npm; do not confuse with the unrelated, archived `geist-ui`). 10 scales × 10 steps numbered **100–1000 where the number IS the role** (100–300 backgrounds, 400–600 borders, 700–800 solids, 900 secondary text, 1000 primary text) — [vercel.com/geist/colors](https://vercel.com/geist/colors). Values read as hand-tuned; no generation methodology published. WCAG AA stated as guidance. sRGB hex + per-accent `*-p3` `oklch()` variants. Standout: [vercel.com/design.md](https://vercel.com/design.md) (+`/design.dark.md`) — a machine-readable full-system spec (colors, spacing, radius, shadows, motion), the most agent-friendly docs artifact found in the entire sweep. On the roster as a maintainer pick for its conventions and dev-tool relevance, not its color science.

### shadcn/ui
[shadcn-ui/ui](https://github.com/shadcn-ui/ui) read directly: 9 neutral base scales — 5 byte-identical to Tailwind's, 4 newer (Mauve/Olive/Mist/Taupe, Radix-named, origin unconfirmed) — all static tables in `themes.ts`; **no generation, no contrast strategy anywhere**. The real system is the semantic CSS-variable convention (`--background`/`--foreground` pairs, `--primary`, `--muted`, `--destructive`, `--border`/`--input`/`--ring`, `--chart-1..5`, `--sidebar-*`) + `.dark` class override. OKLCH migration confirmed (Tailwind v4 era). `--radius` derivation (sm…4xl computed from one base) is more systematic than the color layer. On the roster because it's the audience's reference point and the honest profile is itself valuable truth; also a direct competitive reference for `/create` (their preset builder).

### Tailwind palette
[tailwindcss.com/docs/colors](https://tailwindcss.com/docs/colors): 26 families × 11 steps (50–950), expert-curated (explicitly not algorithmic). v4 converted the v3 hex values to **OKLCH while deliberately preserving cross-hue balance**, targeting Display P3 — the industry's largest OKLCH migration. `@theme` namespaces auto-generate `--color-*` (+ `--spacing-*`, `--radius-*`, `--ease-*`…) custom properties and utilities; **no semantic/alias layer and no documented contrast strategy** — a load-bearing absence worth publishing. Catalyst (paywalled) adds no token layer and is excluded.

## Watchlist (not v1; revisit per dimension)

- **Salesforce Lightning** (2/3/2/3/3) — the literal origin of "design tokens"; SLDS 2 "global styling hooks" (`--slds-g-*`) + 1–100 ramps + a hard SLDS1→2 migration break. Generation tooling (HCL/HSL hybrid per a Medium post) not open. Strong candidate for a history-of-tokens topic page.
- **Atlassian** (2/3/1/2/2) — the `Foundation.Property.Modifier` naming grammar and 4-plane elevation model are distinctive; palette/generation story thin and the JS-rendered docs resist inspection (their server-rendered [DESIGN.md](https://atlassian.design/DESIGN.md) is the workaround).
- **Chakra v3** (2/2/3/3/3) — hand-picked hex, but the Panda-derived semantic-token shape (contrast/fg/subtle/muted/emphasized/solid per palette) and `colorPalette` CSS-variable indirection are a clean re-theming pattern.
- **Mantine** (2/2/3/2/2) — open chroma-js generator with fixed HSL lightness/saturation maps whose docs admit light-hue failure modes, plus an off-by-default WCAG-luminance `autoContrast`; a useful honest counter-example.
- **Open Props** (2/2/3/2/2) — dual generation (composited from open-color/colar vs a parametric single-hue OKLCH curve); no semantic layer, no contrast tooling. Lesson-rich in both directions.
- **GOV.UK** (2/1/3/3/2) — a11y-process exemplar (WCAG 2.2 AA by developer responsibility; APCA proposed in issue #4066, unshipped); hand-authored functional-colour Sass layer.
- **Arco** (2/2/3/1/1) — targeted look only: `palette-dark.js` computes dark ramps with hue-band-dependent piecewise logic (more elaborate than Ant's dark map); but docs unreachable and the color package is stale (v0.4.0, 2024).
- **Hero UI** (2/2/3/1/2) — footnote-level: real-world v2→v3 case of abandoning shade scales + computed contrast for flat OKLCH semantic roles + `color-mix()` states.

## Rejected (binding until revisited — do not re-research without new evidence)

- **Airbnb DLS** — effectively closed: no public docs/repo, site 403s bot fetching, only philosophy pieces and community reconstructions. Inspectability 0.
- **Nord (Provet)** — competent docs but the source repo is not public, npm ships compiled output only, and the FAQ restricts usage to Nordhealth products; generation algorithm undisclosed. Dead end for deep study.
- **Orbit (Kiwi)** — thin color/token story; docs site unreachable during recon; token repo archived. Alive but not roster material.
- **Uber Base** — hand-curated hex ramps, Styletron CSS-in-JS theming (no CSS variables), no contrast methodology, "internal-first" engagement posture; little transferable to a CSS-var/OKLCH builder.
- **Park UI** — a curation layer: the color science is Radix's (vendored wholesale) and the token mechanics are Panda's. Study Radix and Panda instead.
- **Once UI** — the "algorithmic color generation" impression did not survive source inspection: 19 hardcoded hex palettes swapped via `data-brand` attributes, a `custom` mode referencing variables that are never defined, no contrast code, no OKLCH. Rejected on merit.
- **Untitled UI** — the maintainer's "check if it's slop" verdict: **not slop, but not color science**. A real, verified 3-layer semantic token architecture in an open MIT repo (`theme.css`: brand scale → utility aliases → semantic layer, dark via overrides) — but plain `rgb()` values, zero generation methodology, and WCAG claims that exist only as marketing copy. Its alias-layer structure merits at most a footnote in the token-layers topic page.
- **Tailwind Catalyst** — paywalled, utility-styled, adds no token layer beyond Tailwind itself (covered by the Tailwind roster entry).

## Deviations from plan 001

- **Roster size 15 > the 8–12 cap.** The STOP condition fired (more than 12 strong candidates); the tradeoff was presented to the maintainer, who chose to include both Carbon and Geist and to seat shadcn/ui and the Tailwind palette as tier-1. Cost acknowledged: each tier-1 system is a full plan-004 research pass now and on every future dimension. If v1 timeline pressure appears, the four late additions (Carbon, Geist, shadcn, Tailwind) are the natural deferral candidates, in reverse-score order (Geist first).
- **"Astryx by Meta" verified** rather than dropped — it's real and fully open (June 2026); the plan's caution about the name is resolved.

## Notable cross-cutting findings (candidate topic-page seeds)

- Contrast-by-construction exists in three distinct flavors: Leonardo/Spectrum (solve color for target ratio), Material (tone-delta arithmetic), USWDS (luminance-locked grades). Radix is the lone APCA adopter; everyone else is WCAG 2.x or nothing.
- Perceptual-space fragmentation: CAM02-UCS (Spectrum), HCT (Material), LCH (Linear, Fluent), HSLuv (Polaris, Primer's Prism), CIELAB (Stripe), OKLCH (Tailwind, shadcn, Hero v3), HSV (Ant, Arco), HSL (Mantine, legacy). Nobody agrees; the "same seed through every algorithm" showpiece (plan 005) will make this visible.
- Two architectures are converging from opposite ends: ramp-first (Radix, Tailwind, Ant) vs semantic-only (Astryx, Linear, shadcn). Geist's step-as-role numbering is the hybrid.
- Machine-readable design-system specs are emerging independently (Vercel `design.md`, Atlassian `DESIGN.md`, Primer `org.primer.llm`, Spectrum + Leonardo + Astryx MCP servers) — a trend worth its own analysis.
