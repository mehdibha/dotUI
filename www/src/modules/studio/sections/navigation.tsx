"use client"

/* Navigation: how the current location is marked in tabs, the sidebar,
   links and breadcrumbs. */

import { ANCESTOR_OPTIONS, SEPARATOR_OPTIONS } from "../axes/breadcrumbs.meta"
import { UNDERLINE_OPTIONS } from "../axes/links.meta"
import {
  CASE_OPTIONS,
  INDICATOR_OPTIONS,
  ITEM_WEIGHT_OPTIONS,
  MARKER_OPTIONS,
  PILL_OPTIONS,
  TAB_STYLE_OPTIONS,
  WEIGHT_OPTIONS,
} from "../axes/navigation.meta"
import { DialGlyph, DialSelect } from "../dial"
import type { RowMap } from "../row-host"

/** The row's tabs: a chip on a track, an underline, or a lone pill. */
function TabStyleGlyph({ style }: { style: string }) {
  return (
    <DialGlyph>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        {style === "segmented" && (
          <>
            <rect
              x="2"
              y="6.5"
              width="20"
              height="11"
              rx="3"
              fill="currentColor"
              fillOpacity=".15"
            />
            <rect
              x="3.5"
              y="8"
              width="9"
              height="8"
              rx="2"
              fill="currentColor"
              fillOpacity=".7"
            />
          </>
        )}
        {style === "line" && (
          <>
            <path d="M2 18.5h20" stroke="currentColor" opacity=".3" />
            <path d="M3 18.25h9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M4.5 12h6M14 12h6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity=".6"
            />
          </>
        )}
        {style === "pill" && (
          <>
            <rect
              x="2"
              y="7"
              width="11"
              height="10"
              rx="5"
              fill="currentColor"
              fillOpacity=".7"
            />
            <path
              d="M16 12h5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity=".5"
            />
          </>
        )}
      </svg>
    </DialGlyph>
  )
}

const TAB_STYLE_ROW = TAB_STYLE_OPTIONS.map((option) => ({
  ...option,
  glyph: <TabStyleGlyph style={option.value} />,
}))

function TabStyleRow() {
  return <DialSelect axis="tabStyle" label="Tabs" options={TAB_STYLE_ROW} />
}

function NavMarkerRow() {
  return (
    <DialSelect
      axis="navMarker"
      label="Current item"
      options={MARKER_OPTIONS}
    />
  )
}

function TabIndicatorRow() {
  return (
    <DialSelect
      axis="tabIndicator"
      label="Line indicator"
      options={INDICATOR_OPTIONS}
    />
  )
}

function NavWeightRow() {
  return <DialSelect axis="navWeight" label="Weight" options={WEIGHT_OPTIONS} />
}

function NavItemWeightRow() {
  return (
    <DialSelect
      axis="navItemWeight"
      label="Sidebar weight"
      options={ITEM_WEIGHT_OPTIONS}
    />
  )
}

function NavCaseRow() {
  return <DialSelect axis="navCase" label="Case" options={CASE_OPTIONS} />
}

function TabsPillRow() {
  return <DialSelect axis="tabsPill" label="Pill fill" options={PILL_OPTIONS} />
}

function LinkUnderlineRow() {
  return (
    <DialSelect
      axis="linkUnderline"
      label="Underline"
      options={UNDERLINE_OPTIONS}
    />
  )
}

function BreadcrumbSeparatorRow() {
  return (
    <DialSelect
      axis="breadcrumbSeparator"
      label="Separator"
      options={SEPARATOR_OPTIONS}
    />
  )
}

function BreadcrumbToneRow() {
  return (
    <DialSelect
      axis="breadcrumbTone"
      label="Ancestors"
      options={ANCESTOR_OPTIONS}
    />
  )
}

export const ROWS: RowMap = {
  tabStyle: TabStyleRow,
  navMarker: NavMarkerRow,
  tabIndicator: TabIndicatorRow,
  navWeight: NavWeightRow,
  navItemWeight: NavItemWeightRow,
  navCase: NavCaseRow,
  tabsPill: TabsPillRow,
  linkUnderline: LinkUnderlineRow,
  breadcrumbSeparator: BreadcrumbSeparatorRow,
  breadcrumbTone: BreadcrumbToneRow,
}
