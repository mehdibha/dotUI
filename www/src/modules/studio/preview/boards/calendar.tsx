"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { ListBox, ListBoxItem } from "react-aria-components/ListBox"

import { cn } from "@/registry/lib/utils"
import {
  Calendar,
  CalendarGrid,
  CalendarHeader,
  RangeCalendar,
} from "@/registry/ui/calendar"
import { useStyles as useCalendarStyles } from "@/registry/ui/calendar/styles"
import { useStyles as useTimePickerStyles } from "@/registry/ui/time-picker/styles"

import {
  Board,
  BoardSection,
  CAPTION,
  stateProps,
  useBoardFocus,
  useReplay,
  useSteps,
} from "./board"

/** A day near today and a week that crosses a row, both in today's month. */
function useDates() {
  const [now] = useState(() => today(getLocalTimeZone()))
  const days = now.calendar.getDaysInMonth(now)
  const start =
    now.day + 14 <= days ? now.add({ days: 8 }) : now.subtract({ days: 14 })
  return {
    selected:
      now.day + 3 <= days ? now.add({ days: 3 }) : now.subtract({ days: 3 }),
    range: { start, end: start.add({ days: 6 }) },
  }
}

const TODAY = { "data-today": "" }

const DAY_STATES = [
  { label: "Rest", attrs: stateProps("rest") },
  { label: "Hover", attrs: stateProps("hover") },
  { label: "Focus", attrs: stateProps("focus") },
  { label: "Selected", attrs: stateProps("selected") },
  { label: "Today", attrs: { ...stateProps("rest"), ...TODAY } },
  { label: "Today · selected", attrs: { ...stateProps("selected"), ...TODAY } },
]

const LIT: Record<string, string[]> = {
  calendarToday: ["Today", "Today · selected"],
  calendarTodayColor: ["Today", "Today · selected"],
}

/** Frozen day cells, styled by the calendar's own slots. */
function DayStates() {
  const { root, cell } = useCalendarStyles()()
  const { axis } = useBoardFocus()
  const lit = axis ? LIT[axis] : undefined
  return (
    <div
      inert
      data-calendar=""
      className={root({
        className: "grid grid-cols-3 gap-x-10 gap-y-6 sm:grid-cols-6",
      })}
    >
      {DAY_STATES.map(({ label, attrs }, index) => (
        <div
          key={label}
          className={cn(
            "flex flex-col items-center gap-2 transition-opacity duration-300",
            lit && !lit.includes(label) && "opacity-35",
          )}
        >
          <div className="size-(--cell-size)">
            <div {...attrs} className={cell()}>
              {index + 12}
            </div>
          </div>
          <span className={CAPTION}>{label}</span>
        </div>
      ))}
    </div>
  )
}

const WEEK = [12, 13, 14, 15, 16, 17, 18]
const MINUTES = ["00", "15", "30", "45"]

/** A week and a time column, live at rest; while edited, focus walks the week and the selection steps on the calendar's state timing. */
function Replay() {
  const { root, cell } = useCalendarStyles()()
  const { column, item } = useTimePickerStyles()()
  const motion = useReplay("calendarMotion")
  const step = useSteps(motion, 1100)
  if (!motion.running)
    return (
      <div className="flex flex-col items-center gap-6">
        <ListBox
          aria-label="Week"
          orientation="horizontal"
          selectionMode="single"
          data-calendar=""
          className={root({ className: "flex-row gap-0" })}
        >
          {WEEK.map((day) => (
            <ListBoxItem
              key={day}
              id={day}
              className={cell({ className: "size-(--cell-size)" })}
            >
              {day}
            </ListBoxItem>
          ))}
        </ListBox>
        <div data-time-picker-columns="">
          <ListBox
            aria-label="Minute"
            selectionMode="single"
            disallowEmptySelection
            defaultSelectedKeys={["15"]}
            className={column({ className: "overflow-visible" })}
          >
            {MINUTES.map((minute) => (
              <ListBoxItem key={minute} id={minute} className={item()}>
                9:{minute}
              </ListBoxItem>
            ))}
          </ListBox>
        </div>
      </div>
    )
  const focused = step % WEEK.length
  const selected = step % MINUTES.length
  return (
    <div inert className="flex flex-col items-center gap-6">
      <div data-calendar="" className={root({ className: "flex-row gap-0" })}>
        {WEEK.map((day, index) => (
          <div key={day} className="size-(--cell-size)">
            <div
              {...stateProps(index === focused ? "focus" : "rest")}
              className={cell()}
            >
              {day}
            </div>
          </div>
        ))}
      </div>
      <div data-time-picker-columns="">
        <div className={column({ className: "overflow-visible" })}>
          {MINUTES.map((minute, index) => (
            <div
              key={minute}
              {...stateProps(index === selected ? "selected" : "rest")}
              className={item()}
            >
              9:{minute}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CalendarBoard() {
  const { selected, range } = useDates()
  return (
    <Board id="calendar">
      <BoardSection title="States">
        <DayStates />
      </BoardSection>
      <div className="grid min-w-0 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <BoardSection title="Date" className="flex-1">
          <Calendar aria-label="Due date" defaultValue={selected} />
        </BoardSection>
        <BoardSection title="Range" className="flex-1">
          <RangeCalendar aria-label="Trip dates" defaultValue={range}>
            <CalendarHeader />
            <CalendarGrid />
          </RangeCalendar>
        </BoardSection>
        <BoardSection title="Motion" className="flex-1">
          <Replay />
        </BoardSection>
      </div>
    </Board>
  )
}
