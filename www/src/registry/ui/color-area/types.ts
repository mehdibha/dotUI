import type * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

/**
 * A color area allows users to adjust two channels of an RGB, HSL or HSB color value
 * against a two-dimensional gradient background.
 */
export interface ColorAreaProps extends React.ComponentProps<
  typeof ColorAreaPrimitives.ColorArea
> {}
