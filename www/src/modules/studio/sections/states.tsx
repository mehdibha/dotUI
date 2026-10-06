"use client"

/* States — the treatments every control wears at once: focus, disabled,
   invalid, the cursor over each kind of control and text selection. Focus
   is one popover: each pick, then only the knobs its style reads. The ring's
   ink is a leaf of Color's Primary. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS } from "../axes/cursor"
import { TREATMENT_OPTIONS } from "../axes/disabled"
import {
  FOCUS_DEFAULTS,
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
import { HIGHLIGHT_OPTIONS } from "../axes/selection"
import {
  DialGap,
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialSlider,
  DialToggle,
  DialTrigger,
  optionLabel,
} from "../dial"
import type { DialOption } from "../dial"
import { CardGrid } from "../patterns"
import { GroupTitle } from "../rows"
import type { Effective, Studio, StudioState } from "../state"
import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
  OpenHandCursor,
  ProgressCursor,
  WaitCursor,
} from "./cursors"

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

/* --------------------------------- Cursors -------------------------------- */

function Glyph({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("size-4 shrink-0 *:size-full", className)}>
      {children}
    </span>
  )
}

const cursor = (
  value: string,
  label: string,
  glyph: React.ReactNode,
): DialOption => ({
  value,
  label: (
    <>
      <Glyph>{glyph}</Glyph>
      {label}
    </>
  ),
})

const CURSOR_ROWS = [
  {
    key: "cursorControls",
    label: "Controls",
    options: [
      cursor("default", "Arrow", <ArrowCursor />),
      cursor("pointer", "Hand", <HandCursor />),
    ],
  },
  {
    key: "cursorPending",
    label: "Pending",
    options: [
      cursor("default", "Arrow", <ArrowCursor />),
      cursor("progress", "Progress", <ProgressCursor />),
      cursor("wait", "Wait", <WaitCursor />),
    ],
  },
  {
    key: "cursorDragging",
    label: "Dragging",
    options: [
      cursor("inherit", "Arrow", <ArrowCursor />),
      cursor("grab", "Grab", <OpenHandCursor />),
    ],
  },
  {
    key: "cursorDisabled",
    label: "Disabled",
    options: [
      cursor("default", "Arrow", <ArrowCursor />),
      cursor("not-allowed", "Blocked", <NotAllowedCursor />),
    ],
  },
] as const

/* ----------------------------- Text selection ----------------------------- */

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
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

/* --------------------------------- Section --------------------------------- */

const FOCUS_KEYS = Object.keys(FOCUS_DEFAULTS)

export function StatesPreview({ state }: { state: Effective }) {
  return <ControlSpecimen style={state.focusStyle} />
}

function statesSummary(state: StudioState): string {
  return `${optionLabel(FOCUS_STYLE_OPTIONS, state.focusStyle)} · ${optionLabel(FOCUS_INPUT_STYLE_OPTIONS, state.focusInputStyle)}`
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

function cursorSummary(state: StudioState): string {
  return state.cursorControls === "pointer" ? "Hand" : "Arrow"
}

export function StatesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const changed = CURSOR_ROWS.filter(
    (row) => state[row.key] !== CURSOR_DEFAULTS[row.key],
  ).length
  return (
    <>
      <DialTrigger
        label="Focus"
        holds={FOCUS_KEYS}
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
        axis="disabledTreatment"
        label="Disabled"
        options={TREATMENT_OPTIONS.map((option) => ({
          ...option,
          preview: <DisabledSpecimen treatment={option.value} />,
        }))}
      />
      <DialSelect
        axis="inputError"
        label="Invalid"
        options={ERROR_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <ErrorGlyph kind={option.value as "border" | "message" | "bar"} />
            </DialGlyph>
          ),
        }))}
      />
      <DialTrigger
        label="Cursor"
        holds={CURSOR_ROWS.map((row) => row.key)}
        value={
          <span className="truncate">
            {cursorSummary(state)}
            {changed > (state.cursorControls === "pointer" ? 0 : 1) &&
              ` · ${changed}`}
          </span>
        }
      >
        <DialPopover className="w-80">
          {CURSOR_ROWS.map((row) => (
            <DialSegmented
              key={row.key}
              label={row.label}
              value={state[row.key]}
              onChange={set(row.key)}
              options={[...row.options]}
            />
          ))}
        </DialPopover>
      </DialTrigger>
      <DialTrigger
        label="Text selection"
        holds={["selectionHighlight", "selectionUiText"]}
        value={
          <>
            <span className="truncate">
              {optionLabel(HIGHLIGHT_OPTIONS, state.selectionHighlight)}
              {state.selectionUiText === "selectable" && " · Selectable"}
            </span>
            <HighlightChip value={state.selectionHighlight} />
          </>
        }
      >
        <DialPopover className="w-80">
          <DialSegmented
            label="Highlight"
            value={state.selectionHighlight}
            onChange={set("selectionHighlight")}
            options={HIGHLIGHT_OPTIONS.map((option) => ({
              value: option.value,
              label: (
                <>
                  <HighlightChip value={option.value} />
                  {option.label}
                </>
              ),
            }))}
          />
          <DialToggle
            label="Selectable UI text"
            value={state.selectionUiText === "selectable"}
            onChange={(on) =>
              set("selectionUiText")(on ? "selectable" : "none")
            }
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
