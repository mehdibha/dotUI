import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { THUMB_VALUES, TRACK_VALUES } from "./sliders"

export const THUMB_OPTIONS = options(THUMB_VALUES, {
  knob: {
    label: "Knob",
    credits: ["shadcn nova, rhea, luma", "Radix", "Spectrum 2"],
  },
  ring: {
    label: "Ring",
    credits: ["shadcn vega, maia", "Untitled UI", "Ant Design"],
  },
  solid: {
    label: "Solid",
    credits: ["shadcn sera", "Carbon", "Supabase", "Polaris"],
  },
  handle: { label: "Handle", credits: ["Material 3"] },
})

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  auto: { label: "Auto" },
  hairline: { label: "Hairline", credits: ["Carbon", "shadcn sera"] },
  thin: { label: "Thin", credits: ["shadcn nova", "Supabase", "Polaris"] },
  medium: { label: "Medium", credits: ["Radix", "Untitled UI", "Geist"] },
  thick: { label: "Thick", credits: ["Material 3"] },
})

export const OPTIONS = {
  sliderThumb: THUMB_OPTIONS,
  sliderTrack: TRACK_OPTIONS,
  sliderColor: SOURCE_OPTIONS,
}
