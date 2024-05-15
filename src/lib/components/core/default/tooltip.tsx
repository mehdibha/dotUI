"use client";

import * as React from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
  OverlayArrow as AriaOverlayArrow,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const tooltipVariants = tv({
  base: "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 max-w-[200px] sm:max-w-[160px] duration-100 exiting:duration-75 exiting:animate-out exiting:fade-out-0",
  variants: {
    variant: {
      fill: "",
      muted: "",
    },
    type: {
      neutral: "bg-bg-tooltip text-fg-onTooltip",
      danger: "bg-bg-danger text-fg-onDanger",
      success: "bg-bg-success text-fg-onSuccess",
      warning: "bg-bg-warning text-fg-onWarning",
      info: "bg-bg-info text-fg-onInfo",
    },
    compoundVariants: [
      {
        variant: "muted",
        type: "neutral",
        className: "border border-border-muted bg-bg-muted text-fg",
      },
      {
        variant: "muted",
        type: "danger",
        className: "border border-border-danger bg-bg-danger-muted text-fg-onMutedDanger",
      },
      {
        variant: "muted",
        type: "success",
        className:
          "border border-border-success bg-bg-success-muted text-fg-onMutedSuccess",
      },
      {
        variant: "muted",
        type: "warning",
        className:
          "border border-border-warning bg-bg-warning-muted text-fg-onMutedWarning",
      },
      {
        variant: "muted",
        type: "info",
        className: "border border-border-info bg-bg-info-muted text-fg-onMutedInfo",
      },
    ],
  },
  defaultVariants: {
    variant: "fill",
    type: "neutral",
  },
});

type TooltipRootProps = AriaTooltipTriggerProps;

const TooltipRoot = ({ delay = 700, closeDelay = 0, ...props }: TooltipRootProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

interface TooltipContentProps
  extends Omit<AriaTooltipProps, "children">,
    VariantProps<typeof tooltipVariants> {
  children: React.ReactNode;
}

const TooltipContent = ({ type, variant, ...props }: TooltipContentProps) => {
  return (
    <AriaTooltip
      {...props}
      offset={10}
      className={composeRenderProps(props.className, (className) =>
        tooltipVariants({ type, variant, className })
      )}
    />
  );
};

const TooltipArrow = (props: Partial<React.SVGProps<SVGSVGElement>>) => {
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

interface TooltipProps
  extends TooltipRootProps,
    TooltipContentProps,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  arrow?: boolean;
}

const Tooltip = ({
  children,
  isDisabled,
  delay,
  closeDelay,
  trigger,
  isOpen,
  defaultOpen,
  content,
  arrow = true,
  variant,
  type,

  ...props
}: TooltipProps) => {
  return (
    <TooltipRoot
      isDisabled={isDisabled}
      delay={delay}
      closeDelay={closeDelay}
      trigger={trigger}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
    >
      {children}
      {arrow && <TooltipArrow />}
      <TooltipContent variant={variant} type={type} {...props}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

export { Tooltip, TooltipRoot, TooltipContent, TooltipArrow };
export type { TooltipProps, TooltipRootProps, TooltipContentProps };
