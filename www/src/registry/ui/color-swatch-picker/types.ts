import type * as ColorSwatchPickerPrimitives from 'react-aria-components/ColorSwatchPicker'

/**
 * A ColorSwatchPicker displays a list of color swatches and allows a user to select one of them.
 */
export interface ColorSwatchPickerProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPicker
> {}

/**
 * Missing description.
 */
export interface ColorSwatchPickerItemProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPickerItem
> {}
