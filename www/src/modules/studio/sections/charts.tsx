"use client"

/* Charts — the categorical series palette and the chart look. */

import { cn } from "@/registry/lib/utils"

import {
  AREA_OPTIONS,
  AXES_OPTIONS,
  BARS_OPTIONS,
  GRID_OPTIONS,
  LEGEND_OPTIONS,
  LINES_OPTIONS,
  PALETTE_OPTIONS,
} from "../axes/charts"
import { DialGap, DialGlyph, DialList, DialSelect } from "../dial"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

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

function Glyph({ children }: { children: React.ReactNode }) {
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
        {children}
      </svg>
    </DialGlyph>
  )
}

const GLYPHS: Record<string, Record<string, React.ReactNode>> = {
  axes: {
    minimal: <path d="M5 21h1m5 0h1m5 0h1" opacity=".6" />,
    labeled: <path d="M2 6h2m-2 6h2m-2 6h2M8 21h1m5 0h1m5 0h1" opacity=".6" />,
  },
  grid: {
    lines: <path d="M3 7h18M3 12h18M3 17h18" opacity=".5" />,
    dashed: (
      <path d="M3 7h18M3 12h18M3 17h18" strokeDasharray="2 2" opacity=".5" />
    ),
  },
  lines: {
    smooth: <path d={CURVE} strokeWidth="2" />,
    straight: <path d={POLYLINE} strokeWidth="2" />,
    fine: <path d={POLYLINE} strokeWidth="1" />,
  },
  area: {
    tint: <path d={`${POLYLINE}v14H3Z`} fill="currentColor" fillOpacity=".3" />,
    solid: (
      <path d={`${POLYLINE}v14H3Z`} fill="currentColor" fillOpacity=".7" />
    ),
  },
  bars: {
    rounded: (
      <path
        d="M4 21V12a2 2 0 0 1 4 0v9m2 0V6a2 2 0 0 1 4 0v15m2 0V10a2 2 0 0 1 4 0v11"
        fill="currentColor"
        stroke="none"
      />
    ),
    square: (
      <path
        d="M4 21V10h4v11Zm6 0V4h4v17Zm6 0V8h4v13Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    slim: (
      <path
        d="M5 21V10h2v11Zm6 0V4h2v17Zm6 0V8h2v13Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
  legend: {
    bottom: (
      <>
        <path d="M3 13 8 7l5 3 8-6" />
        <path d="M5 20h4m4 0h4" strokeWidth="3" opacity=".6" />
      </>
    ),
    top: (
      <>
        <path d="M5 4h4m4 0h4" strokeWidth="3" opacity=".6" />
        <path d="M3 20 8 14l5 3 8-6" />
      </>
    ),
  },
}

const LOOKS = [
  { key: "chartAxes", label: "Axes", glyphs: "axes", options: AXES_OPTIONS },
  { key: "chartGrid", label: "Grid", glyphs: "grid", options: GRID_OPTIONS },
  {
    key: "chartLines",
    label: "Lines",
    glyphs: "lines",
    options: LINES_OPTIONS,
  },
  { key: "chartArea", label: "Area", glyphs: "area", options: AREA_OPTIONS },
  { key: "chartBars", label: "Bars", glyphs: "bars", options: BARS_OPTIONS },
  {
    key: "chartLegend",
    label: "Legend",
    glyphs: "legend",
    options: LEGEND_OPTIONS,
  },
] as const

/* --------------------------------- Section --------------------------------- */

export function ChartsPreview({ state }: { state: StudioState }) {
  return <SeriesGlyph palette={state.chartPalette} />
}

export function ChartsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialList
        label="Palette"
        value={state.chartPalette}
        onChange={set("chartPalette")}
        options={PALETTE_OPTIONS.map((option) => ({
          ...option,
          preview: <SeriesGlyph palette={option.value} />,
        }))}
      />
      <DialGap />
      {LOOKS.map((look) => (
        <DialSelect
          key={look.key}
          label={look.label}
          value={state[look.key]}
          onChange={set(look.key)}
          options={look.options.map((option) => ({
            ...option,
            preview: <Glyph>{GLYPHS[look.glyphs]?.[option.value]}</Glyph>,
          }))}
        />
      ))}
    </>
  )
}
