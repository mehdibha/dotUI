"use client";

import React from "react";
import {
  composeRenderProps,
  Popover as AriaPopover,
  OverlayArrow as AriaOverlayArrow,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const popoverStyles = tv({
  slots: {
    popover:
      "bg-bg min-w-(--trigger-width) entering:animate-in entering:fade-in entering:zoom-in-95 entering:duration-150 exiting:duration-150 entering:placement-bottom:slide-in-from-top-2 entering:placement-top:slide-in-from-bottom-2 entering:placement-left:slide-in-from-right-2 entering:placement-right:slide-in-from-left-2 exiting:animate-out exiting:fade-out exiting:zoom-out-95 exiting:placement-bottom:slide-out-to-top-2 exiting:placement-top:slide-out-to-bottom-2 exiting:placement-left:slide-out-to-right-2 exiting:placement-right:slide-out-to-left-2 placement-bottom:origin-top placement-top:origin-bottom placement-left:origin-right placement-right:origin-left group rounded-md border shadow-md ease-[cubic-bezier(0.165,0.84,0.44,1)]",
    arrow:
      "stroke-border fill-bg group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 stroke-1",
  },
});

const { popover, arrow } = popoverStyles();

interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  showArrow?: boolean;
}
function Popover({ className, showArrow = false, ...props }: PopoverProps) {
  return (
    <AriaPopover
      className={composeRenderProps(className, (className) =>
        popover({ className })
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
