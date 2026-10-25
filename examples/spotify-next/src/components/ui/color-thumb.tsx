"use client";

import * as ColorThumbPrimitives from "react-aria-components/ColorThumb";
import { tv } from "tailwind-variants";

const colorThumbVariants = tv({
  base: "outline-none focus-visible:focus-ring z-30 size-6 rounded-full border-2 border-thumb ring-1 ring-scrim disabled:border-border disabled:bg-disabled!",
});

interface ColorThumbProps extends Omit<
  ColorThumbPrimitives.ColorThumbProps,
  "className"
> {
  className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
  return (
    <ColorThumbPrimitives.ColorThumb
      data-color-thumb=""
      className={colorThumbVariants({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { ColorThumbProps };
export { ColorThumb };
