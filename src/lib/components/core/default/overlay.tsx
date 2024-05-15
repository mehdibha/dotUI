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

type OverlayProps = {
  type?: "modal" | "drawer" | "popover";
  children?: React.ReactNode;
  isDismissable?: boolean;
  className?: string;
  classNames?: ModalOverlayClassNames &
    DrawerOverlayClassNames &
    PopoverOverlayClassNames;
};

const Overlay = ({ type = "modal", isDismissable, ...props }: OverlayProps) => {
  switch (type) {
    case "modal":
      return <ModalOverlay isDismissable={isDismissable} {...props} />;
    case "drawer":
      return <DrawerOverlay isDismissable={isDismissable} {...props} />;
    case "popover":
      return <PopoverOverlay {...props} />;
  }
};

const modalVariants = tv({
  slots: {
    backdrop: [
      "fixed inset-0 z-50 bg-black/80",
      "data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0",
    ],
    overlay: [
      "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
      "border bg-background shadow-lg sm:rounded-lg md:w-full",
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

const ModalOverlay = ({
  classNames,
  className,
  isDismissable = true,
  ...props
}: ModalOverlayProps) => {
  const { overlay, backdrop } = modalVariants({});
  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={backdrop({ className: classNames?.backdrop })}
    >
      <AriaModal {...props} className={cn(overlay(), classNames?.overlay, className)} />
    </AriaModalOverlay>
  );
};

const drawerVariants = tv({
  slots: {
    backdrop:
      "fixed inset-0 z-50 bg-red-500/80 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0",
    overlay:
      "fixed left-[50%] bottom-0 z-50 w-full max-w-lg translate-x-[-50%] border bg-background shadow-lg duration-200 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[entering]:slide-in-from-left-1/2 data-[entering]:slide-in-from-top-[48%] data-[exiting]:slide-out-to-left-1/2 data-[exiting]:slide-out-to-top-[48%] sm:rounded-lg md:w-full",
  },
});

type DrawerOverlaySlots = keyof ReturnType<typeof drawerVariants>;
type DrawerOverlayClassNames = {
  [key in DrawerOverlaySlots]?: string;
};

interface DrawerOverlayProps extends AriaModalOverlayProps {
  classNames?: DrawerOverlayClassNames;
}

const DrawerOverlay = ({
  classNames,
  className,
  isDismissable = true,
  ...props
}: DrawerOverlayProps) => {
  const { overlay, backdrop } = drawerVariants({});
  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={backdrop({ className: classNames?.backdrop })}
    >
      <AriaModal {...props} className={cn(overlay(), classNames?.overlay, className)} />
    </AriaModalOverlay>
  );
};

// TODO: Replace colors and add forced-colors

const popoverOverlayVariants = tv({
  slots: {
    overlay: [
      "z-50 rounded-md border bg-popover text-popover-foreground shadow-md",
      "entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 entering:placement-left:slide-in-from-right-1 entering:placement-right:slide-in-from-left-1 entering:ease-out entering:duration-200",
      "exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 exiting:placement-left:slide-out-to-right-1 exiting:placement-right:slide-out-to-left-1 exiting:ease-in exiting:duration-150",
    ],
    arrow: [
      "block fill-popover stroke-1 stroke-border",
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

const PopoverOverlay = ({
  arrow = false,
  children,
  className,
  classNames,
  ...props
}: PopoverOverlayProps) => {
  const { overlay, arrow: arrowStyle } = popoverOverlayVariants({});
  return (
    <AriaPopover {...props} className={cn(overlay({}), classNames?.overlay, className)}>
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
};

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
