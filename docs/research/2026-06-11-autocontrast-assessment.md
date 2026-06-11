# tailwindcss-autocontrast — design assessment & industry survey

> Written 2026-06-11. Status: **assessment, no decision made.** This document evaluates
> whether the build-time CSS-scanning approach of this plugin is sound, surveys what
> major design systems do instead, and proposes options. Paths are relative to the
> repo root.

## Verdict (TL;DR)

The plugin is fragile on two independent levels:

1. **Delivery mechanism.** ~480 of its ~560 lines exist to re-discover and re-parse the
   project's own CSS from inside a Tailwind build (filesystem globbing, regex `@import`
   resolution, PostCSS var extraction). No surveyed design system or component library
   uses this pattern — every one of them either ships explicit foreground tokens,
   computes them at *theme-generation* time from a structured input it owns, or computes
   them at runtime. The strongest evidence is internal: two of dotUI's three on-color
   code paths already bypass this plugin (see §3).
2. **Algorithm.** The "max contrast of black vs white" WCAG2 rule flips to black too
   early (relative luminance Y = 0.179). Measured against this plugin's own
   `getContrastColor`: it picks **black** text on Tailwind `blue-500`, `indigo-500`, and
   `#777`, where Mantine, MUI, Material 3, and APCA-aligned thresholds all pick white
   (see §5). Any user whose accent lands in that class gets the wrong button text color.

Recommended direction: bake `--on-*` at theme-generation time via `@dotui/colors`
(the showcase bundle already proves this works), optionally emit the OKLCH
relative-color "lightness flip" as the default value so runtime themes self-correct,
and in any case move the flip rule to a white-biased threshold (§7).

## 1. What the plugin does today

At Tailwind compile time (`@plugin "tailwindcss-autocontrast"`), the plugin:

1. Locates the root stylesheet: explicit `cssFile` option → env vars
   (`TW_AUTOCONTRAST_CSS_FILE` / `TW_AUTOCONTRAST_SOURCE`) → glob search of `source` →
   fallback glob of the whole cwd (`**/*.css`, depth 6), taking the first file containing
   `@import "tailwindcss"` (`packages/tailwindcss-autocontrast/src/index.js:136-244`).
2. Reads it and recursively inlines relative `@import "./…"` statements via regex
   (`packages/tailwindcss-autocontrast/src/index.js:95`).
3. PostCSS-parses custom properties from `:root` (→ light), `.dark` / `:root.dark`
   (→ dark), and any other class selector (→ named theme), including inside
   `@layer base` (`packages/tailwindcss-autocontrast/src/index.js:399-451`).
4. Keeps vars matching `{name}-{shade}` with shade ∈ {50…950} whose value parses as a
   color (`packages/tailwindcss-autocontrast/src/index.js:453-473`).
5. Converts via culori to sRGB, computes WCAG2 relative luminance, picks whichever of
   black/white has the higher contrast ratio, and injects
   `--on-{name}-{shade}: black|white` via `addBase` (`packages/tailwindcss-autocontrast/src/index.js:360-397, 490-554`).

## 2. Fragility analysis

- **Out-of-band file discovery.** The plugin runs inside the Tailwind build but
  re-finds the CSS on disk by globbing from `process.cwd()`, which differs across task
  runners (turbo at package dir vs repo root, vitest, IDE Tailwind plugins). The two
  env-var escape hatches exist precisely because this breaks. In a monorepo with
  multiple stylesheets containing `@import "tailwindcss"`, fallback discovery takes the
  first glob match — not guaranteed deterministic. The module-level
  `fileResolutionCache` (`packages/tailwindcss-autocontrast/src/index.js:17`) is never invalidated, so a moved/renamed
  stylesheet goes stale within a watch process.
- **Regex `@import` resolution** only follows paths starting with `.`
  (`packages/tailwindcss-autocontrast/src/index.js:95`). `@import "theme.css"`, package imports, and `url()` forms are
  silently skipped.
- **`@theme` is invisible.** Declarations directly inside `@theme { … }` — the
  canonical Tailwind v4 token location — are not rules, so `walkRules` never visits
  them. Works for dotUI today because ramps live in `:root`/`.dark`, but it is a
  landmine for any external consumer of the published npm package following v4 idiom.
  `[data-theme="…"]` and `html.dark` selectors are likewise missed.
- **`var()` indirection silently becomes `black`** (`packages/tailwindcss-autocontrast/src/index.js:379-384`).
  `--accent-500: var(--blue-500)` — a normal aliasing pattern — produces a wrong answer
  with no warning.
- **Build-time snapshot vs runtime themes.** Values are frozen at compile time. dotUI's
  premise is user-generated themes applied at runtime, which is exactly the case a
  build-time scan cannot see. This is why the workarounds in §3 exist.

Minor: the shade whitelist {50…950} excludes other naming schemes; any class selector
with custom props is treated as a "theme" (harmless noise); the luminance code uses
WCAG 2.0's 0.03928 sRGB constant vs 2.1's 0.04045 (negligible).

## 3. dotUI already routes around the plugin

The repo maintains **three implementations of the same decision**, plus a parity test
to keep them aligned:

| Path | Mechanism | Why it exists |
|---|---|---|
| Static build (`www/src/registry/base/base.css`, `@plugin … { cssfile: './src/styles.css' }`) | This plugin, at Tailwind compile time | Fills `--on-*` for the shipped ramps in `base/colors.css` |
| Runtime theming (`www/src/modules/core/styles.tsx`, `DesignSystemProvider`) | `emitPrimitivesCss(…, { onColors: true })` using `onBlackWhite()` from `packages/colors/src/shared/on-color.ts` | Plugin output is stale once ramps are overridden at runtime, so foregrounds are re-baked into the injected `<style>` |
| Showcase bundle (`www/scripts/build-showcase-bundle.ts`) | **Strips the `@plugin` line** and pre-bakes `--on-*` into static CSS | Portability — avoids the plugin's path brittleness entirely |

Parity is enforced by `www/src/registry/theme/on-color-parity.spec.ts`, which asserts
`onBlackWhite()` matches the plugin's exported `getContrastColor` for every generated
step. When a system needs a parity test between a build-time scanner, a runtime baker,
and a bundle pre-baker, the scanner is the odd one out. Components consume the result
via semantic utilities (`text-fg-on-accent`, `--color-fg-on-highlight: var(--on-neutral-300)`,
etc. in `www/src/registry/ui/*/styles.ts`).

## 4. Industry survey

Surveyed mid-2026 (method caveats in §8). Every system falls into one of three camps;
**none scans authored CSS at build time** — that pattern appears unique to this plugin.

| Camp | Who | How |
|---|---|---|
| (a) Explicit paired tokens | shadcn/ui (`--primary` / `--primary-foreground`, hand-written in `globals.css`), Radix Themes (per-scale `--{color}-contrast` token; sky/mint/lime/yellow/amber hand-cased for dark text), Chakra v3 (`colorPalette.contrast`), Panda CSS, Park UI, Adobe Spectrum's shipped tokens | The theme author writes both halves. Dominant pattern, and the convention of the shadcn registry ecosystem dotUI ships into. |
| (b) Computed at theme-generation time from structured input | Material 3 / material-color-utilities (HCT tone pairing: `on-primary` = tone 100 vs primary tone 40 — contrast guaranteed by construction, `ContrastCurve` fallback solver), daisyUI 5 (auto-fills missing `*-content` from its **declared** `@plugin "daisyui/theme"` config using culori/OKLCH tinted poles — never by scanning user stylesheets), Bootstrap Sass `color-contrast()`, Radix custom-palette generator, Adobe Leonardo (contrast-first: colors solved *from* target ratios) | The tool owns a structured input, so there is nothing to scan and nothing to go stale. |
| (c) Runtime | Mantine `autoContrast` (JS, luminance threshold 0.3, white-biased), MUI `getContrastText` (white unless contrast(white) < 3), native CSS `contrast-color()` | Survives arbitrary runtime theming. |

daisyUI 5 is the closest relative — build-time, Tailwind v4, auto-generated foregrounds —
and the difference is exactly the load-bearing one: it computes from a declared config
contract rather than parsing CSS text, so it has none of the discovery failure modes.
(It shares the runtime-staleness caveat and documents it: override the base color at
runtime and you must override the content color too.)

Token pipelines (Style Dictionary, Terrazzo) ship no contrast-derived-token generation;
Terrazzo offers contrast *linting* of declared pairs only.

## 5. The flip-rule problem (measured)

WCAG2 "max of black vs white" flips at relative luminance Y = 0.179 — well documented
(Lea Verou's *contrast-color()* analysis; Material's source comments citing APCA
research) as flipping to black far too early for human perception. Measured against
this package's own export:

```
node -e "const{getContrastColor}=require('./src/index.js'); …"   # from package dir

color                       oklch L   plugin     L>0.7 rule   Mantine (Y>0.3)
#3b82f6  (tailwind blue-500)  0.62    black      white        white
#6366f1  (indigo-500)         0.59    black      white        white
#0ea5e9  (sky-500)            0.68    black      white        black
#777777  (mid gray)           0.57    black      white        white
#e11d48  (rose-600)           0.59    white      white        white
```

Reference flip points: WCAG2-max Y = 0.179 (≈ oklch L 0.56) · Mantine
`luminanceThreshold` 0.3 / MUI `contrastThreshold` 3 → Y = 0.30 (≈ L 0.67) ·
Material 3 prefers white below tone ~60 · Lea Verou's APCA-fit recommendation
**oklch L ≈ 0.70** (~98% agreement with APCA's pick). Pure black/white is also the
crudest output: daisyUI ships hue-tinted poles (80% mix toward the pole, 20% hue
retained), Radix and MD3 use tuned scale steps — and `onColor()` in
`packages/colors/src/shared/on-color.ts` already implements tinted poles with AA
verification. The plugin/`onBlackWhite` pair is the least sophisticated picker in the
repo, kept binary for parity.

## 6. CSS-native state of the art

- **`contrast-color()`** (CSS Color 5): returns only black/white by WCAG2 max — the
  same rule criticized in §5. Safari 26 (Sept 2025); Baseline **Newly Available
  April 2026** (verified via MDN). No candidate lists / target ratios in the shipped
  spec; those were deferred. Widely-available status lands ~2028. Strictly less capable
  than the OKLCH flip below, today.
- **OKLCH "lightness flip" via relative color syntax** — Baseline since July 2024
  (~93%+ support):

  ```css
  @theme inline {
    --color-fg-on-accent: oklch(from var(--accent-500) clamp(0, (0.7 - l) * infinity, 1) 0 h);
  }
  ```

  Threshold tunable per theme (`0.65–0.75` defensible; `0.70` ≈ APCA); small nonzero
  chroma yields tinted "ink" foregrounds. Because `@theme inline` inlines the expression
  at the usage site, it recomputes wherever the ramp var resolves — i.e. it stays
  correct under `DesignSystemProvider`'s scoped and runtime theming. Caveats: a derived
  custom property declared on `:root` does *not* recompute for subtree overrides (hence
  `@theme inline` or per-scope re-declaration); transitions across the threshold snap;
  translucent backgrounds use the color's own lightness, not the composited result;
  pre-2024 browsers need a plain baked fallback declared first.

## 7. Options

1. **(Recommended) Retire the CSS scan; bake at generation time.** Emit `--on-*` into
   the registry's static `colors.css` via `emitPrimitivesCss(…, { onColors: true })` —
   the same path the showcase bundle and runtime provider already use. One code path
   (`@dotui/colors`) owns the decision; the plugin, its discovery machinery, and the
   parity test all become unnecessary. Explicit vars in shipped CSS also match the
   shadcn-ecosystem expectation that foregrounds are visible and overridable.
2. **(Optional layer on 1) Emit the OKLCH flip as the default value** via
   `@theme inline`, with a baked literal as the pre-RCS fallback. User-tweaked ramps
   then self-correct at runtime, which could eventually delete the runtime re-baking in
   `DesignSystemProvider`. Revisit native `contrast-color()` around 2028 or when
   target-contrast variants ship.
3. **(Regardless of 1/2) Fix the flip rule** from max-ratio to white-biased: black only
   when oklch L > ~0.7 (equivalently, white unless contrast(white) < ~4.5), or promote
   `onColor()`'s tinted poles over `onBlackWhite`. Note this changes shipped visuals on
   mid-tone accents (black → white button text), so it is a design decision; plugin and
   runtime must move together to keep parity until the plugin is retired.
4. **(Minimum, if the plugin stays published)** Parse `@theme` blocks, warn instead of
   silently emitting `black` for `var()`-valued tokens, and document the monorepo `cwd`
   pitfalls prominently in the README.

## 8. Sources & verification caveats

Research was performed 2026-06-11 by sandboxed agents with restricted network access.
Confidence tiers:

- **Verified on disk:** this plugin's source; Material's algorithm read directly from
  `@material/material-color-utilities@0.3.0` in node_modules (`material_dynamic_colors.js`,
  `dynamic_color.js` — incl. the `tonePrefersLightForeground(tone) = tone < 60` comment
  citing Andrew Somers/APCA); dotUI's own `on-color.ts`, parity spec, provider, and
  showcase-bundle script. The §5 table was computed against `getContrastColor` locally.
- **Verified via live fetch (MDN / tailwindcss.com):** `contrast-color()` semantics and
  its Baseline-April-2026 date; relative-color-syntax mechanics; Tailwind v4 `@theme` /
  `@theme inline` behavior; no auto-contrast feature in Tailwind core.
- **High-confidence knowledge (early-2026 cutoff), URLs not re-fetched:** shadcn/Radix/
  Chakra/Panda/Mantine/MUI/daisyUI specifics (daisyUI 4's `generateForegroundColorFrom`
  formula is near-verbatim; v5 carrying it over is high-but-not-verified confidence),
  Lea Verou's threshold numbers, exact Chrome/Firefox `contrast-color()` ship versions.
  Spot-check candidates: https://lea.verou.me/blog/2024/contrast-color/ ·
  https://daisyui.com/docs/colors/ · https://www.radix-ui.com/colors/custom ·
  https://mantine.dev/theming/colors/ · https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color

No conclusion above hinges on an unverified fact: the fragility analysis and the §5
measurements are grounded in this repo, and the "nobody scans CSS" finding holds across
every library whose mechanism is verified or high-confidence.
