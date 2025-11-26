import type {
  ColorSlider as AriaColorSlider,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
} from "react-aria-components";

export interface ColorSliderProps
  extends React.ComponentProps<typeof AriaColorSlider> {}

export interface ColorSliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

export interface ColorSliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}
