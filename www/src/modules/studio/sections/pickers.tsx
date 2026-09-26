"use client"

/* Pickers — the trigger caret select and combobox share, and the calendar's
   month grid. The field shell comes from Inputs, the listbox from Menus. */

import { cn } from "@/registry/lib/utils"

import {
  DAY_SHAPE_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "../axes/calendar"
import { CARET_OPTIONS } from "../axes/pickers"
import {
  DialGap,
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import { CardGrid } from "../patterns"
import type { Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

function CaretGlyph({ caret }: { caret: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {caret === "double" ? (
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      ) : (
        <path d="m6 9 6 6 6-6" />
      )}
    </svg>
  )
}

const DAY_RADIUS: Record<string, string> = {
  rounded: "rounded-[3px]",
  circle: "rounded-full",
  square: "rounded-none",
}

/** Two weeks of cells with one day selected in the shape. */
function MonthGlyph({ shape }: { shape: string }) {
  return (
    <span className="my-1 grid w-full grid-cols-7 gap-1 px-1">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "aspect-square w-full",
            DAY_RADIUS[shape],
            i === 9 ? "bg-primary" : "bg-fg/8",
          )}
        />
      ))}
    </span>
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

/* --------------------------------- Section --------------------------------- */

export function PickersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialSelect
        label="Select"
        value={state.pickerCaret}
        onChange={set("pickerCaret")}
        rowPreview={false}
        options={CARET_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <CaretGlyph caret={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialTrigger
        label="Calendar"
        value={
          <>
            <span className="truncate">
              {optionLabel(DAY_SHAPE_OPTIONS, state.calendarDayShape)} ·{" "}
              {optionLabel(TODAY_OPTIONS, state.calendarToday)}
            </span>
            <span
              className={cn(
                "size-3.5 shrink-0 bg-primary",
                DAY_RADIUS[state.calendarDayShape],
              )}
            />
          </>
        }
      >
        <DialPopover className="w-80">
          <CardGrid
            label="Day shape"
            columns={3}
            value={state.calendarDayShape}
            onChange={set("calendarDayShape")}
            options={DAY_SHAPE_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              children: <MonthGlyph shape={option.value} />,
            }))}
          />
          <DialGap />
          <DialSelect
            label="Today"
            value={state.calendarToday}
            onChange={set("calendarToday")}
            options={TODAY_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <TodayGlyph marker={option.value} />
                </DialGlyph>
              ),
            }))}
          />
          <DialSegmented
            label="Weekdays"
            value={state.calendarWeekdays}
            onChange={set("calendarWeekdays")}
            options={WEEKDAY_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
