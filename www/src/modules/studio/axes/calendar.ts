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

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveCalendar(state: StudioState): Resolved {
  return {
    params: {
      calendar: {
        dayShape: pick(DAY_SHAPE_OPTIONS, state.calendarDayShape, "rounded"),
        today: pick(TODAY_OPTIONS, state.calendarToday, "none"),
        weekdays: pick(WEEKDAY_OPTIONS, state.calendarWeekdays, "single"),
      },
    },
  }
}
