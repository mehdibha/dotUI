"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type VariantProps, cn, cva } from "@/lib/utils/classes";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-bg-tooltip text-fg-onTooltip",
        danger: "bg-bg-danger text-fg-onDanger",
        success: "bg-bg-success text-fg-onSuccess",
        warning: "bg-bg-warning text-fg-onWarning",
        info: "bg-bg-info text-fg-onInfo",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant, className }))}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipProps
  extends React.ComponentProps<typeof TooltipPrimitive.Root>,
    Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "asChild" | "content">,
    VariantProps<typeof tooltipContentVariants> {
  container?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>["container"];
  content: React.ReactNode;
}

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps
>((props, ref) => {
  const {
    children,
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    disableHoverableContent,
    content,
    container,
    forceMount,
    ...tooltipContentProps
  } = props;
  const rootProps = {
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    disableHoverableContent,
  };
  return (
    <TooltipRoot {...rootProps}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal container={container} forceMount={forceMount}>
        <TooltipContent {...tooltipContentProps} ref={ref}>
          {content}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
});
Tooltip.displayName = "Tooltip";

export {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
};
