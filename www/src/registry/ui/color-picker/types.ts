import * as ColorPickerPrimitives from "react-aria-components/ColorPicker";

import type { ButtonProps } from "@/registry/ui/button";
import type { DialogContentProps, DialogProps } from "@/registry/ui/dialog";

/**
 * A ColorPicker synchronizes a color value between multiple React Aria color components.
 * It simplifies building color pickers with customizable layouts via composition.
 */
export interface ColorPickerProps extends ColorPickerPrimitives.ColorPickerProps, Omit<DialogProps, "children"> {}

/**
 * Missing description.
 */
export interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
	children?: React.ReactNode | ((props: ColorPickerPrimitives.ColorPickerState) => React.ReactNode);
}

/**
 * Missing description.
 */
export interface ColorPickerContentProps extends DialogContentProps {}
