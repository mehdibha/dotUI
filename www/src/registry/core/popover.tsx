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
    overlay:
      "group/popover bg-bg text-fg data-[trigger=ComboBox]:min-w-(--trigger-width) data-[trigger=Select]:min-w-(--trigger-width) entering:animate-in entering:fade-in entering:ease-out entering:placement-bottom:slide-in-from-top-0.5 entering:placement-top:slide-in-from-bottom-0.5 entering:placement-left:slide-in-from-right-0.5 entering:placement-right:slide-in-from-left-0.5 exiting:animate-out exiting:fade-out exiting:ease-in exiting:placement-bottom:slide-out-to-top-0.5 exiting:placement-top:slide-out-to-bottom-0.5 exiting:placement-left:slide-out-to-right-0.5 exiting:placement-right:slide-out-to-left-0.5 z-50 rounded-md border px-3 py-1.5 text-sm shadow-md",
    arrow:
      "stroke-border fill-bg group-placement-left/popover:-rotate-90 group-placement-right/popover:rotate-90 group-placement-bottom/popover:rotate-180 stroke-1",
  },
});

const { overlay, arrow } = popoverStyles();

interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  arrow?: boolean;
}
function Popover({ className, arrow, ...props }: PopoverProps) {
  return (
    <AriaPopover
      className={composeRenderProps(className, (className) =>
        overlay({ className })
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {arrow && <PopoverArrow />}
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
        width={8}
        height={8}
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
