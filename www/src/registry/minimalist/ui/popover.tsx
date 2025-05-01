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
    popover: [
      "bg-bg min-w-(--trigger-width) group rounded-md border shadow-md ease-[cubic-bezier(0.165,0.84,0.44,1)]",
      "placement-bottom:origin-top placement-top:origin-bottom placement-left:origin-right placement-right:origin-left",
      "entering:opacity-0 exiting:opacity-0 opacity-100 duration-150 will-change-[transform,opacity]",
      "translate-0 entering:placement-bottom:-translate-y-2 exiting:placement-bottom:-translate-y-2 entering:placement-top:translate-y-2 exiting:placement-top:translate-y-2 entering:placement-right:-translate-x-2 exiting:placement-right:-translate-x-2 entering:placement-left:translate-x-2 exiting:placement-left:translate-x-2",
    ],
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
