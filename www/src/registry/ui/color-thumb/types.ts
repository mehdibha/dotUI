import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

/**
 * A color thumb appears within a ColorArea, ColorSlider, or ColorWheel
 * and allows a user to drag to adjust the color value.
 */
export interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
	className?: string;
}
