import type * as KeyboardPrimitives from 'react-aria-components/Keyboard'

/**
 * Groups multiple keyboard keys together to represent a key combination.
 */
export interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * A kbd displays a keyboard key or shortcut that triggers an action.
 */
export interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitives.Keyboard
> {}
