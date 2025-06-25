"use client";

import type { DrawerProps } from "@dotui/ui/components/drawer";
import type { ModalProps } from "@dotui/ui/components/modal";
import type { PopoverProps } from "@dotui/ui/components/popover";
import { Drawer } from "@dotui/ui/components/drawer";
import { Modal } from "@dotui/ui/components/modal";
import { Popover } from "@dotui/ui/components/popover";
import { useIsMobile } from "@dotui/ui/hooks/use-is-mobile";

type Type = "modal" | "popover" | "drawer";

type CommonProps =
  | "isDismissable"
  | "isOpen"
  | "defaultOpen"
  | "onOpenChange"
  | "isKeyboardDismissDisabled"
  | "shouldCloseOnInteractOutside";

interface OverlayProps extends Pick<ModalProps, CommonProps> {
  children?: React.ReactNode;
  type?: Type;
  mobileType?: Type | null;
  popoverProps?: Omit<PopoverProps, "children" | CommonProps>;
  modalProps?: Omit<ModalProps, "children" | CommonProps>;
  drawerProps?: Omit<DrawerProps, "children" | CommonProps>;
}

function Overlay({
  type = "modal",
  mobileType = "drawer",
  modalProps,
  popoverProps,
  drawerProps,
  ...props
}: OverlayProps) {
  const isMobile = useIsMobile();
  const resolvedType = mobileType ? (isMobile ? mobileType : type) : type;

  if (resolvedType === "popover") {
    return <Popover {...popoverProps} {...props} />;
  }

  if (resolvedType === "drawer") {
    return <Drawer {...drawerProps} {...props} />;
  }

  return <Modal {...modalProps} {...props} />;
}

export type { OverlayProps };
export { Overlay };
