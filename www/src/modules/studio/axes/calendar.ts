import type { Resolved, StudioState } from "./index"

export const CALENDAR_DEFAULTS = {
  calendarDayShape: "circle",
  calendarToday: "ring",
  calendarWeekdays: "single",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveCalendar(_state: StudioState): Resolved {
  return {}
}
