import type * as RadioGroupPrimitives from 'react-aria-components/RadioGroup'

/**
 * A rating lets the user select a score, such as a number of stars, within a
 * range. Built on a React Aria radio group, so it is fully keyboard accessible.
 */
export interface RatingProps extends Omit<
  RadioGroupPrimitives.RadioGroupProps,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'orientation'
> {
  /** The number of items to display. @default 5 */
  max?: number
  /** The selected rating (controlled). */
  value?: number
  /** The default rating (uncontrolled). */
  defaultValue?: number
  /** Handler called when the selected rating changes. */
  onChange?: (value: number) => void
}
