import { options } from "./core/meta"
import {
  COLOR_VALUES,
  FILL_VALUES,
  TRACK_STYLE_VALUES,
  TRACK_VALUES,
} from "./progress"

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  thin: { label: "Thin", credits: ["Material 3", "shadcn"] },
  medium: { label: "Medium", credits: ["Spectrum 2", "Radix Themes"] },
  thick: {
    label: "Thick",
    credits: ["Primer", "Carbon", "Ant Design", "Mantine", "HeroUI"],
  },
  "x-heavy": { label: "Extra heavy", credits: ["Polaris"] },
})

export const TRACK_STYLE_OPTIONS = options(TRACK_STYLE_VALUES, {
  plain: {
    label: "Plain",
    credits: ["shadcn", "Spectrum 2", "Carbon", "Ant Design", "Primer"],
  },
  bordered: { label: "Bordered", credits: ["Radix Themes"] },
  gap: { label: "Gap", credits: ["Material 3"] },
})

export const COLOR_OPTIONS = options(COLOR_VALUES, {
  "same-buttons": {
    label: "Same as buttons",
    credits: ["Carbon", "Primer", "Duolingo"],
  },
  "same-checks": {
    label: "Same as checks",
    credits: ["Supabase", "Spectrum 2"],
  },
})

export const FILL_OPTIONS = options(FILL_VALUES, {
  neutral: { label: "Neutral" },
  accent: { label: "Accent" },
  checks: { label: "Checks" },
})

export const OPTIONS = {
  progressTrack: TRACK_OPTIONS,
  progressTrackStyle: TRACK_STYLE_OPTIONS,
  progressColor: FILL_OPTIONS,
}
