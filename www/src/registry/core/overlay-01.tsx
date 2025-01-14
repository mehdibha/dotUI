"use client";

import { Drawer, DrawerProps } from "@/registry/core/drawer";
import { Modal, ModalProps } from "@/registry/core/modal";
import { Popover, PopoverProps } from "@/registry/core/popover";
import { useMediaQuery } from "@/registry/hooks/use-media-query";

type Type = "modal" | "popover" | "drawer";

interface OverlayProps {
  children?: React.ReactNode;
  type?: Type;
  mobileType?: Type;
  mediaQuery?: string;
  popoverProps?: PopoverProps;
  modalProps?: ModalProps;
  drawerProps?: DrawerProps;
}

function Overlay({
  type = "modal",
  mobileType,
  mediaQuery = "(max-width: 640px)",
  children,
  modalProps,
  popoverProps,
  drawerProps,
}: OverlayProps) {
  const isMobile = useMediaQuery(mediaQuery);
  const resolvedType = mobileType ? (isMobile ? mobileType : type) : type;

  if (resolvedType === "modal") {
    return <Modal {...modalProps}>{children}</Modal>;
  }

  if (resolvedType === "popover") {
    return <Popover {...popoverProps}>{children}</Popover>;
  }

  if (resolvedType === "drawer") {
    return <Drawer {...drawerProps}>{children}</Drawer>;
  }
}

export type { OverlayProps };
export { Overlay };
