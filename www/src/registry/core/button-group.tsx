"use client";

import { ButtonContext as AriaButtonContext } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { ButtonProvider } from "@/components/dynamic-core/button";
import { buttonStyles } from "@/registry/core/button-01";

const buttonGroupStyles = tv({
  base: "inline-flex isolate items-center [&_button]:first:rounded-s-md [&_button]:last:rounded-e-md [&_button]:rounded-none",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
});

interface ButtonGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof buttonGroupStyles>,
    VariantProps<typeof buttonStyles> {
  isDisabled?: boolean;
}

function ButtonGroup({
  variant,
  size,
  shape,
  isDisabled,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <AriaButtonContext value={{ isDisabled }}>
      <ButtonProvider variant={variant} size={size} shape={shape}>
        <div className={buttonGroupStyles({ className })} {...props} />
      </ButtonProvider>
    </AriaButtonContext>
  );
}

export type { ButtonGroupProps };
export { ButtonGroup };
