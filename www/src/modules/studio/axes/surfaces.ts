/* Surfaces — how the page, cards and floating layers separate. A style is a
   named starting point over three settings; Glass sits beside it, and each
   mode's page L* is Color's (the engine re-anchors every ramp on it).

   - Layers, in light: cards on the page's tone (Same), white cards on a gray
     page (Grouped — Polaris, Carbon Gray 10, Apple grouped), or cards shaded
     below the page (Tonal — Material 3). Dark always steps up page → card →
     overlay, under the field/muted rung so content inside still reads.
   - Edge: a hairline (Geist, shadcn, Primer) or none (Fluent, Spectrum). An
     edgeless system's dark is derived: shadows die on near-black, so they
     double, cards lift a quarter rung and overlays take the hairline
     (Atlassian, Spectrum, HeroUI).
   - Shadow: one lift for cards, popovers and dialogs together, on Tailwind's
     rungs — the default IS the registry's look (card none · popover md ·
     modal lg).
   - Glass: popovers, tooltips and toasts at 70% over a blurred backdrop;
     dialogs and drawers sit on a scrim and stay solid.

   Only what differs from the registry's defaults is emitted. */

import type { Resolved, StudioState } from "./index"
import { BOOLEAN, oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SURFACE_DEFAULTS = {
  surfaceLayers: "same",
  surfaceEdge: "line",
  surfaceShadow: "subtle",
  surfaceGlass: false,
}

export const LAYERS_OPTIONS = [
  { value: "same", label: "Same" },
  { value: "grouped", label: "Grouped" },
  { value: "tonal", label: "Tonal" },
]

export const EDGE_OPTIONS = [
  { value: "line", label: "Line" },
  { value: "none", label: "None" },
]

export const SHADOW_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "raised", label: "Raised" },
  { value: "floating", label: "Floating" },
]

export const SURFACE_SCHEMA: ChapterSchema<typeof SURFACE_DEFAULTS> = {
  surfaceLayers: oneOf(LAYERS_OPTIONS),
  surfaceEdge: oneOf(EDGE_OPTIONS),
  surfaceShadow: oneOf(SHADOW_OPTIONS),
  surfaceGlass: BOOLEAN,
}

/* --------------------------------- Styles --------------------------------- */

type StyleKey = "surfaceLayers" | "surfaceEdge" | "surfaceShadow"

export interface SurfaceStyle {
  id: string
  label: string
  /** Who draws their surfaces this way. */
  hint: string
  values: Record<StyleKey, string>
}

const style = (
  id: string,
  label: string,
  hint: string,
  surfaceLayers: string,
  surfaceEdge: string,
  surfaceShadow: string,
): SurfaceStyle => ({
  id,
  label,
  hint,
  values: { surfaceLayers, surfaceEdge, surfaceShadow },
})

export const SURFACE_STYLES: SurfaceStyle[] = [
  style("outlined", "Outlined", "Vercel, shadcn", "same", "line", "subtle"),
  style("soft", "Soft", "Linear, Stripe", "same", "line", "raised"),
  style("elevated", "Elevated", "Fluent, Airbnb", "same", "none", "raised"),
  style("grouped", "Grouped", "Polaris, Apple", "grouped", "none", "subtle"),
  style("tonal", "Tonal", "Material", "tonal", "none", "flat"),
]

const STYLE_KEYS: StyleKey[] = ["surfaceLayers", "surfaceEdge", "surfaceShadow"]

/** The style the state sits on, or the closest one: Layers outweighs the
 *  other two, and a tie goes to `from`, the style the edits started at. */
export function surfaceStyle(
  state: StudioState,
  from?: string,
): { style: SurfaceStyle; exact: boolean } {
  const score = (s: SurfaceStyle) =>
    STYLE_KEYS.reduce(
      (n, key) =>
        state[key] === s.values[key]
          ? n + (key === "surfaceLayers" ? 3 : 1)
          : n,
      0,
    )
  const best = SURFACE_STYLES.reduce((a, b) =>
    score(b) > score(a) || (score(b) === score(a) && b.id === from) ? b : a,
  )
  return {
    style: best,
    exact: STYLE_KEYS.every((key) => state[key] === best.values[key]),
  }
}

/** Cards with no edge, no shadow and the page's own tone would vanish. */
export const flatAllowed = (state: StudioState) =>
  state.surfaceLayers !== "same" || state.surfaceEdge !== "none"

/** `patch` applied, lifting the shadow off Flat when it would hide cards. */
export function withSurface(
  state: StudioState,
  patch: Partial<Record<StyleKey, string>>,
): StudioState {
  const next = { ...state, ...patch }
  return flatAllowed(next) || next.surfaceShadow !== "flat"
    ? next
    : { ...next, surfaceShadow: "subtle" }
}

/* -------------------------------- Recipe --------------------------------- */

export type Mode = "light" | "dark"
export interface PerMode<T> {
  light: T
  dark: T
}

/** A surface color as the engine sees it: a rung of the neutral ramp, a mix
 *  of two rungs, the system's hairline, black at an alpha, or nothing. */
export type SurfaceColor =
  | { kind: "none" }
  | { kind: "hairline" }
  | { kind: "step"; step: string }
  | { kind: "mix"; a: string; b: string; weight: number }
  | { kind: "shade"; alpha: number }

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
  /** Popovers, menus, tooltips, toasts; dialogs share its color and edge. */
  popover: SurfaceLook
  modalShadow: ShadowLayer[]
  glass: boolean
}

const NONE: SurfaceColor = { kind: "none" }
const HAIRLINE: SurfaceColor = { kind: "hairline" }
const step = (step: string): SurfaceColor => ({ kind: "step", step })
/** Halfway between the 50 and 100 rungs: the registry's dark popover. */
const HALF: SurfaceColor = { kind: "mix", a: "50", b: "100", weight: 50 }
/** A quarter rung above 50: a lifted dark card, still under the popover. */
const QUARTER: SurfaceColor = { kind: "mix", a: "50", b: "100", weight: 75 }
const both = <T>(value: T): PerMode<T> => ({ light: value, dark: value })

/* Tailwind's shadow ladder as `[offset, alpha]` layers: 0 none, then xs, sm,
   md, lg, xl, 2xl. */
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

/** Rung per role — card, popover, modal — at each shadow step. Edgeless
 *  cards start a rung higher: their shadow is their edge. */
const LADDERS = {
  line: {
    flat: [0, 2, 3],
    subtle: [0, 3, 4],
    raised: [2, 4, 5],
    floating: [3, 5, 6],
  },
  none: {
    flat: [0, 2, 3],
    subtle: [2, 3, 4],
    raised: [3, 4, 5],
    floating: [4, 5, 6],
  },
} satisfies Record<string, Record<string, [number, number, number]>>

/* The soft 0-offset outline shadow-led systems draw around every raised
   surface (Fluent's 0 0 2px). */
const PERIMETER: [string, number] = ["0 0 2px 0", 0.12]

function shadowLayers(rung: number, edgeless: boolean): ShadowLayer[] {
  const layers = RUNGS[rung] ?? []
  if (layers.length === 0) return []
  return [...(edgeless ? [PERIMETER] : []), ...layers].map(
    ([offset, alpha]) => ({
      offset,
      color: {
        light: { kind: "shade", alpha },
        dark: {
          kind: "shade",
          alpha: edgeless ? Math.min(alpha * 2, 0.6) : alpha,
        },
      },
    }),
  )
}

/** Every setting resolved together, so no combination contradicts itself. */
export function surfaceRecipe(state: StudioState): SurfaceRecipe {
  const edgeless = state.surfaceEdge === "none"
  const grouped = state.surfaceLayers === "grouped"
  const tonal = state.surfaceLayers === "tonal"
  const ladder = LADDERS[edgeless ? "none" : "line"]
  const [card, popover, modal] =
    ladder[state.surfaceShadow as keyof typeof ladder] ?? ladder.subtle
  return {
    page: { light: grouped ? HALF : step("25"), dark: step("25") },
    card: {
      edge: both(edgeless ? NONE : HAIRLINE),
      bg: {
        light: grouped ? step("25") : tonal ? HALF : step("50"),
        dark: edgeless || tonal ? QUARTER : step("50"),
      },
      shadow: shadowLayers(card, edgeless),
    },
    popover: {
      edge: { light: edgeless ? NONE : HAIRLINE, dark: HAIRLINE },
      bg: { light: grouped ? step("25") : step("50"), dark: HALF },
      shadow: shadowLayers(popover, edgeless),
    },
    modalShadow: shadowLayers(modal, edgeless),
    glass: state.surfaceGlass,
  }
}

/* ----------------------------- Serialization ----------------------------- */

/** How a SurfaceColor's references resolve: to CSS vars (the resolver) or to
 *  a mode's solved scales (the panel glyphs, tests). */
export interface SurfacePalette {
  step: (step: string) => string
  hairline: string
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

const TOKEN_PALETTE: SurfacePalette = {
  step: (step) => `var(--neutral-${step})`,
  hairline: "var(--color-border)",
}

function pairCss(pair: PerMode<SurfaceColor>): string {
  const light = surfaceColorCss(pair.light, TOKEN_PALETTE)
  const dark = surfaceColorCss(pair.dark, TOKEN_PALETTE)
  return light === dark ? light : `light-dark(${light}, ${dark})`
}

function surfaceTokens(state: StudioState): Record<string, string> {
  const { page, card, popover, modalShadow, glass } = surfaceRecipe(state)
  return {
    "--card-border": pairCss(card.edge),
    "--overlay-border": pairCss(popover.edge),
    "--shadow-card": shadowCss(card.shadow, pairCss),
    "--shadow-popover": shadowCss(popover.shadow, pairCss),
    "--shadow-modal": shadowCss(modalShadow, pairCss),
    "--color-bg": pairCss(page),
    "--color-card": pairCss(card.bg),
    "--color-popover": pairCss(popover.bg),
    "--popover-alpha": glass ? "70%" : "100%",
    "--popover-backdrop-filter": glass ? "blur(40px) saturate(150%)" : "none",
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
