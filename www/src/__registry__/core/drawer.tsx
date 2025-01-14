"use client";

import React from "react";
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/registry/lib/cn";

const drawerVariants = tv({
  slots: {
    backdrop: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
    drawer: ["bg-bg outline-hidden fixed inset-0 z-50 flex flex-col"],
  },
  variants: {
    placement: {
      top: "exiting:slide-out-to-top entering:slide-in-from-top inset-x-0 top-0 border-b",
      bottom:
        "exiting:slide-out-to-bottom entering:slide-in-from-bottom inset-x-0 bottom-0 border-t",
      left: "exiting:slide-out-to-left entering:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right:
        "exiting:slide-out-to-right entering:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    },
  },
});

const { drawer, backdrop } = drawerVariants();

interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
  placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({ className, ...props }: DrawerProps) {
  return (
    <AriaModalOverlay>
      <div className={backdrop()} />
      <AriaModal className={cn(drawer(), className)} {...props} />
    </AriaModalOverlay>
  );
}

export type { DrawerProps };
export { Drawer };
