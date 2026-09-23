/* Surfaces — how cards and floating layers separate from the page (#590).
   Five decisions, never resolver parameters:

   - Separation: which means leads (edge, shadow, contrast) and how it shifts
     per mode. Dark behavior lives INSIDE the option — shadows die on
     near-black, so each strategy encodes its own dark translation (12-system
     survey, 2026-08-09): Hairline ≈ shadcn/Geist, Adaptive ≈ Radix Themes/
     Primer (shadow-led light over a faint ring → brighter edge, elevation
     and a tighter shadow in dark), Shadow ≈ Fluent/Spectrum (shadows
     strengthen in dark), Tonal ≈ Material 3 (contrast-led in BOTH modes,
     containers darker than the page in light).
   - Depth: the one intensity lever — hairline weight, shadow size and dark
     elevation move together. Shadow-led systems (Fluent, Material,
     Atlassian) ship a key + ambient pair, so the Shadow strategy does too.
   - Canvas: white-on-white, or a tinted page white surfaces lift off (Vercel,
     Stripe, Apple); dark lifts the same surfaces a full rung instead.
   - Modes: each mode's background L* — how white the light page is, how
     black the dark one (OLED at 0). The color engine reads it.
   - Material: the popover tier (menus, pickers, popovers) solid, or as
     glass — shadcn's recipe, the surface at 70% over a blurred, saturated
     backdrop. Modals and drawers stay solid either way; they sit over a
     scrim, so there is nothing to see through.

   Engine: every combination resolves to the tokens card, popover (menus,
   pickers, chart tooltips), modal and drawer read — an edge per role (`--card-border`,
   `--overlay-border`), a shadow per role (`--shadow-card`, `--shadow-popover`,
   `--shadow-modal`), the surface colors (`--color-bg`, `--color-card`,
   `--color-popover`) and the popover material (`--popover-alpha`,
   `--popover-backdrop-filter`).
   Shadows are Tailwind's own rungs, so the default recipe IS the registry's
   look (card none · popover md · modal lg); per-mode values ride on
   `light-dark()`; only what differs from the defaults is emitted. */

import { DEFAULT_MODES, MODE_BG_RANGE } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SURFACE_DEFAULTS = {
  surfaceStrategy: "hairline",
  surfaceDepth: "subtle",
  surfaceCanvas: "same",
  surfaceMaterial: "solid",
  modes: DEFAULT_MODES,
}

export const STRATEGY_OPTIONS = [
  {
    value: "hairline",
    label: "Hairline",
    description:
      "A 1px neutral edge on cards and floating layers in both modes; " +
      "shadows stay secondary, with none on cards until Raised.",
    seenIn: ["shadcn/ui", "Geist", "Linear"],
  },
  {
    value: "adaptive",
    label: "Adaptive",
    description:
      "Shadow-led in light: a faint ring, lighter than Hairline's edge, " +
      "and a small shadow on cards. In dark the balance flips: a brighter " +
      "edge and lighter floating layers lead, and shadows stay one size " +
      "smaller but darker (cards at Flat lose theirs).",
    seenIn: ["Primer", "Radix Themes", "Atlassian"],
  },
  {
    value: "shadow",
    label: "Shadow",
    description:
      "No edges; a key + ambient shadow pair on every surface, cards " +
      "included, about three times as dark in dark mode, where floating layers " +
      "also step lighter.",
    seenIn: ["Fluent 2", "Spectrum 2"],
  },
  {
    value: "tonal",
    label: "Tonal",
    description:
      "No edges; cards and floating layers step off the page by " +
      "background tone alone — on a Plain page a shade darker than the " +
      "page in light, lighter in dark. Only floating layers keep a soft " +
      "shadow, from Subtle up.",
    seenIn: ["Material 3"],
  },
]

export const DEPTH_OPTIONS = [
  {
    value: "flat",
    label: "Flat",
    description:
      "The quietest: a lighter edge and the style's smallest shadows.",
  },
  {
    value: "subtle",
    label: "Subtle",
    description:
      "The registry's own look under Hairline — the standard hairline, " +
      "popovers at shadow-md, modals at shadow-lg, cards flat.",
  },
  {
    value: "raised",
    label: "Raised",
    description:
      "A heavier edge and one shadow rung up (cards gain a small one); in " +
      "dark, floating layers step a shade lighter.",
  },
  {
    value: "floating",
    label: "Floating",
    description:
      "The strongest edge and largest shadows — modals up to shadow-2xl.",
  },
]

export const CANVAS_OPTIONS = [
  {
    value: "same",
    label: "Plain",
    description:
      "Page and cards share near-identical whites; cards separate by edge " +
      "or shadow alone.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "tinted",
    label: "Tinted",
    description:
      "A light-gray page with cards on the whitest step (Tonal keeps its " +
      "own card tone). In dark the page stays put and cards and floating " +
      "layers lift one rung further than on Plain.",
    seenIn: ["Apple HIG"],
  },
]

export const MATERIAL_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description: "Popovers, menus, selects and pickers are opaque.",
    seenIn: ["Material 3"],
  },
  {
    value: "glass",
    label: "Glass",
    description:
      "The popover tier at 70% opacity over a 40px blur and 150% " +
      "saturation of what's behind. Modals and drawers stay opaque.",
    seenIn: ["shadcn/ui", "Radix Themes", "Apple HIG"],
  },
]

/* -------------------------------- Recipe --------------------------------- */

export type Mode = "light" | "dark"
export interface PerMode<T> {
  light: T
  dark: T
}

/** A surface color as the engine sees it: a rung of the neutral ramp, a mix
 *  of two rungs, the system's hairline, black at an alpha, or nothing. The
 *  resolver writes it as CSS vars. */
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
/* Adaptive's light edge: Radix Themes' gray-a3 ring lands on rung 100. */
const EDGE_FAINT = [
  mix("50", "100", 50),
  step("100"),
  mix("100", "200", 50),
  step("200"),
]

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
 *  same shadow-md on near-black), harder (a shadow that reads on white
 *  vanishes on near-black; Spectrum's dark drop shadows are ~3× darker), or
 *  tighter — one rung smaller at ~0.4 alpha, the way Primer and Radix Themes
 *  shrink blur while raising alpha in dark. */
type DarkCast = "same" | "harder" | "tighter"

const DARK_ALPHA: Record<DarkCast, number> = { same: 1, harder: 3, tighter: 4 }

const onlyIn =
  (mode: Mode) =>
  (layer: ShadowLayer): ShadowLayer => ({
    offset: layer.offset,
    color: { ...both(NONE), [mode]: layer.color[mode] },
  })

function shadowLayers(
  rung: number,
  weight: number,
  dark: DarkCast,
  layered: boolean,
): ShadowLayer[] {
  if (dark === "tighter")
    return [
      ...shadowLayers(rung, weight, "same", layered).map(onlyIn("light")),
      ...layersAt(rung - 1, weight, DARK_ALPHA.tighter, layered).map(
        onlyIn("dark"),
      ),
    ]
  return layersAt(rung, weight, DARK_ALPHA[dark], layered)
}

function layersAt(
  rung: number,
  weight: number,
  darkAlpha: number,
  layered: boolean,
): ShadowLayer[] {
  const layers = RUNGS[rung] ?? []
  const color = (alpha: number): PerMode<SurfaceColor> => {
    const light = Math.min(alpha * weight, 0.7)
    return {
      light: { kind: "shade", alpha: light },
      dark: { kind: "shade", alpha: Math.min(light * darkAlpha, 0.6) },
    }
  }
  const out: ShadowLayer[] = layers.map(([offset, alpha]) => ({
    offset,
    color: color(alpha),
  }))
  const key = layers[0]
  if (layered && key)
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
        // Shadow-led in light over a faint ring; dark re-weights toward a
        // brighter edge + elevation with a tighter shadow kept.
        edge = {
          light: EDGE_FAINT[d] ?? HAIRLINE,
          dark: EDGE_DARK[Math.min(d + 1, 3)] ?? HAIRLINE,
        }
        ladder = {
          card: [1, 2, 3, 4],
          popover: [3, 4, 5, 6],
          modal: [4, 5, 6, 6],
        }
        dark = "tighter"
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
      default:
        // Tonal: contrast-led in BOTH modes — containers step off the page
        // by background alone, shadows subordinate (floating layers only).
        tonal = floating
          ? ([55, 70, 85, 100][d] ?? 70)
          : ([25, 35, 50, 60][d] ?? 35)
        ladder = {
          card: [0, 0, 0, 0],
          popover: [0, 2, 3, 4],
          modal: [0, 3, 4, 5],
        }
        weight = 0.8
    }

    const shadow = shadowLayers(
      ladder[role][d] ?? 0,
      weight,
      dark,
      state.surfaceStrategy === "shadow",
    )
    // Light lifts via the canvas tint instead, so elevation is dark-only;
    // a tinted canvas lifts cards a full rung there.
    const steps = floating ? OVERLAY_ELEVATION : CARD_ELEVATION
    const lift = Math.min(
      floating ? 2 : 1 + (tinted ? 1 : 0),
      elevation + (tinted ? (floating ? 1 : 2) : 0),
    )
    const bg: PerMode<SurfaceColor> =
      tonal !== null
        ? both(mix("50", "100", 100 - tonal))
        : {
            light: tinted ? step("25") : step("50"),
            dark: steps[lift] ?? step("50"),
          }

    return { edge, bg, shadow }
  }

  return {
    page: {
      light: tinted ? mix("50", "100", 50) : step("25"),
      dark: step("25"),
    },
    card: look("card"),
    popover: look("popover"),
    modal: look("modal"),
    glass: state.surfaceMaterial === "glass",
  }
}

/* ----------------------------- Serialization ----------------------------- */

/** How a SurfaceColor's references resolve: to CSS vars (the resolver) or to
 *  a mode's solved scales (tests). */
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
  const { page, card, popover, modal, glass } = surfaceRecipe(state)
  return {
    "--card-border": pairCss(card.edge),
    "--overlay-border": pairCss(popover.edge),
    "--shadow-card": shadowCss(card.shadow, pairCss),
    "--shadow-popover": shadowCss(popover.shadow, pairCss),
    "--shadow-modal": shadowCss(modal.shadow, pairCss),
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

export const SURFACE_SPEC = {
  label: "Surfaces",
  description:
    "How cards and floating layers (popovers, menus, modals) separate " +
    "from the page: which means leads — edge, shadow or tone — and how it " +
    "translates to dark, how strong it is, the page behind them, the " +
    "popover material, and each mode's background lightness.",
  axes: {
    surfaceStrategy: {
      label: "Style",
      description:
        "Which means separates surfaces from the page, with its dark-mode " +
        "translation built in — shadows barely read on near-black, so each " +
        "style decides what replaces them.",
      value: { type: "enum", options: STRATEGY_OPTIONS },
      guidance:
        "Of 9 systems checked: shadcn/ui, Geist and Linear are edge-led in " +
        "both modes (Linear barely uses shadows and lifts dark surfaces by " +
        "lightness: Hairline at Raised is closest, the first depth where " +
        "floating layers step lighter in dark, at the cost of a small card " +
        "shadow); Primer, Radix Themes and Atlassian lean on shadows in light " +
        "and turn up edges or surface lightness in dark; Fluent 2 and " +
        "Spectrum 2 stay shadow-led and darken shadows 2–3× in dark; " +
        "Material 3 separates by surface tone. Hairline suits dense tool " +
        "UIs, Shadow and Adaptive softer consumer products, Tonal a " +
        "Material look.",
    },
    surfaceDepth: {
      label: "Depth",
      description:
        "The one intensity lever: edge weight, shadow size and dark-mode " +
        "lift move together, for every surface role at once.",
      value: { type: "enum", options: DEPTH_OPTIONS },
      guidance:
        "Fluent 2 ships six shadow steps and Primer splits resting from " +
        "floating shadows; here the roles keep their order and Depth moves " +
        "the whole ladder. Flat or Subtle for tools and dashboards, Raised " +
        "or Floating when cards are the interface (boards, feeds).",
    },
    surfaceCanvas: {
      label: "Page",
      description:
        "Whether the page is the same white as its cards or a tinted gray " +
        "they lift off.",
      value: { type: "enum", options: CANVAS_OPTIONS },
      guidance:
        "shadcn/ui's page and card share one white; Apple HIG pairs a " +
        "gray grouped background with white rows, and Atlassian's sunken " +
        "surface makes the same move for wells like Kanban columns. Tinted " +
        "suits settings pages and card-heavy dashboards; Plain suits " +
        "document-like pages.",
    },
    surfaceMaterial: {
      label: "Glass",
      description:
        "Whether the popover tier — menus, selects, comboboxes, pickers, " +
        "popovers — is opaque or translucent over a blur.",
      value: { type: "enum", options: MATERIAL_OPTIONS },
      guidance:
        "shadcn/ui offers translucent menus as a builder option (off by " +
        "default); Radix Themes defaults its panels — cards, dialogs and " +
        "menus — to translucent; Apple HIG puts popovers on Liquid Glass. " +
        "Glass only shows over content: on a plain page it reads as a " +
        "slightly grayer solid.",
    },
    modes: {
      label: "Backgrounds",
      description:
        "Each mode's page background lightness (CIELAB L*). The color " +
        "engine rebuilds every ramp around it, so surfaces, borders and " +
        "text keep their contrast.",
      value: {
        type: "json",
        shape:
          "[{ id, name, polarity: 'light' | 'dark', bg }] — one entry per " +
          `polarity. bg is L*: light ${MODE_BG_RANGE.light.min}–` +
          `${MODE_BG_RANGE.light.max} (default 99), dark ` +
          `${MODE_BG_RANGE.dark.min}–${MODE_BG_RANGE.dark.max} (default 2; ` +
          `0 is OLED black), in steps of ${MODE_BG_RANGE.step}.`,
      },
      guidance:
        "Material 3 sets the light page at tone 98 and dark at tone 6 " +
        "(tone ≈ L*); shadcn/ui's dark background is oklch 0.145 (≈ L* 3); " +
        "Geist's dark page is pure black. 2–6 keeps dark shadows and " +
        "lifted surfaces readable; 0 suits OLED or cinematic looks; a " +
        "light page under 97 reads as tinted gray.",
    },
  },
} satisfies ChapterSpec<typeof SURFACE_DEFAULTS>
