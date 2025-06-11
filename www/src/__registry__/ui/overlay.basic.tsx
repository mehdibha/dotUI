"use client";

import type { DrawerProps } from "@/registry/ui/drawer.basic";
import type { ModalProps } from "@/registry/ui/modal.blur";
import type { PopoverProps } from "@/registry/ui/popover.basic";
import { useIsMobile } from "@/registry/hooks/use-is-mobile";
import { Drawer } from "@/registry/ui/drawer.basic";
import { Modal } from "@/registry/ui/modal.blur";
import { Popover } from "@/registry/ui/popover.basic";

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

  if (resolvedType === "modal") {
    return <Modal {...modalProps} {...props} />;
  }

  if (resolvedType === "popover") {
    return <Popover {...popoverProps} {...props} />;
  }

  if (resolvedType === "drawer") {
    return <Drawer {...drawerProps} {...props} />;
  }
}

export type { OverlayProps };
export { Overlay };
