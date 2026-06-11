import type * as GroupPrimitives from 'react-aria-components/Group'

/**
 * A group represents a set of related UI controls, and supports interactive states for styling.
 */
export interface GroupProps extends React.ComponentProps<
  typeof GroupPrimitives.Group
> {
  /**
   * The orientation of the group layout.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}
