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
      "before:ease-drawer entering:before:opacity-0 exiting:before:opacity-0 fixed inset-0 z-50 before:fixed before:inset-0 before:bg-black/40 before:opacity-100 before:duration-500 before:content-['']",
    overlay:
      "bg-bg ease-drawer fixed z-50 flex flex-col border duration-500 will-change-transform",
  },
  variants: {
    placement: {
      top: {
        overlay:
          "entering:-translate-y-full exiting:-translate-y-full top-0 max-h-[calc(var(--visual-viewport-height)-var(--drawer-margin))] min-h-20 w-screen translate-y-0 rounded-b-xl border-t-0",
      },
      bottom: {
        overlay:
          "top-(--visual-viewport-height) exiting:translate-y-0 entering:translate-y-0 max-h-[calc(var(--visual-viewport-height)-var(--drawer-margin))] min-h-20 w-screen -translate-y-full rounded-t-xl border-b-0 [&>[role=dialog]]:pb-[calc(max(calc(var(--spacing)*4),env(safe-area-inset-bottom)))]",
      },
      left: {
        overlay:
          "entering:-translate-x-full exiting:-translate-x-full max-h-(--visual-viewport-height) h-(--visual-viewport-height) left-0 top-0 min-w-20 max-w-[calc(100vw-var(--drawer-margin))] translate-x-0 rounded-r-xl border-l-0 [&>[role=dialog]]:pb-[calc(max(calc(var(--spacing)*4),env(safe-area-inset-bottom)))]",
      },
      right: {
        overlay:
          "entering:translate-x-full exiting:translate-x-full max-h-(--visual-viewport-height) h-(--visual-viewport-height) right-0 top-0 min-w-20 max-w-[calc(100vw-var(--drawer-margin))] translate-x-0 rounded-l-xl border-r-0 [&>[role=dialog]]:pb-[calc(max(calc(var(--spacing)*4),env(safe-area-inset-bottom)))]",
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
        style={composeRenderProps(style, (style) => ({
          "--drawer-margin": "calc(var(--spacing)*24)",
          ...style,
        }))}
        {...props}
      />
    </AriaModalOverlay>
  );
}

export type { DrawerProps };
export { Drawer };
