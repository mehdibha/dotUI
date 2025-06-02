"use client";

import { ButtonContext as AriaButtonContext } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { ButtonProvider, buttonStyles } from "@/registry/ui/button.basic";

const buttonGroupStyles = tv({
  base: "isolate inline-flex items-center [&_button]:rounded-none [&_button]:first:rounded-s-md [&_button]:last:rounded-e-md",
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
