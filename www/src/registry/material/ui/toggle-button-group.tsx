"use client";

import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import {
  ToggleButtonProvider,
  toggleButtonStyles,
} from "@/registry/material/ui/toggle-button_basic";

const toggleGroupStyles = tv({
  base: "isolate inline-flex items-center [&_button]:rounded-none [&_button]:first:rounded-s-md [&_button]:last:rounded-e-md",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
});

interface ToggleButtonGroupProps
  extends React.ComponentProps<typeof AriaToggleButtonGroup>,
    VariantProps<typeof toggleButtonStyles> {}

const ToggleButtonGroup = ({
  variant,
  size,
  shape,
  orientation = "horizontal",
  className,
  ...props
}: ToggleButtonGroupProps) => {
  return (
    <ToggleButtonProvider variant={variant} size={size} shape={shape}>
      <AriaToggleButtonGroup
        orientation={orientation}
        className={composeRenderProps(className, (className, renderProps) =>
          toggleGroupStyles({
            ...renderProps,
            orientation,
            className,
          })
        )}
        {...props}
      />
    </ToggleButtonProvider>
  );
};

export type { ToggleButtonGroupProps };
export { ToggleButtonGroup };
