"use client"

/* Density: the tier, drawn to scale, and the rows that read it. */

import { DENSITY_VALUES } from "../axes/space"
import { DENSITY_OPTIONS, densityTier } from "../axes/space.meta"
import { DialGap, DialGlyph, DialSelect } from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective } from "../state"

const TOUCH = densityTier("touch").ladder

/** A tier's md control, its height to scale against Touch's. */
function ControlGlyph({ density }: { density: string }) {
  const h = (densityTier(density).ladder[2] / TOUCH[2]) * 14
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x={0.75}
        y={8 - h / 2}
        width={14.5}
        height={h}
        rx={2.5}
        stroke="currentColor"
        strokeWidth={1.25}
      />
      <path
        d="M5 8h6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Every tier's md control as a bar, the current one lit. */
export function SpacePreview({ state }: { state: Effective }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {DENSITY_VALUES.map((id) => (
        <span
          key={id}
          className="w-1 rounded-full bg-fg/25 data-active:bg-fg/80"
          data-active={id === state.density || undefined}
          style={{ height: `${(densityTier(id).ladder[2] / TOUCH[2]) * 100}%` }}
        />
      ))}
    </span>
  )
}

/** A tier's md control and its text, at 60% scale. */
function ControlSpecimen({ density }: { density: string }) {
  const { ladder, text } = densityTier(density)
  return (
    <span
      className="flex w-12 items-center justify-center rounded-[4px] border border-current"
      style={{ height: ladder[2] * 0.6, fontSize: text * 0.6 }}
      aria-hidden
    >
      Aa
    </span>
  )
}

const DENSITY_ROW_OPTIONS = DENSITY_OPTIONS.map((option) => ({
  ...option,
  preview: <ControlSpecimen density={option.value} />,
  glyph: (
    <DialGlyph>
      <ControlGlyph density={option.value} />
    </DialGlyph>
  ),
}))

function DensityRow() {
  return (
    <DialSelect axis="density" label="Scale" options={DENSITY_ROW_OPTIONS} />
  )
}

export function SpaceSection() {
  return (
    <>
      <Row axis="density" />
      <DialGap />
      <Row axis="inputHeight" />
      <Row axis="menuRows" />
    </>
  )
}

export const ROWS: RowMap = { density: DensityRow }
