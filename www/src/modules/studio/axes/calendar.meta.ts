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
    description: "shadcn, Material 3, Polaris, Carbon",
  },
  circle: {
    label: "Circle",
    description: "Untitled UI, Airbnb, Linear, Stripe",
  },
})

export const TODAY_OPTIONS = options(TODAY_VALUES, {
  fill: { label: "Fill", description: "shadcn, Untitled UI, Geist" },
  ring: { label: "Ring", description: "Material 3, Ant, Linear" },
  numeral: { label: "Numeral", description: "Polaris, Stripe" },
  dot: { label: "Dot", description: "Carbon, Spectrum 2" },
})

export const TODAY_COLOR_OPTIONS = options(TODAY_COLOR_VALUES, {
  neutral: { label: "Neutral", description: "shadcn, Polaris, Linear, Stripe" },
  selection: { label: "Selection", description: "Material 3, Carbon, Ant" },
})

export const WEEKDAY_OPTIONS = options(WEEKDAY_VALUES, {
  single: { label: "Single", description: "Material 3, Carbon, Geist" },
  double: {
    label: "Double",
    description: "shadcn, Polaris, Stripe, Untitled UI",
  },
  triple: { label: "Triple", description: "Notion, Atlassian" },
})

export const OPTIONS = {
  calendarDayShape: DAY_SHAPE_OPTIONS,
  calendarToday: TODAY_OPTIONS,
  calendarTodayColor: TODAY_COLOR_OPTIONS,
  calendarWeekdays: WEEKDAY_OPTIONS,
}
