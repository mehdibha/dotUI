"use client";

import React from "react";
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const drawerVariants = tv({
  slots: {
    underlay:
      "before:ease-drawer before:animate-in before:fade-in exiting:before:animate-out exiting:before:fade-out exiting:before:duration-300 fixed inset-0 z-50 before:fixed before:inset-0 before:bg-black/40 before:duration-300 before:content-['']",
    overlay:
      "outline-hidden entering:animate-in exiting:animate-out entering:duration-300 exiting:duration-300 bg-bg ease-drawer fixed z-50 flex flex-col",
  },
  variants: {
    placement: {
      top: {
        overlay:
          "exiting:slide-out-to-top entering:slide-in-from-top inset-x-0 top-0 border-b",
      },
      bottom: {
        overlay:
          "exiting:slide-out-to-bottom entering:slide-in-from-bottom inset-x-0 bottom-0 border-t",
      },
      left: {
        overlay:
          "exiting:slide-out-to-left entering:slide-in-from-left top-0 left-0 h-(--visual-viewport-height) border-r",
      },
      right: {
        overlay:
          "exiting:slide-out-to-right entering:slide-in-from-right top-0 right-0 h-(--visual-viewport-height) border-l",
      },
    },
  },
  defaultVariants: {
    placement: "bottom",
  },
});

const { overlay, underlay } = drawerVariants();

interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
  placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({
  isDismissable = true,
  className,
  style,
  placement,
  ...props
}: DrawerProps) {
  return (
    <AriaModalOverlay
      className={underlay()}
      isDismissable={isDismissable}
      {...props}
    >
      <AriaModal
        className={composeRenderProps(className, (className) =>
          overlay({ placement, className })
        )}
        style={style}
        {...props}
      />
    </AriaModalOverlay>
  );
}

export type { DrawerProps };
export { Drawer };
