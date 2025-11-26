import type {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  SliderThumb as AriaSliderThumb,
  SliderOutput as AriaSliderOutput,
} from "react-aria-components";

export interface SliderProps
  extends React.ComponentProps<typeof AriaSlider> {}

export interface SliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

export interface SliderFillerProps extends React.ComponentProps<"div"> {}

export interface SliderThumbProps
  extends React.ComponentProps<typeof AriaSliderThumb> {}

export interface SliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

