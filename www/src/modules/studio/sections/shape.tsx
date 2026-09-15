"use client"

/* Shape — the radius model from the shadcn-styles study (#575): a base length
   scaling the whole system, plus a role→rung vector where a style's shape
   identity actually lives. Corner shape is its own axis. Density lives in
   Space.

   This section owns radius resolution for the whole panel — Space, Focus,
   Buttons and Inputs read `roleRadiusPx` rather than re-deriving it. */

import {
  CORNER_SHAPE_OPTIONS,
  cornerShapeStyle,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "../axes/shape"
import type { ShapeRoleKey } from "../axes/shape"
import {
  ControlGroup,
  GroupTitle,
  OptionGridRow,
  SelectRow,
  SliderRow,
} from "../rows"
import type { Studio, StudioState } from "../state"

export { controlRadiusPx, roleRadiusPx } from "../axes/shape"

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

function rolePxLabel(px: number, ratio: number): string {
  if (ratio === Infinity) return "pill"
  return `${Math.round(px * ratio * 10) / 10}px`
}

/** Mini specimen for a character card: its surface + control corners nested. */
function CharacterGlyph({ vector }: { vector: Record<ShapeRoleKey, string> }) {
  const arc = (id: string, size: number) => {
    const ratio = SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
    return ratio === Infinity ? size : Math.min(ratio * 8, size)
  }
  return (
    <div className="relative size-6">
      <div
        className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-fg/40"
        style={{ borderTopLeftRadius: arc(vector.roleSurface, 24) }}
      />
      <div
        className="absolute top-0 left-0 size-3.5 border-t-2 border-l-2 border-fg/80"
        style={{ borderTopLeftRadius: arc(vector.roleControl, 14) }}
      />
    </div>
  )
}

const CHARACTER_OPTIONS = SHAPE_CHARACTERS.map((character) => ({
  id: character.id,
  label: character.label,
  preview: <CharacterGlyph vector={character.vector} />,
}))

/** The character whose vector matches the current roles, if any. */
function activeCharacter(state: StudioState): string {
  const match = SHAPE_CHARACTERS.find((character) =>
    SHAPE_ROLES.every(({ key }) => character.vector[key] === state[key]),
  )
  return match?.id ?? ""
}

/** Collapsed-row summary: the corner shape, and the base radius. */
export function shapeSummary(state: StudioState): string {
  const corner =
    CORNER_SHAPE_OPTIONS.find((o) => o.value === state.cornerShape)?.label ??
    state.cornerShape
  return state.cornerShape === "round"
    ? `${state.radiusPx}px`
    : `${corner} ${state.radiusPx}px`
}

export function ShapeSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const autoRatio =
    SHAPE_RUNGS[Math.max(0, rungIndex(state.roleSurface) - 1)]?.ratio ?? 0
  const rungOptions = (allowAuto: boolean) => [
    ...(allowAuto
      ? [
          {
            value: "auto",
            label: `Auto · ${rolePxLabel(state.radiusPx, autoRatio)}`,
          },
        ]
      : []),
    ...SHAPE_RUNGS.map(({ id, label, ratio }) => ({
      value: id,
      label:
        ratio === Infinity
          ? label
          : `${label} · ${rolePxLabel(state.radiusPx, ratio)}`,
    })),
  ]
  return (
    <>
      <ControlGroup>
        {/* Self-demo: the row's own corners wear the value, 1:1. */}
        <SliderRow
          label="Radius"
          value={state.radiusPx}
          onChange={set("radiusPx")}
          minValue={0}
          maxValue={16}
          step={0.5}
          ticks={[4, 8, 10, 12]}
          format={(v) => `${v}px`}
          trackStyle={{
            borderRadius: `${state.radiusPx}px`,
            ...cornerShapeStyle(state.cornerShape),
          }}
        />
        <SelectRow
          label="Corners"
          value={state.cornerShape}
          onChange={set("cornerShape")}
          options={CORNER_SHAPE_OPTIONS}
        />
      </ControlGroup>
      <OptionGridRow
        label="Character"
        value={activeCharacter(state)}
        onChange={(id) => {
          const character = SHAPE_CHARACTERS.find((c) => c.id === id)
          if (!character) return
          for (const { key } of SHAPE_ROLES) set(key)(character.vector[key])
        }}
        options={CHARACTER_OPTIONS}
        columns={3}
      />
      <GroupTitle>Roles</GroupTitle>
      <ControlGroup>
        {SHAPE_ROLES.map(({ key, label, example }) => (
          <SelectRow
            key={key}
            label={label}
            description={example}
            value={state[key]}
            onChange={set(key)}
            options={rungOptions(key === "roleItem")}
          />
        ))}
      </ControlGroup>
    </>
  )
}
