"use client";

import { Text as AriaText, type TextProps as AriaTextProps } from "react-aria-components";
import { type VariantProps, tv } from "tailwind-variants";

const textStyles = tv({
  variants: {
    slot: {
      label: "text-sm font-bold",
      description: "text-sm text-fg-muted",
    },
  },
});

interface TextProps extends Omit<AriaTextProps, "slot">, VariantProps<typeof textStyles> {}
const Text = ({ slot, className, ...props }: TextProps) => {
  return <AriaText slot={slot} className={textStyles({ slot, className })} {...props} />;
};

export type { textStyles };
export { Text };
