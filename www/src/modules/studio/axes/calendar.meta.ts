import {
  DAY_SHAPE_VALUES,
  TODAY_COLOR_VALUES,
  TODAY_VALUES,
  WEEKDAY_VALUES,
} from "./calendar"
import { options } from "./core/meta"

export const DAY_SHAPE_OPTIONS = options(DAY_SHAPE_VALUES, {
  same: {
    label: "Same as buttons",
    description: "Day cells follow the button corners",
    credits: ["shadcn", "Material 3", "Polaris", "Carbon"],
  },
  circle: {
    label: "Circle",
    description: "Round day cells, pill-shaped ranges",
    credits: ["Untitled UI", "Airbnb", "Linear", "Stripe"],
  },
})

export const TODAY_OPTIONS = options(TODAY_VALUES, {
  fill: {
    label: "Fill",
    description: "Today sits on a shaded cell",
    credits: ["shadcn", "Untitled UI", "Geist"],
  },
  ring: {
    label: "Ring",
    description: "An outline ring around today",
    credits: ["Material 3", "Ant", "Linear"],
  },
  numeral: {
    label: "Numeral",
    description: "Today's number set in bold",
    credits: ["Polaris", "Stripe"],
  },
  dot: {
    label: "Dot",
    description: "A small dot under today's number",
    credits: ["Carbon", "Spectrum 2"],
  },
})

export const TODAY_COLOR_OPTIONS = options(TODAY_COLOR_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Today's marker stays gray",
    credits: ["shadcn", "Polaris", "Linear", "Stripe"],
  },
  selection: {
    label: "Selection",
    description: "Today's marker takes the selection color",
    credits: ["Material 3", "Carbon", "Ant"],
  },
})

export const WEEKDAY_OPTIONS = options(WEEKDAY_VALUES, {
  single: {
    label: "Single",
    description: "One letter: S, M, T",
    credits: ["Material 3", "Carbon", "Geist"],
  },
  double: {
    label: "Double",
    description: "Two letters: Su, Mo, Tu",
    credits: ["shadcn", "Polaris", "Stripe", "Untitled UI"],
  },
  triple: {
    label: "Triple",
    description: "Three letters: Sun, Mon, Tue",
    credits: ["Notion", "Atlassian"],
  },
})

export const OPTIONS = {
  calendarDayShape: DAY_SHAPE_OPTIONS,
  calendarToday: TODAY_OPTIONS,
  calendarTodayColor: TODAY_COLOR_OPTIONS,
  calendarWeekdays: WEEKDAY_OPTIONS,
}
