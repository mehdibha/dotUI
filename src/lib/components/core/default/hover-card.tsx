"use client";

import * as React from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow as AriaOverlayArrow,
  composeRenderProps,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const hoverCardVariants = tv({
  base: "z-50 overflow-auto rounded-md p-4 shadow-md animate-in fade-in-0 duration-100 exiting:duration-75 exiting:animate-out exiting:fade-out-0 bg-bg-tooltip text-fg-onTooltip",
});

type HoverCardRootProps = AriaTooltipTriggerProps;

const HoverCardRoot = ({
  delay = 200,
  closeDelay = 150,
  ...props
}: HoverCardRootProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

interface HoverCardContentProps
  extends Omit<AriaTooltipProps, "children">,
    VariantProps<typeof hoverCardVariants> {
  children: React.ReactNode;
}

const HoverCardContent = (props: HoverCardContentProps) => {
  return (
    <AriaTooltip
      offset={10}
      {...props}
      className={composeRenderProps(props.className, (className) =>
        hoverCardVariants({ className })
      )}
    />
  );
};

const HoverCardArrow = (props: Partial<React.SVGProps<SVGSVGElement>>) => {
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

interface HoverCardProps
  extends HoverCardRootProps,
    HoverCardContentProps,
    VariantProps<typeof hoverCardVariants> {
  content: React.ReactNode;
  arrow?: boolean;
}

const HoverCard = ({
  children,
  isDisabled,
  delay,
  closeDelay,
  trigger,
  isOpen,
  defaultOpen,
  content,
  arrow = true,
  ...props
}: HoverCardProps) => {
  return (
    <HoverCardRoot
      isDisabled={isDisabled}
      delay={delay}
      closeDelay={closeDelay}
      trigger={trigger}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
    >
      {children}
      {arrow && <HoverCardArrow />}
      <HoverCardContent {...props}>{content}</HoverCardContent>
    </HoverCardRoot>
  );
};

export { HoverCard, HoverCardRoot, HoverCardContent, HoverCardArrow };
export type { HoverCardProps, HoverCardRootProps, HoverCardContentProps };
