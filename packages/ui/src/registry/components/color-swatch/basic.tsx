"use client";

import {
  ColorSwatch as AriaColorSwatch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorSwatchStyles = tv({
  base: "relative size-5 rounded-sm border",
});

interface ColorSwatchProps
  extends React.ComponentProps<typeof AriaColorSwatch> {}
const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        colorSwatchStyles({ className }),
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

export type { ColorSwatchProps };
export { ColorSwatch };
