import type { Popover as AriaPopover } from "react-aria-components";

/**
 * A popover is an overlay element positioned relative to a trigger.
 */
export interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  /**
   * Whether to show an arrow pointing to the trigger.
   * @default false
   */
  showArrow?: boolean;
}
