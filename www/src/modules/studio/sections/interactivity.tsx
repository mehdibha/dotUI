"use client"

/* Interactivity — how the product answers the pointer and text selection: the
   cursor over each kind of control, whether UI text selects, the selection
   highlight. Links keep the hand everywhere, so they are not a cursor row. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS, CURSOR_OPTIONS } from "../axes/cursor"
import { HIGHLIGHT_OPTIONS } from "../axes/selection"
import { DialPopover, DialSegmented, DialToggle, DialTrigger } from "../dial"
import type { DialOption } from "../dial"
import type { Studio, StudioState } from "../state"
import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
  OpenHandCursor,
  ProgressCursor,
  WaitCursor,
} from "./cursors"

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

const CURSOR_GLYPHS: Record<string, React.ReactNode> = {
  default: <ArrowCursor />,
  inherit: <ArrowCursor />,
  pointer: <HandCursor />,
  progress: <ProgressCursor />,
  wait: <WaitCursor />,
  grab: <OpenHandCursor />,
  "not-allowed": <NotAllowedCursor />,
}

const CURSOR_ROWS = (
  [
    ["cursorControls", "Controls"],
    ["cursorPending", "Pending"],
    ["cursorDragging", "Dragging"],
    ["cursorDisabled", "Disabled"],
  ] as const
).map(([key, label]) => ({
  key,
  label,
  options: CURSOR_OPTIONS[key].map(
    (option): DialOption => ({
      value: option.value,
      label: (
        <>
          <Glyph>{CURSOR_GLYPHS[option.value]}</Glyph>
          {option.label}
        </>
      ),
    }),
  ),
}))

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

const optionLabel = (
  options: { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value

/* --------------------------------- Section --------------------------------- */

export function InteractivityPreview({ state }: { state: StudioState }) {
  return (
    <Glyph>
      {state.cursorControls === "pointer" ? <HandCursor /> : <ArrowCursor />}
    </Glyph>
  )
}

function cursorSummary(state: StudioState): string {
  return state.cursorControls === "pointer" ? "Hand" : "Arrow"
}

export function InteractivitySection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const changed = CURSOR_ROWS.filter(
    (row) => state[row.key] !== CURSOR_DEFAULTS[row.key],
  ).length
  return (
    <>
      <DialTrigger
        label="Cursor"
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
              options={row.options}
            />
          ))}
        </DialPopover>
      </DialTrigger>
      <DialTrigger
        label="Text selection"
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
