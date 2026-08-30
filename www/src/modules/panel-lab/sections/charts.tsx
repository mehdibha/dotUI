"use client"

/* Charts — the data-viz look. Three axes: the categorical series palette
   (auto = hues rotated from the brand seed, vivid and muted fixed sets, mono
   = brand tints — the strategies real systems pick between), the line curve
   (smooth vs linear), and the gridline treatment (dashed / solid / none).
   Schematic on purpose: the real chart-color engine is queued for a rewrite;
   this section pins down the axes it must serve. */

import { toHex, toOklch } from "@dotui/colors"

import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Lab, LabState } from "../state"

export const CHART_DEFAULTS = {
  chartPalette: "auto",
  chartCurve: "smooth",
  chartGrid: "dashed",
}

const PALETTE_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "vivid", label: "Vivid" },
  { value: "muted", label: "Muted" },
  { value: "mono", label: "Mono" },
]

const CURVE_OPTIONS = [
  { value: "smooth", label: "Smooth" },
  { value: "linear", label: "Linear" },
]

const GRID_OPTIONS = [
  { value: "dashed", label: "Dashed" },
  { value: "solid", label: "Solid" },
  { value: "none", label: "None" },
]

const VIVID = ["#4E80EE", "#2EBD85", "#F5A524", "#E5484D"]
const MUTED = ["#7C90C1", "#7FAE94", "#C0A47E", "#B98F9C"]

/** The categorical series colors the palette strategy resolves to. */
export function chartSeries(state: LabState): string[] {
  const brand = state.brand
  switch (state.chartPalette) {
    case "vivid":
      return VIVID
    case "muted":
      return MUTED
    case "mono":
      return [100, 65, 40, 22].map(
        (pct) => `color-mix(in oklab, ${brand} ${pct}%, transparent)`,
      )
    default: {
      const seed = toOklch(brand)
      return [0, 75, 160, 250].map((shift) =>
        toHex({ ...seed, h: ((seed.h ?? 0) + shift) % 360 }),
      )
    }
  }
}

type Point = [number, number]

export function linePath(points: Point[], smooth: boolean): string {
  const first = points[0]
  if (!first) return ""
  if (!smooth) return `M${points.map((p) => `${p[0]} ${p[1]}`).join(" L")}`
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

export function ChartsHero({ state }: { state: LabState }) {
  const colors = chartSeries(state)
  const smooth = state.chartCurve === "smooth"
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
              strokeDasharray={grid === "dashed" ? "3 4" : undefined}
            />
          ))}
        {SERIES.map((values, i) => (
          <path
            key={i}
            d={linePath(seriesPoints(values), smooth)}
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

/** Collapsed-row summary: the palette strategy and the curve. */
export function chartsSummary(state: LabState): string {
  const palette =
    PALETTE_OPTIONS.find((o) => o.value === state.chartPalette)?.label ??
    state.chartPalette
  const curve =
    CURVE_OPTIONS.find((o) => o.value === state.chartCurve)?.label ??
    state.chartCurve
  return `${palette} · ${curve}`
}

export function ChartsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ChartsHero state={state} />
      <SegmentedControlRow
        label="Palette"
        value={state.chartPalette}
        onChange={set("chartPalette")}
        options={PALETTE_OPTIONS}
      />
      <SegmentedControlRow
        label="Curve"
        value={state.chartCurve}
        onChange={set("chartCurve")}
        options={CURVE_OPTIONS}
      />
      <SegmentedControlRow
        label="Grid"
        value={state.chartGrid}
        onChange={set("chartGrid")}
        options={GRID_OPTIONS}
      />
    </ControlGroup>
  )
}
