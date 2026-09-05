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

   Engine: every combination resolves to the tokens card, popover and modal
   read — an edge and a shadow per role (`--card-border`/`--shadow-card`,
   `--overlay-border`/`--shadow-overlay`), the surface colors (`--color-bg`,
   `--color-card`, `--color-popover`) and the floating material
   (`--overlay-backdrop-filter`). Per-mode values ride on `light-dark()`;
   only what differs from the registry defaults is emitted. */

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
  overlay: SurfaceLook
  glass: boolean
}

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

/* Shadow ladders per role — size 1..3. `alphas` are the light-mode base;
   dark casts 2.2× harder (a shadow that reads on white vanishes on
   near-black). `ambient` is the soft second layer of the layered character. */
const SHADOW_LADDER = {
  card: {
    offsets: ["0 1px 2px", "0 1px 3px", "0 2px 8px -2px"],
    alphas: [0.05, 0.07, 0.09],
    ambient: ["0 1px 3px 1px", "0 2px 6px 2px", "0 4px 10px 3px"],
  },
  overlay: {
    offsets: ["0 2px 8px -2px", "0 8px 24px -6px", "0 16px 40px -8px"],
    alphas: [0.1, 0.16, 0.25],
    ambient: ["0 4px 10px 3px", "0 8px 24px 4px", "0 12px 36px 6px"],
  },
}

function shadowLayers(
  role: "card" | "overlay",
  size: number,
  weight: number,
  darkCasts: boolean,
  character: string,
): ShadowLayer[] {
  if (size <= 0) return []
  const ladder = SHADOW_LADDER[role]
  const i = size - 1
  const base = ladder.alphas[i] ?? 0
  const color = (mult: number): PerMode<SurfaceColor> => {
    const light = Math.min(base * weight, 0.7) * mult
    const dark = Math.min(base * weight * 2.2, 0.7) * mult
    return {
      // Tint only reads in light — a dark-mode shadow stays black either way.
      // The ink is lighter than pure black, so the alpha compensates upward.
      light:
        character === "tinted"
          ? { kind: "ink", alpha: Math.min(light * 1.25, 0.8) }
          : { kind: "shade", alpha: light },
      dark: darkCasts ? { kind: "shade", alpha: dark } : NONE,
    }
  }
  const layers: ShadowLayer[] = [
    { offset: ladder.offsets[i] ?? "", color: color(1) },
  ]
  if (character === "layered")
    layers.push({ offset: ladder.ambient[i] ?? "", color: color(0.55) })
  return layers
}

/** The whole chapter in one place: each strategy resolves edge, shadow and
 *  dark elevation together from the depth lever, so no combination of the
 *  axes can contradict itself. */
export function surfaceRecipe(state: StudioState): SurfaceRecipe {
  const d = Math.max(0, DEPTHS.indexOf(state.surfaceDepth))
  const tinted = state.surfaceCanvas === "tinted"
  const ring = state.surfaceEdge === "ring"

  const look = (role: "card" | "overlay"): SurfaceLook => {
    const floating = role === "overlay"
    let edge: PerMode<SurfaceColor> = both(NONE)
    let size = 0
    let weight = 1
    let darkCasts = true
    /* Dark-mode elevation steps this strategy adds at this depth. */
    let elevation = 0
    /* Tonal only: % of the way from the card rung to the next. */
    let tonal: number | null = null

    switch (state.surfaceStrategy) {
      case "hairline":
        // Edge-led in both modes; shadows stay subordinate, none at flat.
        edge = {
          light: EDGE_LIGHT[d] ?? HAIRLINE,
          dark: EDGE_DARK[d] ?? HAIRLINE,
        }
        size = floating ? d : Math.max(0, d - 1)
        weight = 0.8
        if (floating && d >= 2) elevation = 1
        break
      case "adaptive":
        // Shadow-only in light; dark swaps the means to hairline + elevation.
        edge = { light: NONE, dark: EDGE_DARK[Math.min(d + 1, 3)] ?? HAIRLINE }
        size = floating ? Math.max(1, d) : ([1, 1, 1, 2][d] ?? 1)
        darkCasts = false
        if (floating && d >= 1) elevation = 1
        break
      case "shadow":
        // Depth-led: real shadows even at flat, elevation carries dark.
        size = floating ? ([1, 2, 3, 3][d] ?? 2) : ([1, 1, 2, 2][d] ?? 1)
        weight = 1.3
        elevation = (floating ? 1 : 0) + (d >= 2 ? 1 : 0)
        break
      case "tonal":
        // Contrast-led in BOTH modes: containers step off the page by
        // background alone, shadows subordinate (floating layers only).
        tonal = floating
          ? ([55, 70, 85, 100][d] ?? 70)
          : ([25, 35, 50, 60][d] ?? 35)
        size = floating ? ([0, 1, 1, 2][d] ?? 1) : 0
        weight = 0.8
        break
      default:
        // Outline: a solid step on overlays in dark + heavy shadow.
        edge = floating
          ? { light: HAIRLINE, dark: step("400") }
          : both(HAIRLINE)
        size = floating ? ([1, 2, 3, 3][d] ?? 2) : ([0, 1, 2, 2][d] ?? 1)
        weight = 1.5
        if (floating && d >= 1) elevation = 1
    }

    const shadow = shadowLayers(
      role,
      size,
      weight,
      darkCasts,
      state.surfaceShadow,
    )
    // Ring redraws the edge outside the box — a strategy that paints no edge
    // has nothing to convert.
    if (ring && (edge.light.kind !== "none" || edge.dark.kind !== "none"))
      shadow.unshift({ offset: "0 0 0 1px", color: edge })

    // Light lifts via the canvas tint instead, so elevation is dark-only.
    const ladder = floating ? OVERLAY_ELEVATION : CARD_ELEVATION
    const lift = Math.min(floating ? 2 : 1, elevation + (tinted ? 1 : 0))
    const bg: PerMode<SurfaceColor> =
      tonal !== null
        ? both(mix("50", "100", 100 - tonal))
        : {
            light: tinted ? step("25") : step("50"),
            dark: ladder[lift] ?? step("50"),
          }

    return { edge: ring ? both(NONE) : edge, bg, shadow }
  }

  return {
    page: { light: tinted ? step("50") : step("25"), dark: step("25") },
    card: look("card"),
    overlay: look("overlay"),
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
      return `rgb(0 0 0 / ${color.alpha.toFixed(2)})`
    case "ink":
      return `color-mix(in srgb, ${palette.ink} ${Math.round(color.alpha * 100)}%, transparent)`
  }
}

export function shadowCss(
  layers: ShadowLayer[],
  color: (color: PerMode<SurfaceColor>) => string,
): string {
  if (layers.length === 0) return "none"
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
  const { page, card, overlay, glass } = surfaceRecipe(state)
  const popover = pairCss(overlay.bg)
  return {
    "--card-border": pairCss(card.edge),
    "--overlay-border": pairCss(overlay.edge),
    "--shadow-card": shadowCss(card.shadow, pairCss),
    "--shadow-overlay": shadowCss(overlay.shadow, pairCss),
    "--color-bg": pairCss(page),
    "--color-card": pairCss(card.bg),
    "--color-popover": glass ? glassCss(popover) : popover,
    "--overlay-backdrop-filter": glass ? GLASS_BACKDROP_FILTER : "none",
  }
}

const DEFAULT_TOKENS = surfaceTokens(SURFACE_DEFAULTS as StudioState)

export const WIRED = true

export function resolveSurfaces(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  for (const [name, value] of Object.entries(surfaceTokens(state))) {
    if (value !== DEFAULT_TOKENS[name]) tokens[name] = value
  }
  return { tokens }
}
