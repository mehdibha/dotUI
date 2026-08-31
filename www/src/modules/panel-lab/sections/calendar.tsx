"use client"

/* Calendar — the month-grid language only; the date-picker's trigger lives
   in Pickers, its field in Inputs. Selected-day shape: circle (Material 3,
   iOS, Spectrum) vs radius-following rounded square (shadcn/react-day-picker,
   Geist) vs hard square (Carbon, flatpickr) — the strongest fork. Today
   marker: outline ring (Material 3, Ant) vs muted fill (shadcn) vs accent
   numeral, no shape (iOS). Weekday header: S M T (Material, iOS) vs Su Mo
   (react-day-picker default) vs Sun Mon (Carbon). Range fill is DERIVED from
   day shape — circle endpoints get a pill band, square cells an edge-to-edge
   tint — shown in the hero, no lever. Rejected: cell density (global Space
   axis); range-segment styling (no cross-system fork; Inputs + Selection
   own it). */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"

export const CALENDAR_DEFAULTS = {
  calendarDayShape: "circle",
  calendarToday: "ring",
  calendarWeekdays: "single",
}

/* ------------------------------ Option glyphs ------------------------------ */

function ShapeGlyph({ shape }: { shape: "circle" | "rounded" | "square" }) {
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

function TodayGlyph({ marker }: { marker: "ring" | "fill" | "numeral" }) {
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

const SHAPE_OPTIONS: SelectRowOption[] = [
  {
    value: "circle",
    label: "Circle",
    illustration: <ShapeGlyph shape="circle" />,
  },
  {
    value: "rounded",
    label: "Rounded",
    illustration: <ShapeGlyph shape="rounded" />,
  },
  {
    value: "square",
    label: "Square",
    illustration: <ShapeGlyph shape="square" />,
  },
]

const TODAY_OPTIONS: SelectRowOption[] = [
  { value: "ring", label: "Ring", illustration: <TodayGlyph marker="ring" /> },
  { value: "fill", label: "Fill", illustration: <TodayGlyph marker="fill" /> },
  {
    value: "numeral",
    label: "Numeral",
    illustration: <TodayGlyph marker="numeral" />,
  },
]

const WEEKDAY_OPTIONS = [
  { value: "single", label: "S" },
  { value: "double", label: "Su" },
  { value: "triple", label: "Sun" },
]

/* ---------------------------------- Hero ----------------------------------- */

export const DAY_SHAPE = {
  circle: "rounded-full",
  rounded: "rounded-md",
  square: "rounded-none",
}

const BAND_END: Record<keyof typeof DAY_SHAPE, [string, string]> = {
  circle: ["rounded-l-full", "rounded-r-full"],
  rounded: ["rounded-l-md", "rounded-r-md"],
  square: ["", ""],
}

export const WEEKDAYS = {
  single: ["S", "M", "T", "W", "T", "F", "S"],
  double: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  triple: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}

const RANGE = { start: 6, end: 9 }
const TODAY = 16

// 30-day month opening on Wednesday — 5 rows exactly, outside days padded.
const CELLS = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2
  if (day < 1) return { label: 31 + day, outside: true }
  if (day > 30) return { label: day - 30, outside: true }
  return { label: day, outside: false }
})

function DayCell({
  cell,
  state,
}: {
  cell: { label: number; outside: boolean }
  state: LabState
}) {
  const shapeKey = state.calendarDayShape as keyof typeof DAY_SHAPE
  const day = cell.outside ? -1 : cell.label
  const inRange = day >= RANGE.start && day <= RANGE.end
  const endpoint = day === RANGE.start || day === RANGE.end
  const today = day === TODAY
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      {inRange && (
        // Derived from shape: pill band hugging circles, edge tint for cells.
        <span
          className={cn(
            "absolute inset-x-0 bg-accent/15",
            shapeKey === "circle" ? "inset-y-0.5" : "inset-y-0",
            day === RANGE.start && BAND_END[shapeKey][0],
            day === RANGE.end && BAND_END[shapeKey][1],
          )}
        />
      )}
      <span
        className={cn(
          "relative flex size-7 items-center justify-center text-xs text-fg",
          DAY_SHAPE[shapeKey],
          cell.outside && "text-fg-muted/50",
          endpoint && "bg-accent font-medium text-fg-on-accent",
          today && state.calendarToday === "ring" && "border border-accent",
          today && state.calendarToday === "fill" && "bg-muted",
          today &&
            state.calendarToday === "numeral" &&
            "font-medium text-fg-accent",
        )}
      >
        {cell.label}
      </span>
    </div>
  )
}

export function CalendarHero({ state }: { state: LabState }) {
  const labels = WEEKDAYS[state.calendarWeekdays as keyof typeof WEEKDAYS]
  return (
    <Hero className="items-center py-4">
      <div className="flex w-fit flex-col gap-1">
        <span className="px-1 text-xs font-medium text-fg">March</span>
        <div className="grid grid-cols-7">
          {labels.map((d, i) => (
            <span
              key={i}
              className="flex h-6 w-8 items-center justify-center text-[0.625rem] font-medium text-fg-muted"
            >
              {d}
            </span>
          ))}
          {CELLS.map((cell, i) => (
            <DayCell key={i} cell={cell} state={state} />
          ))}
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the day shape, and the today marker. */
export function calendarSummary(state: LabState): string {
  const shape =
    SHAPE_OPTIONS.find((o) => o.value === state.calendarDayShape)?.label ??
    state.calendarDayShape
  const today =
    TODAY_OPTIONS.find((o) => o.value === state.calendarToday)?.label ??
    state.calendarToday
  return `${shape} days · ${today} today`
}

export function CalendarSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <CalendarHero state={state} />
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
        options={TODAY_OPTIONS}
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
