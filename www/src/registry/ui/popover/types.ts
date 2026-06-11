import type * as PopoverPrimitives from 'react-aria-components/Popover'

/**
 * A popover is an overlay element positioned relative to a trigger.
 */
export interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitives.Popover
> {
  /**
   * Whether to show an arrow pointing to the trigger.
   * @default false
   */
  showArrow?: boolean
}
