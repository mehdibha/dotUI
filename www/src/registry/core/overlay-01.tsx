"use client";

import React from "react";
import { XIcon } from "lucide-react";
import {
  composeRenderProps,
  Popover as AriaPopover,
  OverlayArrow as AriaOverlayArrow,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  OverlayTriggerStateContext as AriaOverlayTriggerStateContext,
  type PopoverProps as AriaPopoverProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, type ButtonProps } from "@/registry/core/button-01";
import { useMediaQuery } from "@/registry/hooks/use-media-query";
import { cn } from "@/registry/lib/cn";
import { MotionDrawerRoot, useMotionDrawer } from "./use-motion-drawer";

type OverlayType = "modal" | "drawer" | "popover";

type OverlayProps = {
  type?: OverlayType;
  mobileType?: OverlayProps["type"];
  showDismissButton?: boolean;
  swipeIndicator?: boolean;
  mediaQuery?: string;
  children: React.ReactNode;
  classNames?: ModalOverlayClassNames &
    DrawerOverlayClassNames &
    PopoverOverlayClassNames;
} & Omit<AriaModalOverlayProps, "children"> &
  Omit<AriaPopoverProps, "children">;

const Overlay = React.forwardRef<HTMLElement | HTMLDivElement, OverlayProps>(
  (
    {
      type: typeProp = "modal",
      mobileType,
      mediaQuery = "(max-width: 640px)",
      isDismissable = true,
      swipeIndicator,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery(mediaQuery);
    const type = mobileType ? (isMobile ? mobileType : typeProp) : typeProp;
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
          // @ts-expect-error TODO FIX THIS SAME ORIENTATION PROP AS POPOVER :'(
          <DrawerOverlay
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            swipeIndicator={swipeIndicator}
            isDismissable={isDismissable}
            {...props}
          />
        );
      case "popover":
        return (
          <PopoverOverlay
            ref={ref as React.ForwardedRef<HTMLElement>}
            {...props}
          />
        );
    }
  }
);
Overlay.displayName = "Overlay";

const modalVariants = tv({
  slots: {
    backdrop: [
      "h-(--visual-viewport-height) fixed left-0 top-0 z-50 flex w-[100vw] items-center justify-center bg-black/40 backdrop-blur-sm",
      "entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 entering:duration-200 exiting:duration-150",
    ],
    overlay: [
      "group/overlay relative z-50 w-full max-w-lg",
      "bg-bg border shadow-lg sm:rounded-lg md:w-full",
      "entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 entering:duration-200 exiting:duration-150",
    ],
  },
});

type ModalOverlaySlots = keyof ReturnType<typeof modalVariants>;
type ModalOverlayClassNames = {
  [key in ModalOverlaySlots]?: string;
};

interface ModalOverlayProps extends AriaModalOverlayProps {
  showDismissButton?: boolean;
  classNames?: ModalOverlayClassNames;
}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof AriaModalOverlay>,
  ModalOverlayProps
>(
  (
    { classNames, className, isDismissable, showDismissButton, ...props },
    ref
  ) => {
    const { overlay, backdrop } = modalVariants({});
    return (
      <AriaModalOverlay
        {...props}
        ref={ref}
        isDismissable={isDismissable}
        className={backdrop({ className: classNames?.backdrop })}
      >
        <AriaModal
          {...props}
          data-type="modal"
          className={cn(overlay(), classNames?.overlay, className)}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              {(showDismissButton ?? isDismissable) && <DismissButton />}
              {children}
            </>
          ))}
        </AriaModal>
      </AriaModalOverlay>
    );
  }
);
ModalOverlay.displayName = "ModalOverlay";

const popoverOverlayVariants = tv({
  slots: {
    overlay:
      "group/overlay bg-bg text-fg data-[trigger=ComboBox]:min-w-(--trigger-width) data-[trigger=Select]:min-w-(--trigger-width) z-50 rounded-md border shadow-md",
    arrow: [
      "fill-bg stroke-border block stroke-1",
      "group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180",
    ],
  },
});

type PopoverOverlaySlots = keyof ReturnType<typeof popoverOverlayVariants>;
type PopoverOverlayClassNames = {
  [key in PopoverOverlaySlots]?: string;
};

interface PopoverOverlayProps extends AriaPopoverProps {
  arrow?: boolean;
  classNames?: PopoverOverlayClassNames;
  showDismissButton?: boolean;
}

const PopoverOverlay = React.forwardRef<
  React.ElementRef<typeof AriaPopover>,
  PopoverOverlayProps
>(
  (
    { arrow = false, className, showDismissButton, classNames, ...props },
    ref
  ) => {
    const { overlay, arrow: arrowStyle } = popoverOverlayVariants({});
    return (
      <AriaPopover
        data-type="popover"
        ref={ref}
        {...props}
        className={cn(overlay(), classNames?.overlay, className)}
      >
        {composeRenderProps(props.children, (children, {}) => (
          <>
            {showDismissButton && <DismissButton />}
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
          </>
        ))}
      </AriaPopover>
    );
  }
);
PopoverOverlay.displayName = "PopoverOverlay";

const drawerVariants = tv({
  slots: {
    backdrop: ["fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", "opacity-0"],
    overlay: [
      "group/overlay bg-bg outline-hidden fixed z-50 flex flex-col",
      "inset-0",
      "placement-bottom:top-auto placement-top:bottom-auto placement-left:right-auto placement-right:left-auto",
      "placement-bottom:mt-24 placement-bottom:rounded-t-[10px] placement-bottom:border-t",
      "placement-top:mb-24 placement-top:rounded-b-[10px] placement-top:border-b",
      "placement-right:ml-24 placement-right:rounded-l-[10px] placement-right:border-l",
      "placement-left:mr-24 placement-left:rounded-r-[10px] placement-left:border-r",
      "touch-none will-change-transform",
      "placement-bottom:translate-y-full placement-top:-translate-y-full placement-left:-translate-x-full placement-right:translate-x-full", // required
      "placement-bottom:max-h-[90%] placement-top:max-h-[90%]",
    ],
  },
});

type DrawerOverlaySlots = keyof ReturnType<typeof drawerVariants>;
type DrawerOverlayClassNames = {
  [key in DrawerOverlaySlots]?: string;
};

interface DrawerOverlayProps extends Omit<AriaModalOverlayProps, "children"> {
  placement?: "top" | "bottom" | "left" | "right";
  showDismissButton?: boolean;
  swipeIndicator?: boolean;
  children?: React.ReactNode;
  classNames?: DrawerOverlayClassNames;
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof AriaModalOverlay>,
  DrawerOverlayProps
>(
  (
    {
      children,
      classNames,
      className,
      isDismissable,
      showDismissButton = false,
      swipeIndicator = true,
      placement = "bottom",
      ...props
    },
    ref
  ) => {
    const { rootProps, modalProps, backdropProps, drawerProps } =
      useMotionDrawer({
        isDismissable,
        placement,
        scaleBackground: false,
      });
    const { overlay, backdrop } = drawerVariants();

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
            <div
              {...drawerProps}
              data-type="drawer"
              className={cn(overlay(), classNames?.overlay, className)}
            >
              {showDismissButton && (
                <DismissButton shape="rectangle">Done</DismissButton>
              )}
              {swipeIndicator && (
                <div className="bg-bg-muted mx-auto my-4 h-2 w-[100px] rounded-full" />
              )}
              {children}
            </div>
          </AriaModal>
        </AriaModalOverlay>
      </MotionDrawerRoot>
    );
  }
);
DrawerOverlay.displayName = "DrawerOverlay";

const DismissButton = (props: ButtonProps) => {
  const state = React.useContext(AriaOverlayTriggerStateContext);
  return (
    <Button
      shape="square"
      variant="quiet"
      size="sm"
      aria-label="Close"
      {...props}
      className={cn("absolute right-2 top-2 z-20", props.className)}
      onPress={() => state.close()}
    >
      {props.children ?? <XIcon />}
    </Button>
  );
};

export type {
  OverlayProps,
  ModalOverlayProps,
  DrawerOverlayProps,
  PopoverOverlayProps,
};
export {
  Overlay,
  PopoverOverlay,
  DrawerOverlay,
  ModalOverlay,
  DismissButton,
  drawerVariants,
  modalVariants,
  popoverOverlayVariants,
};
