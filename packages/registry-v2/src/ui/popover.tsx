"use client";

import React from "react";
import {
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const popoverStyles = tv({
  slots: {
    popover: [
      "popover z-50 max-w-72 min-w-(--trigger-width) origin-(--trigger-anchor-point) overflow-y-auto rounded-md border bg-popover shadow-md forced-color-adjust-none",

      "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",

      "entering:scale-95 entering:transform-(--origin) entering:opacity-0",
      "exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150",
      "placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]",
    ],
    arrow: [
      "block [&>svg]:size-2.5 [&>svg]:fill-tooltip",
      "placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180",
    ],
  },
});

const { popover, arrow } = popoverStyles();

interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  showArrow?: boolean;
}
function Popover({ className, showArrow = false, ...props }: PopoverProps) {
  return (
    <AriaPopover
      data-slot="popover"
      data-popover=""
      className={composeRenderProps(className, (className) =>
        popover({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {showArrow && <PopoverArrow />}
        </>
      ))}
    </AriaPopover>
  );
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return (
    <AriaOverlayArrow>
      <svg
        width={12}
        height={12}
        viewBox="0 0 8 8"
        className={arrow({ className })}
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

export type { PopoverProps };
export { Popover };
