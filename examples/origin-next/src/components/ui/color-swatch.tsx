"use client";

import type * as React from "react";
import * as ColorSwatchPrimitives from "react-aria-components/ColorSwatch";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

const colorSwatchVariants = tv({
  base: "relative size-5 shrink-0 rounded-sm border",
});

interface ColorSwatchProps extends React.ComponentProps<
  typeof ColorSwatchPrimitives.ColorSwatch
> {}

const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
  return (
    <ColorSwatchPrimitives.ColorSwatch
      data-color-swatch=""
      className={composeRenderProps(className, (className) =>
        colorSwatchVariants({ className }),
      )}
      style={composeRenderProps(style, (style, { color }) => ({
        ...style,
        background: `linear-gradient(${color}, ${color}),
      repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      }))}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { ColorSwatchProps };
export { ColorSwatch };
