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
      "min-w-(--trigger-width) rounded-md border bg-popover shadow-md ease-out",
      "origin-(--trigger-anchor-point)",
      "opacity-100 duration-150 scale will-change-[transform,opacity,scale] entering:opacity-0 exiting:opacity-0 entering:scale-50 exiting:scale-50",
      "translate-0 entering:placement-left:translate-x-2 entering:placement-right:-translate-x-2 entering:placement-top:translate-y-2 entering:placement-bottom:-translate-y-2 exiting:placement-left:translate-x-2 exiting:placement-right:-translate-x-2 exiting:placement-top:translate-y-2 exiting:placement-bottom:-translate-y-2",
    ],
    arrow:
      "fill-bg stroke-border stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180",
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
