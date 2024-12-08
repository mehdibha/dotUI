"use client";

import {
  ColorArea as AriaColorArea,
  composeRenderProps,
  type ColorAreaProps as AriaColorAreaProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ColorThumb } from "@/registry/core/color-thumb-01";

const colorAreaStyles = tv({
  base: "disabled:bg-bg-disabled! inline-block size-48 min-w-20 rounded-md",
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
  return (
    <AriaColorArea
      {...props}
      className={colorAreaStyles({ className })}
      style={composeRenderProps(props.style, (style, { isDisabled }) => ({
        ...style,
        ...(isDisabled ? { background: "none" } : {}),
      }))}
    />
  );
};

export { ColorArea, ColorAreaRoot };
