"use client"

/* Browser — what the product overrides of the browser's own chrome: the
   pointer over controls, whether UI text selects, the selection highlight,
   the scrollbars. Cursor is one row opening the four pointer decisions;
   links keep the hand everywhere, so they are not one of them. */

import { cn } from "@/registry/lib/utils"

import { CURSOR_DEFAULTS } from "../axes/cursor"
import { STYLE_OPTIONS } from "../axes/scrollbars"
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
          <>
            <span className="truncate">
              {browserSummary(state)}
              {changed > (state.cursorControls === "pointer" ? 0 : 1) &&
                ` · ${changed}`}
            </span>
            <BrowserPreview state={state} />
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
      <DialToggle
        label="Selectable"
        value={state.selectionUiText === "selectable"}
        onChange={(on) => set("selectionUiText")(on ? "selectable" : "none")}
      />
      <DialSelect
        label="Highlight"
        value={state.selectionHighlight}
        onChange={set("selectionHighlight")}
        options={HIGHLIGHT_OPTIONS}
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
