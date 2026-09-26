"use client"

/* Navigation — how a link announces itself, the selected-tab signature, the
   breadcrumb trail, and the current page. Link and tab colors are leaves of
   Color's Primary; pagination's cells wear Buttons' look. */

import { cn } from "@/registry/lib/utils"

import { SEPARATOR_OPTIONS, TONE_OPTIONS } from "../axes/breadcrumbs"
import { UNDERLINE_OPTIONS } from "../axes/links"
import { CURRENT_OPTIONS } from "../axes/pagination"
import { TAB_STYLE_OPTIONS } from "../axes/tabs"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import type { Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

function LinkGlyph({ underline }: { underline: string }) {
  return (
    <span
      className={cn(
        "shrink-0 text-[11px] font-medium text-fg/80 underline-offset-2",
        underline === "always" && "underline",
        underline === "hover" && "underline decoration-fg/30",
      )}
    >
      Link
    </span>
  )
}

function TabGlyph({ style }: { style: string }) {
  if (style === "segmented")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="7.5"
          width="18"
          height="9"
          rx="3"
          fill="currentColor"
          opacity=".2"
        />
        <rect
          x="4.5"
          y="9"
          width="7.5"
          height="6"
          rx="2"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
  if (style === "line")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="7.5"
          y="8.5"
          width="9"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".5"
        />
        <path
          d="M3 16h18"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".3"
        />
        <path
          d="M6.5 16h11"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  if (style === "pill")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="7.5"
          width="15"
          height="9"
          rx="4.5"
          fill="currentColor"
          opacity=".25"
        />
        <rect
          x="8"
          y="10.75"
          width="8"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16.5h3.5v-5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5H21"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="11.5"
        width="5"
        height="2.5"
        rx="1.25"
        fill="currentColor"
        opacity=".5"
      />
    </svg>
  )
}

function SeparatorGlyph({ separator }: { separator: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12h4M17.5 12h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      {separator === "slash" ? (
        <path
          d="M13.75 6.5 10.25 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m10.5 7.5 4.5 4.5-4.5 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function CurrentGlyph({ current }: { current: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {current === "filled" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
        />
      ) : (
        <rect
          x="8.25"
          y="8.25"
          width="7.5"
          height="7.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function NavigationSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Link"
        value={state.linkUnderline}
        onChange={set("linkUnderline")}
        options={UNDERLINE_OPTIONS.map((option) => ({
          ...option,
          preview: <LinkGlyph underline={option.value} />,
        }))}
      />
      <DialSelect
        label="Tabs"
        value={state.tabStyle}
        onChange={set("tabStyle")}
        rowPreview={false}
        options={TAB_STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <TabGlyph style={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialTrigger
        label="Breadcrumbs"
        value={
          <>
            <span className="truncate">
              {optionLabel(SEPARATOR_OPTIONS, state.breadcrumbSeparator)}
            </span>
            <DialGlyph>
              <SeparatorGlyph separator={state.breadcrumbSeparator} />
            </DialGlyph>
          </>
        }
      >
        <DialPopover>
          <DialSegmented
            label="Separator"
            value={state.breadcrumbSeparator}
            onChange={set("breadcrumbSeparator")}
            options={SEPARATOR_OPTIONS}
          />
          <DialSegmented
            label="Crumbs"
            value={state.breadcrumbTone}
            onChange={set("breadcrumbTone")}
            options={TONE_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
      <DialSelect
        label="Pagination"
        value={state.paginationCurrent}
        onChange={set("paginationCurrent")}
        options={CURRENT_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <CurrentGlyph current={option.value} />
            </DialGlyph>
          ),
        }))}
      />
    </>
  )
}
