import type {
	Slider as AriaSlider,
	SliderOutput as AriaSliderOutput,
	SliderThumb as AriaSliderThumb,
	SliderTrack as AriaSliderTrack,
} from "react-aria-components";

/**
 * A slider allows a user to select one or more values within a range.
 */
export interface SliderProps extends React.ComponentProps<typeof AriaSlider> {}

/**
 * A slider track is a container for one or more slider thumbs.
 */
export interface SliderControlProps extends React.ComponentProps<typeof AriaSliderTrack> {}

/**
 * Missing description.
 */
export interface SliderFillerProps extends React.ComponentProps<"div"> {}

/**
 * A slider thumb represents an individual value that the user can adjust within a slider track.
 */
export interface SliderThumbProps extends React.ComponentProps<typeof AriaSliderThumb> {}

/**
 * A slider output displays the current value of a slider as text.
 */
export interface SliderOutputProps extends React.ComponentProps<typeof AriaSliderOutput> {}
