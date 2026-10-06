"use client"

/* Charts — the categorical series palette. */

import { cn } from "@/registry/lib/utils"

import { PALETTE_OPTIONS } from "../axes/charts"
import { DialList } from "../dial"
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

/* --------------------------------- Section --------------------------------- */

export function ChartsPreview({ state }: { state: StudioState }) {
  return <SeriesGlyph palette={state.chartPalette} />
}

export function ChartsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <DialList
      label="Palette"
      value={state.chartPalette}
      onChange={set("chartPalette")}
      options={PALETTE_OPTIONS.map((option) => ({
        ...option,
        preview: <SeriesGlyph palette={option.value} />,
      }))}
    />
  )
}
