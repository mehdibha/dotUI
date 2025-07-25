"use client";

import type { TextProps as AriaTextProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { Text as AriaText } from "react-aria-components";
import { tv } from "tailwind-variants";

const textStyles = tv({
  base: "text-sm",
  variants: {
    slot: {
      label: "font-bold",
      description: "text-fg-muted",
      errorMessage: "text-fg-danger",
    },
  },
});

interface TextProps
  extends Omit<AriaTextProps, "slot">,
    VariantProps<typeof textStyles> {}
const Text = ({ slot, className, ...props }: TextProps) => {
  return (
    <AriaText
      slot={slot}
      className={textStyles({ slot, className })}
      {...props}
    />
  );
};

export type { textStyles };
export { Text };
