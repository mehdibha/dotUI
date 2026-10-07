/* Surfaces — how the page, cards and floating layers separate. A style is a
   named starting point over three settings; Glass sits beside it, and each
   mode's page L* is Color's (the engine re-anchors every ramp on it; the
   light page is Auto on Layers).

   - Layers, in light: cards on the page's tone (Same — shadcn, Primer), white
     cards on a gray page (Grouped — Apple, Polaris, HeroUI), or cards shaded
     below the page (Tonal — Material 3). The page is always the page slider's
     tone, so Grouped's depth is the page's gray. Dark always steps up page →
     card → overlay, under the field/muted rung so content inside still reads.
   - Edge: a hairline (Geist, shadcn, Primer) or none (Fluent, Atlassian). An
     edgeless system's dark is derived: shadows die on near-black, so they
     double, cards lift a quarter rung and overlays take the hairline
     (Atlassian, Spectrum, HeroUI).
   - Shadow: one ladder for cards, popovers and dialogs together, on
     Tailwind's rungs. Flat is the registry's look (card none · popover md ·
     modal lg); Low is shadcn New York, Medium shadcn Luma.
   - Glass: popovers, tooltips and toasts at 70% over a blurred backdrop;
     dialogs and drawers sit on a scrim and stay solid.
   - App shell: the sidebar and the frame around an inset content panel.

   Only what differs from the registry's defaults is emitted. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { BOOLEAN, oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SURFACE_DEFAULTS = {
  surfaceLayers: "same",
  surfaceEdge: "line",
  surfaceShadow: "flat",
  surfaceGlass: false,
  shellTone: "subtle",
}

export const LAYERS_VALUES = ["same", "grouped", "tonal"] as const

export const EDGE_VALUES = ["line", "none"] as const

export const SHADOW_VALUES = ["flat", "low", "medium", "high"] as const

export const SHELL_VALUES = ["subtle", "page", "recessed"] as const

/* Light: halfway between the 50 and 100 rungs (Linear's #efeff0 frame on a
   #f9f9fa panel). Dark: the page shaded toward black (#09090a on #121213). */
const SHELL_SIDEBAR: Record<string, string> = {
  page: "var(--color-bg)",
  recessed:
    "light-dark(color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100)), color-mix(in oklab, var(--neutral-25) 70%, oklch(0 0 0)))",
}

export const SURFACE_SCHEMA: ChapterSchema<typeof SURFACE_DEFAULTS> = {
  surfaceLayers: oneOf(LAYERS_VALUES),
  surfaceEdge: oneOf(EDGE_VALUES),
  surfaceShadow: oneOf(SHADOW_VALUES),
  surfaceGlass: BOOLEAN,
  shellTone: oneOf(SHELL_VALUES),
}

/* -------------------------------- Recipe --------------------------------- */

export type Mode = "light" | "dark"
export interface PerMode<T> {
  light: T
  dark: T
}

/** A surface color as the engine sees it: a rung of the neutral ramp, a mix
 *  of two rungs, white, the system's hairline, black at an alpha, or
 *  nothing. */
export type SurfaceColor =
  | { kind: "none" }
  | { kind: "white" }
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

/** The page is always the neutral's 25 rung — the page slider's tone. */
export interface SurfaceRecipe {
  card: SurfaceLook
  /** Popovers, menus, tooltips, toasts; dialogs share its color and edge. */
  popover: SurfaceLook
  modalShadow: ShadowLayer[]
  glass: boolean
}

const NONE: SurfaceColor = { kind: "none" }
const WHITE: SurfaceColor = { kind: "white" }
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

/** Rung per role — card, popover, modal — at each shadow step. */
const LADDER = {
  flat: [0, 3, 4],
  low: [2, 3, 4],
  medium: [3, 4, 5],
  high: [4, 5, 6],
} satisfies Record<string, [number, number, number]>

const ladder = (state: Effective) =>
  LADDER[state.surfaceShadow as keyof typeof LADDER] ?? LADDER.flat

/** The card's rung, for glyphs that hint at its shadow. */
export const cardRung = (state: Effective) => ladder(state)[0]

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
export function surfaceRecipe(state: Effective): SurfaceRecipe {
  const edgeless = state.surfaceEdge === "none"
  const grouped = state.surfaceLayers === "grouped"
  const tonal = state.surfaceLayers === "tonal"
  const [card, popover, modal] = ladder(state)
  return {
    card: {
      edge: both(edgeless ? NONE : HAIRLINE),
      bg: {
        light: grouped ? WHITE : tonal ? HALF : step("25"),
        dark: edgeless || tonal ? QUARTER : step("50"),
      },
      shadow: shadowLayers(card, edgeless),
    },
    popover: {
      edge: { light: edgeless ? NONE : HAIRLINE, dark: HAIRLINE },
      bg: {
        light: grouped ? WHITE : tonal ? step("50") : step("25"),
        dark: HALF,
      },
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
    case "white":
      return "oklch(1 0 0)"
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

function surfaceTokens(state: Effective): Record<string, string> {
  const { card, popover, modalShadow, glass } = surfaceRecipe(state)
  return {
    "--card-border": pairCss(card.edge),
    "--overlay-border": pairCss(popover.edge),
    "--shadow-card": shadowCss(card.shadow, pairCss),
    "--shadow-popover": shadowCss(popover.shadow, pairCss),
    "--shadow-modal": shadowCss(modalShadow, pairCss),
    "--color-card": pairCss(card.bg),
    "--color-popover": pairCss(popover.bg),
    "--popover-alpha": glass ? "70%" : "100%",
    "--popover-backdrop-filter": glass ? "blur(40px) saturate(150%)" : "none",
  }
}

const DEFAULT_TOKENS = surfaceTokens(SURFACE_DEFAULTS as Effective)

export function resolveSurfaces(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  for (const [name, value] of Object.entries(surfaceTokens(state))) {
    if (value !== DEFAULT_TOKENS[name]) tokens[name] = value
  }
  const sidebar = SHELL_SIDEBAR[state.shellTone]
  if (sidebar) tokens["--color-sidebar"] = sidebar
  return { tokens, params: { sidebar: { shell: state.shellTone } } }
}

export const chapter = defineChapter({
  id: "surfaces",
  defaults: SURFACE_DEFAULTS,
  schema: SURFACE_SCHEMA,
  resolve: resolveSurfaces,
  rules: [
    {
      // Flat cards need an edge or a tone apart from the page; Grouped's
      // white cards get theirs from the page clamp (color/grouped-page).
      id: "surfaces/flat-needs-separation",
      target: "surfaceShadow",
      when: {
        all: [
          { key: "surfaceEdge", in: ["none"] },
          { key: "surfaceLayers", in: ["same"] },
        ],
      },
      effect: { kind: "exclude", options: ["flat"], fallback: "low" },
      cause: "surfaceEdge",
    },
  ],
})
