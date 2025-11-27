import type { DrawerProps } from "@dotui/registry/ui/drawer";
import type { ModalProps } from "@dotui/registry/ui/modal";
import type { PopoverProps } from "@dotui/registry/ui/popover";

type Type = "modal" | "popover" | "drawer";

type CommonProps =
  | "isDismissable"
  | "isOpen"
  | "defaultOpen"
  | "onOpenChange"
  | "isKeyboardDismissDisabled"
  | "shouldCloseOnInteractOutside";

/**
 * Missing description.
 */
export interface OverlayProps extends Pick<ModalProps, CommonProps> {
  children?: React.ReactNode;

  /**
   * The type of overlay to display on desktop.
   * @default 'modal'
   */
  type?: Type;

  /**
   * The type of overlay to display on mobile. Set to null to disable.
   * @default 'drawer'
   */
  mobileType?: Type | null;

  /**
   * Props to pass to the popover when type is 'popover'.
   */
  popoverProps?: Omit<PopoverProps, "children" | CommonProps>;

  /**
   * Props to pass to the modal when type is 'modal'.
   */
  modalProps?: Omit<ModalProps, "children" | CommonProps>;

  /**
   * Props to pass to the drawer when type is 'drawer'.
   */
  drawerProps?: Omit<DrawerProps, "children" | CommonProps>;
}
