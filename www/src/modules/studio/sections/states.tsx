"use client"

/* Focus, Disabled, Cursor and Text selection — each a Foundations page —
   plus Invalid, hosted on the Field page. Specimens draw each recipe with
   the panel's own inks at its real geometry. */

import { cn } from "@/registry/lib/utils"

import type { Effective } from "../axes"
import { HIGHLIGHT_OPTIONS } from "../axes/selection.meta"
import { INVALID_FILL } from "../axes/states"
import {
  CONTROL_TEXT_OPTIONS,
  CURSOR_CONTROL_OPTIONS,
  CURSOR_DISABLED_OPTIONS,
  DISABLED_OPTIONS,
  FOCUS_COLOR_OPTIONS,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_STYLE_OPTIONS,
  INVALID_OPTIONS,
} from "../axes/states.meta"
import { DialSelect, DialSlider } from "../dial"
import type { RowMap } from "../row-host"
import { useStudio } from "../use-studio"
import { ArrowCursor, HandCursor } from "./cursors"

const INK = "var(--color-border-focus)"
const DANGER = "var(--color-fg-danger)"
const DANGER_MUTED = "var(--color-danger-muted)"

const SIZE = "h-3.5 w-6 rounded-[4px]"

/** The control ring as Focus draws it: Inset sits inside the edge, Halo
 *  hugs it at half strength. */
function ControlSpecimen({ state }: { state: Effective }) {
  const { focusStyle: style, focusWidth: width } = state
  return (
    <span
      className={cn("mx-1 block shrink-0 bg-fg/25", SIZE)}
      style={{
        outline: `${width}px solid ${INK}`,
        outlineColor:
          style === "halo"
            ? `color-mix(in oklab, ${INK} 50%, transparent)`
            : INK,
        outlineOffset: style === "inset" ? -width : style === "halo" ? 0 : 2,
      }}
    />
  )
}

function DisabledSpecimen({ treatment }: { treatment: string }) {
  // A filled button with its label: one grey for Solid, itself at 50% for Fade.
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE,
        treatment === "fade" ? "bg-primary opacity-50" : "bg-disabled",
      )}
    >
      <span
        className={cn(
          "h-[18%] w-1/2 rounded-full",
          treatment === "fade" ? "bg-fg-on-primary" : "bg-fg-disabled",
        )}
      />
    </span>
  )
}

function InvalidSpecimen({ invalid }: { invalid: string }) {
  return (
    <span
      className={cn("mx-1 block shrink-0 border bg-bg", SIZE)}
      style={{
        borderColor: DANGER,
        boxShadow: invalid === "halo" ? `0 0 0 3px ${DANGER_MUTED}` : undefined,
        backgroundImage:
          invalid === "tint"
            ? `linear-gradient(${INVALID_FILL}, ${INVALID_FILL})`
            : undefined,
      }}
    />
  )
}

const mix = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

/** The ring on a part that covers its own box (a check, a thumb): outside
 *  the edge, except Halo, which hugs it. */
function partRing({ focusStyle, focusWidth }: Effective, ink: string) {
  return {
    outline: `${focusWidth}px solid ${focusStyle === "halo" ? mix(ink, 50) : ink}`,
    outlineOffset: focusStyle === "halo" ? 0 : 2,
  }
}

/** The ring on a button: Inset draws it inside, over a page-colored line. */
function buttonRing(state: Effective, ink: string) {
  if (state.focusStyle !== "inset") return partRing(state, ink)
  const width = state.focusWidth
  return {
    outline: `${width}px solid ${ink}`,
    outlineOffset: -width,
    boxShadow: `inset 0 0 0 ${width + 1}px var(--color-bg)`,
  }
}

function fieldFocus(state: Effective, ink: string): React.CSSProperties {
  if (state.inputStyle === "underline")
    return {
      borderWidth: "0 0 2px",
      borderColor: ink,
      borderRadius: 0,
      background: "none",
    }
  switch (state.focusInputStyle) {
    case "edge":
      return { borderColor: ink }
    case "thick-edge":
      return {
        borderColor: ink,
        outline: `2px solid ${ink}`,
        outlineOffset: -2,
      }
    case "ring":
      return { borderColor: ink, ...buttonRing(state, ink), boxShadow: "none" }
    default:
      return { borderColor: ink, outline: `2px solid ${mix(ink, 35)}` }
  }
}

/** What keyboard focus looks like on a button, a check, a switch and a
 *  field, in the panel's own inks. */
export function FocusSpecimen() {
  const { effective: state } = useStudio()
  const ink = state.focusColor === "neutral" ? "var(--color-fg)" : INK
  const part = partRing(state, ink)
  return (
    <div className="flex h-36 shrink-0 flex-col items-center justify-center gap-5 rounded-lg tint-5">
      <div className="flex items-center gap-6">
        <span
          className="flex h-7 items-center rounded-md bg-fg px-3 text-[12px] font-medium text-bg"
          style={buttonRing(state, ink)}
        >
          Save
        </span>
        <span className="size-4 rounded-[4px] bg-fg" style={part} />
        <span
          className="relative h-[18px] w-[30px] rounded-full bg-fg/25"
          style={part}
        >
          <span className="absolute top-0.5 left-0.5 size-3.5 rounded-full bg-fg" />
        </span>
      </div>
      <span
        className="flex h-8 w-48 items-center rounded-md border border-fg/20 bg-bg px-2.5 text-[12px] text-fg/50"
        style={fieldFocus(state, ink)}
      >
        name@company.com
      </span>
    </div>
  )
}

/* Painted words: the option is the highlight itself. The blue depicts the OS
   default. */
const HIGHLIGHT_CHIPS: Record<string, string> = {
  accent: "bg-text-selection text-fg-on-text-selection",
  browser: "bg-[#B3D7FF] text-[#1B1B1F]",
}

function HighlightChip({ value }: { value: string }) {
  return (
    <span className={cn("rounded-xs px-1 text-[11px]", HIGHLIGHT_CHIPS[value])}>
      Aa
    </span>
  )
}

export function FocusPreview({ state }: { state: Effective }) {
  return <ControlSpecimen state={state} />
}

export function DisabledPreview({ state }: { state: Effective }) {
  return <DisabledSpecimen treatment={state.disabledTreatment} />
}

/** The cursor over a control. */
export function CursorPreview({ state }: { state: Effective }) {
  const Glyph = state.cursorControls === "pointer" ? HandCursor : ArrowCursor
  return (
    <span className="block size-5 shrink-0 *:size-full">
      <Glyph />
    </span>
  )
}

export function TextSelectionPreview({ state }: { state: Effective }) {
  return <HighlightChip value={state.selectionHighlight} />
}

/* The Focus page's pickers open under their row, clear of the preview. */
const UNDER = "bottom end"

const FocusStyleRow = () => (
  <DialSelect
    axis="focusStyle"
    label="Style"
    options={FOCUS_STYLE_OPTIONS}
    placement={UNDER}
  />
)

const FocusWidthRow = () => (
  <DialSlider
    axis="focusWidth"
    label="Width"
    minValue={1}
    maxValue={4}
    step={1}
    format={(value) => `${value}px`}
  />
)

const SWATCH: Record<string, string> = {
  accent: "var(--accent-700)",
  neutral: "var(--color-fg)",
}

const FOCUS_COLOR_ROW_OPTIONS = FOCUS_COLOR_OPTIONS.map((option) => ({
  ...option,
  glyph: (
    <span
      className="size-2.5 shrink-0 rounded-full"
      style={{ background: SWATCH[option.value] }}
    />
  ),
}))

const FocusColorRow = () => (
  <DialSelect
    axis="focusColor"
    label="Color"
    options={FOCUS_COLOR_ROW_OPTIONS}
    placement={UNDER}
  />
)

const FieldFocusRow = () => (
  <DialSelect
    axis="focusInputStyle"
    label="Style"
    options={FOCUS_INPUT_STYLE_OPTIONS}
    placement={UNDER}
  />
)

const DISABLED_ROW_OPTIONS = DISABLED_OPTIONS.map((option) => ({
  ...option,
  glyph: <DisabledSpecimen treatment={option.value} />,
}))

const DisabledRow = () => (
  <DialSelect
    axis="disabledTreatment"
    label="Disabled"
    options={DISABLED_ROW_OPTIONS}
  />
)

const INVALID_ROW_OPTIONS = INVALID_OPTIONS.map((option) => ({
  ...option,
  glyph: <InvalidSpecimen invalid={option.value} />,
}))

const InvalidRow = () => (
  <DialSelect
    axis="invalidStyle"
    label="Invalid"
    options={INVALID_ROW_OPTIONS}
  />
)

const CursorControlsRow = () => (
  <DialSelect
    axis="cursorControls"
    label="Controls"
    options={CURSOR_CONTROL_OPTIONS}
  />
)

const CursorDisabledRow = () => (
  <DialSelect
    axis="cursorDisabled"
    label="Disabled"
    options={CURSOR_DISABLED_OPTIONS}
  />
)

const ControlTextRow = () => (
  <DialSelect
    axis="selectionUiText"
    label="Control text"
    options={CONTROL_TEXT_OPTIONS}
  />
)

const HIGHLIGHT_ROW_OPTIONS = HIGHLIGHT_OPTIONS.map((option) => ({
  ...option,
  glyph: <HighlightChip value={option.value} />,
}))

const HighlightRow = () => (
  <DialSelect
    axis="selectionHighlight"
    label="Highlight"
    options={HIGHLIGHT_ROW_OPTIONS}
  />
)

export const ROWS: RowMap = {
  focusStyle: FocusStyleRow,
  focusWidth: FocusWidthRow,
  focusColor: FocusColorRow,
  focusInputStyle: FieldFocusRow,
  disabledTreatment: DisabledRow,
  invalidStyle: InvalidRow,
  cursorControls: CursorControlsRow,
  cursorDisabled: CursorDisabledRow,
  selectionUiText: ControlTextRow,
  selectionHighlight: HighlightRow,
}
