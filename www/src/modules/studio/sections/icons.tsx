"use client"

/* Icons — the library, and under its picker the one axis that library
   exposes: stroke width on line sets, weight on Phosphor. */

import { HeartIcon, SearchIcon, SettingsIcon } from "@/registry/icons"
import {
  IconLibraryContext,
  IconWeightContext,
} from "@/registry/icons/create-icon"
import type { IconLibraryName, PhosphorWeight } from "@/registry/icons/icon-map"

import { ICON_STROKE_WIDTH_VAR, STROKE_RANGE } from "../axes/icons"
import { LIBRARY_OPTIONS, WEIGHT_OPTIONS } from "../axes/icons.meta"
import { DialSelect, DialSlider } from "../dial"
import { Row } from "../row-host"
import type { RowMap } from "../row-host"

const SPECIMEN_ICONS = [SearchIcon, SettingsIcon, HeartIcon]

/** Draws the registry icons inside it with `library`, at `weight` on
 *  Phosphor and `stroke` on line sets. */
function IconScope({
  library,
  weight,
  stroke,
  className,
  children,
}: {
  library: IconLibraryName
  weight?: PhosphorWeight
  stroke?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <IconLibraryContext.Provider value={library}>
      <IconWeightContext.Provider value={weight}>
        <span
          className={className}
          style={{ [ICON_STROKE_WIDTH_VAR]: stroke } as React.CSSProperties}
        >
          {children}
        </span>
      </IconWeightContext.Provider>
    </IconLibraryContext.Provider>
  )
}

/** A strip of registry icons drawn by `library`. */
function Glyphs(props: {
  library: IconLibraryName
  weight?: PhosphorWeight
  stroke?: number
}) {
  return (
    <IconScope
      {...props}
      className="flex shrink-0 items-center gap-1.5 **:[svg]:size-4"
    >
      {SPECIMEN_ICONS.map((Icon, i) => (
        <Icon key={i} />
      ))}
    </IconScope>
  )
}

// Names only: the preview takes over with the Icons board while it's open.
const LIBRARY_ROW_OPTIONS = LIBRARY_OPTIONS.map(({ value, label }) => ({
  value,
  label,
}))

const LibraryRow = () => (
  <DialSelect
    axis="iconLibrary"
    holds={["iconStroke", "iconWeight"]}
    label="Icons"
    options={LIBRARY_ROW_OPTIONS}
  >
    <Row axis="iconStroke" />
    <Row axis="iconWeight" />
  </DialSelect>
)

const StrokeRow = () => (
  <DialSlider
    axis="iconStroke"
    label="Stroke"
    minValue={STROKE_RANGE.min}
    maxValue={STROKE_RANGE.max}
    step={STROKE_RANGE.step}
    format={(v) => v.toFixed(2)}
  />
)

const WEIGHT_ROW_OPTIONS = WEIGHT_OPTIONS.map((option) => ({
  ...option,
  glyph: <Glyphs library="phosphor" weight={option.value as PhosphorWeight} />,
}))

const WeightRow = () => (
  <DialSelect axis="iconWeight" label="Weight" options={WEIGHT_ROW_OPTIONS} />
)

export const ROWS: RowMap = {
  iconLibrary: LibraryRow,
  iconStroke: StrokeRow,
  iconWeight: WeightRow,
}
