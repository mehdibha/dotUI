"use client"

/* Charts: palette and grid; the chart's Motion row is Motion's. */

import { cn } from "@/registry/lib/utils"

import { GRID_OPTIONS, PALETTE_OPTIONS } from "../axes/charts.meta"
import { DialGlyph, DialSelect } from "../dial"
import type { RowMap } from "../row-host"

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

function GridGlyph({ grid }: { grid: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {grid !== "none" && (
        <path
          d="M3 7h18M3 12h18M3 17h18"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={grid === "dashed" ? "2 2" : undefined}
          opacity=".35"
        />
      )}
      <path
        d="M4 17 9 10l4 3 7-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function GridRow() {
  return (
    <DialSelect
      axis="chartGrid"
      label="Gridlines"
      options={GRID_OPTIONS.map((option) => ({
        ...option,
        glyph: (
          <DialGlyph>
            <GridGlyph grid={option.value} />
          </DialGlyph>
        ),
      }))}
    />
  )
}

export const ROWS: RowMap = {
  chartPalette: PaletteRow,
  chartGrid: GridRow,
}
