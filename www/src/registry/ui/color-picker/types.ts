import type * as ColorPickerPrimitives from "react-aria-components/ColorPicker";

import type { DialogProps } from "@/registry/ui/dialog";

/**
 * A ColorPicker synchronizes a color value between multiple React Aria color components.
 * It simplifies building color pickers with customizable layouts via composition.
 */
export interface ColorPickerProps extends ColorPickerPrimitives.ColorPickerProps, Omit<DialogProps, "children"> {}
