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
    credits: ["shadcn", "Material 3", "Polaris", "Carbon"],
  },
  circle: {
    label: "Circle",
    credits: ["Untitled UI", "Airbnb", "Linear", "Stripe"],
  },
})

export const TODAY_OPTIONS = options(TODAY_VALUES, {
  fill: { label: "Fill", credits: ["shadcn", "Untitled UI", "Geist"] },
  ring: { label: "Ring", credits: ["Material 3", "Ant", "Linear"] },
  numeral: { label: "Numeral", credits: ["Polaris", "Stripe"] },
  dot: { label: "Dot", credits: ["Carbon", "Spectrum 2"] },
})

export const TODAY_COLOR_OPTIONS = options(TODAY_COLOR_VALUES, {
  neutral: {
    label: "Neutral",
    credits: ["shadcn", "Polaris", "Linear", "Stripe"],
  },
  selection: { label: "Selection", credits: ["Material 3", "Carbon", "Ant"] },
})

export const WEEKDAY_OPTIONS = options(WEEKDAY_VALUES, {
  single: { label: "Single", credits: ["Material 3", "Carbon", "Geist"] },
  double: {
    label: "Double",
    credits: ["shadcn", "Polaris", "Stripe", "Untitled UI"],
  },
  triple: { label: "Triple", credits: ["Notion", "Atlassian"] },
})

export const OPTIONS = {
  calendarDayShape: DAY_SHAPE_OPTIONS,
  calendarToday: TODAY_OPTIONS,
  calendarTodayColor: TODAY_COLOR_OPTIONS,
  calendarWeekdays: WEEKDAY_OPTIONS,
}
