"use client"

/* States — the treatments every control wears at once: focus, disabled,
   invalid. Focus is one recipe in one popover: the ring controls wear, the
   layer fields wear, each pick followed by only the knobs that style reads.
   The ring's ink is a leaf of Color's Primary, so it is not repeated here.
   Menu items highlight, no ring. */

import { cn } from "@/registry/lib/utils"

import { TREATMENT_OPTIONS } from "../axes/disabled"
import {
  FOCUS_GAP_RANGE,
  FOCUS_INPUT_BORDER_RANGE,
  FOCUS_INPUT_STYLE_OPTIONS,
  FOCUS_INPUT_WIDTH_RANGE,
  FOCUS_OFFSET_OPTIONS,
  FOCUS_STRENGTH_RANGE,
  FOCUS_STYLE_OPTIONS,
  FOCUS_WIDTH_RANGE,
} from "../axes/focus"
import { ERROR_OPTIONS } from "../axes/invalid"
import {
  DialGap,
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialTrigger,
} from "../dial"
import { CardGrid } from "../patterns"
import { GroupTitle } from "../rows"
import type { Effective, Studio, StudioState } from "../state"

const px = (n: number) => `${n}px`

/* Focus specimens: a control and a field wearing each style, drawn with the
   panel's own focus ink at a legible fixed geometry. Small beside the row's
   value, larger on the popover's cards. */
const INK = "var(--color-border-focus)"
const BG = "var(--color-bg)"
const halo = (pct: number) => `color-mix(in oklab, ${INK} ${pct}%, transparent)`

const CONTROL_RINGS: Record<string, string> = {
  ring: `0 0 0 1.5px ${BG}, 0 0 0 3px ${INK}`,
  halo: `0 0 0 3px ${halo(45)}`,
  duo: `inset 0 0 0 1px ${BG}, 0 0 0 1.5px ${INK}`,
}

const SPECIMEN = "mx-1 block h-3.5 w-6 shrink-0 rounded-[4px]"
const CARD_SPECIMEN = "mx-auto my-1.5 block h-5 w-10 shrink-0 rounded-md"

function ControlSpecimen({ style, card }: { style: string; card?: boolean }) {
  return (
    <span
      className={cn(card ? CARD_SPECIMEN : SPECIMEN, "bg-fg/25")}
      style={{ boxShadow: CONTROL_RINGS[style] }}
    />
  )
}

const FIELD_RINGS: Record<string, React.CSSProperties> = {
  halo: { borderColor: INK, boxShadow: `0 0 0 2.5px ${halo(30)}` },
  ring: { boxShadow: `0 0 0 1.5px ${BG}, 0 0 0 3px ${INK}` },
  border: { borderColor: INK, borderWidth: 2 },
}

function FieldSpecimen({ style, card }: { style: string; card?: boolean }) {
  return (
    <span
      className={cn(
        card ? CARD_SPECIMEN : SPECIMEN,
        "border border-fg/30 bg-bg",
      )}
      style={FIELD_RINGS[style]}
    />
  )
}

/* Disabled specimens: the same filled control under each treatment. */
function DisabledSpecimen({ treatment }: { treatment: string }) {
  return (
    <span
      className={cn(
        "block h-3.5 w-6 shrink-0 rounded-[4px]",
        treatment === "solid" && "bg-disabled",
        treatment === "fade" && "bg-primary opacity-50",
        treatment === "alpha" && "bg-fg/12",
      )}
    />
  )
}

function ErrorGlyph({ kind }: { kind: "border" | "message" | "bar" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {kind === "border" && (
        <>
          <rect
            x="3.75"
            y="8"
            width="16.5"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg-danger"
          />
          <path
            d="M7 12h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity=".35"
          />
        </>
      )}
      {kind === "message" && (
        <>
          <rect
            x="3.75"
            y="4.5"
            width="16.5"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg-danger"
          />
          <circle
            cx="5.5"
            cy="17.25"
            r="1.4"
            fill="currentColor"
            className="text-fg-danger"
          />
          <path
            d="M9 17.25h7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-fg-danger"
          />
        </>
      )}
      {kind === "bar" && (
        <>
          <rect
            x="4"
            y="4.5"
            width="2"
            height="15"
            rx="1"
            fill="currentColor"
            className="text-fg-danger"
          />
          <path
            d="M9 7h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-fg-danger"
          />
          <rect
            x="9"
            y="10.5"
            width="11"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity=".45"
          />
        </>
      )}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

const label = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

export function StatesPreview({ state }: { state: Effective }) {
  return <ControlSpecimen style={state.focusStyle} />
}

export function statesSummary(state: StudioState): string {
  return `${label(FOCUS_STYLE_OPTIONS, state.focusStyle)} · ${label(FOCUS_INPUT_STYLE_OPTIONS, state.focusInputStyle)}`
}

/** Mounted with the popover: each pick, then the knobs its style reads
 *  (the rest are hidden by the focus rules). Labels drop the "Ring"/"Field"
 *  prefix — the group carries it. */
function FocusPanel({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <GroupTitle>Controls</GroupTitle>
      <CardGrid
        label="Control focus"
        columns={3}
        value={state.focusStyle}
        onChange={set("focusStyle")}
        options={FOCUS_STYLE_OPTIONS.map((option) => ({
          id: option.value,
          label: option.label,
          children: <ControlSpecimen style={option.value} card />,
        }))}
      />
      <DialSlider
        axis="focusWidth"
        label="Width"
        minValue={FOCUS_WIDTH_RANGE.min}
        maxValue={FOCUS_WIDTH_RANGE.max}
        step={FOCUS_WIDTH_RANGE.step}
        format={px}
      />
      <DialSlider
        axis="focusHaloStrength"
        label="Strength"
        minValue={FOCUS_STRENGTH_RANGE.min}
        maxValue={FOCUS_STRENGTH_RANGE.max}
        step={FOCUS_STRENGTH_RANGE.step}
        format={(v) => `${v}%`}
      />
      <DialSegmented
        axis="focusOffset"
        label="Offset"
        options={FOCUS_OFFSET_OPTIONS}
      />
      <DialSlider
        axis="focusGap"
        label="Gap"
        minValue={FOCUS_GAP_RANGE.min}
        maxValue={FOCUS_GAP_RANGE.max}
        step={FOCUS_GAP_RANGE.step}
        format={px}
      />
      <DialGap />
      <GroupTitle>Fields</GroupTitle>
      <CardGrid
        label="Field focus"
        columns={3}
        value={state.focusInputStyle}
        onChange={set("focusInputStyle")}
        options={FOCUS_INPUT_STYLE_OPTIONS.map((option) => ({
          id: option.value,
          label: option.label,
          children: <FieldSpecimen style={option.value} card />,
        }))}
      />
      <DialSlider
        axis="focusInputWidth"
        label="Width"
        minValue={FOCUS_INPUT_WIDTH_RANGE.min}
        maxValue={FOCUS_INPUT_WIDTH_RANGE.max}
        step={FOCUS_INPUT_WIDTH_RANGE.step}
        format={px}
      />
      <DialSlider
        axis="focusInputStrength"
        label="Strength"
        minValue={FOCUS_STRENGTH_RANGE.min}
        maxValue={FOCUS_STRENGTH_RANGE.max}
        step={FOCUS_STRENGTH_RANGE.step}
        format={(v) => `${v}%`}
      />
      <DialSlider
        axis="focusInputBorderWidth"
        label="Width"
        minValue={FOCUS_INPUT_BORDER_RANGE.min}
        maxValue={FOCUS_INPUT_BORDER_RANGE.max}
        step={FOCUS_INPUT_BORDER_RANGE.step}
        format={px}
      />
    </>
  )
}

export function StatesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialTrigger
        label="Focus"
        value={
          <>
            <span className="truncate">{statesSummary(state)}</span>
            <ControlSpecimen style={state.focusStyle} />
            <FieldSpecimen style={state.focusInputStyle} />
          </>
        }
      >
        <DialPopover className="w-80">
          <FocusPanel studio={studio} />
        </DialPopover>
      </DialTrigger>
      <DialSelect
        label="Disabled"
        value={state.disabledTreatment}
        onChange={set("disabledTreatment")}
        options={TREATMENT_OPTIONS.map((option) => ({
          ...option,
          preview: <DisabledSpecimen treatment={option.value} />,
        }))}
      />
      <DialSelect
        label="Invalid"
        value={state.inputError}
        onChange={set("inputError")}
        options={ERROR_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <ErrorGlyph kind={option.value as "border" | "message" | "bar"} />
            </DialGlyph>
          ),
        }))}
      />
    </>
  )
}
