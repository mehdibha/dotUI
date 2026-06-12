import type * as ColorSliderPrimitives from 'react-aria-components/ColorSlider'
import type * as SliderPrimitives from 'react-aria-components/Slider'

/**
 * A color slider allows users to adjust an individual channel of a color value.
 */
export interface ColorSliderProps extends React.ComponentProps<
  typeof ColorSliderPrimitives.ColorSlider
> {}

/**
 * A color slider control is the interactive track along which the thumb can be dragged.
 */
export interface ColorSliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

/**
 * A slider output displays the current value of a slider as text.
 */
export interface ColorSliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}
