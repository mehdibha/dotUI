"use client"

/* Icons — the library, and the weight axis that library exposes. */

import type { IconLibraryName } from "@/registry/icons/icon-map"

import { LIBRARY_OPTIONS, STROKE_DEFAULTS, WEIGHT_OPTIONS } from "../axes/icons"
import { ControlGroup, SelectRow, SliderRow } from "../rows"
import type { Studio, StudioState } from "../state"

/** Collapsed-row summary: the library, and the stroke it draws with. */
export function iconsSummary(state: StudioState): string {
  return (
    LIBRARY_OPTIONS.find((o) => o.value === state.iconLibrary)?.label ??
    state.iconLibrary
  )
}

export function IconsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Library"
        value={state.iconLibrary}
        onChange={set("iconLibrary")}
        options={LIBRARY_OPTIONS}
      />
      {/* Stroke only exists on line-based sets; Phosphor swaps it for weight. */}
      {STROKE_DEFAULTS[state.iconLibrary as IconLibraryName] !== undefined && (
        <SliderRow
          label="Stroke"
          value={state.iconStroke}
          onChange={set("iconStroke")}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
      )}
      {state.iconLibrary === "phosphor" && (
        <SelectRow
          label="Weight"
          value={state.iconWeight}
          onChange={set("iconWeight")}
          options={WEIGHT_OPTIONS}
        />
      )}
    </ControlGroup>
  )
}
