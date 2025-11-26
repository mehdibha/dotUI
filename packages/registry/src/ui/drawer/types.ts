import type { Modal as AriaModal } from "react-aria-components";

export interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
  /**
   * The side of the screen where the drawer appears.
   * @default 'bottom'
   */
  placement?: "top" | "bottom" | "left" | "right";
}
