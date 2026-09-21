"use client"

/* Shape — the base radius, and a character: which rung each role of component
   wears. The character opens a grid of cards, each a small app drawn at that
   character's real radii on the current base, so the pick is made by feel.
   Roles fold under the cards for the system that needs one role off the
   curated path; a hand-set vector reads Custom. */

import { useState } from "react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

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
import {
  DialFolder,
  DialPopover,
  DialSelect,
  DialSlider,
  DialTrigger,
} from "../dial"
import type { Studio, StudioState } from "../state"

const px = (value: number) => `${Math.round(value * 10) / 10}px`

/** A rung at the current base, as the option label reads it. */
function rungLabel(label: string, ratio: number, base: number): string {
  if (ratio === Infinity || ratio === 0) return label
  return `${label} · ${px(base * ratio)}`
}

/** A small app at `state`'s real radii: a panel holding a field and a button
 *  (controls), over a menu (surface) with its highlighted item. */
function AppGlyph({ state }: { state: StudioState }) {
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

/** The trigger's specimen: the surface corner with a control nested inside. */
function CornerGlyph({ state }: { state: StudioState }) {
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

export function shapeSummary(state: StudioState): string {
  const character =
    SHAPE_CHARACTERS.find((c) => c.id === activeCharacter(state))?.label ??
    "Custom"
  return `${character} · ${px(state.radiusPx)}`
}

/** Mounted with the popover, so Roles opens on a custom vector each time. */
function CharacterPanel({ studio }: { studio: Studio }) {
  const { state, set, setState } = studio
  const active = activeCharacter(state)
  const [open, setOpen] = useState(active === undefined)
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
    <>
      <RacToggleButtonGroup
        aria-label="Character"
        selectionMode="single"
        selectedKeys={active ? [active] : []}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          const character = SHAPE_CHARACTERS.find((c) => c.id === next)
          if (character) setState({ ...state, ...character.vector })
        }}
        className="grid grid-cols-2 gap-1.5"
      >
        {SHAPE_CHARACTERS.map((character) => (
          <RacToggleButton
            key={character.id}
            id={character.id}
            className="group/card flex cursor-interactive flex-col gap-2.5 rounded-lg tint-5 p-3 text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring selected:tint-10 selected:inset-ring-1 selected:inset-ring-fg/25"
          >
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full border border-fg/30 transition-[border-width] group-selected/card:border-4 group-selected/card:border-fg" />
              <span className="text-[13px] font-medium text-fg/85">
                {character.label}
              </span>
            </span>
            <AppGlyph state={{ ...state, ...character.vector }} />
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
      <DialFolder
        title="Roles"
        open={open}
        onOpenChange={setOpen}
        modified={active === undefined}
      >
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
    </>
  )
}

export function ShapeSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const character = SHAPE_CHARACTERS.find(
    (c) => c.id === activeCharacter(state),
  )
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
      <DialTrigger
        label="Character"
        value={
          <>
            <span className={cn("truncate", !character && "text-fg/50")}>
              {character?.label ?? "Custom"}
            </span>
            <CornerGlyph state={state} />
          </>
        }
      >
        <DialPopover className="w-80">
          <CharacterPanel studio={studio} />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
