"use client"

/* Icons — the library, and the one axis that library exposes: stroke width on
   line sets, weight on Phosphor. Every row carries its own glyphs, drawn by
   the library it names, so the pick is made by look. */

import { HeartIcon, SearchIcon, SettingsIcon } from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"

import {
  ICON_STROKE_WIDTH_VAR,
  LIBRARY_OPTIONS,
  STROKE_DEFAULTS,
  WEIGHT_OPTIONS,
} from "../axes/icons"
import { DialSelect, DialSlider } from "../dial"
import type { Studio, StudioState } from "../state"

/** A strip of registry icons drawn by `library`, at `weight` on Phosphor. */
function Glyphs({
  library,
  weight,
  stroke,
}: {
  library: IconLibraryName
  weight?: PhosphorWeight
  stroke?: number
}) {
  return (
    <IconLibraryContext.Provider value={library}>
      <IconWeightContext.Provider value={weight}>
        <span
          className="flex shrink-0 items-center gap-1.5 **:[svg]:size-4"
          style={{ [ICON_STROKE_WIDTH_VAR]: stroke } as React.CSSProperties}
        >
          <SearchIcon />
          <SettingsIcon />
          <HeartIcon />
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

/** Beside the title: the strip as the library draws it. */
export function IconsPreview({ state }: { state: StudioState }) {
  return (
    <Glyphs
      library={state.iconLibrary as IconLibraryName}
      weight={state.iconWeight as PhosphorWeight}
      stroke={state.iconStroke}
    />
  )
}

export function IconsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const library = state.iconLibrary as IconLibraryName
  const weight = state.iconWeight as PhosphorWeight
  const strokeDefault = STROKE_DEFAULTS[library]
  return (
    <>
      <DialSelect
        label="Library"
        value={state.iconLibrary}
        onChange={set("iconLibrary")}
        options={LIBRARY_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <Glyphs
              library={option.value as IconLibraryName}
              weight={option.value === "phosphor" ? weight : undefined}
              stroke={option.value === library ? state.iconStroke : undefined}
            />
          ),
        }))}
      />
      {/* Stroke only exists on line sets; Phosphor swaps it for weight. */}
      {strokeDefault !== undefined && (
        <DialSlider
          label="Stroke"
          value={state.iconStroke}
          onChange={set("iconStroke")}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
      )}
      {library === "phosphor" && (
        <DialSelect
          label="Weight"
          value={state.iconWeight}
          onChange={set("iconWeight")}
          options={WEIGHT_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <Glyphs
                library="phosphor"
                weight={option.value as PhosphorWeight}
              />
            ),
          }))}
        />
      )}
    </>
  )
}
