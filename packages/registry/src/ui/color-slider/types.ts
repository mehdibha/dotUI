import type {
  ColorSlider as AriaColorSlider,
  SliderTrack as AriaSliderTrack,
  SliderOutput as AriaSliderOutput,
} from "react-aria-components";

export interface ColorSliderProps
  extends React.ComponentProps<typeof AriaColorSlider> {}

export interface ColorSliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

export interface ColorSliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

