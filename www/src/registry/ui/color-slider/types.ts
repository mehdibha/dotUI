import type {
	ColorSlider as AriaColorSlider,
	SliderOutput as AriaSliderOutput,
	SliderTrack as AriaSliderTrack,
} from "react-aria-components";

/**
 * A color slider allows users to adjust an individual channel of a color value.
 */
export interface ColorSliderProps extends React.ComponentProps<typeof AriaColorSlider> {}

/**
 * Missing description.
 */
export interface ColorSliderControlProps extends React.ComponentProps<typeof AriaSliderTrack> {}

/**
 * A slider output displays the current value of a slider as text.
 */
export interface ColorSliderOutputProps extends React.ComponentProps<typeof AriaSliderOutput> {}
