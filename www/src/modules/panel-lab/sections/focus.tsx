"use client"

/* Focus — the ring recipe (six-system focus audit, Aug 2026). Every surveyed
   system defines focus once — color + width + offset — and the ones that let
   components restyle it drift (Primer, Raycast).

   Color sits on its own above both blocks: it's the one axis both categories
   draw from, so owning it from Controls would have been a lie. Everything
   below is per-category, and a row only appears when the chosen style actually
   reads it — no dead knobs. Menu items highlight, no ring. */

import type { CSSProperties } from "react"

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  GroupTitle,
  SegmentedControlRow,
  SelectRow,
  SPECIMEN_BUTTON,
  SPECIMEN_FIELD,
  StepperRow,
} from "@/modules/control-lab/rows"
import type {
  SegmentedRowOption,
  SelectRowOption,
} from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import { PaletteDot } from "../patterns"
import type { Lab, LabState } from "../state"
import { controlRadiusPx } from "./shape"

/* Defaults mirror the shipped focus-ring/focus-input utilities (2px accent
   ring, 2px bg gap, halo fields). */
export const FOCUS_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "solid",
  focusWidth: 2,
  focusOffset: "gap",
  focusGap: 2,
  focusHaloStrength: 45,
  focusInputStyle: "halo",
  focusInputSpread: 2,
  focusInputStrength: 30,
  focusInputBorderWidth: 1,
}

const COLOR_VARS = {
  accent: "var(--accent-700)",
  neutral: "var(--neutral-700)",
} as const

const COLOR_OPTIONS: SegmentedRowOption[] = [
  {
    value: "accent",
    label: (
      <>
        <PaletteDot color={COLOR_VARS.accent} />
        Accent
      </>
    ),
  },
  {
    value: "neutral",
    label: (
      <>
        <PaletteDot color={COLOR_VARS.neutral} />
        Neutral
      </>
    ),
  },
]

const CONTROL_STYLE_OPTIONS: SelectRowOption[] = [
  { value: "solid", label: "Ring" },
  { value: "halo", label: "Halo" },
]

/** How a field wears the recipe: halo = border + muted halo of the ring color
 *  (dotUI today, Geist/Stripe); ring = the control ring exactly (Supabase);
 *  border = the border swap alone (Material). */
const INPUT_STYLE_OPTIONS: SelectRowOption[] = [
  { value: "halo", label: "Halo" },
  { value: "ring", label: "Ring" },
  { value: "border", label: "Border" },
]

const OFFSET_OPTIONS: SegmentedRowOption[] = [
  { value: "inset", label: "Inset" },
  { value: "flush", label: "Flush" },
  { value: "gap", label: "Gap" },
]

const focusColorVar = (state: LabState): string =>
  COLOR_VARS[state.focusColor as keyof typeof COLOR_VARS] ?? COLOR_VARS.accent

const mix = (base: string, pct: number) =>
  `color-mix(in oklab, ${base} ${pct}%, transparent)`

/** The keyboard ring as a box-shadow stack — the gap paints in bg like the
 *  real focus-ring utility (ring-offset-bg), so it follows any radius. */
function focusRingShadow(state: LabState): string {
  const width = state.focusWidth
  const base = focusColorVar(state)
  const color =
    state.focusStyle === "halo" ? mix(base, state.focusHaloStrength) : base
  switch (state.focusOffset) {
    case "inset":
      return `inset 0 0 0 ${width}px ${color}`
    case "flush":
      return `0 0 0 ${width}px ${color}`
    default: {
      const gap = state.focusGap
      return `0 0 0 ${gap}px var(--color-bg), 0 0 0 ${gap + width}px ${color}`
    }
  }
}

/** The field's focus layer: border swap plus the style's shadow — the exact
 *  keyboard ring, a muted halo of the same color, or the border alone.
 *  Exported: the Inputs hero wears this recipe when its specimens focus. */
export function focusFieldStyle(state: LabState): CSSProperties {
  const base = focusColorVar(state)
  const style = state.focusInputStyle
  return {
    borderColor: base,
    borderWidth: style === "border" ? state.focusInputBorderWidth : undefined,
    boxShadow:
      style === "ring"
        ? focusRingShadow(state)
        : style === "halo"
          ? `0 0 0 ${state.focusInputSpread}px ${mix(base, state.focusInputStrength)}`
          : undefined,
  }
}

/** One focused specimen per block — the secondary button is the neutral read
 *  of the ring, where the recipe has to work without a strong fill behind it. */
function ControlFocusHero({ state }: { state: LabState }) {
  return (
    <Hero className="items-center py-5">
      <span
        className={cn(SPECIMEN_BUTTON, "border bg-neutral text-fg-on-neutral")}
        style={{
          borderRadius: controlRadiusPx(state),
          boxShadow: focusRingShadow(state),
        }}
      >
        Get started
      </span>
    </Hero>
  )
}

function InputFocusHero({ state }: { state: LabState }) {
  return (
    <Hero className="items-center py-5">
      <span
        className={cn(
          SPECIMEN_FIELD,
          "max-w-48 border border-border-field bg-field text-fg",
        )}
        style={{
          borderRadius: controlRadiusPx(state),
          ...focusFieldStyle(state),
        }}
      >
        you@example.com
        <span className="ml-px inline-block h-4 w-px animate-pulse bg-fg" />
      </span>
    </Hero>
  )
}

export function FocusSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      {/* Untitled on purpose: the shared ink opens the chapter, the way a
          settings panel puts the general row above its named sections. */}
      <ControlGroup>
        <SegmentedControlRow
          label="Color"
          value={state.focusColor}
          onChange={set("focusColor")}
          options={COLOR_OPTIONS}
        />
      </ControlGroup>
      <GroupTitle>Controls</GroupTitle>
      <ControlGroup>
        <ControlFocusHero state={state} />
        <SelectRow
          label="Style"
          value={state.focusStyle}
          onChange={set("focusStyle")}
          options={CONTROL_STYLE_OPTIONS}
        />
        <StepperRow
          label="Width"
          value={state.focusWidth}
          onChange={set("focusWidth")}
          minValue={1}
          maxValue={6}
          unit="px"
        />
        {state.focusStyle === "halo" && (
          <StepperRow
            label="Strength"
            value={state.focusHaloStrength}
            onChange={set("focusHaloStrength")}
            minValue={10}
            maxValue={100}
            step={5}
            unit="%"
          />
        )}
        <SegmentedControlRow
          label="Offset"
          value={state.focusOffset}
          onChange={set("focusOffset")}
          options={OFFSET_OPTIONS}
        />
        {state.focusOffset === "gap" && (
          <StepperRow
            label="Gap"
            value={state.focusGap}
            onChange={set("focusGap")}
            minValue={1}
            maxValue={6}
            unit="px"
          />
        )}
      </ControlGroup>
      <GroupTitle>Inputs</GroupTitle>
      <ControlGroup>
        <InputFocusHero state={state} />
        <SelectRow
          label="Style"
          value={state.focusInputStyle}
          onChange={set("focusInputStyle")}
          options={INPUT_STYLE_OPTIONS}
        />
        {state.focusInputStyle === "halo" && (
          <>
            <StepperRow
              label="Spread"
              value={state.focusInputSpread}
              onChange={set("focusInputSpread")}
              minValue={1}
              maxValue={8}
              unit="px"
            />
            <StepperRow
              label="Strength"
              value={state.focusInputStrength}
              onChange={set("focusInputStrength")}
              minValue={10}
              maxValue={100}
              step={5}
              unit="%"
            />
          </>
        )}
        {state.focusInputStyle === "border" && (
          <StepperRow
            label="Width"
            value={state.focusInputBorderWidth}
            onChange={set("focusInputBorderWidth")}
            minValue={1}
            maxValue={4}
            unit="px"
          />
        )}
      </ControlGroup>
    </>
  )
}
