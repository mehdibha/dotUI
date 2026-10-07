/* Date & time — the month grid: a day cell's shape, how today is marked and
   in which color, and the weekday labels. The selected day, range ends and
   band, and the time picker's selected cell paint the checks fill (O5): a
   Checked color off the selection leaf scopes onto every date-cell host.

   Engine: `dayShape`, `today` (marker × color, one composite enum) and
   `weekdays` are enum params on `calendar`; `weekdays` rewrites the shipped
   grid's `weekdayStyle` and header label (calendar/meta.ts `source`). */

import { fillScope } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CALENDAR_DEFAULTS = {
  calendarDayShape: "same",
  calendarToday: "fill",
  calendarTodayColor: "neutral",
  calendarWeekdays: "single",
}

/* Descriptions credit the systems each option is copied from. */
export const DAY_SHAPE_OPTIONS = [
  {
    value: "same",
    label: "Same as buttons",
    description: "shadcn, Material 3, Polaris, Carbon",
  },
  {
    value: "circle",
    label: "Circle",
    description: "Untitled UI, Airbnb, Linear, Stripe",
  },
]

export const TODAY_OPTIONS = [
  { value: "fill", label: "Fill", description: "shadcn, Untitled UI, Geist" },
  { value: "ring", label: "Ring", description: "Material 3, Ant, Linear" },
  { value: "numeral", label: "Numeral", description: "Polaris, Stripe" },
  { value: "dot", label: "Dot", description: "Carbon, Spectrum 2" },
]

export const TODAY_COLOR_OPTIONS = [
  {
    value: "neutral",
    label: "Neutral",
    description: "shadcn, Polaris, Linear, Stripe",
  },
  {
    value: "selection",
    label: "Selection",
    description: "Material 3, Carbon, Ant",
  },
]

export const WEEKDAY_OPTIONS = [
  {
    value: "single",
    label: "Single",
    description: "Material 3, Carbon, Geist",
  },
  {
    value: "double",
    label: "Double",
    description: "shadcn, Polaris, Stripe, Untitled UI",
  },
  { value: "triple", label: "Triple", description: "Notion, Atlassian" },
]

export const CALENDAR_SCHEMA: ChapterSchema<typeof CALENDAR_DEFAULTS> = {
  calendarDayShape: oneOf(DAY_SHAPE_OPTIONS),
  calendarToday: oneOf(TODAY_OPTIONS),
  calendarTodayColor: oneOf(TODAY_COLOR_OPTIONS),
  calendarWeekdays: oneOf(WEEKDAY_OPTIONS),
}

/** The checks fill's scopes: every element that hosts date cells. */
const DATE_CELL_HOSTS = ["calendar", "range-calendar", "time-picker-columns"]

export function resolveCalendar(state: Effective): Resolved {
  return {
    params: {
      calendar: {
        dayShape: state.calendarDayShape,
        today:
          state.calendarTodayColor === "selection"
            ? `${state.calendarToday}-selection`
            : state.calendarToday,
        weekdays: state.calendarWeekdays,
      },
    },
    color: fillScope(state, DATE_CELL_HOSTS, state.checkboxColor),
  }
}

export const chapter = defineChapter({
  id: "calendar",
  defaults: CALENDAR_DEFAULTS,
  schema: CALENDAR_SCHEMA,
  resolve: resolveCalendar,
})
