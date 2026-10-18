"use client"

/* Shape — on the main page, the Radius picker: a few shapes that set every
   corner, then Custom. On the Shape page, the base radius, the rung each role
   of component wears on it, the tracks, and the components with corners of
   their own. */

import type { Effective } from "../axes"
import {
  pickShape,
  RADIUS_RANGE,
  roleRadiusPx,
  roleRatio,
  SHAPE_ROLES,
  SHAPE_RUNGS,
  shapeOf,
} from "../axes/shape"
import type { ShapeId, ShapeRoleKey } from "../axes/shape"
import {
  SHAPE_OPTIONS,
  STROKE_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/shape.meta"
import {
  DialLink,
  DialPopover,
  DialSelect,
  DialSlider,
  DialTrigger,
} from "../dial"
import type { RowMap } from "../row-host"
import { valueLabel } from "../use-axis"
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

/** The main page's Radius: a shape sets every corner; Custom opens the page. */
export function ShapeRow() {
  const { state, setState } = useStudio()
  return (
    <DialSelect
      label="Radius"
      value={shapeOf(state) ?? "Custom"}
      options={SHAPE_OPTIONS}
      onChange={(id) => setState(pickShape(state, id as ShapeId))}
    >
      {/* Inset like the shapes above it. */}
      <DialLink page="shape" label="Custom" value={null} className="px-2.5" />
    </DialSelect>
  )
}

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
  <DialSelect
    axis="controlStroke"
    label="Control stroke"
    options={STROKE_OPTIONS}
  />
)

const TracksRow = () => (
  <DialSelect axis="tracks" label="Tracks" options={TRACK_OPTIONS} />
)

/* Corners a component keeps apart from its role; each edits on its own page. */
const COMPONENT_CORNERS = [
  { page: "button", key: "buttonRadius", label: "Button corners" },
  { page: "badge", key: "badgeShape", label: "Badge shape" },
] as const

/** The Shape page's way to the components with corners of their own. */
export function ComponentCornersRow() {
  const { state } = useStudio()
  return (
    <DialTrigger label="Components" value={null}>
      <DialPopover>
        {COMPONENT_CORNERS.map(({ page, key, label }) => (
          <DialLink
            key={key}
            page={page}
            label={label}
            value={valueLabel(key, state[key])}
          />
        ))}
      </DialPopover>
    </DialTrigger>
  )
}

export const ROWS: RowMap = {
  radiusPx: RadiusRow,
  ...Object.fromEntries(SHAPE_ROLES.map(({ key }) => [key, roleRow(key)])),
  controlStroke: ControlStrokeRow,
  tracks: TracksRow,
}
