import * as ColorThumbPrimitives from "react-aria-components/ColorThumb";

/**
 * A color thumb appears within a ColorArea, ColorSlider, or ColorWheel
 * and allows a user to drag to adjust the color value.
 */
export interface ColorThumbProps extends Omit<ColorThumbPrimitives.ColorThumbProps, "className"> {
	className?: string;
}
