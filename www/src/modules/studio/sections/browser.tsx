"use client"

/* Cursor and text selection — what the product overrides of the browser's
   own chrome. Cursor opens the four pointer decisions (links keep the hand
   everywhere, so they are not one of them); Text selection opens whether UI
   text selects and the highlight. Scrollbars stay native. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS } from "../axes/cursor"
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

/* ------------------------------- Highlight -------------------------------- */

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_OPTIONS = [
  {
    value: "accent",
    label: "Accent",
    preview: (
      <span className="rounded-xs bg-text-selection px-1 text-[11px] text-fg-on-text-selection">
        Aa
      </span>
    ),
  },
  {
    value: "browser",
    label: "Browser",
    preview: (
      <span className="rounded-xs bg-[#B3D7FF] px-1 text-[11px] text-[#1B1B1F]">
        Aa
      </span>
    ),
  },
]

/* --------------------------------- Section --------------------------------- */

function CursorGlyph({ state }: { state: StudioState }) {
  return (
    <Glyph>
      {state.cursorControls === "pointer" ? <HandCursor /> : <ArrowCursor />}
    </Glyph>
  )
}

export function BrowserSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const changed = CURSOR_ROWS.filter(
    (row) => state[row.key] !== CURSOR_DEFAULTS[row.key],
  ).length
  const highlight =
    HIGHLIGHT_OPTIONS.find((o) => o.value === state.selectionHighlight) ??
    HIGHLIGHT_OPTIONS[0]!
  return (
    <>
      <DialTrigger
        label="Cursor"
        value={
          <>
            <span className="truncate">
              {state.cursorControls === "pointer" ? "Hand" : "Arrow"}
              {changed > (state.cursorControls === "pointer" ? 0 : 1) &&
                ` · ${changed}`}
            </span>
            <CursorGlyph state={state} />
          </>
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
              {highlight.label}
              {state.selectionUiText === "selectable" && " · Selectable"}
            </span>
            {highlight.preview}
          </>
        }
      >
        <DialPopover>
          <DialToggle
            label="Selectable"
            value={state.selectionUiText === "selectable"}
            onChange={(on) =>
              set("selectionUiText")(on ? "selectable" : "none")
            }
          />
          <DialSegmented
            label="Highlight"
            value={state.selectionHighlight}
            onChange={set("selectionHighlight")}
            options={HIGHLIGHT_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
