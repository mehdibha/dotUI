"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
  TooltipTriggerStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { Variants } from "motion/react";
import type { VariantProps } from "tailwind-variants";

import { createScopedContext } from "@/lib/utils";

const tooltipStyles = tv({
  slots: {
    content:
      "group/tooltip text-fg placement-bottom:origin-top placement-top:origin-bottom placement-left:origin-right placement-right:origin-left z-50 rounded-md px-3 py-1.5 text-sm shadow-md",
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

const MOTION_VARIANTS: Variants = {
  enter: {
    transform: "scale(1)",
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.2,
    },
  },
  exit: {
    transform: "scale(0.85)",
    opacity: 0,
    transition: {
      type: "easeOut",
      duration: 0.15,
    },
  },
};

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

const MotionTooltip = motion.create(AriaTooltip);

interface TooltipContentProps
  extends Omit<React.ComponentProps<typeof AriaTooltip>, "children" | "style">,
    VariantProps<typeof tooltipStyles> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
function TooltipContent({
  variant,
  offset = 10,
  className,
  ...props
}: TooltipContentProps) {
  const state = React.use(TooltipTriggerStateContext)!;
  const isOpen = state.isOpen;
  return (
    <TooltipProvider variant={variant}>
      <AnimatePresence>
        {isOpen && (
          <MotionTooltip
            isOpen
            initial="exit"
            animate="enter"
            exit="exit"
            offset={offset}
            variants={MOTION_VARIANTS}
            className={composeRenderProps(className, (className) =>
              content({ variant, className }),
            )}
            {...props}
          />
        )}
      </AnimatePresence>
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
