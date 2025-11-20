"use client";

import type * as React from "react";
import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const tooltipStyles = tv({
  slots: {
    content: [
      "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-sm bg-tooltip px-3 py-1.5 text-center text-fg-on-tooltip text-xs outline-none forced-color-adjust-none",
      "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",
      "entering:transform-(--origin) entering:scale-95 entering:opacity-0",
      "exiting:transform-(--origin) exiting:scale-95 exiting:opacity-0 exiting:duration-150",
      "placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))] placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))]",
    ],
    arrow: [
      "block [&>svg]:size-2.5 [&>svg]:fill-tooltip",
      "placement-left:[&>svg]:-rotate-90 placement-bottom:[&>svg]:rotate-180 placement-right:[&>svg]:rotate-90",
    ],
    trigger: "focus-reset focus-visible:focus-ring",
  },
});

const { content, arrow } = tooltipStyles();

/* -----------------------------------------------------------------------------------------------*/
interface TooltipProps
  extends React.ComponentProps<typeof AriaTooltipTrigger> {}

const Tooltip = ({ delay = 700, closeDelay = 0, ...props }: TooltipProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

/* -----------------------------------------------------------------------------------------------*/

interface TooltipContentProps
  extends React.ComponentProps<typeof AriaTooltip>,
    VariantProps<typeof tooltipStyles> {
  hideArrow?: boolean;
}

function TooltipContent({
  offset = 10,
  hideArrow = false,
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
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {!hideArrow && <TooltipArrow />}
        </>
      ))}
    </AriaTooltip>
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

export { Tooltip, TooltipContent };

export type { TooltipProps, TooltipContentProps };
