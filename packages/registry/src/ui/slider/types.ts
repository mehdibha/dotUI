import type {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from "react-aria-components";

export interface SliderProps extends React.ComponentProps<typeof AriaSlider> {}

export interface SliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

export interface SliderFillerProps extends React.ComponentProps<"div"> {}

export interface SliderThumbProps
  extends React.ComponentProps<typeof AriaSliderThumb> {}

export interface SliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}
