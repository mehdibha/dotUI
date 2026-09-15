"use client"

/* Charts — the data-viz look. Two axes: the categorical series palette (mono
   = brand tints, vivid and muted = hues spread around the brand — the
   strategies real systems pick between) and the gridline treatment (solid /
   dashed / none). */

import {
  GRID_OPTIONS,
  gridOption,
  PALETTE_OPTIONS,
  paletteOption,
} from "../axes/charts"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio } from "../state"

export function ChartsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
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
