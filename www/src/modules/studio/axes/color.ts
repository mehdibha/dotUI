/* Color — the seeds and engine axes behind the generated palette, mapped
   straight onto `ColorConfig` (the one recipe `@dotui/colors` resolves; the
   provider and the export both run it). Each mode's background L* is owned
   by Surfaces. */

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { ColorConfig, PrimaryColorSource } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"

/* '' on a seed means Auto (absent from the config). */
export const COLOR_DEFAULTS = {
  brand: DEFAULT_COLOR_CONFIG.seeds.accent,
  buttonColor: "neutral",
  selectionColor: "neutral",
  neutralHue: null as number | null,
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  selectionSeed: "",
  vividness: 1,
  neutralTint: 1,
  preserveSeed: false,
}

/* What a role draws from: the neutral's text end (the shadcn school,
   black/white) or the brand ramp (Material, Linear, Radix Themes). */
export const SOURCE_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "accent", label: "Accent" },
]

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

export function primaryValue(state: StudioState): PrimaryColorSource | "mixed" {
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
  state: StudioState,
  scope: string,
  fill: string,
): Partial<ColorConfig> | undefined {
  if (fill === state.selectionColor) return undefined
  return { scopes: { [scope]: fill as PrimaryColorSource } }
}

/** Drops undefined entries so absent stays absent (the config's "default"). */
function compact<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T
}

export function buildColorConfig(state: StudioState): ColorConfig {
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
      light: state.lightBg === 99 ? undefined : state.lightBg,
      dark: state.darkBg === 0 ? ("oled" as const) : state.darkBg,
    }),
    vividness: state.vividness === 1 ? undefined : state.vividness,
    neutralTint: state.neutralTint === 1 ? undefined : state.neutralTint,
    neutralHue: state.neutralHue ?? undefined,
    preserveSeed: state.preserveSeed || undefined,
    primary: state.buttonColor === "accent" ? "accent" : undefined,
    selection:
      state.selectionColor === state.buttonColor
        ? undefined
        : (state.selectionColor as PrimaryColorSource),
  })
}

/** Sorted-key JSON with absent and empty-object fields dropped — the shape
 *  `resolveAll`'s deep merge leaves behind (`overrides: {}`) still reads as
 *  the untouched recipe. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v)
            .filter(
              ([, x]) =>
                x !== undefined &&
                !(x && typeof x === "object" && Object.keys(x).length === 0),
            )
            .sort(([a], [b]) => a.localeCompare(b)),
        )
      : v,
  )
}

/** True when `config` is the default generated palette (`base/colors.css`). */
export function isDefaultColorConfig(config: ColorConfig): boolean {
  return canonical(config) === canonical(DEFAULT_COLOR_CONFIG)
}

export function resolveColor(state: StudioState): Resolved {
  return { color: buildColorConfig(state) }
}
