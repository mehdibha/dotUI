"use client"

/* Browser — what the product overrides of the browser's own chrome: the
   pointer over controls, whether UI text selects, the selection highlight,
   the scrollbars. Cursor is one row opening the four pointer decisions;
   links keep the hand everywhere, so they are not one of them. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS, CURSOR_OPTIONS } from "../axes/cursor"
import { STYLE_OPTIONS } from "../axes/scrollbars"
import { HIGHLIGHT_OPTIONS } from "../axes/selection"
import {
  DialPopover,
  DialSegmented,
  DialSelect,
  DialToggle,
  DialTrigger,
} from "../dial"
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

/* ------------------------------- Scrollbars ------------------------------- */

function ScrollbarGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h10.5M4 12h10.5M4 18h10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      {kind === "native" && (
        <>
          <rect
            x="17.5"
            y="3.5"
            width="4"
            height="17"
            rx="2"
            fill="currentColor"
            opacity=".2"
          />
          <rect
            x="17.5"
            y="5"
            width="4"
            height="8"
            rx="2"
            fill="currentColor"
          />
        </>
      )}
      {kind === "thin" && (
        <rect
          x="19"
          y="5"
          width="2.5"
          height="9"
          rx="1.25"
          fill="currentColor"
        />
      )}
      {kind === "overlay" && (
        <rect
          x="19"
          y="5"
          width="2.5"
          height="9"
          rx="1.25"
          fill="currentColor"
          opacity=".3"
        />
      )}
    </svg>
  )
}

/* ------------------------------- Highlight -------------------------------- */

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_PREVIEWS: Record<string, React.ReactNode> = {
  accent: (
    <span className="rounded-xs bg-text-selection px-1 text-[11px] text-fg-on-text-selection">
      Aa
    </span>
  ),
  browser: (
    <span className="rounded-xs bg-[#B3D7FF] px-1 text-[11px] text-[#1B1B1F]">
      Aa
    </span>
  ),
}

/* --------------------------------- Section --------------------------------- */

export function BrowserPreview({ state }: { state: StudioState }) {
  return (
    <Glyph>
      {state.cursorControls === "pointer" ? <HandCursor /> : <ArrowCursor />}
    </Glyph>
  )
}

export function browserSummary(state: StudioState): string {
  return state.cursorControls === "pointer" ? "Hand" : "Arrow"
}

export function BrowserSection({ studio }: { studio: Studio }) {
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
            {browserSummary(state)}
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
      <DialToggle
        label="Selectable"
        value={state.selectionUiText === "selectable"}
        onChange={(on) => set("selectionUiText")(on ? "selectable" : "none")}
      />
      <DialSelect
        label="Highlight"
        value={state.selectionHighlight}
        onChange={set("selectionHighlight")}
        options={HIGHLIGHT_OPTIONS.map((option) => ({
          ...option,
          preview: HIGHLIGHT_PREVIEWS[option.value],
        }))}
      />
      <DialSelect
        label="Scrollbars"
        value={state.scrollbarStyle}
        onChange={set("scrollbarStyle")}
        options={STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <Glyph>
              <ScrollbarGlyph kind={option.value} />
            </Glyph>
          ),
        }))}
      />
    </>
  )
}
