"use client";

import React from "react";
import {
  Popover as AriaPopover,
  OverlayArrow as AriaOverlayArrow,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type PopoverProps as AriaPopoverProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import {
  MotionDrawerContent,
  MotionDrawerRoot,
  useMotionDrawer,
} from "./use-motion-drawer";

type OverlayProps = {
  type?: "modal" | "drawer" | "popover";
  children: React.ReactNode;
  classNames?: ModalOverlayClassNames &
    DrawerOverlayClassNames &
    PopoverOverlayClassNames;
} & Omit<AriaModalOverlayProps, "children"> &
  Omit<AriaPopoverProps, "children">;

const Overlay = React.forwardRef<HTMLElement | HTMLDivElement, OverlayProps>(
  ({ type = "modal", isDismissable, ...props }, ref) => {
    switch (type) {
      case "modal":
        return (
          <ModalOverlay
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            isDismissable={isDismissable}
            {...props}
          />
        );
      case "drawer":
        return (
          <DrawerOverlay
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            isDismissable={isDismissable}
            {...props}
          />
        );
      case "popover":
        return <PopoverOverlay ref={ref as React.ForwardedRef<HTMLElement>} {...props} />;
    }
  }
);
Overlay.displayName = "Overlay";

const modalVariants = tv({
  slots: {
    backdrop: [
      "fixed inset-0 z-50 bg-black/80",
      "data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0",
    ],
    overlay: [
      "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
      "border bg-bg shadow-lg sm:rounded-lg md:w-full",
      "duration-200 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[entering]:slide-in-from-left-1/2 data-[entering]:slide-in-from-top-[48%] data-[exiting]:slide-out-to-left-1/2 data-[exiting]:slide-out-to-top-[48%]",
    ],
  },
});

type ModalOverlaySlots = keyof ReturnType<typeof modalVariants>;
type ModalOverlayClassNames = {
  [key in ModalOverlaySlots]?: string;
};

interface ModalOverlayProps extends AriaModalOverlayProps {
  classNames?: ModalOverlayClassNames;
}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof AriaModalOverlay>,
  ModalOverlayProps
>(({ classNames, className, isDismissable = true, ...props }, ref) => {
  const { overlay, backdrop } = modalVariants({});
  return (
    <AriaModalOverlay
      {...props}
      ref={ref}
      isDismissable={isDismissable}
      className={backdrop({ className: classNames?.backdrop })}
    >
      <AriaModal {...props} className={cn(overlay(), classNames?.overlay, className)} />
    </AriaModalOverlay>
  );
});
ModalOverlay.displayName = "ModalOverlay";

// TODO: Replace colors and add forced-colors

const popoverOverlayVariants = tv({
  slots: {
    overlay: [
      "z-50 rounded-md border bg-bg text-popover-foreground shadow-md",
      "entering:duration-200 exiting:duration-150",
      // TODO FIX THESE ANIMATIONS
      // "entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 entering:placement-left:slide-in-from-right-1 entering:placement-right:slide-in-from-left-1 entering:ease-out entering:duration-200",
      // "exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 exiting:placement-left:slide-out-to-right-1 exiting:placement-right:slide-out-to-left-1 exiting:ease-in exiting:duration-150",
    ],
    arrow: [
      "block fill-bg stroke-1 stroke-border",
      "group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180",
    ],
  },
});

type PopoverOverlaySlots = keyof ReturnType<typeof popoverOverlayVariants>;
type PopoverOverlayClassNames = {
  [key in PopoverOverlaySlots]?: string;
};

interface PopoverOverlayProps extends Omit<AriaPopoverProps, "children"> {
  children?: React.ReactNode;
  arrow?: boolean;
  classNames?: PopoverOverlayClassNames;
}

const PopoverOverlay = React.forwardRef<
  React.ElementRef<typeof AriaPopover>,
  PopoverOverlayProps
>(({ arrow = false, children, className, classNames, ...props }, ref) => {
  const { overlay, arrow: arrowStyle } = popoverOverlayVariants({});
  return (
    <AriaPopover
      ref={ref}
      {...props}
      className={cn(overlay({}), classNames?.overlay, className)}
    >
      {arrow && (
        <AriaOverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className={arrowStyle({ className: classNames?.arrow })}
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </AriaOverlayArrow>
      )}
      {children}
    </AriaPopover>
  );
});
PopoverOverlay.displayName = "PopoverOverlay";

const drawerVariants = tv({
  slots: {
    backdrop: [
      "fixed inset-0 bg-black/60",
      "opacity-0 transition-opacity duration-500 ease-drawer data-[visible=true]:opacity-100",
    ],
    overlay: [
      "bg-bg flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px] outline-none",
      "touch-none will-change-transform",
      "transition-transform duration-500 ease-drawer",
      "data-[direction=bottom]:translate-y-full data-[direction=top]:-translate-y-full data-[direction=left]:-translate-x-full data-[direction=right]:translate-x-full",
      "data-[visible=true]:translate-x-0 data-[visible=true]:translate-y-0",
    ],
  },
});

type DrawerOverlaySlots = keyof ReturnType<typeof drawerVariants>;
type DrawerOverlayClassNames = {
  [key in DrawerOverlaySlots]?: string;
};

interface DrawerOverlayProps extends Omit<AriaModalOverlayProps, "children"> {
  children?: React.ReactNode;
  classNames?: DrawerOverlayClassNames;
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof AriaModalOverlay>,
  DrawerOverlayProps
>(({ children, classNames, className, isDismissable = true, ...props }, ref) => {
  const { rootProps, modalProps, backdropProps, drawerProps } = useMotionDrawer({
    dismissible: isDismissable,
  });
  const { overlay, backdrop } = drawerVariants({});
  return (
    <MotionDrawerRoot {...rootProps}>
      <AriaModalOverlay
        ref={ref}
        isDismissable={isDismissable}
        {...props}
        {...modalProps}
      >
        <div
          {...backdropProps}
          className={backdrop({ className: classNames?.backdrop })}
        />
        <AriaModal>
          <MotionDrawerContent>
            <div
              {...drawerProps}
              className={cn(overlay(), classNames?.overlay, className)}
            >
              {/* TODO: Make the swipeIndicator optional */}
              <div className="bg-bg-muted mx-auto my-4 h-2 w-[100px] rounded-full" />
              {children}
            </div>
          </MotionDrawerContent>
        </AriaModal>
      </AriaModalOverlay>
    </MotionDrawerRoot>
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

export type { OverlayProps, ModalOverlayProps, DrawerOverlayProps, PopoverOverlayProps };
export {
  Overlay,
  PopoverOverlay,
  DrawerOverlay,
  ModalOverlay,
  drawerVariants,
  modalVariants,
  popoverOverlayVariants,
};
