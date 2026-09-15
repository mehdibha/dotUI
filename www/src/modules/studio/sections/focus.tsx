"use client"

/* Focus — the ring recipe (six-system focus audit, Aug 2026). Every surveyed
   system defines focus once — color + width + offset — and the ones that let
   components restyle it drift (Primer, Raycast).

   Color sits on its own above both blocks: it's the one axis both categories
   draw from, so owning it from Controls would have been a lie. Everything
   below is per-category: the style is the row, the geometry folds behind it,
   and a knob only appears when the chosen style reads it. Menu items
   highlight, no ring. */

import {
  FOCUS_COLOR_OPTIONS,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_OFFSET_OPTIONS,
  FOCUS_STYLE_OPTIONS,
} from "../axes/focus"
import { DetailRow, MiniSliderRow, PaletteDot } from "../patterns"
import {
  ControlGroup,
  GroupTitle,
  MiniSegmented,
  ParamRow,
  SegmentedControlRow,
} from "../rows"
import type { SegmentedRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

/* The ink each color option draws in — the ramp step the engine re-points
   `--color-border-focus` to. */
const COLOR_VARS = {
  accent: "var(--accent-700)",
  neutral: "var(--neutral-700)",
} as const

const COLOR_OPTIONS: SegmentedRowOption[] = FOCUS_COLOR_OPTIONS.map(
  ({ value, label }) => ({
    value,
    label: (
      <>
        <PaletteDot color={COLOR_VARS[value as keyof typeof COLOR_VARS]} />
        {label}
      </>
    ),
  }),
)

const px = (n: number) => `${n}px`

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Collapsed-row summary: the control ring style, and the ink it draws in.
 *  Values capitalized directly — the color labels are JSX (dot + name). */
export function focusSummary(state: StudioState): string {
  return cap(state.focusStyle)
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
