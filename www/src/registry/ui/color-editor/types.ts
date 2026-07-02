import type * as ColorPickerPrimitives from 'react-aria-components/ColorPicker'

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb'

/**
 * A color editor allows users to adjust a color value using a color area,
 * channel sliders, and field inputs in multiple color formats. Inside a
 * ColorPicker it edits the picker's color; standalone it manages its own.
 */
export interface ColorEditorProps extends Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange' | 'color'
> {
  /**
   * The initial color format displayed by the default fields.
   * @default 'hex'
   */
  defaultFormat?: ColorFormat

  /**
   * Whether the default area shows the alpha channel slider.
   * @default false
   */
  showAlphaChannel?: boolean

  /**
   * Whether the default fields show the color format selector.
   * @default true
   */
  showFormatSelector?: boolean

  /**
   * The color value (controlled). Ignored inside a ColorPicker, which owns the color.
   */
  value?: ColorPickerPrimitives.ColorPickerProps['value']

  /**
   * The default color value (uncontrolled). Ignored inside a ColorPicker.
   * @default '#6366F1'
   */
  defaultValue?: ColorPickerPrimitives.ColorPickerProps['defaultValue']

  /**
   * Handler that is called when the color value changes. Ignored inside a ColorPicker.
   */
  onChange?: ColorPickerPrimitives.ColorPickerProps['onChange']
}

/**
 * A color editor area displays a saturation/brightness area next to a hue
 * slider and an optional alpha slider.
 */
export interface ColorEditorAreaProps extends React.ComponentProps<'div'> {
  /**
   * Whether to show the alpha channel slider.
   * @default false
   */
  showAlphaChannel?: boolean
}

/**
 * Color editor fields display channel inputs for the current color format,
 * with an optional format selector.
 */
export interface ColorEditorFieldsProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  /**
   * The color format displayed by the fields (controlled).
   */
  format?: ColorFormat

  /**
   * The initial color format displayed by the fields (uncontrolled).
   * @default 'hex'
   */
  defaultFormat?: ColorFormat

  /**
   * Handler that is called when the color format changes.
   */
  onFormatChange?: (format: ColorFormat) => void

  /**
   * Whether to show the color format selector.
   * @default true
   */
  showFormatSelector?: boolean
}
