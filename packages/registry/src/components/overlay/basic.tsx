"use client";

import type { DrawerProps } from "@/components/drawer/basic";
import type { ModalProps } from "@/components/modal/blur";
import type { PopoverProps } from "@/components/popover/basic";
import { Drawer } from "@/components/drawer/basic";
import { Modal } from "@/components/modal/blur";
import { Popover } from "@/components/popover/basic";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
