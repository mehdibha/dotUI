"use client"

/* Date & time — the calendar grid; pickers take their fields from Inputs and
   their selected cell from the date-cell recipe. */

import { CalendarIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import {
  DAY_SHAPE_OPTIONS,
  TODAY_COLOR_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "../axes/calendar.meta"
import { DialGap, DialList, DialSelect } from "../dial"
import { FamilyHero, HeroMember, More, UsesRow } from "../family-page"
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"

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

const tint = (look: Look) => (look.neutral ? "bg-fg/12" : "bg-accent-muted")

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

/** A week with today and a selected day. */
function WeekGlyph({ look }: { look: Look }) {
  return (
    <span className="flex shrink-0 gap-px text-fg">
      {[4, 5, 6, 7, 8].map((n) => (
        <Day key={n} n={n} look={look} today={n === 5} selected={n === 7} />
      ))}
    </span>
  )
}

/** A range: solid ends over the checks tint. */
function RangeGlyph({ look }: { look: Look }) {
  const round = look.shape === "circle" || look.pill
  return (
    <span className="flex shrink-0 text-fg">
      {[11, 12, 13, 14, 15].map((n, i) => {
        const start = i === 0
        const end = i === 4
        return (
          <span
            key={n}
            className={cn(
              tint(look),
              start && (round ? "rounded-l-full" : "rounded-l-[3px]"),
              end && (round ? "rounded-r-full" : "rounded-r-[3px]"),
            )}
          >
            <Day n={n} look={look} selected={start || end} />
          </span>
        )
      })}
    </span>
  )
}

/** The date field the picker opens from. */
function FieldGlyph({ range }: { range?: boolean }) {
  return (
    <span className="flex h-5 shrink-0 items-center gap-1 rounded-[4px] border border-fg/25 px-1.5 text-[8px] font-medium text-fg/70 tabular-nums">
      {range ? "06/12 – 06/15" : "06/12"}
      <CalendarIcon className="size-2.5 text-fg/50" />
    </span>
  )
}

/** Two time columns, the selected cell in the date-cell fill. */
function TimeGlyph({ look }: { look: Look }) {
  return (
    <span className="flex shrink-0 gap-0.5 text-[8px] font-medium text-fg/70 tabular-nums">
      {[
        ["08", "09", "10"],
        ["15", "30", "45"],
      ].map((column, c) => (
        <span key={c} className="flex flex-col gap-px">
          {column.map((value, i) => (
            <span
              key={value}
              className={cn(
                "flex h-3 w-4 items-center justify-center rounded-[3px]",
                i === 1 && solid(look),
              )}
            >
              {value}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

const WEEKDAYS: Record<string, string[]> = {
  single: ["S", "M", "T"],
  double: ["Su", "Mo", "Tu"],
  triple: ["Sun", "Mon", "Tue"],
}

/* --------------------------------- Section --------------------------------- */

export function DatesPreview({ state }: { state: Effective }) {
  const look = lookOf(state)
  return <Day n={7} look={look} selected />
}

export function DatesSection({ studio }: { studio: Studio }) {
  const look = lookOf(studio.effective)
  return (
    <>
      <FamilyHero>
        <HeroMember name="Calendar">
          <WeekGlyph look={look} />
        </HeroMember>
        <HeroMember name="Range calendar">
          <RangeGlyph look={look} />
        </HeroMember>
        <HeroMember name="Date picker">
          <FieldGlyph />
        </HeroMember>
        <HeroMember name="Date range picker">
          <FieldGlyph range />
        </HeroMember>
        <HeroMember name="Time picker">
          <TimeGlyph look={look} />
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="calendarDayShape"
        label="Day shape"
        options={DAY_SHAPE_OPTIONS.map((option) => ({
          ...option,
          preview: <RangeGlyph look={{ ...look, shape: option.value }} />,
        }))}
      />
      <DialGap />
      <DialSelect
        axis="calendarToday"
        label="Today"
        options={TODAY_OPTIONS.map((option) => ({
          ...option,
          preview: <Day n={5} look={{ ...look, today: option.value }} today />,
        }))}
      />
      <UsesRow axis="checkboxColor" label="Checked color" />
      <UsesRow axis="inputStyle" label="Fields" />
      <UsesRow axis="motion" label="Motion" />
      <More keys={["calendarTodayColor", "calendarWeekdays"]}>
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
      </More>
    </>
  )
}

export const ROWS: RowMap = {}
