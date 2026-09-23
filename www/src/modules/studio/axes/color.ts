/* Color — the seeds and engine axes behind the generated palette, mapped
   straight onto `ColorConfig` (the one recipe `@dotui/colors` resolves; the
   provider and the export both run it). Modes are the engine's fixed pair —
   light on `:root`, dark on `.dark` — each with its own background L*
   (owned by Surfaces). */

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { ColorConfig, PrimaryColorSource } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"
import type { AxisSpec, ChapterSpec } from "./spec"

export interface ColorMode {
  id: string
  name: string
  polarity: "light" | "dark"
  /** Background L*; 0 on dark = OLED black. */
  bg: number
}

/* Light 99 is the engine's own default and stays absent from the config;
   dark 2 is dotUI's (the engine would pick 6). */
export const DEFAULT_MODES: ColorMode[] = [
  { id: "light", name: "Light", polarity: "light", bg: 99 },
  { id: "dark", name: "Dark", polarity: "dark", bg: 2 },
]

/** Where each mode's background L* runs — the engine's accepted range. */
export const MODE_BG_RANGE = {
  light: { min: 90, max: 100 },
  dark: { min: 0, max: 20 },
  step: 0.5,
}

/* '' on a seed means Auto (absent from the config). */
export const COLOR_DEFAULTS = {
  brand: DEFAULT_COLOR_CONFIG.seeds.accent,
  buttonColor: "neutral",
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
  {
    value: "neutral",
    label: "Neutral",
    description:
      "The neutral's darkest step — near-black in light mode, near-white " +
      "in dark — with the page color on it.",
  },
  {
    value: "accent",
    label: "Accent",
    description:
      "The brand ramp's solid step, with a white or dark label picked to " +
      "clear WCAG 3:1 and APCA Lc 60 — not AA's 4.5:1, so check small " +
      "text on light or vivid brands.",
  },
]

/** Where the Vividness slider runs. */
export const VIVIDNESS_RANGE = { min: 0, max: 2, step: 0.05 }

/* The roles that paint with a source. Leaves hold state; Primary is a view
   over them — their shared value, or mixed — and writing it writes them all.
   Solids fill: the buttons (the primary tokens), each check control (the
   selection tokens), the slider. Inks draw: the selected tab, links, the
   focus ring. */
export const CHECK_LEAVES = [
  "checkboxColor",
  "radioColor",
  "switchColor",
] as const

export const SOLID_LEAVES = [
  "buttonColor",
  ...CHECK_LEAVES,
  "sliderColor",
] as const

export const PRIMARY_LEAVES = [
  ...SOLID_LEAVES,
  "tabsColor",
  "linkColor",
  "focusColor",
] as const

export type PrimaryLeaf = (typeof PRIMARY_LEAVES)[number]

export const PRIMARY_LEAF_LABELS: Record<PrimaryLeaf, string> = {
  buttonColor: "Buttons",
  checkboxColor: "Checkbox",
  radioColor: "Radio",
  switchColor: "Switch",
  sliderColor: "Slider",
  tabsColor: "Tabs",
  linkColor: "Links",
  focusColor: "Focus ring",
}

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

/** The selection tokens' source: the check controls' majority. */
export function selectionSource(state: StudioState): PrimaryColorSource {
  const accent = CHECK_LEAVES.filter((leaf) => state[leaf] === "accent")
  return accent.length >= 2 ? "accent" : "neutral"
}

/** One control's fill as a recipe scope — only when it leaves the selection
 *  source; on it, the control paints with the selection tokens (a
 *  `selection` seed included). */
export function fillScope(
  state: StudioState,
  scope: string,
  fill: string,
): Partial<ColorConfig> | undefined {
  if (fill === selectionSource(state)) return undefined
  return { scopes: { [scope]: fill as PrimaryColorSource } }
}

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

export function buildColorConfig(state: StudioState): ColorConfig {
  const selection = selectionSource(state)
  const light = modeFor(state, "light")
  const dark = modeFor(state, "dark")
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
      light:
        light.bg === 99
          ? undefined
          : clamp(light.bg, MODE_BG_RANGE.light.min, MODE_BG_RANGE.light.max),
      dark:
        dark.bg === 0
          ? ("oled" as const)
          : clamp(dark.bg, MODE_BG_RANGE.dark.min, MODE_BG_RANGE.dark.max),
    }),
    vividness: state.vividness === 1 ? undefined : state.vividness,
    neutralTint: state.neutralTint === 1 ? undefined : state.neutralTint,
    neutralHue: state.neutralHue ?? undefined,
    preserveSeed: state.preserveSeed || undefined,
    primary: state.buttonColor === "accent" ? "accent" : undefined,
    selection: selection === state.buttonColor ? undefined : selection,
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

const statusSeed = (
  label: string,
  paints: string,
  fallback: string,
): AxisSpec => ({
  label,
  description:
    `Seed of the ${label.toLowerCase()} palette — ${paints}. Vividness ` +
    "multiplies its chroma too: above 1 the solid runs louder than the " +
    "seed, below 1 duller (at 0.5 the default danger red turns salmon).",
  value: { type: "color" },
  auto:
    `The engine's default ${fallback}, chosen for color-vision-deficiency ` +
    "separation from the other status hues.",
})

export const COLOR_SPEC = {
  label: "Color",
  description:
    "The palette engine's inputs: a brand seed, a neutral that leans toward " +
    "a hue, optional status and selection seeds, and which ramp the solid " +
    "roles paint with. Every palette is a 12-step ramp generated per mode; " +
    "dark is its own pass, not an inversion. Which roles paint with the " +
    "brand is split over eight leaves — buttonColor, checkboxColor, " +
    "radioColor, switchColor, sliderColor, tabsColor, linkColor, " +
    "focusColor — each stored on its own; the studio's Primary control " +
    "reads them as one value (or mixed) and sets them together. The info " +
    "palette has no seed here: it is always generated from the engine's " +
    "blue (#4862ff), scaled by Vividness like the status palettes.",
  axes: {
    brand: {
      label: "Brand",
      description:
        "The brand color. The accent ramp is built from it: the solid step " +
        "keeps the seed's hue and chroma, and its lightness within L* " +
        "35–92 — a darker or lighter seed is pulled into that window (a " +
        "#141414 brand renders #525252, #fafafa renders #e8e8e8), and a " +
        "mid-tone whose label can't reach contrast is darkened further. " +
        "The neutral leans toward its hue unless Neutral hue is set. Paints every role set to Accent (links and the focus " +
        "ring by default; the focus ring moves to the Selection seed when " +
        "one is set), and always the calendar's and time picker's selected " +
        "values, drop-target highlights in drop zones and trees, and the " +
        "text-selection highlight.",
      value: { type: "color" },
      guidance:
        "Radix Themes picks from 26 named accents; Material 3 derives " +
        "every palette from one source color, as here. A muted seed gives " +
        "a muted ramp by design — raise Vividness rather than picking a " +
        "louder seed. A near-gray seed yields gray ramps and an untinted " +
        "neutral. Status hues don't move away from the brand: a green " +
        "brand lands on top of success, a red one on danger — reseed the " +
        "status to separate them. For a black-and-white system don't seed a " +
        "near-black brand: leave Buttons and the other solid leaves " +
        "(Checkbox, Radio, Switch, Slider, Tabs) on Neutral, their default, " +
        "and give Brand the hue that links, the focus ring and selection " +
        "highlights should carry. Setting the Primary control to Neutral " +
        "moves links and focus off the brand too.",
    },
    buttonColor: {
      label: PRIMARY_LEAF_LABELS.buttonColor,
      description:
        "What the primary tokens fill with: the primary button and toggle " +
        "button, the progress bar, the avatar badge, the primary chat " +
        "bubble, the checked questionnaire choice, and neutral badges and " +
        "tags in the Inverse chip style. Nothing else follows it: " +
        "checkboxColor, radioColor, switchColor, sliderColor and tabsColor " +
        "(default Neutral) and linkColor and focusColor (default Accent) " +
        "are separate leaves. Setting only this one to Accent leaves " +
        "near-black checks, switch, slider and tabs beside brand buttons; " +
        "the Primary control sets all eight at once.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          seenIn:
            option.value === "neutral"
              ? ["shadcn/ui", "Geist"]
              : ["Radix Themes", "Material 3", "Linear"],
        })),
      },
      guidance:
        "Of 5 checked, shadcn/ui and Geist fill the primary button " +
        "near-black; Radix Themes (accent step 9), Material 3 (primary) " +
        "and Linear (its indigo) fill it with the brand. Neutral suits tool UIs where the brand is " +
        "kept for links and focus; accent suits brand-forward products.",
    },
    neutralHue: {
      label: "Neutral hue",
      description:
        "The OKLCH hue the neutral ramp leans toward — the tint of every " +
        "gray: page, surfaces, borders, text.",
      value: { type: "number", min: 0, max: 360, step: 1, unit: "°" },
      auto:
        "Follows the brand's hue. A near-gray brand leaves the neutral " +
        "untinted.",
      guidance:
        "Material 3 and Radix Themes (gray 'auto': mauve for reds and " +
        "purples, slate for blues, sage for greens, sand for yellows) both " +
        "pair the gray with the accent's hue by default. shadcn/ui instead " +
        "offers named grays — Neutral, Stone, Zinc, Mauve, Olive, Mist, " +
        "Taupe — picked apart from the theme. The panel's families sit at " +
        "Taupe 30°, Stone 60°, Olive 130°, Mist 250°, Zinc 286°, Mauve 320°.",
    },
    neutralTint: {
      label: "Neutral tint",
      description:
        "How far the neutral leans toward its hue — a multiplier on the " +
        "engine's tint peak (about 0.016 OKLCH chroma), reached only in the " +
        "mid-tone steps; the page and surfaces carry an eighth to a quarter " +
        "of it. 0 is a pure gray.",
      value: { type: "number", min: 0, max: 2, step: 0.05, unit: "×" },
      guidance:
        "Material 3's neutral runs at HCT chroma 6 by default, 2 in its " +
        "Neutral scheme and 0 in Monochrome; shadcn/ui's default Neutral " +
        "is a pure gray (0). 1 is the median tint of Radix's gray families " +
        "(slate, mauve, sage…): gray with a temperature, about 0.002 " +
        "chroma on the light page. Below 1 light surfaces render as plain " +
        "gray (0.001 at 0.5) — don't call them tinted; the lean survives " +
        "only faintly in borders and dark surfaces. Use 0 for a stark, " +
        "Vercel-like monochrome; toward 2 surfaces carry a visible tint.",
    },
    successSeed: statusSeed(
      "Success",
      "success badges, alerts, toasts and an avatar fallback tint",
      "#6ac48c",
    ),
    warningSeed: statusSeed(
      "Warning",
      "the warning button, warning badges, alerts, toasts and an avatar " +
        "fallback tint",
      "#eab308",
    ),
    dangerSeed: statusSeed(
      "Danger",
      "the danger button, field errors, danger badges, alerts and toasts",
      "#ef4444",
    ),
    selectionSeed: {
      label: "Selection",
      description:
        "Moves the selection tokens onto their own ramp, built from this " +
        "seed: of checkbox, radio and switch, the ones on the source at " +
        "least two of them share fill with its solid step instead of " +
        "neutral or accent; a control alone on the other source keeps it. " +
        "It also takes over the focus color (color-border-focus): with " +
        "Focus ring on Accent, the focus ring and focused field borders " +
        "switch from the brand to this seed.",
      value: { type: "color" },
      auto:
        "No ramp of its own — the selection tokens draw from the source " +
        "most check controls share.",
      guidance:
        "Use it when checked controls carry a hue that is neither the " +
        "brand nor gray: Apple HIG switches default to green. It reaches " +
        "the two or three checks that agree, never a lone one — Carbon's " +
        "green toggle beside a near-black checkbox and radio is out of " +
        "reach.",
    },
    vividness: {
      label: "Vividness",
      description:
        "Scales the chroma of every generated chromatic ramp — brand, " +
        "status and selection. 1 is the engine's fitted curve; 0 is gray.",
      value: { type: "number", unit: "×", ...VIVIDNESS_RANGE },
      guidance:
        "The engine calibrates 1 to Radix Colors and about 1.33 to " +
        "Tailwind's palette. Material 3 makes the same call as scheme " +
        "variants: primary chroma 0 (Monochrome), 12 (Neutral), 36 (Tonal " +
        "Spot, the default) and up to the gamut (Vibrant). Below 0.8 reads " +
        "calm and corporate; above 1.3 reads playful.",
    },
    preserveSeed: {
      label: "Keep exact",
      description:
        "Pins the brand's solid step to the exact seed instead of fitting " +
        "its lightness and chroma to the ramp — in both modes, since the " +
        "solid step is shared across them. Hover shifts from the pinned " +
        "color; border and text steps still come from the ramp. The label on it can then miss its 3:1 / " +
        "Lc 60 target, and nothing here warns: check it yourself.",
      value: { type: "boolean" },
      guidance:
        "Material 3 offers both: Tonal Spot replaces the source chroma, " +
        "while Fidelity and Content keep it and place the source color in " +
        "primary container. Turn it on when brand guidelines require the " +
        "exact hex on buttons; leave it off for ramps that stay even. It " +
        "doesn't fix a monochrome brand: a pinned near-black seed fills " +
        "accent roles near-black in dark mode too, where they sink into " +
        "the page.",
    },
  },
} satisfies ChapterSpec<typeof COLOR_DEFAULTS>
