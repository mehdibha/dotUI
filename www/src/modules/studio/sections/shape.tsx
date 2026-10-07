"use client"

/* Shape — the base radius, and a character: which rung each role of component
   wears. The character opens a grid of cards, each a small app drawn at that
   character's real radii on the current base, so the pick is made by feel.
   Roles fold under the cards for the system that needs one role off the
   curated path; a hand-set vector reads Custom. */

import { useState } from "react"

import { cn } from "@/registry/lib/utils"

import {
  activeCharacter,
  RADIUS_RANGE,
  roleRadiusPx,
  roleRatio,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "../axes/shape"
import type { ShapeRoleKey } from "../axes/shape"
import { STROKE_OPTIONS, TRACK_OPTIONS } from "../axes/shape.meta"
import {
  DialFolder,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialTrigger,
} from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import { CardGrid } from "../patterns"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"

const px = (value: number) => `${Math.round(value * 10) / 10}px`

/** A rung at the current base, as the option label reads it. */
function rungLabel(label: string, ratio: number, base: number): string {
  if (ratio === Infinity || ratio === 0) return label
  return `${label} · ${px(base * ratio)}`
}

/** A small app at `state`'s real radii: a panel holding a field and a button
 *  (controls), over a menu (surface) with its highlighted item. */
function AppGlyph({ state }: { state: Effective }) {
  const radius = (key: ShapeRoleKey) => ({
    borderRadius: roleRadiusPx(state, key),
  })
  return (
    <span
      className="flex w-full flex-col gap-2 border border-fg/15 bg-bg p-2"
      style={radius("rolePanel")}
    >
      <span className="ml-0.5 h-1.5 w-2/5 rounded-full bg-fg/20" />
      <span className="flex gap-1.5">
        <span
          className="h-5 flex-1 border border-fg/20"
          style={radius("roleControl")}
        />
        <span className="h-5 w-8 bg-primary" style={radius("roleControl")} />
      </span>
      <span
        className="flex flex-col gap-1 border border-fg/10 bg-card p-1"
        style={radius("roleSurface")}
      >
        <span className="h-3 w-full bg-fg/10" style={radius("roleItem")} />
        <span className="h-3 w-full" />
      </span>
    </span>
  )
}

/** The chapter's specimen: the surface corner with a control nested inside. */
export function ShapePreview({ state }: { state: Effective }) {
  const arc = (key: ShapeRoleKey, size: number) =>
    Math.min(roleRadiusPx(state, key), size)
  return (
    <span className="relative block size-5 shrink-0">
      <span
        className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-fg/40"
        style={{ borderTopLeftRadius: arc("roleSurface", 20) }}
      />
      <span
        className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-fg/80"
        style={{ borderTopLeftRadius: arc("roleControl", 12) }}
      />
    </span>
  )
}

/* ---------------------------------- Rows ----------------------------------- */

const ROLE_ROW_LABELS: Record<ShapeRoleKey, string> = {
  rolePanel: "Panel corners",
  roleCard: "Card corners",
  roleSurface: "Surface corners",
  roleControl: "Control corners",
  roleItem: "Item corners",
}

/** One role's rung; the Character popover hosts all five. */
const roleRow = (key: ShapeRoleKey) =>
  function RoleRow() {
    const { state, effective } = useStudio()
    return (
      <DialSelect
        axis={key}
        label={ROLE_ROW_LABELS[key]}
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

/** Mounted with the popover, so Roles opens on a custom vector each time. */
function CharacterPanel() {
  const { state, effective, setState } = useStudio()
  const active = activeCharacter(state)
  const [open, setOpen] = useState(active === undefined)
  return (
    <>
      <CardGrid
        label="Character"
        value={active}
        onChange={(id) => {
          const character = SHAPE_CHARACTERS.find((c) => c.id === id)
          if (character) setState({ ...state, ...character.vector })
        }}
        options={SHAPE_CHARACTERS.map((character) => ({
          id: character.id,
          label: character.label,
          children: <AppGlyph state={{ ...effective, ...character.vector }} />,
        }))}
      />
      <DialFolder
        title="Roles"
        open={open}
        onOpenChange={setOpen}
        modified={active === undefined}
      >
        {SHAPE_ROLES.map(({ key, label }) => (
          <Row key={key} axis={key} label={label} />
        ))}
      </DialFolder>
    </>
  )
}

function CharacterRow() {
  const { state } = useStudio()
  const character = SHAPE_CHARACTERS.find(
    (c) => c.id === activeCharacter(state),
  )
  return (
    <DialTrigger
      label="Character"
      holds={SHAPE_ROLES.map((role) => role.key)}
      value={
        <span className={cn("truncate", !character && "text-fg/50")}>
          {character?.label ?? "Custom"}
        </span>
      }
    >
      <DialPopover className="w-80">
        <CharacterPanel />
      </DialPopover>
    </DialTrigger>
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

/* --------------------------------- Section --------------------------------- */

export function ShapeSection() {
  return (
    <>
      <Row axis="radiusPx" />
      <CharacterRow />
      <Row axis="controlStroke" />
      <Row axis="tracks" />
    </>
  )
}

export const ROWS: RowMap = {
  radiusPx: RadiusRow,
  ...Object.fromEntries(SHAPE_ROLES.map(({ key }) => [key, roleRow(key)])),
  controlStroke: ControlStrokeRow,
  tracks: TracksRow,
}
