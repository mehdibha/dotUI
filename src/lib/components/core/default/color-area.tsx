"use client";

import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ColorThumb } from "./color-thumb";

const colorAreaStyles = tv({
  base: "size-48 rounded-md shrink-0",
});

type ColorAreaProps = Omit<ColorAreaRootProps, "children">;
const ColorArea = (props: ColorAreaProps) => {
  return (
    <ColorAreaRoot {...props}>
      <ColorThumb />
    </ColorAreaRoot>
  );
};

interface ColorAreaRootProps extends Omit<AriaColorAreaProps, "className"> {
  className?: string;
}
const ColorAreaRoot = ({ className, ...props }: ColorAreaRootProps) => {
  return <AriaColorArea className={colorAreaStyles({ className })} {...props} />;
};

export { ColorArea, ColorAreaRoot };
