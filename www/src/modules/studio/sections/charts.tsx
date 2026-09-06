"use client"

/* Charts — the data-viz look. Two axes: the categorical series palette (mono
   = brand tints, vivid and muted = hues spread around the brand — the
   strategies real systems pick between) and the gridline treatment (solid /
   dashed / none). The hero is engine-true: its series are the `--chart-*`
   colors the recipe generates for the brand, in the page's mode. */

import { useMemo } from "react"
import { useTheme } from "starter-themes"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import {
  chartPaletteOf,
  GRID_OPTIONS,
  gridOption,
  PALETTE_OPTIONS,
  paletteOption,
} from "../axes/charts"
import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio, StudioState } from "../state"

/** The first series colors the recipe generates for the brand, per mode. */
function useChartSeries(state: StudioState, count: number): string[] {
  const { resolvedTheme } = useTheme()
  const config = useMemo(
    (): ColorConfig => ({
      v: 2,
      seeds: { accent: state.brand },
      chartPalette: chartPaletteOf(state.chartPalette),
    }),
    [state.brand, state.chartPalette],
  )
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  return resolveColorConfigCached(config).charts[mode].categorical.slice(
    0,
    count,
  )
}

type Point = [number, number]

/** A Catmull-Rom curve through the points — the `natural` interpolation the
 *  registry charts default to. */
export function smoothPath(points: Point[]): string {
  const first = points[0]
  if (!first) return ""
  let d = `M${first[0]} ${first[1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i] ?? first
    const p0 = points[i - 1] ?? p1
    const p2 = points[i + 1] ?? p1
    const p3 = points[i + 2] ?? p2
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${
      p2[0] - (p3[0] - p1[0]) / 6
    } ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`
  }
  return d
}

const W = 220
const H = 96

/** y values per series on a shared x grid, staying inside the frame. */
const SERIES: number[][] = [
  [72, 46, 58, 30, 40, 16],
  [84, 70, 62, 66, 50, 44],
  [56, 62, 78, 74, 84, 68],
]

export function seriesPoints(values: number[]): Point[] {
  return values.map((y, i) => [8 + (i * (W - 16)) / (values.length - 1), y])
}

export function ChartsHero({ state }: { state: StudioState }) {
  const colors = useChartSeries(state, SERIES.length)
  const grid = state.chartGrid
  return (
    <Hero className="items-center gap-3 py-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-56" fill="none" aria-hidden>
        {grid !== "none" &&
          [16, 48, 80].map((y) => (
            <line
              key={y}
              x1="4"
              x2={W - 4}
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeOpacity="0.6"
              strokeDasharray={grid === "dashed" ? "3 3" : undefined}
            />
          ))}
        {SERIES.map((values, i) => (
          <path
            key={i}
            d={smoothPath(seriesPoints(values))}
            stroke={colors[i]}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <span className="flex items-center gap-3">
        {["Revenue", "Costs", "Users"].map((label, i) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-xs text-fg-muted"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            {label}
          </span>
        ))}
      </span>
    </Hero>
  )
}

/** Collapsed-row summary: the palette strategy and the grid. */
export function chartsSummary(state: StudioState): string {
  const palette = paletteOption(state.chartPalette)
  const grid = gridOption(state.chartGrid)
  return `${PALETTE_OPTIONS.find((o) => o.value === palette)?.label} · ${
    GRID_OPTIONS.find((o) => o.value === grid)?.label
  }`
}

export function ChartsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <ChartsHero state={state} />
      <SegmentedControlRow
        label="Palette"
        value={paletteOption(state.chartPalette)}
        onChange={set("chartPalette")}
        options={PALETTE_OPTIONS}
      />
      <SegmentedControlRow
        label="Grid"
        value={gridOption(state.chartGrid)}
        onChange={set("chartGrid")}
        options={GRID_OPTIONS}
      />
    </ControlGroup>
  )
}
