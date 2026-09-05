"use client"

/* Surfaces — the chapter's panel. The recipe lives in the axis module; this
   file paints it. The hero renders both modes at once, engine-true: a recipe
   that breaks in dark is this axis's whole failure mode, so the tiles are
   read together, never toggled. */

import { useMemo } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

import {
  CANVAS_OPTIONS,
  DEPTH_OPTIONS,
  EDGE_OPTIONS,
  GLASS_BACKDROP_FILTER,
  glassCss,
  MATERIAL_OPTIONS,
  SHADOW_OPTIONS,
  shadowCss,
  STRATEGY_OPTIONS,
  SURFACE_DEFAULTS,
  surfaceColorCss,
  surfaceRecipe,
} from "../axes/surfaces"
import type { Mode, SurfaceLook, SurfacePalette } from "../axes/surfaces"
import { HeroModes } from "../hero"
import { DetailRow } from "../patterns"
import { ControlGroup, ROW, ROW_LABEL, SegmentedControlRow } from "../rows"
import type { SegmentedRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { useModeTheme } from "./color"

/* ---------------------------------- Hero ----------------------------------- */

type Scales = Record<string, Record<string, string> | undefined>

/** One mode's stack: the page carrying a card, and a floating menu straddling
 *  the card's edge so the treatment is read against both surfaces at once. */
function SurfaceTile({
  label,
  icon: Icon,
  mode,
  state,
  scales,
  background,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  mode: Mode
  state: LabState
  scales: Scales
  background: string
}) {
  const neutral = (step: string) => scales.neutral?.[step] ?? background
  const palette: SurfacePalette = {
    step: neutral,
    // Mirrors `color-border` in registry/theme/semantics.ts.
    hairline:
      mode === "light"
        ? `color-mix(in oklab, ${neutral("200")} 50%, ${neutral("300")})`
        : `color-mix(in oklab, ${neutral("100")} 50%, ${neutral("200")})`,
    ink: neutral("950"),
  }
  const { page, card, popover, glass } = surfaceRecipe(state)
  const paint = (look: SurfaceLook) => ({
    backgroundColor: surfaceColorCss(look.bg[mode], palette),
    border: `1px solid ${surfaceColorCss(look.edge[mode], palette)}`,
    boxShadow: shadowCss(look.shadow, (color) =>
      surfaceColorCss(color[mode], palette),
    ),
  })
  const menu = paint(popover)
  if (glass) {
    menu.backgroundColor = glassCss(menu.backgroundColor)
  }
  const fg = neutral("900")
  const accent = scales.accent?.["700"] ?? background

  return (
    <div
      className="flex-1 overflow-hidden rounded-xl border border-border/45"
      style={{
        backgroundColor: surfaceColorCss(page[mode], palette),
        color: fg,
      }}
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
          style={paint(card)}
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
            ...menu,
            backdropFilter: glass ? GLASS_BACKDROP_FILTER : undefined,
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
          mode="light"
          state={state}
          scales={light.scales}
          background={light.background}
        />
      )}
      {darkTheme && darkMode && (
        <SurfaceTile
          label={darkMode.name}
          icon={MoonIcon}
          mode="dark"
          state={state}
          scales={darkTheme.scales}
          background={darkTheme.background}
        />
      )}
    </HeroModes>
  )
}

const label = (options: SegmentedRowOption[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

/** Collapsed-row summary: the separation strategy, and the floating material. */
export function surfacesSummary(state: LabState): string {
  return `${label(STRATEGY_OPTIONS, state.surfaceStrategy)} · ${label(MATERIAL_OPTIONS, state.surfaceMaterial)}`
}

const DETAIL_ROWS = [
  { key: "surfaceShadow", label: "Shadow", options: SHADOW_OPTIONS },
  { key: "surfaceEdge", label: "Edge", options: EDGE_OPTIONS },
  { key: "surfaceCanvas", label: "Canvas", options: CANVAS_OPTIONS },
] as const

export function SurfacesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const details = DETAIL_ROWS.filter(
    (row) => state[row.key] !== SURFACE_DEFAULTS[row.key],
  ).map((row) => label(row.options, state[row.key]))
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
          label="Material"
          description="Menus, popovers and dialogs."
          value={state.surfaceMaterial}
          onChange={set("surfaceMaterial")}
          options={MATERIAL_OPTIONS}
        />
      </ControlGroup>
      <DetailRow
        label="Details"
        summary={details.length > 0 ? details.join(" · ") : "Default"}
      >
        {DETAIL_ROWS.map((row) => (
          <SegmentedControlRow
            key={row.key}
            label={row.label}
            value={state[row.key]}
            onChange={set(row.key)}
            options={row.options}
          />
        ))}
      </DetailRow>
    </>
  )
}
