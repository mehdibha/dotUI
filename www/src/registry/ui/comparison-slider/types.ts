import type * as SliderPrimitives from 'react-aria-components/Slider'

/**
 * A comparison slider reveals one layer over another as the user drags a handle,
 * commonly used for before/after image comparisons. Built on a React Aria slider,
 * so it is fully keyboard accessible.
 */
export interface ComparisonSliderProps extends Omit<
  React.ComponentProps<typeof SliderPrimitives.Slider>,
  'children'
> {
  /** Base layer, revealed to the right of the handle (e.g. the "after" image). */
  children: React.ReactNode
  /** Overlay layer, clipped to the left of the handle (e.g. the "before" image). */
  reveal: React.ReactNode
  /** Content rendered inside the draggable handle. */
  handle?: React.ReactNode
}
