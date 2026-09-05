"use client"

/* Shape — the radius model from the shadcn-styles study (#575): a base length
   scaling the whole system, plus a role→rung vector where a style's shape
   identity actually lives. Corner shape is its own axis. Density lives in
   Space.

   This section owns radius resolution for the whole panel — Space, Focus,
   Buttons and Inputs read `roleRadiusPx` rather than re-deriving it. */

import type { CSSProperties } from "react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import {
  ControlGroup,
  GroupTitle,
  OptionGridRow,
  SelectRow,
  SliderRow,
} from "../rows"
import {
  CORNER_SHAPE_OPTIONS,
  cornerShapeStyle,
  roleRadiusPx,
  roleRatio,
  SHAPE_CHARACTERS,
  SHAPE_ROLES,
  SHAPE_RUNGS,
} from "../axes/shape"
import type { ShapeRoleKey } from "../axes/shape"
import type { Lab, LabState } from "../state"

export { controlRadiusPx, roleRadiusPx } from "../axes/shape"

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

function rolePxLabel(px: number, ratio: number): string {
  if (ratio === Infinity) return "pill"
  return `${Math.round(px * ratio * 10) / 10}px`
}

/* Nested-surfaces hero: page → card → popover → item, plus a button on the
   card — one specimen per role, every corner wearing its resolved radius 1:1. */
const NEST_BOX = "border border-fg/10 bg-fg/3 shadow-xs"

function RoleLabel({ name, px }: { name: string; px?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs text-fg-muted">
      <span className="truncate">{name}</span>
      {px && (
        <span className="shrink-0 font-mono text-[10px] tabular-nums">
          {px}
        </span>
      )}
    </div>
  )
}

export function ShapeHero({ state }: { state: LabState }) {
  const px = (key: ShapeRoleKey) =>
    rolePxLabel(state.radiusPx, roleRatio(state, key))
  const shape = (key: ShapeRoleKey): CSSProperties => ({
    borderRadius: roleRadiusPx(state, key),
    ...cornerShapeStyle(state.cornerShape),
  })
  return (
    <Hero>
      <div
        className={cn(NEST_BOX, "flex flex-col gap-2.5 p-3")}
        style={shape("rolePanel")}
      >
        <RoleLabel name="Card" px={px("rolePanel")} />
        <div
          className={cn(NEST_BOX, "flex flex-col gap-2 p-2.5")}
          style={shape("roleSurface")}
        >
          <RoleLabel name="Popover" px={px("roleSurface")} />
          <div
            className={cn(NEST_BOX, "px-2.5 py-1.5")}
            style={shape("roleItem")}
          >
            <RoleLabel name="Item" px={px("roleItem")} />
          </div>
        </div>
        <div
          className={cn(
            NEST_BOX,
            "flex items-baseline gap-2 self-start px-3 py-1.5",
          )}
          style={shape("roleControl")}
        >
          <span className="text-xs text-fg-muted">Button</span>
          <span className="font-mono text-[10px] text-fg-muted tabular-nums">
            {px("roleControl")}
          </span>
        </div>
      </div>
    </Hero>
  )
}

/** Mini specimen for a character card: its surface + control corners nested,
 *  echoing the section's corner preview. */
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
function activeCharacter(state: LabState): string {
  const match = SHAPE_CHARACTERS.find((character) =>
    SHAPE_ROLES.every(({ key }) => character.vector[key] === state[key]),
  )
  return match?.id ?? ""
}

/** Collapsed-row summary: the corner shape, and the base radius. */
export function shapeSummary(state: LabState): string {
  const corner =
    CORNER_SHAPE_OPTIONS.find((o) => o.value === state.cornerShape)?.label ??
    state.cornerShape
  return `${corner} · ${state.radiusPx}px`
}

export function ShapeSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
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
        <ShapeHero state={state} />
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
