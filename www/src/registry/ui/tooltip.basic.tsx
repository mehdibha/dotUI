"use client";

import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { createScopedContext } from "@/registry/lib/utils";
import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

// TODO: Remove tailwindcss-animate an replace it with css transitions

const tooltipStyles = tv({
  slots: {
    content:
      "group/tooltip text-fg entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-0.5 entering:placement-top:slide-in-from-bottom-0.5 entering:placement-left:slide-in-from-right-0.5 entering:placement-right:slide-in-from-left-0.5 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-0.5 exiting:placement-top:slide-out-to-bottom-0.5 exiting:placement-left:slide-out-to-right-0.5 exiting:placement-right:slide-out-to-left-0.5 entering:ease-out exiting:ease-out entering:duration-150 exiting:duration-100 z-50 rounded-md px-3 py-1.5 text-sm shadow-md",
    arrow:
      "group-placement-left/tooltip:-rotate-90 group-placement-right/tooltip:rotate-90 group-placement-bottom/tooltip:rotate-180",
  },
  variants: {
    variant: {
      default: {
        content: "bg-bg-muted border",
        arrow: "fill-bg-muted stroke-border",
      },
      inverse: {
        content: "bg-bg-inverse text-fg-inverse",
        arrow: "fill-bg-inverse",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const { content, arrow } = tooltipStyles();

const [TooltipProvider, useTooltipContext] =
  createScopedContext<VariantProps<typeof tooltipStyles>>("TooltipRoot");

interface TooltipProps
  extends TooltipRootProps,
    Omit<TooltipContentProps, "children"> {
  content?: React.ReactNode;
  showArrow?: boolean;
}
const Tooltip = ({
  delay,
  closeDelay,
  trigger,
  defaultOpen,
  isOpen,
  onOpenChange,
  isDisabled,
  content,
  showArrow = false,
  children,
  ...props
}: TooltipProps) => {
  return (
    <TooltipRoot
      delay={delay}
      closeDelay={closeDelay}
      trigger={trigger}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      isDisabled={isDisabled}
    >
      {children}
      <TooltipContent {...props}>
        {showArrow && <TooltipArrow />}
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

interface TooltipRootProps
  extends React.ComponentProps<typeof AriaTooltipTrigger> {}
const TooltipRoot = ({
  delay = 700,
  closeDelay = 0,
  ...props
}: TooltipRootProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

interface TooltipContentProps
  extends React.ComponentProps<typeof AriaTooltip>,
    VariantProps<typeof tooltipStyles> {}
function TooltipContent({
  variant,
  offset = 10,
  className,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipProvider variant={variant}>
      <AriaTooltip
        offset={offset}
        className={composeRenderProps(className, (className) =>
          content({ variant, className }),
        )}
        {...props}
      />
    </TooltipProvider>
  );
}

interface TooltipArrowProps extends React.ComponentProps<"svg"> {}
function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  const { variant } = useTooltipContext("TooltipArrow");
  return (
    <AriaOverlayArrow>
      <svg
        width={8}
        height={8}
        viewBox="0 0 8 8"
        className={arrow({ variant, className })}
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

export type {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
};
export { Tooltip, TooltipRoot, TooltipContent, TooltipArrow };
