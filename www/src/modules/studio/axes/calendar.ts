/* Date & time — the month grid: a day cell's shape, how today is marked and
   in which color, and the weekday labels. The selected day, range ends and
   band, and the time picker's selected cell paint the checks fill (O5): a
   Checked color off the selection leaf scopes onto every date-cell host.

   `today` is one composite enum (marker × color); `weekdays` rewrites the
   shipped grid's `weekdayStyle` and header label (calendar/meta.ts
   `source`). */

import { fillScope } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const DAY_SHAPE_VALUES = ["same", "circle"] as const

export const TODAY_VALUES = ["fill", "ring", "numeral", "dot"] as const

export const TODAY_COLOR_VALUES = ["neutral", "selection"] as const

export const WEEKDAY_VALUES = ["single", "double", "triple"] as const

/** The checks fill's scopes: every element that hosts date cells. */
const DATE_CELL_HOSTS = ["calendar", "range-calendar", "time-picker-columns"]

export const chapter = defineChapter({
  id: "calendar",
  defaults: {
    calendarDayShape: "same",
    calendarToday: "fill",
    calendarTodayColor: "neutral",
    calendarWeekdays: "single",
  },
  schema: {
    calendarDayShape: oneOf(DAY_SHAPE_VALUES),
    calendarToday: oneOf(TODAY_VALUES),
    calendarTodayColor: oneOf(TODAY_COLOR_VALUES),
    calendarWeekdays: oneOf(WEEKDAY_VALUES),
  },
  resolve(state: Effective): Resolved {
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
  },
})
