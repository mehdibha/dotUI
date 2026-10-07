/* Color — the seeds and engine axes behind the generated palette, mapped
   straight onto `ColorConfig` (the one recipe `@dotui/colors` resolves; the
   provider and the export both run it). */

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { ColorConfig, PrimaryColorSource } from "@/registry/theme"

import { defineChapter } from "./core/types"
import type { Effective, Resolved, StudioStateInput } from "./index"
import { auto, BOOLEAN, COLOR, oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"

/* '' on a seed means Auto (absent from the config). */
export const COLOR_DEFAULTS = {
  brand: DEFAULT_COLOR_CONFIG.seeds.accent,
  buttonColor: "accent",
  selectionColor: "accent",
  neutralHue: null as number | null,
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  selectionSeed: "",
  vividness: 1,
  neutralTint: 1,
  preserveSeed: false,
  solidInk: "auto",
  /** Page L* per mode; dark 2 is dotUI's (the engine would pick 6). Light
   *  is Auto: Surfaces' Grouped takes it down to gray. */
  lightBg: "auto" as number | "auto",
  darkBg: 2,
  controlEdge: "firm",
  selectedWash: "neutral",
}

/* What a role draws from: the neutral's text end (the shadcn school,
   black/white) or the brand ramp (Material, Linear, Radix Themes). */
export const SOURCE_VALUES = ["neutral", "accent"] as const

/* The label on a kept-exact brand solid in light: solved for contrast, or
   white whatever it costs (Duolingo's #58cc02, 2.09:1). */
export const SOLID_INK_VALUES = ["auto", "white"] as const

/* How far a control's edge (fields, unchecked checks, outline buttons) sits
   from the surface hairline. */
export const CONTROL_EDGE_VALUES = ["soft", "firm", "strong"] as const

/** The Strong edge, also Selection's check edge. */
export const STRONG_EDGE = "var(--neutral-700)"

const CONTROL_EDGE_TOKENS: Record<string, [string, string]> = {
  soft: ["var(--color-border)", "var(--neutral-400)"],
  strong: [STRONG_EDGE, "var(--neutral-800)"],
}

/* The wash on a persistent selected item: table and tree rows, tags,
   token-field tokens, toggles. */
export const SELECTED_WASH_VALUES = ["neutral", "brand"] as const

const BRAND_WASH = {
  "--color-selected": "var(--accent-100)",
  "--color-selected-hover": "var(--accent-200)",
  "--color-selected-active": "var(--accent-300)",
  "--color-selected-row": "var(--accent-100)",
  "--color-selected-row-hover": "var(--accent-200)",
  "--color-fg-on-selected": "var(--color-fg-accent)",
}

export const VIVIDNESS_RANGE = { min: 0, max: 2, step: 0.05 }
export const NEUTRAL_HUE_RANGE = { min: 0, max: 360, step: 1 }
/** Up to twice the engine's default lean; 0 is a pure gray. */
export const NEUTRAL_TINT_RANGE = { min: 0, max: 2, step: 0.05 }
/** The engine's accepted page range per mode; 0 on dark is OLED black. */
export const LIGHT_BG_RANGE = { min: 90, max: 100, step: 0.5 }
export const DARK_BG_RANGE = { min: 0, max: 20, step: 0.5 }

/** The engine's own light page. */
export const ORIGIN_PAGE = 99
/** Grouped's page: its cards are white, so the page's gray is its depth
 *  (Apple, Polaris, HeroUI). */
export const GROUPED_PAGE = 96

export const COLOR_SCHEMA: ChapterSchema<typeof COLOR_DEFAULTS> = {
  brand: COLOR,
  buttonColor: oneOf(SOURCE_VALUES),
  selectionColor: oneOf(SOURCE_VALUES),
  neutralHue: auto(range(NEUTRAL_HUE_RANGE)),
  successSeed: auto(COLOR),
  warningSeed: auto(COLOR),
  dangerSeed: auto(COLOR),
  selectionSeed: auto(COLOR),
  vividness: range(VIVIDNESS_RANGE),
  neutralTint: range(NEUTRAL_TINT_RANGE),
  preserveSeed: BOOLEAN,
  solidInk: oneOf(SOLID_INK_VALUES),
  lightBg: range(LIGHT_BG_RANGE),
  darkBg: range(DARK_BG_RANGE),
  controlEdge: oneOf(CONTROL_EDGE_VALUES),
  selectedWash: oneOf(SELECTED_WASH_VALUES),
}

/* The roles that paint with a source. Leaves hold state; Primary is a view
   over them — their shared value, or mixed — and writing it writes them all.
   Solids fill: the buttons (the primary tokens), every selected item (the
   selection tokens), each check control, the slider. Inks draw: the selected
   tab, links, the focus ring. */
export const SOLID_LEAVES = [
  "buttonColor",
  "checkboxColor",
  "radioColor",
  "switchColor",
  "selectionColor",
  "sliderColor",
] as const

export const PRIMARY_LEAVES = [
  ...SOLID_LEAVES,
  "tabsColor",
  "linkColor",
  "focusColor",
] as const

export type PrimaryLeaf = (typeof PRIMARY_LEAVES)[number]

export function primaryValue(
  state: Pick<StudioStateInput, PrimaryLeaf>,
): PrimaryColorSource | "mixed" {
  const first = state[PRIMARY_LEAVES[0]]
  return PRIMARY_LEAVES.every((leaf) => state[leaf] === first)
    ? (first as PrimaryColorSource)
    : "mixed"
}

/** The given leaves on one source. */
export function withSource<K extends PrimaryLeaf>(
  leaves: readonly K[],
  source: PrimaryColorSource,
): Record<K, PrimaryColorSource> {
  return Object.fromEntries(leaves.map((leaf) => [leaf, source])) as Record<
    K,
    PrimaryColorSource
  >
}

/** One control's fill as a recipe scope — only when it leaves the selection
 *  leaf; on it, the control paints with the selection tokens (a `selection`
 *  seed included). */
export function fillScope(
  state: Effective,
  scope: string | readonly string[],
  fill: string,
): Partial<ColorConfig> | undefined {
  if (fill === state.selectionColor) return undefined
  const scopes = typeof scope === "string" ? [scope] : scope
  return {
    scopes: Object.fromEntries(
      scopes.map((s) => [s, fill as PrimaryColorSource]),
    ),
  }
}

/** Drops undefined entries so absent stays absent (the config's "default"). */
function compact<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T
}

export function buildColorConfig(state: Effective): ColorConfig {
  return compact({
    v: 2,
    seeds: compact({
      accent: state.brand,
      success: state.successSeed || undefined,
      warning: state.warningSeed || undefined,
      danger: state.dangerSeed || undefined,
      selection: state.selectionSeed || undefined,
    }),
    background: compact({
      // 99 is the engine's own light default.
      light: state.lightBg === ORIGIN_PAGE ? undefined : state.lightBg,
      dark: state.darkBg === 0 ? ("oled" as const) : state.darkBg,
    }),
    vividness: state.vividness === 1 ? undefined : state.vividness,
    neutralTint: state.neutralTint === 1 ? undefined : state.neutralTint,
    neutralHue: state.neutralHue ?? undefined,
    preserveSeed: state.preserveSeed || undefined,
    solidInk: state.solidInk === "white" ? ("white" as const) : undefined,
    primary: state.buttonColor === "accent" ? "accent" : undefined,
    selection:
      state.selectionColor === state.buttonColor
        ? undefined
        : (state.selectionColor as PrimaryColorSource),
  })
}

export function resolveColor(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  const edge = CONTROL_EDGE_TOKENS[state.controlEdge]
  if (edge) {
    tokens["--color-border-control"] = edge[0]
    tokens["--color-border-control-hover"] = edge[1]
  }
  if (state.selectedWash === "brand") Object.assign(tokens, BRAND_WASH)
  return { tokens, color: buildColorConfig(state) }
}

export const chapter = defineChapter({
  id: "color",
  defaults: COLOR_DEFAULTS,
  schema: COLOR_SCHEMA,
  resolve: resolveColor,
  follows: {
    lightBg: [
      {
        kind: "auto",
        id: "auto",
        from: "surfaceLayers",
        table: { same: ORIGIN_PAGE, grouped: GROUPED_PAGE, tonal: ORIGIN_PAGE },
      },
    ],
  },
  rules: [
    {
      // The engine fits a loose seed so its label clears; only a kept-exact
      // solid has a label to override.
      id: "color/white-ink-needs-exact",
      target: "solidInk",
      when: { key: "preserveSeed", in: [false] },
      effect: { kind: "hide" },
      cause: "preserveSeed",
    },
    {
      // Flat white cards with no edge vanish on a near-white page.
      id: "color/grouped-page",
      target: "lightBg",
      when: {
        all: [
          { key: "surfaceLayers", in: ["grouped"] },
          { key: "surfaceEdge", in: ["none"] },
          { key: "surfaceShadow", in: ["flat"] },
        ],
      },
      effect: { kind: "exclude", above: GROUPED_PAGE },
      cause: "surfaceLayers",
    },
  ],
})
