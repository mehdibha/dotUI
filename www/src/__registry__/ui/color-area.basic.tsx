"use client";

import { ColorThumb } from "@/registry/ui/color-thumb.basic";
import {
  ColorArea as AriaColorArea,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorAreaStyles = tv({
  base: "block size-48 min-w-20 rounded-md disabled:[background:var(--color-bg-disabled)]!",
});

type ColorAreaProps = Omit<ColorAreaRootProps, "children">;
const ColorArea = (props: ColorAreaProps) => {
  return (
    <ColorAreaRoot {...props}>
      <ColorThumb />
    </ColorAreaRoot>
  );
};

interface ColorAreaRootProps
  extends React.ComponentProps<typeof AriaColorArea> {}
const ColorAreaRoot = ({ className, ...props }: ColorAreaRootProps) => {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        colorAreaStyles({ className }),
      )}
      {...props}
    />
  );
};

export type { ColorAreaProps, ColorAreaRootProps };
export { ColorArea, ColorAreaRoot };
