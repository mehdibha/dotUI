"use client"

/* Surfaces — how elevated surfaces separate from the page (issue #590).
   Four axes, each a decision an author makes — never a resolver parameter:

   - Separation: which means leads (edge, shadow, contrast) and how it shifts
     per mode. Dark behavior lives INSIDE the option — shadows die on
     near-black, so every strategy encodes its own dark translation instead
     of exposing it as a knob. The 12-system Opus survey (2026-08-09) found
     ZERO systems whose divergence falls outside that pattern, and no theme
     builder exposes per-mode surface controls. References per the survey:
     Hairline ≈ shadcn/Geist (hairline leads both modes, stronger in dark),
     Adaptive ≈ Radix Themes/Primer/Atlassian (shadow-led light → hairline +
     elevation dark), Shadow ≈ Fluent 2/Spectrum 2 (shadows strengthen in
     dark), Outline ≈ Linear. Material's tonal model (bgStep-led in BOTH
     modes, containers darker than the page in light) is the one strategy
     not covered — candidate fifth option, not yet approved.
   - Depth: the one intensity lever. Hairline ink, shadow scale and dark
     elevation move together, each strategy defining what "deeper" means.
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
import {
  ControlGroup,
  ROW,
  ROW_LABEL,
  SegmentedControlRow,
} from "@/modules/control-lab/rows"
import type { SegmentedRowOption } from "@/modules/control-lab/rows"

import { HeroModes } from "../hero"
import type { Lab, LabState } from "../state"
import { useModeTheme } from "./color"

export const SURFACE_DEFAULTS = {
  surfaceStrategy: "hairline",
  surfaceDepth: "subtle",
  surfaceCanvas: "same",
  surfaceMaterial: "solid",
}

const STRATEGY_OPTIONS: SegmentedRowOption[] = [
  { value: "hairline", label: "Hairline" },
  { value: "adaptive", label: "Adaptive" },
  { value: "shadow", label: "Shadow" },
  { value: "outline", label: "Outline" },
]

const DEPTH_OPTIONS: SegmentedRowOption[] = [
  { value: "flat", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "raised", label: "Raised" },
  { value: "floating", label: "Floating" },
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
 *  on white disappears on near-black). */
function shadowCss(
  kind: "card" | "floating",
  size: number,
  weight: number,
  dark: boolean,
): string | undefined {
  if (size <= 0) return undefined
  const spec =
    kind === "card"
      ? ["0 1px 2px", "0 1px 3px", "0 2px 8px -2px"][size - 1]
      : ["0 2px 8px -2px", "0 8px 24px -6px", "0 16px 40px -8px"][size - 1]
  const base =
    kind === "card" ? [0.05, 0.07, 0.09][size - 1] : [0.1, 0.16, 0.25][size - 1]
  const alpha = Math.min((base ?? 0) * weight * (dark ? 2.2 : 1), 0.7)
  return `${spec} rgb(0 0 0 / ${alpha.toFixed(2)})`
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
    elev === 0
      ? base
      : elev === 1
        ? `color-mix(in oklab, ${base} 50%, ${neutral["100"] ?? base})`
        : (neutral["100"] ?? base)

  const glass = floating && state.surfaceMaterial === "glass"
  return {
    bg: glass ? `color-mix(in srgb, ${lifted} 72%, transparent)` : lifted,
    backdropFilter: glass ? "blur(8px)" : undefined,
    boxShadow: shadowCss(kind, shadowSize, shadowWeight, dark),
    borderColor,
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

/** Four named options don't fit beside a label at row width, so the strategy
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

export function SurfacesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
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
    <>
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
