"use client"

/* Shape — the base radius on the main page; on the Shape page, the rung each
   role of component wears on it, and the tracks. */

import {
  RADIUS_RANGE,
  roleRadiusPx,
  roleRatio,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "../axes/shape"
import type { ShapeRoleKey } from "../axes/shape"
import { STROKE_OPTIONS, TRACK_OPTIONS } from "../axes/shape.meta"
import { DialSegmented, DialSelect, DialSlider } from "../dial"
import type { RowMap } from "../family-page"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"

const px = (value: number) => `${Math.round(value * 10) / 10}px`

/** A rung at the current base, as the option label reads it. */
function rungLabel(label: string, ratio: number, base: number): string {
  if (ratio === Infinity || ratio === 0) return label
  return `${label} · ${px(base * ratio)}`
}

/** The page's specimen: one corner at the control radius. */
export function ShapePreview({ state }: { state: Effective }) {
  return (
    <span
      className="block size-3.5 shrink-0 border-t-[1.5px] border-l-[1.5px] border-current"
      style={{
        borderTopLeftRadius: Math.min(roleRadiusPx(state, "roleControl"), 14),
      }}
    />
  )
}

/* ---------------------------------- Rows ----------------------------------- */

const ROLE_LABELS = Object.fromEntries(
  SHAPE_ROLES.map(({ key, label }) => [key, label]),
) as Record<ShapeRoleKey, string>

/** One role's rung on the current base. */
const roleRow = (key: ShapeRoleKey) =>
  function RoleRow() {
    const { state, effective } = useStudio()
    return (
      <DialSelect
        axis={key}
        label={ROLE_LABELS[key]}
        options={[
          ...(key === "roleItem" || key === "roleCard"
            ? [
                {
                  value: "auto",
                  label: `Auto · ${px(state.radiusPx * roleRatio({ ...effective, [key]: "auto" }, key))}`,
                },
              ]
            : []),
          ...SHAPE_RUNGS.filter(
            ({ id }) =>
              id !== "full" || (key !== "rolePanel" && key !== "roleCard"),
          ).map(({ id, label, ratio }) => ({
            value: id,
            label: rungLabel(label, ratio, state.radiusPx),
          })),
        ]}
      />
    )
  }

const RadiusRow = () => (
  <DialSlider
    axis="radiusPx"
    label="Radius"
    minValue={RADIUS_RANGE.min}
    maxValue={RADIUS_RANGE.max}
    step={RADIUS_RANGE.step}
    format={px}
  />
)

const ControlStrokeRow = () => (
  <DialSegmented
    axis="controlStroke"
    label="Control stroke"
    options={STROKE_OPTIONS}
  />
)

const TracksRow = () => (
  <DialSegmented axis="tracks" label="Tracks" options={TRACK_OPTIONS} />
)

export const ROWS: RowMap = {
  radiusPx: RadiusRow,
  ...Object.fromEntries(SHAPE_ROLES.map(({ key }) => [key, roleRow(key)])),
  controlStroke: ControlStrokeRow,
  tracks: TracksRow,
}
