"use client";

import { ColorThumb as AriaColorThumb } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

import { focusRing } from "@dotui/ui/lib/focus-styles";

const colorThumbStyles = tv({
  extend: focusRing,
  base: [
    "disabled:border-border-disabled disabled:bg-bg-disabled! z-30 size-6 rounded-full border-2 border-white ring-1 ring-black/40",
    "group-orientation-horizontal/color-slider:top-1/2 group-orientation-vertical/color-slider:left-1/2",
  ],
});

interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
  className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
  return (
    <AriaColorThumb className={colorThumbStyles({ className })} {...props} />
  );
};

export type { ColorThumbProps };
export { ColorThumb };
