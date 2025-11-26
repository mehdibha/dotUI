import type { Popover as AriaPopover } from "react-aria-components";

export interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  /**
   * Whether to show an arrow pointing to the trigger.
   * @default false
   */
  showArrow?: boolean;
}

