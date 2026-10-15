import { SITE_COLOR_CONFIG } from "./color-config"
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

const NEUTRAL = ["neutral", ".."] as const
const PRIMARY = ["neutral", "accent", ".."] as const
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

/**
 * Checked-control fills and the selected choice card's wash, drawn from
 * `source`.
 */
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
 * cluster from `selection` (default: the primary's). `hasSelection` moves the
 * selection cluster onto its own `selection` ramp.
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
    "color-fg": fg(ref("neutral", "950"), NEUTRAL),
    "color-fg-muted": fg(ref("neutral", "900"), NEUTRAL),
    "color-fg-inverse": fg(ref("neutral", "25"), NEUTRAL),
    "color-fg-disabled": fg(ref("neutral", "600"), NEUTRAL),
    "color-fg-on-neutral": fg(ref("neutral", "950")),
    // ---- borders ----
    // Solid, not alpha: an alpha hairline composites over each surface, so it
    // reads brighter on elevated ones.
    "color-border": bd(
      mix(ref("neutral", "200"), 50, ref("neutral", "300")),
      NEUTRAL,
    ),
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
    "color-tooltip": bg(ref("neutral", "950"), NEUTRAL),
    "color-fg-on-tooltip": fg(ref("neutral", "25")),
    "color-card": bg(
      { light: ref("neutral", "25"), dark: ref("neutral", "50") },
      NEUTRAL,
    ),
    "color-popover": bg(
      {
        light: ref("neutral", "25"),
        dark: mix(ref("neutral", "50"), 50, ref("neutral", "100")),
      },
      NEUTRAL,
    ),
    "color-sidebar": bg(ref("neutral", "50"), NEUTRAL),
    "color-overlay": bg({ value: "oklch(0 0 0)" }),
    "color-thumb": bg({ value: "oklch(1 0 0)" }),
    "color-text-selection": bg(ref("accent", "300"), PRIMARY),
    "color-fg-on-text-selection": fg(ref("neutral", "950")),
  }
}

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
 * Apply per-token remaps to a vocabulary. Unknown token names are ignored so
 * a stale preset never breaks emission.
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

type ColorSlice = {
  primary?: PrimaryColorSource
  selection?: PrimaryColorSource
  scopes?: Record<string, PrimaryColorSource>
  overrides?: TokenOverrides
  seeds?: { selection?: string }
}

/** The resolver every emitter goes through: sources + overrides. */
export function semanticsFor(color: ColorSlice): SemanticVocabulary {
  const primary = color.primary ?? "neutral"
  return applyTokenOverrides(
    semanticVocabulary(
      primary,
      color.selection ?? primary,
      Boolean(color.seeds?.selection),
    ),
    color.overrides,
  )
}

/** The vocabulary `base/colors.css` declares. */
export const SITE_SEMANTICS = semanticsFor(SITE_COLOR_CONFIG)

/** `choice-card`: a checkbox, radio or switch control in card mode (it holds
 *  the label). */
const CHOICE_CARD_SELECTOR =
  ":is([data-checkbox-control],[data-radio-control],[data-switch-control]):has([data-label])"

/**
 * The selection cluster per component scope, keyed by selector: `checkbox` →
 * `[data-checkbox]`.
 */
export function scopedSemantics(
  color: ColorSlice | undefined,
): Record<string, SemanticVocabulary> {
  return Object.fromEntries(
    Object.entries(color?.scopes ?? {}).map(([scope, source]) => [
      scope === "choice-card" ? CHOICE_CARD_SELECTOR : `[data-${scope}]`,
      selectionCluster(source),
    ]),
  )
}

/**
 * Tokens whose target differs from the site vocabulary, for delta re-emits on
 * plain `:root`/`.dark`.
 */
export function semanticDelta(color: ColorSlice): SemanticVocabulary {
  return Object.fromEntries(
    Object.entries(semanticsFor(color)).filter(
      ([name, token]) =>
        JSON.stringify(token.target) !==
        JSON.stringify(SITE_SEMANTICS[name]?.target),
    ),
  )
}
