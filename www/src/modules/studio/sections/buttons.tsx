"use client"

/* Segmented control and Pagination rows. */

import { CURRENT_OPTIONS } from "../axes/pagination.meta"
import {
  SELECTED_OPTIONS as CHIP_OPTIONS,
  TRACK_OPTIONS,
} from "../axes/segmented-control.meta"
import { DialGlyph, DialSelect } from "../dial"
import type { RowMap } from "../row-host"

/** The current page among quiet ones. */
function CurrentGlyph({ current }: { current: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {current === "primary" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
        />
      ) : current === "selected" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
          opacity=".25"
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

function SegmentedSelectedRow() {
  return (
    <DialSelect
      axis="segmentedSelected"
      label="Segmented chip"
      options={CHIP_OPTIONS}
    />
  )
}

function SegmentedTrackRow() {
  return (
    <DialSelect axis="segmentedTrack" label="Track" options={TRACK_OPTIONS} />
  )
}

const CURRENT_ROW = CURRENT_OPTIONS.map((option) => ({
  ...option,
  glyph: (
    <DialGlyph>
      <CurrentGlyph current={option.value} />
    </DialGlyph>
  ),
}))

function PaginationCurrentRow() {
  return (
    <DialSelect
      axis="paginationCurrent"
      label="Current page"
      options={CURRENT_ROW}
    />
  )
}

export const ROWS: RowMap = {
  segmentedSelected: SegmentedSelectedRow,
  segmentedTrack: SegmentedTrackRow,
  paginationCurrent: PaginationCurrentRow,
}
