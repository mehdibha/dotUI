"use client"

/* Focus — the ring recipe (six-system focus audit, Aug 2026). Every surveyed
   system defines focus once — color + width + offset — and the ones that let
   components restyle it drift (Primer, Raycast).

   Color sits on its own above both blocks: it's the one axis both categories
   draw from, so owning it from Controls would have been a lie. Everything
   below is per-category: the style is the row, the geometry folds behind it,
   and a knob only appears when the chosen style reads it. Menu items
   highlight, no ring. */

import type { CSSProperties } from "react"

import { cn } from "@/registry/lib/utils"

import {
  FOCUS_COLOR_OPTIONS,
  FOCUS_DEFAULTS,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_OFFSET_OPTIONS,
  FOCUS_STYLE_OPTIONS,
  mixFocus,
} from "../axes/focus"
import { Hero } from "../hero"
import { DetailRow, MiniSliderRow, PaletteDot } from "../patterns"
import {
  ControlGroup,
  GroupTitle,
  MiniSegmented,
  ParamRow,
  SegmentedControlRow,
  SPECIMEN_BUTTON,
  SPECIMEN_FIELD,
} from "../rows"
import type { SegmentedRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { controlRadiusPx } from "./shape"

/* The ink each color option draws in — the ramp steps the engine re-points
   `--color-border-focus` / `-muted` to. */
const COLOR_VARS = {
  accent: { ring: "var(--accent-700)", muted: "var(--accent-300)" },
  neutral: { ring: "var(--neutral-700)", muted: "var(--neutral-300)" },
} as const

const COLOR_OPTIONS: SegmentedRowOption[] = FOCUS_COLOR_OPTIONS.map(
  ({ value, label }) => ({
    value,
    label: (
      <>
        <PaletteDot color={COLOR_VARS[value as keyof typeof COLOR_VARS].ring} />
        {label}
      </>
    ),
  }),
)

const focusInk = (state: StudioState) =>
  COLOR_VARS[state.focusColor as keyof typeof COLOR_VARS] ?? COLOR_VARS.accent

const px = (n: number) => `${n}px`

/** The keyboard ring as a box-shadow stack, the exact recipe the `focus-ring`
 *  utility composes from the tokens: the gap paints in bg (so it follows any
 *  radius), duo adds a bg hairline just inside the edge under a flush ring. */
export function focusRingShadow(state: StudioState): string {
  const width = state.focusWidth
  const base = focusInk(state).ring
  if (state.focusStyle === "duo")
    return `inset 0 0 0 1px var(--color-bg), 0 0 0 ${width}px ${base}`
  const color =
    state.focusStyle === "halo" ? mixFocus(base, state.focusHaloStrength) : base
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

/** The field's focus layer: border swap plus the style's shadow — a muted
 *  halo of the ring color, the exact keyboard ring, or the border alone
 *  (thickened by an inset stroke, so the box never shifts). Exported: the
 *  Inputs hero wears this recipe when its specimens focus. */
export function focusFieldStyle(state: StudioState): CSSProperties {
  const ink = focusInk(state)
  switch (state.focusInputStyle) {
    case "ring":
      return { borderColor: ink.ring, boxShadow: focusRingShadow(state) }
    case "border":
      return {
        borderColor: ink.ring,
        boxShadow: `inset 0 0 0 ${state.focusInputBorderWidth - 1}px ${ink.ring}`,
      }
    default: {
      const color =
        state.focusInputStrength === FOCUS_DEFAULTS.focusInputStrength
          ? ink.muted
          : mixFocus(ink.ring, state.focusInputStrength)
      return {
        borderColor: ink.ring,
        boxShadow: `0 0 0 ${state.focusInputWidth}px ${color}`,
      }
    }
  }
}

/** The chapter specimen: both categories on one stage — controls wearing the
 *  ring, and a focused field beside its idle twin. */
export function FocusHero({ state }: { state: StudioState }) {
  const specimen = {
    borderRadius: controlRadiusPx(state),
    boxShadow: focusRingShadow(state),
  }
  const field = cn(
    SPECIMEN_FIELD,
    "flex-1 border border-border-control bg-field text-fg",
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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Collapsed-row summary: the control ring style, and the ink it draws in.
 *  Values capitalized directly — the color labels are JSX (dot + name). */
export function focusSummary(state: StudioState): string {
  return `${cap(state.focusStyle)} · ${cap(state.focusColor)}`
}

/** Both reads of the ring: the primary is where a flush accent ring vanishes
 *  into its own fill, the secondary where it has no strong fill behind it. */
function ControlFocusHero({ state }: { state: StudioState }) {
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
function InputFocusHero({ state }: { state: StudioState }) {
  const field = cn(
    SPECIMEN_FIELD,
    "flex-1 border border-border-control bg-field text-fg",
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

/** What the ring's geometry reads back while folded: width, then the
 *  placement (or the halo strength) when it left the default. */
function ringSummary(state: StudioState): string {
  const parts = [px(state.focusWidth)]
  if (state.focusStyle === "halo") parts.push(`${state.focusHaloStrength}%`)
  if (state.focusStyle !== "duo")
    parts.push(
      state.focusOffset === "gap"
        ? `Gap ${px(state.focusGap)}`
        : cap(state.focusOffset),
    )
  return parts.join(" · ")
}

function inputSummary(state: StudioState): string {
  return state.focusInputStyle === "border"
    ? px(state.focusInputBorderWidth)
    : `${px(state.focusInputWidth)} · ${state.focusInputStrength}%`
}

export function FocusSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
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
          options={FOCUS_STYLE_OPTIONS}
        />
      </ControlGroup>
      <DetailRow label="Geometry" summary={ringSummary(state)}>
        <MiniSliderRow
          label="Width"
          value={state.focusWidth}
          onChange={set("focusWidth")}
          minValue={1}
          maxValue={6}
          step={1}
          format={px}
        />
        {state.focusStyle === "halo" && (
          <MiniSliderRow
            label="Strength"
            value={state.focusHaloStrength}
            onChange={set("focusHaloStrength")}
            minValue={10}
            maxValue={100}
            step={5}
            format={(v) => `${v}%`}
          />
        )}
        {state.focusStyle !== "duo" && (
          <ParamRow label="Offset">
            <MiniSegmented
              ariaLabel="Offset"
              value={state.focusOffset}
              onChange={set("focusOffset")}
              options={FOCUS_OFFSET_OPTIONS}
            />
          </ParamRow>
        )}
        {state.focusStyle !== "duo" && state.focusOffset === "gap" && (
          <MiniSliderRow
            label="Gap"
            value={state.focusGap}
            onChange={set("focusGap")}
            minValue={1}
            maxValue={6}
            step={1}
            format={px}
          />
        )}
      </DetailRow>
      <GroupTitle>Inputs</GroupTitle>
      <ControlGroup>
        <InputFocusHero state={state} />
        <SegmentedControlRow
          label="Style"
          value={state.focusInputStyle}
          onChange={set("focusInputStyle")}
          options={FOCUS_INPUT_STYLE_OPTIONS}
        />
      </ControlGroup>
      {/* Ring borrows the control geometry above — nothing of its own. */}
      {state.focusInputStyle === "halo" && (
        <DetailRow label="Halo" summary={inputSummary(state)}>
          <MiniSliderRow
            label="Width"
            value={state.focusInputWidth}
            onChange={set("focusInputWidth")}
            minValue={1}
            maxValue={8}
            step={1}
            format={px}
          />
          <MiniSliderRow
            label="Strength"
            value={state.focusInputStrength}
            onChange={set("focusInputStrength")}
            minValue={10}
            maxValue={100}
            step={5}
            format={(v) => `${v}%`}
          />
        </DetailRow>
      )}
      {state.focusInputStyle === "border" && (
        <DetailRow label="Border" summary={inputSummary(state)}>
          <MiniSliderRow
            label="Width"
            value={state.focusInputBorderWidth}
            onChange={set("focusInputBorderWidth")}
            minValue={1}
            maxValue={4}
            step={1}
            format={px}
          />
        </DetailRow>
      )}
    </>
  )
}
