"use client";

import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Focusable as AriaFocusable,
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { focusRing } from "../lib/focus-styles";

const tooltipStyles = tv({
  slots: {
    content: [
      "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-sm bg-tooltip px-3 py-1.5 text-center text-xs text-fg-on-tooltip forced-color-adjust-none outline-none",

      "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",

      "entering:scale-95 entering:transform-(--origin) entering:opacity-0",
      "exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150",
      "placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]",
    ],
    arrow: [
      "block [&>svg]:size-2.5 [&>svg]:fill-tooltip",
      "placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
    ],
    trigger: focusRing(),
  },
});

const { content, arrow, trigger } = tooltipStyles();

/* -----------------------------------------------------------------------------------------------*/

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
  showArrow = true,
  children,
  ...tooltipContentProps
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
      <TooltipContent {...tooltipContentProps}>
        {showArrow && <TooltipArrow />}
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

/* -----------------------------------------------------------------------------------------------*/
interface TooltipRootProps
  extends React.ComponentProps<typeof AriaTooltipTrigger> {}

const TooltipRoot = ({
  delay = 700,
  closeDelay = 0,
  ...props
}: TooltipRootProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

/* -----------------------------------------------------------------------------------------------*/

interface TooltipContentProps
  extends React.ComponentProps<typeof AriaTooltip>,
    VariantProps<typeof tooltipStyles> {}

function TooltipContent({
  offset = 10,
  className,
  ...props
}: TooltipContentProps) {
  return (
    <AriaTooltip
      data-slot="tooltip"
      offset={offset}
      className={composeRenderProps(className, (className) =>
        content({ className }),
      )}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TooltipArrowProps extends React.ComponentProps<"svg"> {}

function TooltipArrow({ className }: TooltipArrowProps) {
  return (
    <AriaOverlayArrow className={arrow({ className })}>
      <svg data-slot="tooltip-arrow" width={8} height={8} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TooltipTriggerProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}
const TooltipTrigger = ({
  asChild = false,
  children,
  className,
  ...props
}: TooltipTriggerProps) => {
  const Comp = asChild ? Slot : "div";

  return (
    <AriaFocusable>
      <Comp
        data-slot="tooltip-trigger"
        role="button"
        className={trigger({ className })}
        {...props}
      >
        {children}
      </Comp>
    </AriaFocusable>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundTooltip = Object.assign(Tooltip, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});

export {
  CompoundTooltip as Tooltip,
  TooltipRoot,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
};

export type {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipTriggerProps,
};
