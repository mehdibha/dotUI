"use client"

/* Interaction — focus, field focus, invalid and disabled on every control,
   then the cursors and text selection. Specimens draw each recipe with the
   panel's own inks at its real geometry. */

import { cn } from "@/registry/lib/utils"

import { HIGHLIGHT_OPTIONS } from "../axes/selection.meta"
import {
  AUTO_STRENGTH,
  AUTO_WIDTH,
  INVALID_FILL,
  NEUTRAL_FIELD_INK,
} from "../axes/states"
import {
  CONTROL_TEXT_OPTIONS,
  CURSOR_CONTROL_OPTIONS,
  CURSOR_DISABLED_OPTIONS,
  DISABLED_OPTIONS,
  FIELD_INK_ROW,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_INPUT_WEIGHT_OPTIONS,
  FOCUS_STYLE_OPTIONS,
  INVALID_OPTIONS,
  STRENGTH_OPTIONS,
  WIDTH_OPTIONS,
} from "../axes/states.meta"
import { DialSegmented, DialSelect } from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"
import { ArrowCursor, HandCursor, NotAllowedCursor } from "./cursors"

/* -------------------------------- Specimens -------------------------------- */

const INK = "var(--color-border-focus)"
const MUTED = "var(--color-border-focus-muted)"
const BG = "var(--color-bg)"
const DANGER = "var(--color-fg-danger)"
const DANGER_MUTED = "var(--color-danger-muted)"
const PCT: Record<string, number> = { solid: 100, soft: 50, faint: 30 }

const ink = (strength: string) =>
  `color-mix(in oklab, ${INK} ${PCT[strength] ?? 100}%, transparent)`

interface Ring {
  style: string
  strength: string
  width: number
}

/** The ring each recipe draws, as a box-shadow. */
function ringShadow({ style, strength, width }: Ring) {
  const color = ink(strength)
  if (style === "halo") return `0 0 0 ${width}px ${color}`
  if (style === "inset")
    return `inset 0 0 0 ${width}px ${color}, inset 0 0 0 ${width + 1}px ${BG}`
  return `0 0 0 2px ${BG}, 0 0 0 ${2 + width}px ${color}`
}

const SIZE = {
  row: "h-3.5 w-6 rounded-[4px]",
  card: "h-5 w-10 rounded-md",
}
type Size = keyof typeof SIZE

function ControlSpecimen({ ring, size }: { ring: Ring; size: Size }) {
  return (
    <span
      className={cn("mx-1 block shrink-0 bg-fg/25", SIZE[size])}
      style={{ boxShadow: ringShadow(ring) }}
    />
  )
}

/** The field's pair: the focus pair, or the neutral steps under Neutral. */
const fieldInks = (neutral?: boolean) =>
  neutral ? [NEUTRAL_FIELD_INK.edge, NEUTRAL_FIELD_INK.halo] : [INK, MUTED]

function fieldFocus(
  focus: string,
  weight: string,
  ring: Ring,
  neutral?: boolean,
) {
  if (focus === "ring") return { boxShadow: ringShadow(ring) }
  const [ink, muted] = fieldInks(neutral)
  if (focus === "border")
    return {
      borderColor: ink,
      boxShadow: weight === "thick" ? `inset 0 0 0 1px ${ink}` : undefined,
    }
  return {
    borderColor: ink,
    boxShadow: `0 0 0 ${weight === "thick" ? 4 : 2}px ${muted}`,
  }
}

function FieldSpecimen({
  focus,
  weight,
  ring,
  neutral,
  size,
}: {
  focus: string
  weight: string
  ring: Ring
  neutral?: boolean
  size: Size
}) {
  return (
    <span
      className={cn(
        "mx-1 block shrink-0 border border-fg/30 bg-bg",
        SIZE[size],
      )}
      style={fieldFocus(focus, weight, ring, neutral)}
    />
  )
}

function DisabledSpecimen({
  treatment,
  size,
}: {
  treatment: string
  size: Size
}) {
  // A filled button with its label: one grey for Solid, itself at 50% for Fade.
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE[size],
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

function InvalidSpecimen({ invalid, size }: { invalid: string; size: Size }) {
  return (
    <span
      className={cn("mx-1 block shrink-0 border bg-bg", SIZE[size])}
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

const ringOf = (state: Effective): Ring => ({
  style: state.focusStyle,
  strength: state.focusStrength,
  width: state.focusWidth,
})

/* --------------------------------- Glyphs --------------------------------- */

function Glyph({ children }: { children: React.ReactNode }) {
  return <span className="size-4 shrink-0 *:size-full">{children}</span>
}

const CURSOR_GLYPHS: Record<string, React.ReactNode> = {
  pointer: <HandCursor />,
  default: <ArrowCursor />,
  "not-allowed": <NotAllowedCursor />,
}

const cursorOptions = (options: { value: string; label: string }[]) =>
  options.map((option) => ({
    ...option,
    preview: <Glyph>{CURSOR_GLYPHS[option.value]}</Glyph>,
  }))

/* Painted words: the option is the highlight itself. The blue depicts the OS
   default, literal like the cursor drawings. */
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

/* ---------------------------------- Rows ----------------------------------- */

export function InteractionPreview({ state }: { state: Effective }) {
  return <ControlSpecimen ring={ringOf(state)} size="row" />
}

const FOCUS_STYLE_ROW_OPTIONS = FOCUS_STYLE_OPTIONS.map((option) => {
  const ring = {
    style: option.value,
    strength: AUTO_STRENGTH[option.value]!,
    width: AUTO_WIDTH[option.value]!,
  }
  return {
    ...option,
    preview: <ControlSpecimen ring={ring} size="card" />,
    glyph: <ControlSpecimen ring={ring} size="row" />,
  }
})

const FocusStyleRow = () => (
  <DialSelect
    axis="focusStyle"
    holds={["focusStrength", "focusWidth", "focusColor"]}
    label="Focus ring"
    options={FOCUS_STYLE_ROW_OPTIONS}
  >
    <Row axis="focusStrength" />
    <Row axis="focusWidth" />
    <Row axis="focusColor" />
  </DialSelect>
)

function FocusStrengthRow() {
  const ring = ringOf(useStudio().effective)
  return (
    <DialSelect
      axis="focusStrength"
      label="Strength"
      rowPreview={false}
      options={[
        { value: "auto", label: "Auto" },
        ...STRENGTH_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <ControlSpecimen
              ring={{ ...ring, strength: option.value }}
              size="row"
            />
          ),
        })),
      ]}
    />
  )
}

function FocusWidthRow() {
  const { effective, set } = useStudio()
  const ring = ringOf(effective)
  return (
    <DialSelect
      axis="focusWidth"
      label="Width"
      rowPreview={false}
      onChange={(value) =>
        set("focusWidth")(value === "auto" ? "auto" : Number(value))
      }
      options={[
        { value: "auto", label: "Auto" },
        ...WIDTH_OPTIONS.map((option) => ({
          ...option,
          value: String(option.value),
          preview: (
            <ControlSpecimen
              ring={{ ...ring, width: option.value }}
              size="row"
            />
          ),
        })),
      ]}
    />
  )
}

function FieldFocusRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="focusInputStyle"
      holds={["focusInputWeight", "focusInputColor"]}
      label="Field focus"
      options={FOCUS_INPUT_STYLE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <FieldSpecimen
            focus={option.value}
            weight={effective.focusInputWeight}
            ring={ringOf(effective)}
            neutral={effective.focusInputColor === "neutral"}
            size="row"
          />
        ),
      }))}
    >
      <Row axis="focusInputWeight" />
      <Row axis="focusInputColor" />
    </DialSelect>
  )
}

const FieldFocusWeightRow = () => (
  <DialSegmented
    axis="focusInputWeight"
    label="Weight"
    options={FOCUS_INPUT_WEIGHT_OPTIONS}
  />
)

function FieldInkRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="focusInputColor"
      label="Ink"
      options={FIELD_INK_ROW.map((option) => ({
        ...option,
        preview: (
          <FieldSpecimen
            focus={effective.focusInputStyle}
            weight={effective.focusInputWeight}
            ring={ringOf(effective)}
            neutral={option.value === "neutral"}
            size="row"
          />
        ),
      }))}
    />
  )
}

const DISABLED_ROW_OPTIONS = DISABLED_OPTIONS.map((option) => ({
  ...option,
  preview: <DisabledSpecimen treatment={option.value} size="row" />,
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
  preview: <InvalidSpecimen invalid={option.value} size="row" />,
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
    label="Control cursor"
    rowPreview={false}
    options={cursorOptions(CURSOR_CONTROL_OPTIONS)}
  />
)

const CursorDisabledRow = () => (
  <DialSelect
    axis="cursorDisabled"
    label="Disabled cursor"
    rowPreview={false}
    options={cursorOptions(CURSOR_DISABLED_OPTIONS)}
  />
)

/** A button label; a selectable one wears the highlight. */
function ControlTextChip({ value }: { value: string }) {
  return (
    <span className="rounded-xs border border-fg/20 px-1 text-[11px]">
      <span
        className={cn(
          value === "selectable" &&
            "bg-text-selection text-fg-on-text-selection",
        )}
      >
        Save
      </span>
    </span>
  )
}

const CONTROL_TEXT_ROW_OPTIONS = CONTROL_TEXT_OPTIONS.map((option) => ({
  ...option,
  preview: <ControlTextChip value={option.value} />,
}))

const ControlTextRow = () => (
  <DialSelect
    axis="selectionUiText"
    label="Control text"
    rowPreview={false}
    options={CONTROL_TEXT_ROW_OPTIONS}
  />
)

const HIGHLIGHT_ROW_OPTIONS = HIGHLIGHT_OPTIONS.map((option) => ({
  ...option,
  preview: <HighlightChip value={option.value} />,
}))

const HighlightRow = () => (
  <DialSelect
    axis="selectionHighlight"
    holds={["selectionUiText"]}
    label="Text selection"
    options={HIGHLIGHT_ROW_OPTIONS}
  >
    <Row axis="selectionUiText" />
  </DialSelect>
)

export const ROWS: RowMap = {
  focusStyle: FocusStyleRow,
  focusStrength: FocusStrengthRow,
  focusWidth: FocusWidthRow,
  focusInputStyle: FieldFocusRow,
  focusInputWeight: FieldFocusWeightRow,
  focusInputColor: FieldInkRow,
  disabledTreatment: DisabledRow,
  invalidStyle: InvalidRow,
  cursorControls: CursorControlsRow,
  cursorDisabled: CursorDisabledRow,
  selectionUiText: ControlTextRow,
  selectionHighlight: HighlightRow,
}
