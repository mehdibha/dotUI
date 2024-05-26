"use client";

import {
  ColorArea as AriaColorArea,
  ColorThumb as AriaColorThumb,
  type ColorAreaProps as AriaColorAreaProps,
  type ColorThumbProps as AriaColorThumbProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorAreaStyles = tv({
  slots: {
    root: "size-48 rounded-md shrink-0",
    thumb: "size-6 rounded-full border-2 border-white ring-1 ring-black/40",
  },
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
  const { root } = colorAreaStyles();
  return <AriaColorArea className={root({ className })} {...props} />;
};

interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
  className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
  const { thumb } = colorAreaStyles();
  return <AriaColorThumb className={thumb({ className })} {...props} />;
};

export { ColorArea, ColorAreaRoot, ColorThumb };
