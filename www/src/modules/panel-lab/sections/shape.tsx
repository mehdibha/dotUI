"use client"

/* Shape — the radius model from the shadcn-styles study (#575): a base length
   scaling the whole system, plus a role→rung vector where a style's shape
   identity actually lives. Corner shape is its own axis. Density lives in
   Space.

   This section owns radius resolution for the whole panel — Space, Focus,
   Buttons and Inputs read `roleRadiusPx` rather than re-deriving it. */

import type { CSSProperties } from "react"

import { cn } from "@/registry/lib/utils"
import {
  OptionGridRow,
  SegmentedControlRow,
  SelectRow,
  SliderRow,
} from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import { DetailRow } from "../patterns"
import type { Lab, LabState } from "../state"

export const SHAPE_DEFAULTS = {
  /** The base radius — a card's radius, in px. */
  radiusPx: 10,
  cornerShape: "round",
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
}

// CSS corner-shape values (progressive enhancement; unsupported → round).
const CORNER_SHAPE_OPTIONS = [
  { value: "round", label: "Round" },
  { value: "squircle", label: "Squircle" },
  { value: "bevel", label: "Bevel" },
]

/* Rung ratios = the #575 ladder. */
const SHAPE_RUNGS = [
  { id: "none", label: "None", ratio: 0 },
  { id: "xs", label: "xs", ratio: 0.25 },
  { id: "sm", label: "sm", ratio: 0.5 },
  { id: "md", label: "md", ratio: 0.75 },
  { id: "lg", label: "lg", ratio: 1 },
  { id: "xl", label: "xl", ratio: 1.5 },
  { id: "2xl", label: "2xl", ratio: 2 },
  { id: "3xl", label: "3xl", ratio: 3 },
  { id: "full", label: "Pill", ratio: Infinity },
]

const SHAPE_ROLES = [
  { key: "rolePanel", label: "Panels", example: "dialog · card" },
  { key: "roleSurface", label: "Surfaces", example: "popover · menu" },
  { key: "roleControl", label: "Controls", example: "button · input" },
  { key: "roleItem", label: "Items", example: "menu item" },
] as const

export type ShapeRoleKey = (typeof SHAPE_ROLES)[number]["key"]

/* Curated role vectors — the 80% path. Each maps to a family from the study
   (at a 10px base): Square ≈ lyra/sera, Crisp ≈ mira/vega, Standard = dotUI
   today (nova puts controls one rung up), Soft ≈ rhea, Round ≈ luma/maia.
   Items default to 'auto' = one rung below Surfaces — true of every rounded
   shadcn style without exception. */
const SHAPE_CHARACTERS: Array<{
  id: string
  label: string
  vector: Record<ShapeRoleKey, string>
}> = [
  {
    id: "square",
    label: "Square",
    vector: {
      roleControl: "none",
      roleItem: "none",
      roleSurface: "none",
      rolePanel: "none",
    },
  },
  {
    id: "crisp",
    label: "Crisp",
    vector: {
      roleControl: "md",
      roleItem: "auto",
      roleSurface: "md",
      rolePanel: "xl",
    },
  },
  {
    id: "standard",
    label: "Standard",
    vector: {
      roleControl: "md",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
    },
  },
  {
    id: "soft",
    label: "Soft",
    vector: {
      roleControl: "2xl",
      roleItem: "auto",
      roleSurface: "2xl",
      rolePanel: "2xl",
    },
  },
  {
    id: "round",
    label: "Round",
    vector: {
      roleControl: "3xl",
      roleItem: "auto",
      roleSurface: "3xl",
      rolePanel: "3xl",
    },
  },
  {
    id: "pill",
    label: "Pill",
    vector: {
      roleControl: "full",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
    },
  },
]

/* corner-shape is progressive enhancement — unsupported browsers render round. */
export const cornerShapeStyle = (shape: string): CSSProperties =>
  shape === "round" ? {} : ({ cornerShape: shape } as CSSProperties)

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

/** A role's ratio of the base. Items on 'auto' ride one rung below Surfaces —
 *  the invariant every rounded shadcn style follows. */
function roleRatio(state: LabState, key: ShapeRoleKey): number {
  const id = state[key]
  if (id === "auto") {
    const below = Math.max(0, rungIndex(state.roleSurface) - 1)
    return SHAPE_RUNGS[below]?.ratio ?? 0
  }
  return SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
}

/** A role's resolved radius in px — what every other section reads. Pill
 *  clamps to a value large enough to round any control we specimen. */
export function roleRadiusPx(state: LabState, key: ShapeRoleKey): number {
  const ratio = roleRatio(state, key)
  return ratio === Infinity ? 999 : state.radiusPx * ratio
}

export const controlRadiusPx = (state: LabState) =>
  roleRadiusPx(state, "roleControl")

function rolePxLabel(px: number, ratio: number): string {
  if (ratio === Infinity) return "pill"
  return `${Math.round(px * ratio * 10) / 10}px`
}

/* Preview geometry per role: nested arcs sharing one origin, controls boldest. */
const ROLE_ARCS: Record<
  ShapeRoleKey,
  { size: number; arc: string; dot: string }
> = {
  rolePanel: { size: 64, arc: "border-fg/25", dot: "bg-fg/25" },
  roleSurface: { size: 50, arc: "border-fg/40", dot: "bg-fg/40" },
  roleControl: { size: 36, arc: "border-fg/80", dot: "bg-fg/80" },
  roleItem: { size: 22, arc: "border-fg/55", dot: "bg-fg/55" },
}

function ShapeHero({ state }: { state: LabState }) {
  return (
    <Hero className="flex-row items-center gap-5">
      <div className="relative size-16 shrink-0">
        {SHAPE_ROLES.map(({ key }) => {
          const { size, arc } = ROLE_ARCS[key]
          const radius = Math.min(roleRadiusPx(state, key), size)
          return (
            <div
              key={key}
              className={cn("absolute top-0 left-0 border-t-2 border-l-2", arc)}
              style={{
                width: size,
                height: size,
                borderTopLeftRadius: radius,
                ...cornerShapeStyle(state.cornerShape),
              }}
            />
          )
        })}
      </div>
      <div className="flex flex-1 flex-col gap-1 text-xs text-fg-muted">
        {SHAPE_ROLES.map(({ key, label, example }) => (
          <span key={key} className="flex items-baseline gap-2">
            <span
              className={cn(
                "size-1.5 shrink-0 self-center rounded-full",
                ROLE_ARCS[key].dot,
              )}
            />
            <span>{label}</span>
            <span className="flex-1 truncate text-[10px] text-fg-muted/70">
              {example}
            </span>
            <span className="font-mono text-fg tabular-nums">
              {rolePxLabel(state.radiusPx, roleRatio(state, key))}
            </span>
          </span>
        ))}
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
      label: `${label} · ${rolePxLabel(state.radiusPx, ratio)}`,
    })),
  ]
  return (
    <>
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
      <DetailRow
        label="Roles"
        summary={SHAPE_ROLES.map(({ key }) =>
          rolePxLabel(state.radiusPx, roleRatio(state, key)),
        ).join(" · ")}
      >
        {SHAPE_ROLES.map(({ key, label }) => (
          <SelectRow
            key={key}
            label={label}
            value={state[key]}
            onChange={set(key)}
            options={rungOptions(key === "roleItem")}
          />
        ))}
      </DetailRow>
      <SegmentedControlRow
        label="Corners"
        value={state.cornerShape}
        onChange={set("cornerShape")}
        options={CORNER_SHAPE_OPTIONS}
      />
    </>
  )
}
