"use client"

/* Calendar — the month-grid language only; the date-picker's trigger lives
   in Pickers, its field in Inputs. Options and their survey live in the axis
   module. Range fill is DERIVED from day shape — rounded and circle
   endpoints get a pill band, square cells an edge-to-edge tint — no lever.
   Rejected: cell density (global Space axis); range-segment styling (no
   cross-system fork; Inputs + Selection own it). */

import {
  DAY_SHAPE_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "../axes/calendar"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function ShapeGlyph({ shape }: { shape: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {shape === "circle" ? (
        <circle cx="12" cy="12" r="6.5" fill="currentColor" />
      ) : (
        <rect
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          rx={shape === "rounded" ? 3.5 : 0}
          fill="currentColor"
        />
      )}
    </svg>
  )
}

function TodayGlyph({ marker }: { marker: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {marker === "ring" && (
        <circle
          cx="12"
          cy="12"
          r="7.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {marker === "fill" && (
        <circle cx="12" cy="12" r="8" fill="currentColor" opacity=".22" />
      )}
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight={marker === "numeral" ? 650 : 500}
        fill="currentColor"
        className={marker === "numeral" ? "text-fg-accent" : undefined}
      >
        17
      </text>
    </svg>
  )
}

const SHAPE_OPTIONS: SelectRowOption[] = DAY_SHAPE_OPTIONS.map((o) => ({
  ...o,
  illustration: <ShapeGlyph shape={o.value} />,
}))

const MARKER_OPTIONS: SelectRowOption[] = TODAY_OPTIONS.map((o) => ({
  ...o,
  illustration: <TodayGlyph marker={o.value} />,
}))

export function CalendarSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Day shape"
        value={state.calendarDayShape}
        onChange={set("calendarDayShape")}
        options={SHAPE_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Today"
        value={state.calendarToday}
        onChange={set("calendarToday")}
        options={MARKER_OPTIONS}
        layout="grid"
      />
      <SegmentedControlRow
        label="Weekdays"
        value={state.calendarWeekdays}
        onChange={set("calendarWeekdays")}
        options={WEEKDAY_OPTIONS}
      />
    </ControlGroup>
  )
}
