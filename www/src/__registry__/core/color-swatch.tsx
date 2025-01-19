"use client";

import {
  ColorSwatch as AriaColorSwatch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorSwatchStyles = tv({
  base: "size-5 rounded-sm border",
});

interface ColorSwatchProps
  extends React.ComponentProps<typeof AriaColorSwatch> {}
const ColorSwatch = ({ className, ...props }: ColorSwatchProps) => {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        colorSwatchStyles({ className })
      )}
      {...props}
    />
  );
};

export type { ColorSwatchProps };
export { ColorSwatch };
