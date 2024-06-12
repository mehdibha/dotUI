"use client";

import * as React from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow as AriaOverlayArrow,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const tooltipVariants = tv({
  base: "z-50 bg-bg-tooltip text-fg-onTooltip overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 max-w-[200px] sm:max-w-[160px] duration-100 exiting:duration-75 exiting:animate-out exiting:fade-out-0",
});

interface TooltipProps
  extends TooltipRootProps,
    Omit<TooltipContentProps, "children">,
    VariantProps<typeof tooltipVariants> {
  content?: React.ReactNode;
  arrow?: boolean;
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
  arrow = true,
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
      {arrow && <OverlayArrow />}
      <TooltipContent {...props}>{content}</TooltipContent>
    </TooltipRoot>
  );
};

type TooltipRootProps = AriaTooltipTriggerProps;
const TooltipRoot = ({ delay = 700, closeDelay = 0, ...props }: TooltipRootProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

interface TooltipContentProps
  extends Omit<AriaTooltipProps, "className">,
    VariantProps<typeof tooltipVariants> {
  className?: string;
}
const TooltipContent = ({ className, offset = 10, ...props }: TooltipContentProps) => {
  return (
    <AriaTooltip offset={offset} className={tooltipVariants({ className })} {...props} />
  );
};

type OverlayArrowProps = Partial<React.SVGProps<SVGSVGElement>>;
const OverlayArrow = (props: OverlayArrowProps) => {
  return (
    <AriaOverlayArrow>
      <svg
        width={8}
        height={8}
        viewBox="0 0 8 8"
        className="fill-slate-700 stroke-gray-800 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 dark:fill-slate-600 dark:stroke-white/10 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
        {...props}
      >
        <path d="M0 0 L6 6 L12 0" />
      </svg>
    </AriaOverlayArrow>
  );
};

export { Tooltip, TooltipRoot, TooltipContent, OverlayArrow };
export type { TooltipProps, TooltipRootProps, TooltipContentProps };
