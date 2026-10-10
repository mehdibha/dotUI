"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as PopoverPrimitives from "react-aria-components/Popover";
import * as TooltipPrimitives from "react-aria-components/Tooltip";
import { type VariantProps, tv } from "tailwind-variants";

const tooltipVariants = tv({
  slots: {
    content:
      "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-md px-3 py-1.5 text-center text-xs forced-color-adjust-none outline-none border border-(--overlay-border) bg-popover/(--popover-alpha) text-fg shadow-(--shadow-popover,var(--shadow-md)) [backdrop-filter:var(--popover-backdrop-filter)] [--surface-bg:var(--color-popover)] placement-left:translate-x-1.5 placement-right:-translate-x-1.5 placement-top:translate-y-1.5 placement-bottom:-translate-y-1.5 transition-[transform,opacity,scale] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[transform,opacity,scale] motion-reduce:transition-none entering:opacity-0 exiting:opacity-0 [--slide-offset:--spacing(2)] entering:transform-(--offset) exiting:transform-(--offset) placement-left:[--offset:translateX(var(--slide-offset))] placement-right:[--offset:translateX(calc(var(--slide-offset)*-1))] placement-top:[--offset:translateY(var(--slide-offset))] placement-bottom:[--offset:translateY(calc(var(--slide-offset)*-1))]",
    arrow:
      "placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180 [&>svg]:size-2.5 [&>svg]:fill-popover/(--popover-alpha) [&>svg]:stroke-(--overlay-border) [&>svg]:stroke-1 [&_path]:[vector-effect:non-scaling-stroke] placement-left:-ml-px placement-right:-mr-px placement-top:-mt-px placement-bottom:-mb-px hidden",
  },
});

const { content, arrow } = tooltipVariants();

/* -------------------------------------------------------------------------- */
interface TooltipProps extends React.ComponentProps<
  typeof TooltipPrimitives.TooltipTrigger
> {}

const Tooltip = ({ delay = 700, closeDelay = 0, ...props }: TooltipProps) => (
  <TooltipPrimitives.TooltipTrigger
    delay={delay}
    closeDelay={closeDelay}
    {...props}
  />
);

/* -------------------------------------------------------------------------- */

interface TooltipContentProps
  extends
    React.ComponentProps<typeof TooltipPrimitives.Tooltip>,
    VariantProps<typeof tooltipVariants> {
  hideArrow?: boolean;
}

function TooltipContent({
  offset = 10,
  hideArrow = false,
  className,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitives.Tooltip
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
    </TooltipPrimitives.Tooltip>
  );
}

/* -------------------------------------------------------------------------- */

interface TooltipArrowProps extends React.ComponentProps<"svg"> {}

function TooltipArrow({ className }: TooltipArrowProps) {
  return (
    <PopoverPrimitives.OverlayArrow className={arrow({ className })}>
      <svg
        aria-hidden="true"
        data-slot="tooltip-arrow"
        width={8}
        height={8}
        viewBox="0 0 8 8"
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  );
}

/* -------------------------------------------------------------------------- */

export type { TooltipContentProps, TooltipProps };
export { Tooltip, TooltipContent };
