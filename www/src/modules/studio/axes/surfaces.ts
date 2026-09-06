/* Surfaces — how cards and floating layers separate from the page (#590).
   Six decisions, never resolver parameters:

   - Separation: which means leads (edge, shadow, contrast) and how it shifts
     per mode. Dark behavior lives INSIDE the option — shadows die on
     near-black, so each strategy encodes its own dark translation (12-system
     survey, 2026-08-09): Hairline ≈ shadcn/Geist, Adaptive ≈ Radix Themes/
     Primer (shadow-led light → hairline + elevation dark), Shadow ≈ Fluent/
     Spectrum (shadows strengthen in dark), Outline ≈ Linear, Tonal ≈
     Material 3 (contrast-led in BOTH modes, containers darker than the page
     in light).
   - Depth: the one intensity lever — hairline weight, shadow size and dark
     elevation move together.
   - Shadow: the shadow's character (plain black, tinted with the ink, a
     key + ambient pair), orthogonal to Depth.
   - Edge: the hairline as a border inside the box, or a ring outside it
     (every shadcn style renders overlays ring + shadow — #581).
   - Canvas: white-on-white, or a tinted page surfaces lift off.
   - Material: solid or glass floating layers.

   Engine: every combination resolves to the tokens card, popover (menus,
   pickers, chart tooltips), modal and drawer read — an edge per role (`--card-border`,
   `--overlay-border`), a shadow per role (`--shadow-card`, `--shadow-popover`,
   `--shadow-modal`), the surface colors (`--color-bg`, `--color-card`,
   `--color-popover`) and the floating material (`--overlay-backdrop-filter`).
   Shadows are Tailwind's own rungs, so the default recipe IS the registry's
   look (card none · popover md · modal lg); per-mode values ride on
   `light-dark()`; only what differs from the defaults is emitted. */

import type { Resolved, StudioState } from "./index"

export const SURFACE_DEFAULTS = {
  surfaceStrategy: "hairline",
  surfaceDepth: "subtle",
  surfaceShadow: "plain",
  surfaceEdge: "border",
  surfaceCanvas: "same",
  surfaceMaterial: "solid",
}

export const STRATEGY_OPTIONS = [
  { value: "hairline", label: "Hairline" },
  { value: "adaptive", label: "Adaptive" },
  { value: "shadow", label: "Shadow" },
  { value: "outline", label: "Outline" },
  { value: "tonal", label: "Tonal" },
]

export const DEPTH_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "raised", label: "Raised" },
  { value: "floating", label: "Floating" },
]

export const SHADOW_OPTIONS = [
  { value: "plain", label: "Plain" },
  { value: "tinted", label: "Tinted" },
  { value: "layered", label: "Layered" },
]

export const EDGE_OPTIONS = [
  { value: "border", label: "Border" },
  { value: "ring", label: "Ring" },
]

export const CANVAS_OPTIONS = [
  { value: "same", label: "Same" },
  { value: "tinted", label: "Tinted" },
]

export const MATERIAL_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "glass", label: "Glass" },
]

/* -------------------------------- Recipe --------------------------------- */

export type Mode = "light" | "dark"
export interface PerMode<T> {
  light: T
  dark: T
}

/** A surface color as the engine sees it: a rung of the neutral ramp, a mix
 *  of two rungs, the system's hairline, black or the ink at an alpha, or
 *  nothing. The hero paints it from a mode's scales; the resolver writes it
 *  as CSS vars. */
export type SurfaceColor =
  | { kind: "none" }
  | { kind: "hairline" }
  | { kind: "step"; step: string }
  | { kind: "mix"; a: string; b: string; weight: number }
  | { kind: "shade"; alpha: number }
  | { kind: "ink"; alpha: number }

export interface ShadowLayer {
  offset: string
  color: PerMode<SurfaceColor>
}

export interface SurfaceLook {
  edge: PerMode<SurfaceColor>
  bg: PerMode<SurfaceColor>
  shadow: ShadowLayer[]
}

export interface SurfaceRecipe {
  page: PerMode<SurfaceColor>
  card: SurfaceLook
  popover: SurfaceLook
  modal: SurfaceLook
  glass: boolean
}

type Role = "card" | "popover" | "modal"

const NONE: SurfaceColor = { kind: "none" }
const HAIRLINE: SurfaceColor = { kind: "hairline" }
const step = (step: string): SurfaceColor => ({ kind: "step", step })
/** `weight`% of rung `a` mixed with rung `b`. */
const mix = (a: string, b: string, weight: number): SurfaceColor =>
  weight >= 100
    ? step(a)
    : weight <= 0
      ? step(b)
      : { kind: "mix", a, b, weight }
const both = <T>(value: T): PerMode<T> => ({ light: value, dark: value })

const DEPTHS = ["flat", "subtle", "raised", "floating"]

/* Hairline weight per depth, as neutral rungs — the registry's own hairline
   (theme.css `color-border`) is the subtle step. */
const EDGE_LIGHT = [step("200"), HAIRLINE, step("300"), step("400")]
const EDGE_DARK = [step("100"), HAIRLINE, step("200"), step("300")]

/* Dark elevation ladders. Step 0 is the registry default (theme.css: card =
   50, popover = a rung between 50 and 100); cards cap a step below floating
   surfaces so the ladder never flattens. */
const CARD_ELEVATION = [step("50"), mix("50", "100", 50), step("100")]
const OVERLAY_ELEVATION = [
  mix("50", "100", 50),
  step("100"),
  mix("100", "200", 50),
]

/* Tailwind's shadow ladder, indexed 0 (none) → 6 (2xl), as `[offset, alpha]`
   layers. The registry ships popover = md and modal = lg, so a recipe that
   lands on a rung is the registry's exact value. `AMBIENT` is the wide soft
   layer the layered character adds under each rung. */
const RUNGS: Array<Array<[string, number]>> = [
  [],
  [["0 1px 2px 0", 0.05]],
  [
    ["0 1px 3px 0", 0.1],
    ["0 1px 2px -1px", 0.1],
  ],
  [
    ["0 4px 6px -1px", 0.1],
    ["0 2px 4px -2px", 0.1],
  ],
  [
    ["0 10px 15px -3px", 0.1],
    ["0 4px 6px -4px", 0.1],
  ],
  [
    ["0 20px 25px -5px", 0.1],
    ["0 8px 10px -6px", 0.1],
  ],
  [["0 25px 50px -12px", 0.25]],
]
const AMBIENT = [
  "",
  "0 2px 8px 1px",
  "0 4px 12px 2px",
  "0 8px 24px 4px",
  "0 12px 36px 6px",
  "0 20px 48px 8px",
  "0 28px 64px 12px",
]

/** How a strategy's shadows translate to dark: unchanged (shadcn ships the
 *  same shadow-md on near-black), gone (dark leans on hairline + elevation),
 *  or harder (a shadow that reads on white vanishes on near-black). */
type DarkCast = "same" | "none" | "harder"

function shadowLayers(
  rung: number,
  weight: number,
  dark: DarkCast,
  character: string,
): ShadowLayer[] {
  const layers = RUNGS[rung] ?? []
  const color = (alpha: number): PerMode<SurfaceColor> => {
    const light = Math.min(alpha * weight, 0.7)
    return {
      // Tint only reads in light — a dark-mode shadow stays black either way.
      // The ink is lighter than pure black, so the alpha compensates upward.
      light:
        character === "tinted"
          ? { kind: "ink", alpha: Math.min(light * 1.25, 0.8) }
          : { kind: "shade", alpha: light },
      dark:
        dark === "none"
          ? NONE
          : {
              kind: "shade",
              alpha: dark === "harder" ? Math.min(light * 2.2, 0.6) : light,
            },
    }
  }
  const out: ShadowLayer[] = layers.map(([offset, alpha]) => ({
    offset,
    color: color(alpha),
  }))
  const key = layers[0]
  if (character === "layered" && key)
    out.push({ offset: AMBIENT[rung] ?? "", color: color(key[1] * 0.5) })
  return out
}

/** Shadow rung per role at each depth (flat · subtle · raised · floating). */
type Ladder = Record<Role, [number, number, number, number]>

/** The whole chapter in one place: each strategy resolves edge, shadow and
 *  dark elevation together from the depth lever, so no combination of the
 *  axes can contradict itself. */
export function surfaceRecipe(state: StudioState): SurfaceRecipe {
  const d = Math.max(0, DEPTHS.indexOf(state.surfaceDepth))
  const tinted = state.surfaceCanvas === "tinted"
  const ring = state.surfaceEdge === "ring"

  const look = (role: Role): SurfaceLook => {
    const floating = role !== "card"
    let edge: PerMode<SurfaceColor> = both(NONE)
    let ladder: Ladder
    let weight = 1
    let dark: DarkCast = "same"
    /* Dark-mode elevation steps this strategy adds at this depth. */
    let elevation = 0
    /* Tonal only: % of the way from the card rung to the next. */
    let tonal: number | null = null

    switch (state.surfaceStrategy) {
      case "hairline":
        // Edge-led in both modes; shadows stay subordinate (the registry's
        // own md/lg at subtle), none on cards until raised.
        edge = {
          light: EDGE_LIGHT[d] ?? HAIRLINE,
          dark: EDGE_DARK[d] ?? HAIRLINE,
        }
        ladder = {
          card: [0, 0, 1, 2],
          popover: [2, 3, 4, 5],
          modal: [3, 4, 5, 6],
        }
        if (floating && d >= 2) elevation = 1
        break
      case "adaptive":
        // Shadow-only in light; dark swaps the means to hairline + elevation.
        edge = { light: NONE, dark: EDGE_DARK[Math.min(d + 1, 3)] ?? HAIRLINE }
        ladder = {
          card: [1, 2, 3, 4],
          popover: [3, 4, 5, 6],
          modal: [4, 5, 6, 6],
        }
        dark = "none"
        if (floating && d >= 1) elevation = 1
        break
      case "shadow":
        // Depth-led: real shadows even at flat, elevation carries dark.
        ladder = {
          card: [2, 3, 4, 5],
          popover: [3, 4, 5, 6],
          modal: [4, 5, 6, 6],
        }
        weight = 1.2
        dark = "harder"
        elevation = (floating ? 1 : 0) + (d >= 2 ? 1 : 0)
        break
      case "tonal":
        // Contrast-led in BOTH modes: containers step off the page by
        // background alone, shadows subordinate (floating layers only).
        tonal = floating
          ? ([55, 70, 85, 100][d] ?? 70)
          : ([25, 35, 50, 60][d] ?? 35)
        ladder = {
          card: [0, 0, 0, 0],
          popover: [0, 2, 3, 4],
          modal: [0, 3, 4, 5],
        }
        weight = 0.8
        break
      default:
        // Outline: a solid step on overlays in dark + heavy shadow.
        edge = floating
          ? { light: HAIRLINE, dark: step("400") }
          : both(HAIRLINE)
        ladder = {
          card: [0, 2, 3, 4],
          popover: [3, 4, 5, 6],
          modal: [4, 5, 6, 6],
        }
        weight = 1.5
        if (floating && d >= 1) elevation = 1
    }

    const shadow = shadowLayers(
      ladder[role][d] ?? 0,
      weight,
      dark,
      state.surfaceShadow,
    )
    // Ring redraws the edge outside the box — a strategy that paints no edge
    // has nothing to convert.
    if (ring && (edge.light.kind !== "none" || edge.dark.kind !== "none"))
      shadow.unshift({ offset: "0 0 0 1px", color: edge })

    // Light lifts via the canvas tint instead, so elevation is dark-only.
    const steps = floating ? OVERLAY_ELEVATION : CARD_ELEVATION
    const lift = Math.min(floating ? 2 : 1, elevation + (tinted ? 1 : 0))
    const bg: PerMode<SurfaceColor> =
      tonal !== null
        ? both(mix("50", "100", 100 - tonal))
        : {
            light: tinted ? step("25") : step("50"),
            dark: steps[lift] ?? step("50"),
          }

    return { edge: ring ? both(NONE) : edge, bg, shadow }
  }

  return {
    page: { light: tinted ? step("50") : step("25"), dark: step("25") },
    card: look("card"),
    popover: look("popover"),
    modal: look("modal"),
    glass: state.surfaceMaterial === "glass",
  }
}

/* ----------------------------- Serialization ----------------------------- */

/** How a SurfaceColor's references resolve: to CSS vars (the resolver) or to
 *  a mode's solved scales (the hero). */
export interface SurfacePalette {
  step: (step: string) => string
  hairline: string
  ink: string
}

const alpha = (value: number) => String(Math.round(value * 1000) / 1000)

export function surfaceColorCss(
  color: SurfaceColor,
  palette: SurfacePalette,
): string {
  switch (color.kind) {
    case "none":
      return "transparent"
    case "hairline":
      return palette.hairline
    case "step":
      return palette.step(color.step)
    case "mix":
      return `color-mix(in oklab, ${palette.step(color.a)} ${color.weight}%, ${palette.step(color.b)})`
    case "shade":
      return `rgb(0 0 0 / ${alpha(color.alpha)})`
    case "ink":
      return `color-mix(in srgb, ${palette.ink} ${Math.round(color.alpha * 100)}%, transparent)`
  }
}

/** Tailwind's own "no shadow" — `none` would invalidate the composed
 *  `box-shadow` list a `ring-*` utility shares with the shadow. */
export const NO_SHADOW = "0 0 #0000"

export function shadowCss(
  layers: ShadowLayer[],
  color: (color: PerMode<SurfaceColor>) => string,
): string {
  if (layers.length === 0) return NO_SHADOW
  return layers
    .map((layer) => `${layer.offset} ${color(layer.color)}`)
    .join(", ")
}

/** Glass: the floating surface color at 72%, over a blurred backdrop. */
export const glassCss = (bg: string) =>
  `color-mix(in srgb, ${bg} 72%, transparent)`
export const GLASS_BACKDROP_FILTER = "blur(8px)"

const TOKEN_PALETTE: SurfacePalette = {
  step: (step) => `var(--neutral-${step})`,
  hairline: "var(--color-border)",
  ink: "var(--color-fg)",
}

function pairCss(pair: PerMode<SurfaceColor>): string {
  const light = surfaceColorCss(pair.light, TOKEN_PALETTE)
  const dark = surfaceColorCss(pair.dark, TOKEN_PALETTE)
  return light === dark ? light : `light-dark(${light}, ${dark})`
}

function surfaceTokens(state: StudioState): Record<string, string> {
  const { page, card, popover, modal, glass } = surfaceRecipe(state)
  const popoverBg = pairCss(popover.bg)
  return {
    "--card-border": pairCss(card.edge),
    "--overlay-border": pairCss(popover.edge),
    "--shadow-card": shadowCss(card.shadow, pairCss),
    "--shadow-popover": shadowCss(popover.shadow, pairCss),
    "--shadow-modal": shadowCss(modal.shadow, pairCss),
    "--color-bg": pairCss(page),
    "--color-card": pairCss(card.bg),
    "--color-popover": glass ? glassCss(popoverBg) : popoverBg,
    "--overlay-backdrop-filter": glass ? GLASS_BACKDROP_FILTER : "none",
  }
}

const DEFAULT_TOKENS = surfaceTokens(SURFACE_DEFAULTS as StudioState)

export function resolveSurfaces(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  for (const [name, value] of Object.entries(surfaceTokens(state))) {
    if (value !== DEFAULT_TOKENS[name]) tokens[name] = value
  }
  return { tokens }
}
