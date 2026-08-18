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
  SPECIMEN_BUTTON,
  SPECIMEN_FIELD,
  StepperRow,
} from "@/modules/control-lab/rows"
import type { SegmentedRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import { PaletteDot } from "../patterns"
import type { Lab, LabState } from "../state"
import { controlRadiusPx } from "./shape"

/* Defaults mirror the shipped focus-ring/focus-input utilities (2px accent
   ring, 2px bg gap, halo fields). */
export const FOCUS_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "ring",
  focusWidth: 2,
  focusOffset: "gap",
  focusGap: 2,
  focusHaloStrength: 45,
  focusInputStyle: "halo",
  focusInputWidth: 2,
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

/** Duo is the two-stroke family (Fluent, GOV.UK): a bg hairline inside the
 *  colored ring, so at least one stroke reads on any fill. */
const CONTROL_STYLE_OPTIONS: SegmentedRowOption[] = [
  { value: "ring", label: "Ring" },
  { value: "halo", label: "Halo" },
  { value: "duo", label: "Duo" },
]

/** How a field wears the recipe: halo = border + muted halo of the ring color
 *  (dotUI today, Geist/Stripe); ring = the control ring exactly (Supabase);
 *  border = the border swap alone (Material). */
const INPUT_STYLE_OPTIONS: SegmentedRowOption[] = [
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
  // Duo sits flush by design — the inner hairline is its gap.
  if (state.focusStyle === "duo")
    return `0 0 0 1px var(--color-bg), 0 0 0 ${width + 1}px ${base}`
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
          ? `0 0 0 ${state.focusInputWidth}px ${mix(base, state.focusInputStrength)}`
          : undefined,
  }
}

/** The chapter specimen: both categories on one stage — controls wearing the
 *  ring, and a focused field beside its idle twin. */
export function FocusHero({ state }: { state: LabState }) {
  const specimen = {
    borderRadius: controlRadiusPx(state),
    boxShadow: focusRingShadow(state),
  }
  const field = cn(
    SPECIMEN_FIELD,
    "flex-1 border border-border-field bg-field text-fg",
  )
  const radius = controlRadiusPx(state)
  return (
    <Hero className="items-center gap-3 py-5">
      <div className="flex items-center justify-center gap-4">
        <span
          className={cn(SPECIMEN_BUTTON, "bg-primary text-fg-on-primary")}
          style={specimen}
        >
          Get started
        </span>
        <span
          className={cn(
            SPECIMEN_BUTTON,
            "border bg-neutral text-fg-on-neutral",
          )}
          style={specimen}
        >
          Cancel
        </span>
      </div>
      <div className="flex w-full items-center gap-2.5">
        <span className={field} style={{ borderRadius: radius }}>
          you@example.com
        </span>
        <span
          className={field}
          style={{ borderRadius: radius, ...focusFieldStyle(state) }}
        >
          you@example.com
          <span className="ml-px inline-block h-4 w-px animate-pulse bg-fg" />
        </span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the control ring style, and the ink it draws in.
 *  Values capitalized directly — the color labels are JSX (dot + name). */
export function focusSummary(state: LabState): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return `${cap(state.focusStyle)} · ${cap(state.focusColor)}`
}

/** Both reads of the ring: the primary is where a flush accent ring vanishes
 *  into its own fill, the secondary where it has no strong fill behind it. */
function ControlFocusHero({ state }: { state: LabState }) {
  const specimen = {
    borderRadius: controlRadiusPx(state),
    boxShadow: focusRingShadow(state),
  }
  return (
    <Hero className="flex-row items-center justify-center gap-4 py-5">
      <span
        className={cn(SPECIMEN_BUTTON, "bg-primary text-fg-on-primary")}
        style={specimen}
      >
        Get started
      </span>
      <span
        className={cn(SPECIMEN_BUTTON, "border bg-neutral text-fg-on-neutral")}
        style={specimen}
      >
        Cancel
      </span>
    </Hero>
  )
}

/** An idle twin beside the focused field — the style only reads as the delta
 *  from rest: border swap vs halo vs ring against the same silhouette. */
function InputFocusHero({ state }: { state: LabState }) {
  const field = cn(
    SPECIMEN_FIELD,
    "flex-1 border border-border-field bg-field text-fg",
  )
  const radius = controlRadiusPx(state)
  return (
    <Hero className="flex-row items-center gap-2.5 py-5">
      <span className={field} style={{ borderRadius: radius }}>
        you@example.com
      </span>
      <span
        className={field}
        style={{ borderRadius: radius, ...focusFieldStyle(state) }}
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
        <SegmentedControlRow
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
        {state.focusStyle !== "duo" && (
          <>
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
          </>
        )}
      </ControlGroup>
      <GroupTitle>Inputs</GroupTitle>
      <ControlGroup>
        <InputFocusHero state={state} />
        <SegmentedControlRow
          label="Style"
          value={state.focusInputStyle}
          onChange={set("focusInputStyle")}
          options={INPUT_STYLE_OPTIONS}
        />
        {state.focusInputStyle === "halo" && (
          <>
            <StepperRow
              label="Width"
              value={state.focusInputWidth}
              onChange={set("focusInputWidth")}
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
