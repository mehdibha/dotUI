"use client"

/* Date & time — the calendar grid; pickers take their fields from Inputs and
   their selected cell from the date-cell recipe. */

import { cn } from "@/registry/lib/utils"

import {
  DAY_SHAPE_OPTIONS,
  TODAY_COLOR_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "../axes/calendar.meta"
import { DialSelect } from "../dial"
import type { RowMap } from "../family-page"
import type { Effective } from "../state"
import { useStudio } from "../use-studio"

/* -------------------------------- Specimens -------------------------------- */

/** What a glyph reads from the system: shape, today marker, fills. */
interface Look {
  shape: string
  pill: boolean
  today: string
  todayColor: string
  neutral: boolean
}

const lookOf = (state: Effective): Look => ({
  shape: state.calendarDayShape,
  pill: state.buttonRadius === "pill",
  today: state.calendarToday,
  todayColor: state.calendarTodayColor,
  neutral: state.checkboxColor === "neutral",
})

const chipRadius = (look: Look) =>
  look.shape === "circle" || look.pill ? "rounded-full" : "rounded-[3px]"

const solid = (look: Look) =>
  look.neutral ? "bg-fg text-bg" : "bg-accent text-fg-on-accent"

/** A day numeral in its cell; `today` draws the marker. */
function Day({
  n,
  look,
  selected,
  today,
  className,
}: {
  n: number
  look: Look
  selected?: boolean
  today?: boolean
  className?: string
}) {
  const accent = look.todayColor === "selection"
  const mark = today && !selected ? look.today : undefined
  return (
    <span
      className={cn(
        "relative flex size-4 items-center justify-center text-[8px] font-medium tabular-nums",
        chipRadius(look),
        selected && solid(look),
        mark === "fill" && (accent ? solid(look) : "bg-fg/10"),
        mark === "ring" &&
          cn(
            "ring-1 ring-inset",
            !accent
              ? "ring-fg/35"
              : look.neutral
                ? "ring-fg"
                : "text-fg-accent ring-accent",
          ),
        today &&
          (look.today === "numeral" || (look.today === "dot" && accent)) &&
          "font-bold",
        accent &&
          (mark === "numeral" || mark === "dot") &&
          (look.neutral ? "text-fg" : "text-fg-accent"),
        className,
      )}
    >
      {n}
      {today && look.today === "dot" && (
        <span
          className={cn(
            "absolute bottom-px left-1/2 size-0.5 -translate-x-1/2 rounded-full",
            selected
              ? "bg-current"
              : accent && !look.neutral
                ? "bg-accent"
                : "bg-fg",
          )}
        />
      )}
    </span>
  )
}

const WEEKDAYS: Record<string, string[]> = {
  single: ["S", "M", "T"],
  double: ["Su", "Mo", "Tu"],
  triple: ["Sun", "Mon", "Tue"],
}

/* ---------------------------------- Rows ---------------------------------- */

function DayShapeRow() {
  const look = lookOf(useStudio().effective)
  return (
    <DialSelect
      axis="calendarDayShape"
      label="Day shape"
      rowPreview={false}
      options={DAY_SHAPE_OPTIONS.map((option) => ({
        ...option,
        preview: <Day n={7} look={{ ...look, shape: option.value }} selected />,
      }))}
    />
  )
}

function TodayRow() {
  const look = lookOf(useStudio().effective)
  return (
    <DialSelect
      axis="calendarToday"
      label="Today"
      options={TODAY_OPTIONS.map((option) => ({
        ...option,
        preview: <Day n={5} look={{ ...look, today: option.value }} today />,
      }))}
    />
  )
}

function TodayColorRow() {
  const look = lookOf(useStudio().effective)
  return (
    <DialSelect
      axis="calendarTodayColor"
      label="Today color"
      options={TODAY_COLOR_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <Day n={5} look={{ ...look, todayColor: option.value }} today />
        ),
      }))}
    />
  )
}

function WeekdaysRow() {
  return (
    <DialSelect
      axis="calendarWeekdays"
      label="Weekday labels"
      rowPreview={false}
      options={WEEKDAY_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <span className="flex w-12 shrink-0 justify-between text-[8px] font-medium text-fg/60">
            {WEEKDAYS[option.value]?.map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </span>
        ),
      }))}
    />
  )
}

export const ROWS: RowMap = {
  calendarDayShape: DayShapeRow,
  calendarToday: TodayRow,
  calendarTodayColor: TodayColorRow,
  calendarWeekdays: WeekdaysRow,
}
