import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { THUMB_VALUES, TRACK_VALUES } from "./sliders"

export const THUMB_OPTIONS = options(THUMB_VALUES, {
  knob: {
    label: "Knob",
    description: "A light disc with a gray edge",
    credits: ["shadcn nova, rhea, luma", "Radix", "Spectrum 2"],
  },
  ring: {
    label: "Ring",
    description: "A light disc ringed in the fill color",
    credits: ["shadcn vega, maia", "Untitled UI", "Ant Design"],
  },
  solid: {
    label: "Solid",
    description: "A disc in the fill color",
    credits: ["shadcn sera", "Carbon", "Supabase", "Polaris"],
  },
  handle: {
    label: "Handle",
    description: "A tall bar that cuts a gap in the track",
    credits: ["Material 3"],
  },
})

const TRACKS = options(TRACK_VALUES, {
  hairline: {
    label: "Hairline",
    description: "A 2px track",
    credits: ["Carbon", "shadcn sera"],
  },
  thin: {
    label: "Thin",
    description: "A 4px track",
    credits: ["shadcn nova", "Supabase", "Polaris"],
  },
  medium: {
    label: "Medium",
    description: "An 8px track",
    credits: ["Radix", "Untitled UI", "Geist"],
  },
  thick: {
    label: "Thick",
    description: "A 16px track",
    credits: ["Material 3"],
  },
})

export const TRACK_OPTIONS = [
  { value: "auto", label: "Auto", description: "Sized to suit the thumb" },
  ...TRACKS,
]

export const OPTIONS = {
  sliderThumb: THUMB_OPTIONS,
  sliderTrack: TRACKS,
  sliderColor: SOURCE_OPTIONS,
}
