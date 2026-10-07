import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { THUMB_VALUES, TRACK_VALUES } from "./sliders"

export const THUMB_OPTIONS = options(THUMB_VALUES, {
  knob: { label: "Knob" },
  ring: { label: "Ring" },
  solid: { label: "Solid" },
  handle: { label: "Handle" },
})

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  auto: { label: "Auto" },
  hairline: { label: "Hairline" },
  thin: { label: "Thin" },
  medium: { label: "Medium" },
  thick: { label: "Thick" },
})

export const OPTIONS = {
  sliderThumb: THUMB_OPTIONS,
  sliderTrack: TRACK_OPTIONS,
  sliderColor: SOURCE_OPTIONS,
}
