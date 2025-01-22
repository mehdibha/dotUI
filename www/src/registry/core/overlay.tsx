"use client";

import { Drawer, DrawerProps } from "@/registry/core/drawer_basic";
import { Modal, ModalProps } from "@/registry/core/modal_basic";
import { Popover, PopoverProps } from "@/registry/core/popover_basic";
import { useMediaQuery } from "@/registry/hooks/use-media-query";

type Type = "modal" | "popover" | "drawer";

type CommonProps =
  | "UNSTABLE_portalContainer"
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
  const isMobile = useMediaQuery("(max-width: 640px)");
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
