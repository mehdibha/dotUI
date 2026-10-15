import { options } from "./core/meta"
import {
  COLOR_VALUES,
  FILL_VALUES,
  TRACK_STYLE_VALUES,
  TRACK_VALUES,
} from "./progress"

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  thin: {
    label: "Thin",
    description: "A 4px bar",
    credits: ["Material 3", "shadcn"],
  },
  medium: {
    label: "Medium",
    description: "A 6px bar",
    credits: ["Spectrum 2", "Radix Themes"],
  },
  thick: {
    label: "Thick",
    description: "An 8px bar",
    credits: ["Primer", "Carbon", "Ant Design", "Mantine", "HeroUI"],
  },
  "x-heavy": {
    label: "Extra heavy",
    description: "A chunky 16px bar",
    credits: ["Polaris"],
  },
})

export const TRACK_STYLE_OPTIONS = options(TRACK_STYLE_VALUES, {
  plain: {
    label: "Plain",
    description: "Fill over a muted track",
    credits: ["shadcn", "Spectrum 2", "Carbon", "Ant Design", "Primer"],
  },
  bordered: {
    label: "Bordered",
    description: "Track outlined by a hairline",
    credits: ["Radix Themes"],
  },
  gap: {
    label: "Gap",
    description: "Gap between fill and track, end dot",
    credits: ["Material 3"],
  },
})

export const COLOR_OPTIONS = options(COLOR_VALUES, {
  "same-buttons": {
    label: "Same as buttons",
    description: "Follows the buttons' fill color",
    credits: ["Carbon", "Primer", "Duolingo"],
  },
  "same-checks": {
    label: "Same as checks",
    description: "Follows the checkboxes' fill color",
    credits: ["Supabase", "Spectrum 2"],
  },
})

const FILL_OPTIONS = options(FILL_VALUES, {
  neutral: { label: "Neutral", description: "Black, or white in dark mode" },
  accent: { label: "Accent", description: "The brand color" },
  checks: { label: "Checks", description: "Whatever color the checkboxes use" },
})

export const OPTIONS = {
  progressTrack: TRACK_OPTIONS,
  progressTrackStyle: TRACK_STYLE_OPTIONS,
  progressColor: FILL_OPTIONS,
}
