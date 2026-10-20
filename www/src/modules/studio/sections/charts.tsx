"use client"

/* Charts: palette and the chart look; the chart's Motion row is Motion's. */

import { cn } from "@/registry/lib/utils"

import {
  AREA_OPTIONS,
  AXES_OPTIONS,
  BARS_OPTIONS,
  GRID_OPTIONS,
  LEGEND_OPTIONS,
  LINES_OPTIONS,
  PALETTE_OPTIONS,
} from "../axes/charts.meta"
import type { Option } from "../axes/core/meta"
import { DialGlyph, DialSelect } from "../dial"
import type { RowMap } from "../row-host"
import type { AxisKey } from "../use-axis"

/* Mono rides the real accent; vivid and muted spread fixed hues at high and
   low chroma, the strategy rather than the engine's exact output. */
const MONO = ["bg-accent", "bg-accent/60", "bg-accent/30"]
const SERIES: Record<string, string[]> = {
  mono: MONO,
  vivid: [
    "bg-[oklch(0.65_0.2_30)]",
    "bg-[oklch(0.65_0.2_150)]",
    "bg-[oklch(0.65_0.2_270)]",
  ],
  muted: [
    "bg-[oklch(0.65_0.08_30)]",
    "bg-[oklch(0.65_0.08_150)]",
    "bg-[oklch(0.65_0.08_270)]",
  ],
}

function SeriesGlyph({ palette }: { palette: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {(SERIES[palette] ?? MONO).map((color) => (
        <span key={color} className={cn("size-2.5 rounded-full", color)} />
      ))}
    </span>
  )
}

const CURVE = "M3 16C6 16 7 8 11 8s5 6 10 2"
const POLYLINE = "M3 16 8 9l5 4 8-7"

const GLYPHS: Record<string, React.ReactNode> = {
  "chartAxes:minimal": <path d="M5 21h1m5 0h1m5 0h1" opacity=".6" />,
  "chartAxes:labeled": (
    <path d="M2 6h2m-2 6h2m-2 6h2M8 21h1m5 0h1m5 0h1" opacity=".6" />
  ),
  "chartGrid:lines": <path d="M3 7h18M3 12h18M3 17h18" opacity=".5" />,
  "chartGrid:dashed": (
    <path d="M3 7h18M3 12h18M3 17h18" strokeDasharray="2 2" opacity=".5" />
  ),
  "chartLines:smooth": <path d={CURVE} strokeWidth="2" />,
  "chartLines:straight": <path d={POLYLINE} strokeWidth="2" />,
  "chartLines:fine": <path d={POLYLINE} strokeWidth="1" />,
  "chartArea:tint": (
    <path d={`${POLYLINE}v14H3Z`} fill="currentColor" fillOpacity=".3" />
  ),
  "chartArea:solid": (
    <path d={`${POLYLINE}v14H3Z`} fill="currentColor" fillOpacity=".7" />
  ),
  "chartBars:rounded": (
    <path
      d="M4 21V12a2 2 0 0 1 4 0v9m2 0V6a2 2 0 0 1 4 0v15m2 0V10a2 2 0 0 1 4 0v11"
      fill="currentColor"
      stroke="none"
    />
  ),
  "chartBars:square": (
    <path
      d="M4 21V10h4v11Zm6 0V4h4v17Zm6 0V8h4v13Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  "chartBars:slim": (
    <path
      d="M5 21V10h2v11Zm6 0V4h2v17Zm6 0V8h2v13Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  "chartLegend:bottom": (
    <>
      <path d="M3 13 8 7l5 3 8-6" />
      <path d="M5 20h4m4 0h4" strokeWidth="3" opacity=".6" />
    </>
  ),
  "chartLegend:top": (
    <>
      <path d="M5 4h4m4 0h4" strokeWidth="3" opacity=".6" />
      <path d="M3 20 8 14l5 3 8-6" />
    </>
  ),
}

function LookGlyph({ glyph }: { glyph: React.ReactNode }) {
  return (
    <DialGlyph>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {glyph}
      </svg>
    </DialGlyph>
  )
}

function PaletteRow() {
  return (
    <DialSelect
      axis="chartPalette"
      label="Palette"
      options={PALETTE_OPTIONS.map((option) => ({
        ...option,
        glyph: <SeriesGlyph palette={option.value} />,
      }))}
    />
  )
}

function lookRow(axis: AxisKey, label: string, options: Option[]) {
  return function LookRow() {
    return (
      <DialSelect
        axis={axis}
        label={label}
        options={options.map((option) => ({
          ...option,
          glyph: <LookGlyph glyph={GLYPHS[`${axis}:${option.value}`]} />,
        }))}
      />
    )
  }
}

export const ROWS: RowMap = {
  chartPalette: PaletteRow,
  chartAxes: lookRow("chartAxes", "Axes", AXES_OPTIONS),
  chartGrid: lookRow("chartGrid", "Gridlines", GRID_OPTIONS),
  chartLines: lookRow("chartLines", "Lines", LINES_OPTIONS),
  chartArea: lookRow("chartArea", "Area", AREA_OPTIONS),
  chartBars: lookRow("chartBars", "Bars", BARS_OPTIONS),
  chartLegend: lookRow("chartLegend", "Legend", LEGEND_OPTIONS),
}
