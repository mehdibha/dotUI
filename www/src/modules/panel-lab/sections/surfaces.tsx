"use client"

/* Surfaces — how elevated surfaces separate from the page (issue #590).
   Six axes, each a decision an author makes — never a resolver parameter:

   - Separation: which means leads (edge, shadow, contrast) and how it shifts
     per mode. Dark behavior lives INSIDE the option — shadows die on
     near-black, so every strategy encodes its own dark translation instead
     of exposing it as a knob. The 12-system Opus survey (2026-08-09) found
     ZERO systems whose divergence falls outside that pattern, and no theme
     builder exposes per-mode surface controls. References per the survey:
     Hairline ≈ shadcn/Geist (hairline leads both modes, stronger in dark),
     Adaptive ≈ Radix Themes/Primer/Atlassian (shadow-led light → hairline +
     elevation dark), Shadow ≈ Fluent 2/Spectrum 2 (shadows strengthen in
     dark), Outline ≈ Linear, Tonal ≈ Material 3 (bgStep-led in BOTH modes,
     containers darker than the page in light — the inverse of every other
     strategy, so it bypasses the dark-only elevation ladder entirely).
   - Depth: the one intensity lever. Hairline ink, shadow scale and dark
     elevation move together, each strategy defining what "deeper" means.
   - Shadow: the shadow's character, orthogonal to Depth — Plain single-layer
     black alpha (shadcn), Tinted with the neutral ink (Radix Themes
     gray-scale-tinted; Stripe tints with brand), Layered key + ambient pair
     (Material 3). Depth keeps owning size and intensity.
   - Edge: how the surface/panel roles draw their hairline — border inside
     the box (dotUI today) vs ring outside it (all 8 shadcn styles render
     overlays ring + shadow, zero border — issue #581).
   - Canvas: the page↔surface relationship — white-on-white, or a tinted
     page surfaces lift off (gray canvas in light, elevated cards in dark).
   - Material: solid or glass overlays — the grouped tweak.

   Every combination is coherent by construction, so there are no conditional
   rows and nothing to caption. The hero renders both modes at once,
   engine-true: a recipe that breaks in dark is this axis's whole failure
   mode, so the tiles are read together, never toggled. */

import { useMemo } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

import { HeroModes } from "../hero"
import { ControlGroup, ROW, ROW_LABEL, SegmentedControlRow } from "../rows"
import type { SegmentedRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { useModeTheme } from "./color"

export const SURFACE_DEFAULTS = {
  surfaceStrategy: "hairline",
  surfaceDepth: "subtle",
  surfaceShadow: "plain",
  surfaceEdge: "border",
  surfaceCanvas: "same",
  surfaceMaterial: "solid",
}

const STRATEGY_OPTIONS: SegmentedRowOption[] = [
  { value: "hairline", label: "Hairline" },
  { value: "adaptive", label: "Adaptive" },
  { value: "shadow", label: "Shadow" },
  { value: "outline", label: "Outline" },
  { value: "tonal", label: "Tonal" },
]

const DEPTH_OPTIONS: SegmentedRowOption[] = [
  { value: "flat", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "raised", label: "Raised" },
  { value: "floating", label: "Floating" },
]

const SHADOW_OPTIONS: SegmentedRowOption[] = [
  { value: "plain", label: "Plain" },
  { value: "tinted", label: "Tinted" },
  { value: "layered", label: "Layered" },
]

const EDGE_OPTIONS: SegmentedRowOption[] = [
  { value: "border", label: "Border" },
  { value: "ring", label: "Ring" },
]

const CANVAS_OPTIONS: SegmentedRowOption[] = [
  { value: "same", label: "Same" },
  { value: "tinted", label: "Tinted" },
]

const MATERIAL_OPTIONS: SegmentedRowOption[] = [
  { value: "solid", label: "Solid" },
  { value: "glass", label: "Glass" },
]

/* ------------------------------- Resolver --------------------------------- */

const DEPTHS = ["flat", "subtle", "raised", "floating"]

/** One resolved surface treatment: what the tile actually paints. */
interface SurfaceLook {
  bg: string
  borderColor?: string
  boxShadow?: string
  backdropFilter?: string
}

/** Shadow ladder — size 0 is none; dark scales alpha up (a shadow that reads
 *  on white disappears on near-black). Character re-colors and layers the
 *  same ladder — Depth keeps owning size and intensity. */
function shadowCss(
  kind: "card" | "floating",
  size: number,
  weight: number,
  dark: boolean,
  character: string,
  ink: string,
): string | undefined {
  if (size <= 0) return undefined
  const spec =
    kind === "card"
      ? ["0 1px 2px", "0 1px 3px", "0 2px 8px -2px"][size - 1]
      : ["0 2px 8px -2px", "0 8px 24px -6px", "0 16px 40px -8px"][size - 1]
  const base =
    kind === "card" ? [0.05, 0.07, 0.09][size - 1] : [0.1, 0.16, 0.25][size - 1]
  const alpha = Math.min((base ?? 0) * weight * (dark ? 2.2 : 1), 0.7)
  // Tint only reads in light — a dark-mode shadow stays black either way.
  // The ink is lighter than pure black, so the alpha compensates upward.
  const color = (a: number) =>
    character === "tinted" && !dark
      ? `color-mix(in srgb, ${ink} ${Math.round(Math.min(a * 1.25, 0.8) * 100)}%, transparent)`
      : `rgb(0 0 0 / ${a.toFixed(2)})`
  if (character === "layered") {
    // M3 pair: the crisp key keeps the ladder spec, the ambient spreads soft.
    const ambient =
      kind === "card"
        ? ["0 1px 3px 1px", "0 2px 6px 2px", "0 4px 10px 3px"][size - 1]
        : ["0 4px 10px 3px", "0 8px 24px 4px", "0 12px 36px 6px"][size - 1]
    return `${spec} ${color(alpha)}, ${ambient} ${color(alpha * 0.55)}`
  }
  return `${spec} ${color(alpha)}`
}

/**
 * The whole axis in one place: each strategy resolves edge, shadow role and
 * dark elevation together from the depth lever, so no combination of the four
 * axes can contradict itself. `ink` is the mode's strongest neutral.
 */
function surfaceLook(
  state: LabState,
  kind: "card" | "floating",
  dark: boolean,
  scales: Record<string, Record<string, string> | undefined>,
  background: string,
): SurfaceLook {
  const d = Math.max(0, DEPTHS.indexOf(state.surfaceDepth))
  const neutral = scales.neutral ?? {}
  const base = neutral["50"] ?? background
  const ink = neutral["950"] ?? background
  const hairline = (alpha: number) =>
    `color-mix(in srgb, ${ink} ${alpha}%, transparent)`
  const floating = kind === "floating"

  let borderColor: string | undefined
  let shadowSize = 0
  let shadowWeight = 1
  /* Dark-mode elevation steps this strategy adds at this depth. */
  let strategyElev = 0
  /* Tonal only: % of the neutral-100 step mixed into the page base. */
  let tonalMix: number | null = null

  if (state.surfaceStrategy === "hairline") {
    // Edge-led: the border does the work in both modes, shadows stay
    // subordinate and vanish entirely at flat.
    borderColor = hairline([7, 9, 11, 13][d] ?? 9)
    shadowSize = floating ? d : Math.max(0, d - 1)
    shadowWeight = 0.8
    if (dark && floating && d >= 2) strategyElev = 1
  } else if (state.surfaceStrategy === "adaptive") {
    // Shadow-only in light; dark swaps the means to hairline + elevation.
    if (dark) {
      borderColor = hairline([9, 11, 13, 15][d] ?? 11)
      if (floating && d >= 1) strategyElev = 1
    } else {
      shadowSize = floating ? Math.max(1, d) : ([1, 1, 1, 2][d] ?? 1)
    }
  } else if (state.surfaceStrategy === "shadow") {
    // Depth-led: real shadows even at flat, elevation carries dark.
    shadowSize = floating ? ([1, 2, 3, 3][d] ?? 2) : ([1, 1, 2, 2][d] ?? 1)
    shadowWeight = 1.3
    if (dark) strategyElev = (floating ? 1 : 0) + (d >= 2 ? 1 : 0)
  } else if (state.surfaceStrategy === "tonal") {
    // Contrast-led in BOTH modes: containers step off the page by background
    // alone — darker than the page in light, lighter in dark — borders absent
    // and shadows subordinate (floating layers only, never cards).
    tonalMix = floating
      ? ([55, 70, 85, 100][d] ?? 70)
      : ([25, 35, 50, 60][d] ?? 35)
    shadowSize = floating ? ([0, 1, 1, 2][d] ?? 1) : 0
    shadowWeight = 0.8
  } else {
    // Outline: solid near-bg step on overlays + heavy shadow.
    borderColor = floating
      ? dark
        ? hairline(24)
        : (neutral["200"] ?? background)
      : hairline(dark ? 10 : 8)
    shadowSize = floating ? ([1, 2, 3, 3][d] ?? 2) : ([0, 1, 2, 2][d] ?? 1)
    shadowWeight = 1.5
    if (dark && floating && d >= 1) strategyElev = 1
  }

  // Light lifts via the canvas tint instead, so elevation is dark-only.
  // Cards cap a step below floating surfaces so the ladder never flattens.
  const canvasElev = dark && state.surfaceCanvas === "tinted" ? 1 : 0
  const elev = Math.min(floating ? 2 : 1, canvasElev + strategyElev)
  const lifted =
    tonalMix !== null
      ? `color-mix(in oklab, ${base} ${100 - tonalMix}%, ${neutral["100"] ?? base})`
      : elev === 0
        ? base
        : elev === 1
          ? `color-mix(in oklab, ${base} 50%, ${neutral["100"] ?? base})`
          : (neutral["100"] ?? base)

  const glass = floating && state.surfaceMaterial === "glass"
  // Ring redraws the strategy's hairline outside the box (#581) — a strategy
  // that paints no edge has nothing to convert.
  const ring = state.surfaceEdge === "ring" ? borderColor : undefined
  const shadow = shadowCss(
    kind,
    shadowSize,
    shadowWeight,
    dark,
    state.surfaceShadow,
    ink,
  )
  return {
    bg: glass ? `color-mix(in srgb, ${lifted} 72%, transparent)` : lifted,
    backdropFilter: glass ? "blur(8px)" : undefined,
    boxShadow: ring
      ? [`0 0 0 1px ${ring}`, shadow].filter(Boolean).join(", ")
      : shadow,
    borderColor: ring ? undefined : borderColor,
  }
}

/* ---------------------------------- Hero ----------------------------------- */

/** One mode's stack: the page carrying a card, and a floating menu straddling
 *  the card's edge so the treatment is read against both surfaces at once. */
function SurfaceTile({
  label,
  icon: Icon,
  dark,
  state,
  scales,
  background,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  dark: boolean
  state: LabState
  scales: Record<string, Record<string, string> | undefined>
  background: string
}) {
  const fg = scales.neutral?.["900"] ?? background
  const accent = scales.accent?.["700"] ?? background
  // Tinted canvas: gray page in light; dark keeps the page deep and lifts
  // the surfaces instead (the elevation half lives in surfaceLook).
  const page =
    !dark && state.surfaceCanvas === "tinted"
      ? `color-mix(in oklab, ${background} 50%, ${scales.neutral?.["100"] ?? background})`
      : background
  const card = surfaceLook(state, "card", dark, scales, background)
  const menu = surfaceLook(state, "floating", dark, scales, background)
  const border = (look: SurfaceLook) =>
    look.borderColor
      ? { border: `1px solid ${look.borderColor}` }
      : { border: "1px solid transparent" }

  return (
    <div
      className="flex-1 overflow-hidden rounded-xl border border-border/45"
      style={{ backgroundColor: page, color: fg }}
    >
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="flex items-center gap-1.5 opacity-60">
          <Icon className="size-3" />
          <span className="text-[10px] font-medium">{label}</span>
        </span>
      </div>
      <div className="relative mx-3 mt-2 mb-3 h-24">
        <div
          className="absolute inset-x-0 top-0 h-14 rounded-lg p-2"
          style={{
            backgroundColor: card.bg,
            boxShadow: card.boxShadow,
            ...border(card),
          }}
        >
          <span className="block h-1.5 w-1/2 rounded-full bg-current opacity-70" />
          <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-current opacity-25" />
          <span
            aria-hidden
            className="absolute top-2 right-2 size-4 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
        <div
          className="absolute top-8 right-4 flex w-20 flex-col gap-1 rounded-md p-1.5"
          style={{
            backgroundColor: menu.bg,
            boxShadow: menu.boxShadow,
            backdropFilter: menu.backdropFilter,
            ...border(menu),
          }}
        >
          <span className="flex h-3.5 items-center rounded-sm bg-current/10 px-1">
            <span className="block h-1 w-3/4 rounded-full bg-current opacity-60" />
          </span>
          <span className="block h-1 w-1/2 rounded-full bg-current opacity-25" />
          <span className="block h-1 w-2/3 rounded-full bg-current opacity-25" />
        </div>
      </div>
    </div>
  )
}

/** Five named options don't fit beside a label at row width, so the strategy
 *  row stacks: label line on top, full-width segments beneath. */
function StackedSegmentedRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SegmentedRowOption[]
}) {
  return (
    <div
      data-row=""
      className={cn(ROW, "flex h-auto flex-col items-stretch gap-2 px-4 py-3")}
    >
      <span className={ROW_LABEL}>{label}</span>
      <SegmentedControl
        aria-label={label}
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) onChange(next as string)
        }}
        className="w-full bg-bg/50 p-0.5"
      >
        {options.map((option) => (
          <SegmentedControlItem
            key={option.value}
            id={option.value}
            className="flex-1 justify-center text-xs"
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

/** The chapter specimen: both polarities side by side — "right in light,
 *  wrong in dark" is the failure mode being shopped for. */
export function SurfacesHero({ state }: { state: LabState }) {
  const modes = state.modes
  const lightMode = useMemo(
    () => modes.find((mode) => mode.polarity === "light"),
    [modes],
  )
  const darkMode = useMemo(
    () => modes.find((mode) => mode.polarity === "dark"),
    [modes],
  )
  const light = useModeTheme(state, lightMode)
  const darkTheme = useModeTheme(state, darkMode)

  return (
    <HeroModes>
      {light && lightMode && (
        <SurfaceTile
          label={lightMode.name}
          icon={SunIcon}
          dark={false}
          state={state}
          scales={light.scales}
          background={light.background}
        />
      )}
      {darkTheme && darkMode && (
        <SurfaceTile
          label={darkMode.name}
          icon={MoonIcon}
          dark
          state={state}
          scales={darkTheme.scales}
          background={darkTheme.background}
        />
      )}
    </HeroModes>
  )
}

/** Collapsed-row summary: the separation strategy, and the floating material. */
export function surfacesSummary(state: LabState): string {
  const strategy =
    STRATEGY_OPTIONS.find((o) => o.value === state.surfaceStrategy)?.label ??
    state.surfaceStrategy
  const material =
    MATERIAL_OPTIONS.find((o) => o.value === state.surfaceMaterial)?.label ??
    state.surfaceMaterial
  return `${strategy} · ${material}`
}

export function SurfacesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SurfacesHero state={state} />
      <ControlGroup>
        <StackedSegmentedRow
          label="Separation"
          value={state.surfaceStrategy}
          onChange={set("surfaceStrategy")}
          options={STRATEGY_OPTIONS}
        />
        <SegmentedControlRow
          label="Depth"
          value={state.surfaceDepth}
          onChange={set("surfaceDepth")}
          options={DEPTH_OPTIONS}
        />
        <SegmentedControlRow
          label="Shadow"
          value={state.surfaceShadow}
          onChange={set("surfaceShadow")}
          options={SHADOW_OPTIONS}
        />
        <SegmentedControlRow
          label="Edge"
          value={state.surfaceEdge}
          onChange={set("surfaceEdge")}
          options={EDGE_OPTIONS}
        />
        <SegmentedControlRow
          label="Canvas"
          value={state.surfaceCanvas}
          onChange={set("surfaceCanvas")}
          options={CANVAS_OPTIONS}
        />
        <SegmentedControlRow
          label="Material"
          description="Menus, popovers and tooltips."
          value={state.surfaceMaterial}
          onChange={set("surfaceMaterial")}
          options={MATERIAL_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}
