"use client";

import type * as React from "react";
import {
  Group as AriaGroup,
  SeparatorContext as AriaSeparatorContext,
  TextContext as AriaTextContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const buttonGroupStyles = tv({
  slots: {
    root: [
      "flex w-fit items-stretch",
      "has-[>[data-slot=button-group]]:gap-2",
      "**:data-[slot=input]:focus:z-10! *:focus-visible:relative *:focus-visible:z-10!",
      "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    ],
    separator: "",
    text: "flex items-center gap-2 rounded-md border bg-muted/50 px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        separator: "",
      },
      vertical: {
        root: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
        separator: "",
      },
    },
  },
});

const { root, separator, text } = buttonGroupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ButtonGroupProps
  extends React.ComponentProps<typeof AriaGroup>,
    VariantProps<typeof buttonGroupStyles> {}

const ButtonGroup = ({
  orientation = "horizontal",
  className,
  ...props
}: ButtonGroupProps) => {
  return (
    <Provider
      values={[
        [
          AriaSeparatorContext,
          {
            orientation:
              orientation === "horizontal" ? "vertical" : "horizontal",
            className: separator({ orientation }),
          },
        ],
        [AriaTextContext, { className: text({ orientation }) }],
      ]}
    >
      <AriaGroup
        data-slot="button-group"
        className={composeRenderProps(className, (className) =>
          root({ className, orientation }),
        )}
        {...props}
      />
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ButtonGroup };

export type { ButtonGroupProps };