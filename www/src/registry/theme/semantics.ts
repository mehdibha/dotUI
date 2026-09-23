/**
 * The semantic vocabulary (token system v2) — the typed single source of
 * truth for dotUI's `--color-*` tokens, generated into CSS by `emitCss`.
 *
 * Tokens map roles onto the engine's 12-job ladder:
 * 25 app-bg · 50 subtle-bg · 100/200/300 ui rest/hover/active ·
 * 400/500/600 borders subtle/interactive/emphasized · 700/800 solid/hover ·
 * 900/950 text low/high-contrast. `on-*` are the engine's solved solid
 * labels; text on light-tint surfaces uses the text jobs (correct in both
 * modes by construction — no more reversed-ramp casualties).
 */

import { DEFAULT_COLOR_CONFIG } from "./color-config"
import type {
  PrimaryColorSource,
  SemanticTarget,
  SemanticToken,
  SemanticVocabulary,
  TokenOverride,
  TokenOverrides,
  TokenTargetSpec,
} from "./types"
import { JOB_STEPS } from "./types"

/** Picker pools: the neutral backbone + any custom palette. */
const NEUTRAL = ["neutral", ".."] as const
/** Picker pool for "primary"-flavored tokens: neutral or the brand accent ramp. */
const PRIMARY = ["neutral", "accent", ".."] as const
/** Picker pool for selection/focus tokens once a `selection` ramp exists. */
const SELECTION = ["neutral", "accent", "selection", ".."] as const

const ref = (palette: string, step: string): SemanticTarget =>
  ({ ref: { palette, step } }) as SemanticTarget
const on = (palette: string, step: "700" | "800"): SemanticTarget => ({
  on: { palette, step },
})
const mix = (
  a: SemanticTarget,
  weight: number,
  b: SemanticTarget,
): SemanticTarget => ({ mix: [a, weight, b] })

const bg = (
  target: SemanticToken["target"],
  scales?: readonly string[],
): SemanticToken => ({
  target,
  category: "background",
  scales,
})
const fg = (
  target: SemanticToken["target"],
  scales?: readonly string[],
): SemanticToken => ({
  target,
  category: "foreground",
  scales,
})
const bd = (
  target: SemanticToken["target"],
  scales?: readonly string[],
): SemanticToken => ({
  target,
  category: "border",
  scales,
})

/** The solid + tinted cluster every status hue shares. */
function statusCluster(palette: string): SemanticVocabulary {
  return {
    [`color-${palette}`]: bg(ref(palette, "700"), [palette]),
    [`color-${palette}-hover`]: bg(ref(palette, "800"), [palette]),
    [`color-${palette}-active`]: bg(
      mix(ref(palette, "800"), 88, ref("neutral", "950")),
      [palette],
    ),
    [`color-${palette}-muted`]: bg(ref(palette, "100"), [palette]),
    [`color-${palette}-muted-hover`]: bg(ref(palette, "200"), [palette]),
    [`color-fg-${palette}`]: fg(ref(palette, "900"), [palette]),
    [`color-fg-on-${palette}`]: {
      target: on(palette, "700"),
      category: "foreground",
    },
    [`color-border-${palette}`]: bd(ref(palette, "400"), [palette]),
    [`color-border-${palette}-hover`]: bd(ref(palette, "500"), [palette]),
  }
}

/** The solid one source paints: the accent ramp, or the neutral's text end
 *  as an inverse surface (black/white, text on it is the app background). */
function sourceFill(source: PrimaryColorSource) {
  const accent = source === "accent"
  return {
    fill: bg(accent ? ref("accent", "700") : ref("neutral", "950"), PRIMARY),
    hover: bg(
      accent
        ? ref("accent", "800")
        : mix(ref("neutral", "950"), 90, ref("neutral", "25")),
      PRIMARY,
    ),
    active: bg(
      accent
        ? mix(ref("accent", "800"), 88, ref("neutral", "950"))
        : mix(ref("neutral", "950"), 80, ref("neutral", "25")),
      PRIMARY,
    ),
    muted: bg(accent ? ref("accent", "100") : ref("neutral", "200"), PRIMARY),
    on: {
      target: accent ? on("accent", "700") : ref("neutral", "25"),
      category: "foreground",
    } satisfies SemanticToken,
    fgDisabled: fg(
      accent ? ref("accent", "400") : ref("neutral", "500"),
      PRIMARY,
    ),
  }
}

/** Checked-control fills (switch/checkbox/radio), the selected choice card's
 *  wash, and focus — drawn from `source`. */
export function selectionCluster(
  source: PrimaryColorSource,
): SemanticVocabulary {
  const fill = sourceFill(source)
  return {
    "color-selection": fill.fill,
    "color-selection-hover": fill.hover,
    "color-selection-muted": fill.muted,
    "color-fg-on-selection": fill.on,
  }
}

/**
 * Build the vocabulary: the primary cluster from `primary`, the selection
 * cluster from `selection` (the primary's by default), until a `selection`
 * seed moves the latter onto its own ramp (Vercel: black primary, blue
 * selection). One table, no emitter special-cases.
 */
export function semanticVocabulary(
  primary: PrimaryColorSource = "neutral",
  selection: PrimaryColorSource = primary,
  hasSelection = false,
): SemanticVocabulary {
  const fill = sourceFill(primary)
  const primaryCluster: SemanticVocabulary = {
    "color-primary": fill.fill,
    "color-primary-hover": fill.hover,
    "color-primary-active": fill.active,
    "color-primary-muted": fill.muted,
    // The disabled fill stays neutral whatever the primary draws from.
    "color-primary-disabled": bg(ref("neutral", "300"), PRIMARY),
    "color-fg-on-primary": fill.on,
    "color-fg-primary-disabled": fill.fgDisabled,
  }

  const selection_: SemanticVocabulary = hasSelection
    ? {
        "color-selection": bg(ref("selection", "700"), SELECTION),
        "color-selection-hover": bg(ref("selection", "800"), SELECTION),
        "color-selection-muted": bg(ref("selection", "100"), SELECTION),
        "color-fg-on-selection": {
          target: on("selection", "700"),
          category: "foreground",
        },
      }
    : selectionCluster(selection)

  return {
    // ---- surfaces / backgrounds ----
    "color-bg": bg(ref("neutral", "25"), NEUTRAL),
    "color-muted": bg(ref("neutral", "100"), NEUTRAL),
    "color-inverse": bg(ref("neutral", "950"), NEUTRAL),
    "color-disabled": bg(ref("neutral", "100"), NEUTRAL),
    "color-field": bg(ref("neutral", "100"), NEUTRAL),
    "color-highlight": bg(ref("neutral", "200"), NEUTRAL),
    "color-fg-on-highlight": fg(ref("neutral", "950")),
    "color-selected": bg(ref("neutral", "300"), ["neutral"]),
    "color-selected-hover": bg(ref("neutral", "400"), ["neutral"]),
    "color-selected-active": bg(ref("neutral", "500"), ["neutral"]),
    "color-fg-on-selected": fg(ref("neutral", "950")),
    "color-neutral": bg(ref("neutral", "100"), ["neutral"]),
    "color-neutral-hover": bg(ref("neutral", "200"), ["neutral"]),
    "color-neutral-active": bg(ref("neutral", "300"), ["neutral"]),
    ...primaryCluster,
    ...selection_,
    ...statusCluster("success"),
    ...statusCluster("danger"),
    ...statusCluster("warning"),
    ...statusCluster("info"),
    ...statusCluster("accent"),
    // ---- foregrounds ----
    "color-fg": fg(ref("neutral", "950"), NEUTRAL),
    "color-fg-muted": fg(ref("neutral", "900"), NEUTRAL),
    "color-fg-inverse": fg(ref("neutral", "25"), NEUTRAL),
    "color-fg-disabled": fg(ref("neutral", "600"), NEUTRAL),
    "color-fg-on-neutral": fg(ref("neutral", "950")),
    // ---- borders ----
    // Two-weight model: every structural edge (chrome, cards, separators,
    // overlays) shares one subtle weight, and controls opt into one solid
    // emphasized weight. Solid, not alpha: an alpha hairline composites over
    // each element's own background, so the same token paints brighter on
    // elevated surfaces (a border-t on a bg-card code bar reads stronger than
    // the frame around it). One fixed color reads identically everywhere.
    // Light matches ~9% ink over the app bg; dark sits between the mids
    // (Geist-style, ~L 0.25) so edges stay legible on the lighter elevated
    // surfaces — a dark solid matched to the page-bg hairline would vanish
    // on popover (both ~L 0.20).
    "color-border": bd(
      {
        light: mix(ref("neutral", "200"), 50, ref("neutral", "300")),
        dark: mix(ref("neutral", "100"), 50, ref("neutral", "200")),
      },
      NEUTRAL,
    ),
    // The control weight: field, control, and secondary-button edges.
    "color-border-control": bd(ref("neutral", "400"), NEUTRAL),
    "color-border-control-hover": bd(ref("neutral", "500"), NEUTRAL),
    "color-border-focus": bd(
      ref(hasSelection ? "selection" : "accent", "700"),
      PRIMARY,
    ),
    "color-border-focus-muted": bd(
      ref(hasSelection ? "selection" : "accent", "300"),
      PRIMARY,
    ),
    // ---- component surfaces ----
    "color-tooltip": bg(ref("neutral", "950"), NEUTRAL),
    "color-fg-on-tooltip": fg(ref("neutral", "25")),
    "color-card": bg(ref("neutral", "50"), NEUTRAL),
    // Dark overlays get their own rung between card (50) and muted (100), so a
    // popover lifts off the card it floats over while field/muted content
    // inside it still reads. Light keeps the card value — there the shadow
    // separates, as in Atlassian/shadcn.
    "color-popover": bg(
      {
        light: ref("neutral", "50"),
        dark: mix(ref("neutral", "50"), 50, ref("neutral", "100")),
      },
      NEUTRAL,
    ),
    "color-sidebar": bg(ref("neutral", "50"), NEUTRAL),
    // ---- overlay / chrome (previously hardcoded in components) ----
    "color-overlay": bg({ value: "oklch(0 0 0)" }),
    "color-thumb": bg({ value: "oklch(1 0 0)" }),
    // `::selection` — a light accent tint under dark text in light mode, a
    // dark tint under light text in dark (both flip with the ramps).
    "color-text-selection": bg(ref("accent", "300"), PRIMARY),
    "color-fg-on-text-selection": fg(ref("neutral", "950")),
  }
}

/** The default vocabulary (accent primary). */
export const DEFAULT_SEMANTICS = semanticsFor(DEFAULT_COLOR_CONFIG)

const specTarget = (spec: TokenTargetSpec): SemanticTarget => ({
  ref: { palette: spec.palette, step: JOB_STEPS[spec.job] },
})

const modeTarget = (
  target: SemanticToken["target"],
  mode: "light" | "dark",
): SemanticTarget => ("light" in target ? target[mode] : target)

function overriddenTarget(
  base: SemanticToken["target"],
  override: TokenOverride,
): SemanticToken["target"] {
  if ("palette" in override) return specTarget(override)
  return {
    light: override.light
      ? specTarget(override.light)
      : modeTarget(base, "light"),
    dark: override.dark ? specTarget(override.dark) : modeTarget(base, "dark"),
  }
}

/**
 * Apply per-token remaps (T5 `overrides`) to a vocabulary. Unknown token
 * names are ignored (a stale preset must never break emission); category,
 * picker pools, and descriptions survive the remap.
 */
export function applyTokenOverrides(
  vocabulary: SemanticVocabulary,
  overrides: TokenOverrides | undefined,
): SemanticVocabulary {
  if (!overrides || Object.keys(overrides).length === 0) return vocabulary
  const out = { ...vocabulary }
  for (const [name, override] of Object.entries(overrides)) {
    const base = out[name]
    if (!base) continue
    out[name] = { ...base, target: overriddenTarget(base.target, override) }
  }
  return out
}

/** The recipe fields the vocabulary reads. */
type ColorSlice = {
  primary?: PrimaryColorSource
  selection?: PrimaryColorSource
  scopes?: Record<string, PrimaryColorSource>
  overrides?: TokenOverrides
  seeds?: { selection?: string }
}

/** The one resolver every emitter goes through (T4): sources + overrides. */
export function semanticsFor(
  color: ColorSlice = DEFAULT_COLOR_CONFIG,
): SemanticVocabulary {
  const primary = color?.primary ?? "neutral"
  return applyTokenOverrides(
    semanticVocabulary(
      primary,
      color?.selection ?? primary,
      Boolean(color?.seeds?.selection),
    ),
    color?.overrides,
  )
}

/** The selection cluster re-declared per component scope (`scopes`), keyed
 *  by the selector it lands on: `checkbox` → `[data-checkbox]`. */
export function scopedSemantics(
  color: ColorSlice | undefined,
): Record<string, SemanticVocabulary> {
  return Object.fromEntries(
    Object.entries(color?.scopes ?? {}).map(([scope, source]) => [
      `[data-${scope}]`,
      selectionCluster(source),
    ]),
  )
}

/**
 * The tokens whose target differs from the default vocabulary — for delta
 * re-emits on plain `:root`/`.dark` (the v0 bundle, scoped previews), where
 * the full `@theme` layer ships static and only divergences re-point.
 */
export function semanticDelta(
  color: ColorSlice | undefined,
): SemanticVocabulary {
  return Object.fromEntries(
    Object.entries(semanticsFor(color)).filter(
      ([name, token]) =>
        JSON.stringify(token.target) !==
        JSON.stringify(DEFAULT_SEMANTICS[name]?.target),
    ),
  )
}
