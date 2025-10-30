"use client";

import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { ToggleButtonProvider } from "@dotui/registry/ui/toggle-button";
import type { toggleButtonStyles } from "@dotui/registry/ui/toggle-button";

const toggleGroupStyles = tv({
  slots: {
    root: "flex w-fit items-center",
    item: [
      "min-w-0 shrink-0 rounded-none shadow-none hover:z-10 focus:z-10 focus-visible:z-12 selected:z-11 selected:focus-visible:z-12",
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-row has-data-[variant=default]:-space-x-px",
        item: "first:rounded-l-md last:rounded-r-md",
      },
      vertical: {
        root: "flex-col has-data-[variant=default]:-space-y-px",
        item: "first:rounded-t-md last:rounded-b-md",
      },
    },
  },
});

const { root, item } = toggleGroupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ToggleButtonGroupProps
  extends React.ComponentProps<typeof AriaToggleButtonGroup>,
    VariantProps<typeof toggleButtonStyles> {}

const ToggleButtonGroup = ({
  variant,
  size,
  orientation = "horizontal",
  className,
  ...props
}: ToggleButtonGroupProps) => {
  return (
    <ToggleButtonProvider
      variant={variant}
      size={size}
      className={item({ orientation })}
    >
      <AriaToggleButtonGroup
        orientation={orientation}
        className={composeRenderProps(className, (className) =>
          root({
            orientation,
            className,
          }),
        )}
        {...props}
      />
    </ToggleButtonProvider>
  );
};

export type { ToggleButtonGroupProps };
export { ToggleButtonGroup };
