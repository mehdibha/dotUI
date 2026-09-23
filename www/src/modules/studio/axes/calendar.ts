/* Calendar — the month grid's three decisions. Day shape: radius-following
   rounded square (shadcn/react-day-picker, Geist — dotUI today) vs circle
   (Material 3, iOS, Spectrum) vs hard square (Carbon, flatpickr); the range
   band derives from it. Today marker: none (dotUI today) vs outline ring
   (Material 3, Ant) vs muted fill (shadcn) vs accent numeral (iOS). Weekday
   header: S M T (Material, iOS) vs Su Mo (react-day-picker) vs Sun Mon
   (Carbon).

   Engine: three enum params on `calendar`; `weekdays` rewrites the shipped
   grid's `weekdayStyle` and header label (calendar/meta.ts `source`). */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const CALENDAR_DEFAULTS = {
  calendarDayShape: "rounded",
  calendarToday: "none",
  calendarWeekdays: "single",
}

export const DAY_SHAPE_OPTIONS = [
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
]

export const TODAY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "ring", label: "Ring" },
  { value: "fill", label: "Fill" },
  { value: "numeral", label: "Numeral" },
]

export const WEEKDAY_OPTIONS = [
  { value: "single", label: "S" },
  { value: "double", label: "Su" },
  { value: "triple", label: "Sun" },
]

export const CALENDAR_SCHEMA: Schema<typeof CALENDAR_DEFAULTS> = {
  calendarDayShape: oneOf(DAY_SHAPE_OPTIONS),
  calendarToday: oneOf(TODAY_OPTIONS),
  calendarWeekdays: oneOf(WEEKDAY_OPTIONS),
}

export function resolveCalendar(state: StudioState): Resolved {
  return {
    params: {
      calendar: {
        dayShape: state.calendarDayShape,
        today: state.calendarToday,
        weekdays: state.calendarWeekdays,
      },
    },
  }
}
