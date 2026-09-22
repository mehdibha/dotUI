/* Calendar — the month grid's three decisions: day shape (the range band
   derives from it), the today marker, and the weekday header labels.

   Engine: three enum params on `calendar`; `weekdays` rewrites the shipped
   grid's `weekdayStyle` and header label (calendar/meta.ts `source`). */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const CALENDAR_DEFAULTS = {
  calendarDayShape: "rounded",
  calendarToday: "none",
  calendarWeekdays: "single",
}

export const DAY_SHAPE_OPTIONS = [
  {
    value: "rounded",
    label: "Rounded",
    description:
      "Rounded-square day cells at the md rung of the radius ladder; a range " +
      "band runs square through the week with pill ends.",
    seenIn: ["shadcn/ui", "Mantine", "Chakra UI", "Polaris", "Ant Design"],
  },
  {
    value: "circle",
    label: "Circle",
    description:
      "Circular day cells; a range band runs through the week with pill " +
      "ends.",
    seenIn: ["Material 3", "Spectrum 2", "HeroUI", "React Aria"],
  },
  {
    value: "square",
    label: "Square",
    description:
      "Unrounded cells that tile edge to edge; the range band is a plain " +
      "rectangle.",
    seenIn: ["Carbon"],
  },
]

export const TODAY_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "Today looks like any other day.",
    seenIn: ["Polaris", "Mantine"],
  },
  {
    value: "ring",
    label: "Ring",
    description: "A 1px accent ring inside today's cell.",
    seenIn: ["Material 3", "Ant Design"],
  },
  {
    value: "fill",
    label: "Fill",
    description:
      "A muted neutral fill behind today's numeral; hover and selection " +
      "override it.",
    seenIn: ["shadcn/ui", "Cloudscape"],
  },
  {
    value: "numeral",
    label: "Numeral",
    description: "Today's numeral in the accent text color, no shape.",
    seenIn: ["Chakra UI", "Carbon"],
  },
]

export const WEEKDAY_OPTIONS = [
  {
    value: "single",
    label: "S",
    description: "One-letter weekday headers: S M T W T F S.",
    seenIn: ["Material 3", "Carbon", "Chakra UI", "Spectrum 2", "React Aria"],
  },
  {
    value: "double",
    label: "Su",
    description: "Two-letter weekday headers: Su Mo Tu We Th Fr Sa.",
    seenIn: ["shadcn/ui", "Mantine", "Polaris", "Ant Design"],
  },
  {
    value: "triple",
    label: "Sun",
    description: "Three-letter weekday headers: Sun Mon Tue.",
  },
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

export const CALENDAR_SPEC = {
  label: "Calendar",
  description:
    "The month grid shared by Calendar, RangeCalendar and the date pickers: " +
    "the day cell's shape, how today is marked, and the weekday header.",
  axes: {
    calendarDayShape: {
      label: "Day shape",
      description:
        "The shape of a day cell's hover, focus and selection, and of the " +
        "ends of a selected range.",
      value: { type: "enum", options: DAY_SHAPE_OPTIONS },
      guidance:
        "Rounded follows the system's radius (5 of 10 checked: shadcn/ui, " +
        "Mantine, Chakra, Polaris, Ant Design); Circle is the Material 3 / " +
        "Spectrum 2 / HeroUI look and suits Round shapes; Square tiles the " +
        "grid like Carbon and suits Square shapes.",
    },
    calendarToday: {
      label: "Today",
      description:
        "The marker that tells today apart from the other days when it is " +
        "not selected.",
      value: { type: "enum", options: TODAY_OPTIONS },
      guidance:
        "9 of 11 checked systems mark today by default; Polaris doesn't and " +
        "Mantine's border is opt-in. Ring (Material 3, Ant Design) stays readable " +
        "next to a filled selection; Fill (shadcn/ui, Cloudscape) is the " +
        "quietest; Numeral (Chakra, Carbon) marks it with text color only. " +
        "Spectrum 2's dot and Fluent 2's solid accent disc have no match yet.",
    },
    calendarWeekdays: {
      label: "Weekdays",
      description: "How the weekday column headers are abbreviated.",
      value: { type: "enum", options: WEEKDAY_OPTIONS },
      guidance:
        "Single letters (5 of 9 checked) keep a compact grid; two letters " +
        "(shadcn/ui via react-day-picker, Mantine, Polaris, Ant Design) " +
        "remove the S/S and T/T ambiguity. None of the checked systems " +
        "defaults to three letters; it needs the widest cells.",
    },
  },
} satisfies ChapterSpec<typeof CALENDAR_DEFAULTS>
