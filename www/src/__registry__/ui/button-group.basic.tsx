"use client";

import type { buttonStyles } from "@/registry/ui/button.basic";
import type { VariantProps } from "tailwind-variants";
import { ButtonProvider } from "@/registry/ui/button.basic";
import { ButtonContext as AriaButtonContext } from "react-aria-components";
import { tv } from "tailwind-variants";

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
