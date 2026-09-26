"use client"

/* Popovers — the anchored panel's own decisions past Surfaces, Menus and
   Motion: the arrow at the trigger and how a title sits. The tooltip is a
   surface decision of its own, never synced to the popover's. */

import { PICKER_OPTIONS } from "../axes/mobile"
import { HEADER_OPTIONS } from "../axes/popovers"
import { TOOLTIP_STYLE_OPTIONS } from "../axes/tooltips"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialToggle,
  DialTrigger,
} from "../dial"
import type { Studio, StudioState } from "../state"

/* -------------------------------- Specimens -------------------------------- */

/** The panel over the trigger it's anchored to, with or without the tip. */
function TipGlyph({ tip }: { tip: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8h10M7 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
      {tip && <path d="M10.3 14.7 12 17.2l1.7-2.5Z" fill="currentColor" />}
      <path
        d="M9 20.5h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** The chip with its caret, over the thing it names. */
function TooltipGlyph({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5.5"
        width="14"
        height="7"
        rx="2"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="1.5"
      />
      <path
        d="M10.3 12.5 12 15l1.7-2.5Z"
        fill="currentColor"
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity=".45" />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

function PopoversPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <TipGlyph tip={state.popoverTip === "tip"} />
    </DialGlyph>
  )
}

export function PopoversSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialTrigger
        label="Popover"
        value={
          <>
            <span className="truncate">
              {state.popoverTip === "tip" ? "Arrow" : "Plain"}
            </span>
            <PopoversPreview state={state} />
          </>
        }
      >
        <DialPopover className="w-72">
          <DialToggle
            label="Arrow"
            value={state.popoverTip === "tip"}
            onChange={(on) => set("popoverTip")(on ? "tip" : "none")}
          />
          <DialSegmented
            label="Header"
            value={state.popoverHeader}
            onChange={set("popoverHeader")}
            options={HEADER_OPTIONS}
          />
          <DialSegmented
            label="On mobile"
            value={state.mobilePickers}
            onChange={set("mobilePickers")}
            options={PICKER_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
      <DialSelect
        label="Tooltip"
        value={state.tooltipStyle}
        onChange={set("tooltipStyle")}
        options={TOOLTIP_STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <TooltipGlyph filled={option.value === "inverted"} />
            </DialGlyph>
          ),
        }))}
      />
    </>
  )
}
