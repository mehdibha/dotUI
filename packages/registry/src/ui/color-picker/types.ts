import type { ColorPickerProps as AriaColorPickerProps, ColorPickerState } from "react-aria-components";

import type { ButtonProps } from "@dotui/registry/ui/button";
import type { DialogContentProps, DialogProps } from "@dotui/registry/ui/dialog";

/**
 * A ColorPicker synchronizes a color value between multiple React Aria color components.
 * It simplifies building color pickers with customizable layouts via composition.
 */
export interface ColorPickerProps extends AriaColorPickerProps, Omit<DialogProps, "children"> {}

/**
 * Missing description.
 */
export interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
	children?: React.ReactNode | ((props: ColorPickerState) => React.ReactNode);
}

/**
 * Missing description.
 */
export interface ColorPickerContentProps extends DialogContentProps {}
