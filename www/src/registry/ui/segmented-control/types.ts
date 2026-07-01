import type * as ToggleButtonPrimitives from 'react-aria-components/ToggleButton'
import type * as ToggleButtonGroupPrimitives from 'react-aria-components/ToggleButtonGroup'

/**
 * A segmented control lets the user pick one option from a small, mutually
 * exclusive set, with a pill indicator that slides to the selection.
 */
export interface SegmentedControlProps extends Omit<
  React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
  'selectionMode'
> {}

/**
 * A single segment within a `SegmentedControl`. Each item needs a unique `id`,
 * which is the value reported by the control's selection.
 */
export interface SegmentedControlItemProps extends React.ComponentProps<
  typeof ToggleButtonPrimitives.ToggleButton
> {}
