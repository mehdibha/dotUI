"use client"

/* Shape — three rows: the base radius, a character (which rung each role of
   component wears), and corner shape. Every option carries its own corner
   glyph so the pick is made by look. Roles fold under for the system that
   needs one role off the curated path; a hand-set vector reads Custom. */

import {
  activeCharacter,
  CORNER_SHAPE_OPTIONS,
  cornerShapeStyle,
  RADIUS_RANGE,
  roleRatio,
  rungIndex,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "../axes/shape"
import type { ShapeRoleKey, ShapeVector } from "../axes/shape"
import { DialFolder, DialSelect, DialSlider } from "../dial"
import type { Studio, StudioState } from "../state"

const px = (value: number) => `${Math.round(value * 10) / 10}px`

/** A rung at the current base, as the option label reads it. */
function rungLabel(label: string, ratio: number, base: number): string {
  if (ratio === Infinity || ratio === 0) return label
  return `${label} · ${px(base * ratio)}`
}

/** A character's corners: its surface with a control nested inside. */
function CharacterGlyph({ vector }: { vector: ShapeVector }) {
  const arc = (id: string, size: number) => {
    const ratio = SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
    return ratio === Infinity ? size : Math.min(ratio * 8, size)
  }
  return (
    <span className="relative block size-5 shrink-0">
      <span
        className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-fg/40"
        style={{ borderTopLeftRadius: arc(vector.roleSurface, 20) }}
      />
      <span
        className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-fg/80"
        style={{ borderTopLeftRadius: arc(vector.roleControl, 12) }}
      />
    </span>
  )
}

/** A corner shape on a square the size of a swatch. */
function CornerGlyph({ shape }: { shape: string }) {
  return (
    <span
      className="block size-4 shrink-0 rounded-[7px] border-[1.5px] border-fg/70"
      style={cornerShapeStyle(shape)}
    />
  )
}

export function shapeSummary(state: StudioState): string {
  const character =
    SHAPE_CHARACTERS.find((c) => c.id === activeCharacter(state))?.label ??
    "Custom"
  return `${character} · ${px(state.radiusPx)}`
}

export function ShapePrimary({ studio }: { studio: Studio }) {
  const { state, set, setState } = studio
  return (
    <>
      <DialSlider
        label="Radius"
        value={state.radiusPx}
        onChange={set("radiusPx")}
        minValue={RADIUS_RANGE.min}
        maxValue={RADIUS_RANGE.max}
        step={RADIUS_RANGE.step}
        format={px}
      />
      <DialSelect
        label="Character"
        // No option is "Custom": the row reads it while the roles match no card.
        value={activeCharacter(state) ?? "Custom"}
        onChange={(id) => {
          const character = SHAPE_CHARACTERS.find((c) => c.id === id)
          if (character) setState({ ...state, ...character.vector })
        }}
        options={SHAPE_CHARACTERS.map((character) => ({
          value: character.id,
          label: character.label,
          preview: <CharacterGlyph vector={character.vector} />,
        }))}
      />
      <DialSelect
        label="Corners"
        value={state.cornerShape}
        onChange={set("cornerShape")}
        options={CORNER_SHAPE_OPTIONS.map((option) => ({
          ...option,
          preview: <CornerGlyph shape={option.value} />,
        }))}
      />
    </>
  )
}

/** Roles — the vector behind the character. Items read Auto on the rung
 *  below Surfaces; every option carries its length at the current base. */
export function ShapeSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const options = (key: ShapeRoleKey) => [
    ...(key === "roleItem"
      ? [
          {
            value: "auto",
            label: `Auto · ${px(state.radiusPx * roleRatio({ ...state, roleItem: "auto" }, key))}`,
          },
        ]
      : []),
    ...SHAPE_RUNGS.map(({ id, label, ratio }) => ({
      value: id,
      label: rungLabel(label, ratio, state.radiusPx),
    })),
  ]
  return (
    <DialFolder title="Roles" defaultOpen={false}>
      {SHAPE_ROLES.map(({ key, label }) => (
        <DialSelect
          key={key}
          label={label}
          value={state[key]}
          onChange={set(key)}
          options={options(key)}
        />
      ))}
    </DialFolder>
  )
}
