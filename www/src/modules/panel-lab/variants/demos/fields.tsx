"use client"

/* Field-family card demos — inert span-based specimens of each chapter's
   hero, driven by the same state keys. See demo.tsx for the strip contract. */

import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { DAY_SHAPE, WEEKDAYS } from "../../sections/calendar"
import { inputLook, SHELL } from "../../sections/inputs"
import { controlRadiusPx } from "../../sections/shape"
import { TRACK_HEIGHT } from "../../sections/sliders"
import type { LabState } from "../../state"

/** The stepper placement around a static value. */
export function NumberFieldDemo({ state }: { state: LabState }) {
  const radius = controlRadiusPx(state)
  const look = inputLook(state.inputStyle, radius)
  const layout = state.numberLayout
  const stepper = (icon: React.ReactNode) => (
    <span
      className="flex size-6 shrink-0 items-center justify-center text-fg-muted"
      style={{ borderRadius: Math.max(radius - 3, 2) }}
    >
      {icon}
    </span>
  )
  const value = (
    <span
      className={cn(
        "flex flex-1 items-center text-fg tabular-nums",
        layout === "split" && "justify-center",
      )}
    >
      12
    </span>
  )

  if (layout === "stacked") {
    return (
      <span
        className={cn(
          SHELL,
          "w-32 shrink-0 overflow-hidden pl-2.5",
          look.className,
        )}
        style={look.style}
      >
        {value}
        <span className="flex h-full w-6 shrink-0 flex-col border-l border-border-field">
          <span className="flex flex-1 items-center justify-center border-b border-border-field text-fg-muted">
            <ChevronUpIcon className="size-3" />
          </span>
          <span className="flex flex-1 items-center justify-center text-fg-muted">
            <ChevronDownIcon className="size-3" />
          </span>
        </span>
      </span>
    )
  }
  return (
    <span
      className={cn(
        SHELL,
        "w-32 shrink-0 gap-1",
        layout === "split" ? "px-1" : "pr-1 pl-2.5",
        look.className,
      )}
      style={look.style}
    >
      {layout === "split" && stepper(<MinusIcon className="size-3.5" />)}
      {value}
      {layout === "right" && stepper(<MinusIcon className="size-3.5" />)}
      {stepper(<PlusIcon className="size-3.5" />)}
    </span>
  )
}

/** Three digits and a caret cell wearing the cell treatment. */
export function OtpFieldDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const style = state.otpStyle
  const digits = ["3", "9", "4", null]
  const glyph = (digit: string | null) =>
    digit ?? <span className="inline-block h-4 w-px animate-pulse bg-fg" />
  const cell =
    "flex h-9 w-8 shrink-0 items-center justify-center font-mono text-sm text-fg tabular-nums"

  if (style === "group") {
    return (
      <span
        className={cn(
          "flex shrink-0 divide-x divide-border-field overflow-hidden",
          look.className,
        )}
        style={look.style}
      >
        {digits.map((digit, i) => (
          <span key={i} className={cell}>
            {glyph(digit)}
          </span>
        ))}
      </span>
    )
  }
  return (
    <span className="flex shrink-0 gap-2">
      {digits.map((digit, i) => (
        <span
          key={i}
          className={cn(
            cell,
            style === "underline"
              ? "border-b-2 border-border-field"
              : look.className,
          )}
          style={style === "underline" ? undefined : look.style}
        >
          {glyph(digit)}
        </span>
      ))}
    </span>
  )
}

/** The select caret fully visible, the date trigger fading right. */
export function PickersDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const box = cn(SHELL, "w-36 shrink-0 gap-2 px-2.5", look.className)
  const Caret =
    state.pickerCaret === "double" ? ChevronsUpDownIcon : ChevronDownIcon
  return (
    <>
      <span className={box} style={look.style}>
        <span className="flex flex-1 items-center truncate text-fg">
          Monthly
        </span>
        <Caret className="size-3.5 shrink-0 text-fg-muted" />
      </span>
      {state.pickerDateTrigger === "button" ? (
        <span className={box} style={look.style}>
          <CalendarIcon className="size-3.5 shrink-0 text-fg-muted" />
          <span className="flex flex-1 items-center truncate text-fg">
            Aug 12, 2026
          </span>
        </span>
      ) : (
        <span className={cn(box, "pr-1")} style={look.style}>
          <span className="flex flex-1 items-center truncate text-fg">
            Aug 12, 2026
          </span>
          <span className="flex size-6 shrink-0 items-center justify-center text-fg-muted">
            <CalendarIcon className="size-3.5" />
          </span>
        </span>
      )}
    </>
  )
}

/** A month fragment — weekday header and two week rows, the second cropping
 *  at the card's bottom edge; a selected day wears the shape, day 17 the
 *  today marker. */
export function CalendarDemo({ state }: { state: LabState }) {
  const labels = WEEKDAYS[state.calendarWeekdays as keyof typeof WEEKDAYS]
  const shape = DAY_SHAPE[state.calendarDayShape as keyof typeof DAY_SHAPE]
  const weeks = [
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
  ]
  return (
    <span className="flex shrink-0 flex-col self-start pt-3.5">
      <span className="flex">
        {labels.map((d, i) => (
          <span
            key={i}
            className="flex h-4 w-7 items-center justify-center text-[0.625rem] font-medium text-fg-muted"
          >
            {d}
          </span>
        ))}
      </span>
      {weeks.map((week, w) => (
        <span key={w} className="flex">
          {week.map((day) => (
            <span key={day} className="flex size-7 items-center justify-center">
              <span
                className={cn(
                  "flex size-6 items-center justify-center text-xs text-fg",
                  shape,
                  day === 12 && "bg-accent font-medium text-fg-on-accent",
                  day === 17 &&
                    state.calendarToday === "ring" &&
                    "border border-accent",
                  day === 17 && state.calendarToday === "fill" && "bg-muted",
                  day === 17 &&
                    state.calendarToday === "numeral" &&
                    "font-medium text-fg-accent",
                )}
              >
                {day}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

function SliderSpecimen({
  percent,
  state,
}: {
  percent: number
  state: LabState
}) {
  const left = `${percent}%`
  return (
    <span className="relative flex h-6 w-40 shrink-0 items-center">
      <span
        className={cn(
          "flex w-full overflow-hidden rounded-full bg-muted",
          TRACK_HEIGHT[state.sliderTrack as keyof typeof TRACK_HEIGHT],
        )}
      >
        <span
          className="h-full rounded-full bg-accent"
          style={{ width: left }}
        />
      </span>
      {state.sliderThumb === "bar" ? (
        // The ring paints the card surface over track and fill — the M3 gap.
        <span
          className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-[3px] ring-card"
          style={{ left }}
        />
      ) : (
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-bg shadow-sm"
          style={{ left }}
        />
      )}
    </span>
  )
}

/** The hero's two values: fill shape and thumb treatment at a glance. */
export function SlidersDemo({ state }: { state: LabState }) {
  return (
    <>
      <SliderSpecimen percent={35} state={state} />
      <SliderSpecimen percent={70} state={state} />
    </>
  )
}
