"use client"

/* Interactivity — how the product answers the pointer and text selection: the
   cursor over each kind of control, whether UI text selects, the selection
   highlight. Links keep the hand everywhere, so they are not a cursor row. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS } from "../axes/cursor"
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
              options={[...row.options]}
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
