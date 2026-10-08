"use client"

import { useEffect, useRef, useState } from "react"
import { getLocalTimeZone, Time, today } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"

import { CalendarIcon, ClockIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Calendar,
  CalendarGrid,
  CalendarHeader,
  RangeCalendar,
} from "@/registry/ui/calendar"
import { useStyles as useCalendarStyles } from "@/registry/ui/calendar/styles"
import { DateField } from "@/registry/ui/date-field"
import { DatePicker, DateRangePicker } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Label } from "@/registry/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { TimeField } from "@/registry/ui/time-field"
import { TimePicker, TimePickerColumns } from "@/registry/ui/time-picker"

import {
  Board,
  BoardSection,
  CAPTION,
  stateProps,
  useBoardFocus,
  useLoop,
} from "./board"

const CALENDAR_AXES = [
  "calendarDayShape",
  "calendarToday",
  "calendarTodayColor",
  "calendarWeekdays",
  "checkboxColor",
]

/* ---------------------------------- Dates ---------------------------------- */

/** Today, a day near it and a week beside it, all in today's month. */
function useDates() {
  const [now] = useState(() => today(getLocalTimeZone()))
  const days = now.calendar.getDaysInMonth(now)
  const forward = now.day + 9 <= days
  const start = forward ? now.add({ days: 3 }) : now.subtract({ days: 9 })
  return {
    selected:
      now.day + 3 <= days ? now.add({ days: 3 }) : now.subtract({ days: 3 }),
    range: { start, end: start.add({ days: 6 }) },
  }
}

/** Whether the element is at least `min` px wide; the board's popover inset narrows it, not the viewport. */
function useWiderThan(min: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWide((entry?.contentRect.width ?? 0) >= min),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [min])
  return [ref, wide] as const
}

/* -------------------------------- Day states -------------------------------- */

type DayState =
  | "rest"
  | "hover"
  | "selected"
  | "focus"
  | "today"
  | "unavailable"

const DAY_STATES: { state: DayState; label: string; day: number }[] = [
  { state: "rest", label: "Rest", day: 12 },
  { state: "hover", label: "Hover", day: 13 },
  { state: "focus", label: "Focus", day: 14 },
  { state: "selected", label: "Selected", day: 15 },
  { state: "today", label: "Today", day: 16 },
  { state: "unavailable", label: "Unavailable", day: 17 },
]

// The state each key styles, so its cell stands out while the panel edits it.
const STATE_OF_AXIS: Record<string, DayState> = {
  calendarToday: "today",
  calendarTodayColor: "today",
  checkboxColor: "selected",
  dateMotion: "focus",
}

function dayAttributes(state: DayState) {
  if (state === "today") return { ...stateProps("rest"), "data-today": "" }
  if (state === "unavailable")
    return { ...stateProps("rest"), "data-unavailable": "true" }
  return stateProps(state)
}

/** Frozen day cells, styled by the calendar's own slots. */
function DayStates() {
  const { root, cell } = useCalendarStyles()()
  const { axis } = useBoardFocus()
  const emphasis = axis ? STATE_OF_AXIS[axis] : undefined
  const replay = useLoop(axis === "dateMotion", 1100, true)
  return (
    <div
      inert
      data-calendar=""
      className={root({
        className: "grid grid-cols-3 gap-x-8 gap-y-6",
      })}
    >
      {DAY_STATES.map(({ state, label, day }) => (
        <div
          key={state}
          className={cn(
            "flex flex-col items-center gap-2 transition-opacity duration-300",
            emphasis && emphasis !== state && "opacity-35",
          )}
        >
          <div className="size-(--cell-size)">
            <div
              {...dayAttributes(state === "focus" && !replay ? "rest" : state)}
              className={cell()}
            >
              {day}
            </div>
          </div>
          <span className={CAPTION}>{label}</span>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------- Calendars -------------------------------- */

function SingleCalendar() {
  const { selected } = useDates()
  return <Calendar aria-label="Due date" defaultValue={selected} />
}

function TripCalendar() {
  const { range } = useDates()
  const [ref, wide] = useWiderThan(560)
  const months = wide ? 2 : 1
  return (
    <div ref={ref} className="flex w-full justify-center">
      <RangeCalendar
        aria-label="Trip dates"
        defaultValue={range}
        visibleDuration={{ months }}
      >
        <CalendarHeader />
        <div className="flex items-start gap-8">
          {Array.from({ length: months }, (_, offset) => (
            <CalendarGrid key={offset} offset={{ months: offset }} />
          ))}
        </div>
      </RangeCalendar>
    </div>
  )
}

/* ------------------------------ Open pickers ------------------------------- */

/** A picker's popover held open under its trigger, out of the overlay layer. */
function OpenPanel({ children }: { children: React.ReactNode }) {
  const { popover } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  return (
    <div data-popover="" className={popover({ className: "mt-1 w-fit" })}>
      <div className={content()}>{children}</div>
    </div>
  )
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-xs min-w-0 flex-col gap-7">
      {children}
    </div>
  )
}

/** Two columns once the section itself is wide enough, whatever the viewport. */
function Columns({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container w-full max-w-2xl">
      <div className="grid grid-cols-1 items-start gap-x-12 gap-y-7 @xl:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

function Pickers() {
  const { selected, range } = useDates()
  const [value, setValue] = useState<CalendarDate | null>(selected)
  return (
    <Columns>
      <DatePicker value={value} onChange={setValue} isOpen className="w-fit">
        <Label>Due date</Label>
        <InputGroup className="w-60">
          <DateInput />
          <InputGroupAddon>
            <Button variant="secondary" size="sm" isIconOnly>
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <OpenPanel>
          <Calendar autoFocus={false} />
        </OpenPanel>
      </DatePicker>
      <Column>
        <DateField defaultValue={range.start}>
          <Label>Start date</Label>
          <DateInput />
        </DateField>
        <DateRangePicker defaultValue={range}>
          <Label>Trip</Label>
          <InputGroup>
            <DateInput slot="start" />
            <span aria-hidden className="text-fg-muted">
              –
            </span>
            <DateInput slot="end" />
            <InputGroupAddon>
              <Button variant="secondary" size="sm" isIconOnly>
                <CalendarIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Popover>
            <DialogContent>
              <RangeCalendar />
            </DialogContent>
          </Popover>
        </DateRangePicker>
      </Column>
    </Columns>
  )
}

/** The columns, each scrolled to its selected time (the items mount after the columns). */
function TimeColumns() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    let attempts = 0
    const center = () => {
      const columns = [
        ...(ref.current?.querySelectorAll<HTMLElement>(
          "[data-time-picker-column]",
        ) ?? []),
      ]
      const pairs = columns.map(
        (column) =>
          [
            column,
            column.querySelector<HTMLElement>("[data-selected]"),
          ] as const,
      )
      if (!pairs.length || pairs.some(([, item]) => !item)) {
        if (++attempts < 60) frame = requestAnimationFrame(center)
        return
      }
      for (const [column, item] of pairs) {
        if (!item) continue
        column.scrollTop +=
          item.getBoundingClientRect().top -
          column.getBoundingClientRect().top -
          (column.clientHeight - item.clientHeight) / 2
      }
    }
    center()
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div ref={ref}>
      <TimePickerColumns />
    </div>
  )
}

function Times() {
  return (
    <Columns>
      <TimePicker defaultValue={new Time(9, 30)} isOpen className="w-fit">
        <Label>Reminder</Label>
        <InputGroup className="w-44">
          <DateInput />
          <InputGroupAddon>
            <Button variant="secondary" size="sm" isIconOnly>
              <ClockIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <OpenPanel>
          <TimeColumns />
        </OpenPanel>
      </TimePicker>
      <Column>
        <TimeField defaultValue={new Time(9, 0)}>
          <Label>Opens at</Label>
          <DateInput />
        </TimeField>
        <TimeField defaultValue={new Time(17, 45)} hourCycle={24}>
          <Label>Closes at</Label>
          <DateInput />
        </TimeField>
      </Column>
    </Columns>
  )
}

export default function DatesBoard() {
  return (
    <Board id="dates">
      <BoardSection
        member="calendar"
        title="Calendar"
        axes={[...CALENDAR_AXES, "dateMotion"]}
        className="gap-x-20 gap-y-10"
      >
        <SingleCalendar />
        <DayStates />
      </BoardSection>
      <BoardSection
        member="range-calendar"
        title="Range calendar"
        axes={CALENDAR_AXES}
      >
        <TripCalendar />
      </BoardSection>
      <BoardSection
        member="date-picker"
        title="Date picker"
        axes={["inputStyle", ...CALENDAR_AXES]}
      >
        <Pickers />
      </BoardSection>
      <BoardSection
        member="time"
        title="Time"
        axes={["inputStyle", "checkboxColor", "dateMotion"]}
      >
        <Times />
      </BoardSection>
    </Board>
  )
}
