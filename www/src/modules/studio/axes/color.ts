/* Color — the seeds and engine axes behind the generated palette, mapped
   straight onto `ColorConfig` (the one recipe `@dotui/colors` resolves; the
   provider and the export both run it). Modes are the engine's fixed pair —
   light on `:root`, dark on `.dark` — each with its own background L* and a
   high-contrast switch. High contrast raises that mode's border floors; the
   guarantee policy itself is global, so either mode on makes solid labels
   strict in both. */

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { ColorConfig } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"

export interface ColorMode {
  id: string
  name: string
  polarity: "light" | "dark"
  /** Background L*; 0 on dark = OLED black. */
  bg: number
  contrast: "default" | "high"
}

/* Light 99 is the engine's own default and stays absent from the config;
   dark 2 is dotUI's (the engine would pick 6). */
const DEFAULT_MODES: ColorMode[] = [
  {
    id: "light",
    name: "Light",
    polarity: "light",
    bg: 99,
    contrast: "default",
  },
  { id: "dark", name: "Dark", polarity: "dark", bg: 2, contrast: "default" },
]

/* '' on a seed means Auto (absent from the config); 0 on a border means
   unmeasured (the section seeds it from the untouched ramp on switch-on). */
export const COLOR_DEFAULTS = {
  brand: DEFAULT_COLOR_CONFIG.seeds.accent,
  primary: "neutral",
  neutralHue: null as number | null,
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  selectionSeed: "",
  modes: DEFAULT_MODES,
  vividness: 1,
  hueShift: 1,
  neutralTint: 1,
  preserveSeed: false,
  guarantees: "default",
  borderContrast: false,
  border400: 0,
  border500: 0,
  border600: 0,
}

export const GUARANTEE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "relaxed", label: "Relaxed" },
  { value: "strict", label: "Strict" },
]

export const BORDER_JOBS = [
  { key: "border400", job: "400", label: "Border · subtle", maxValue: 3 },
  { key: "border500", job: "500", label: "Border · interactive", maxValue: 4 },
  { key: "border600", job: "600", label: "Border · emphasized", maxValue: 8 },
] as const

/** WCAG floors a high-contrast mode holds its border jobs to. */
const HIGH_CONTRAST_FLOORS = { "400": 2, "500": 3, "600": 4.5 } as const

/** One polarity's mode; the default when a stored pair lost it. */
export function modeFor(state: StudioState, polarity: ColorMode["polarity"]) {
  return (
    state.modes.find((mode) => mode.polarity === polarity) ??
    (DEFAULT_MODES.find((mode) => mode.polarity === polarity) as ColorMode)
  )
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** Drops undefined entries so absent stays absent (the config's "default"). */
function compact<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T
}

function borderTargets(
  state: StudioState,
  high: Record<ColorMode["polarity"], boolean>,
): ColorConfig["borders"] {
  const targets: NonNullable<ColorConfig["borders"]>[string] = {}
  for (const { key, job } of BORDER_JOBS) {
    const custom =
      state.borderContrast && state[key] > 0 ? state[key] : undefined
    const light = high.light ? HIGH_CONTRAST_FLOORS[job] : custom
    const dark = high.dark ? HIGH_CONTRAST_FLOORS[job] : custom
    if (light === undefined && dark === undefined) continue
    targets[job] = light === dark ? light : compact({ light, dark })
  }
  return Object.keys(targets).length > 0 ? { "*": targets } : undefined
}

/** The state's color recipe — engine-true, absent means the engine default. */
export function buildColorConfig(state: StudioState): ColorConfig {
  const light = modeFor(state, "light")
  const dark = modeFor(state, "dark")
  const high = {
    light: light.contrast === "high",
    dark: dark.contrast === "high",
  }
  const policy = high.light || high.dark ? "strict" : state.guarantees
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
      light: light.bg === 99 ? undefined : clamp(light.bg, 90, 100),
      dark: dark.bg === 0 ? ("oled" as const) : clamp(dark.bg, 0, 20),
    }),
    vividness: state.vividness === 1 ? undefined : state.vividness,
    hueShift: state.hueShift === 1 ? undefined : state.hueShift,
    neutralTint: state.neutralTint === 1 ? undefined : state.neutralTint,
    neutralHue: state.neutralHue ?? undefined,
    preserveSeed: state.preserveSeed || undefined,
    guaranteePolicy:
      policy === "relaxed" || policy === "strict" ? policy : undefined,
    borders: borderTargets(state, high),
    primary: state.primary === "accent" ? "accent" : undefined,
  })
}

/** Sorted-key JSON with absent and empty-object fields dropped — the shape
 *  `resolveAll`'s deep merge leaves behind (`borders: {}`) still reads as
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
