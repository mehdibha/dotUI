"use client";

import {
  ColorArea as AriaColorArea,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { ColorThumb } from "@dotui/registry/ui/color-thumb";

const colorAreaStyles = tv({
  base: "block size-48 min-w-20 rounded-md disabled:[background:var(--color-disabled)]!",
});

/* -----------------------------------------------------------------------------------------------*/

type ColorAreaProps = React.ComponentProps<typeof AriaColorArea>;

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        colorAreaStyles({ className }),
      )}
      {...props}
    >
      {props.children || <ColorThumb />}
    </AriaColorArea>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorArea };

export type { ColorAreaProps };
