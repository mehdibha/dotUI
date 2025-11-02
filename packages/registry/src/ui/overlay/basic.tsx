"use client";

import { useIsMobile } from "@dotui/registry/hooks/use-mobile";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Modal } from "@dotui/registry/ui/modal";
import { Popover } from "@dotui/registry/ui/popover";
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
