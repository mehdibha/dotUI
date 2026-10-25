"use client";

import type * as React from "react";
import * as ColorSwatchPickerPrimitives from "react-aria-components/ColorSwatchPicker";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { ColorSwatch } from "@/components/ui/color-swatch";
import { tv } from "tailwind-variants";

const colorSwatchPickerVariants = tv({
  slots: {
    root: "flex flex-wrap gap-2",
    item: "relative rounded-xs transition-shadow focus:z-10 outline-none focus-visible:focus-ring disabled:cursor-disabled disabled:*:data-color-swatch:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]! before:absolute before:inset-0 before:scale-90 before:rounded-[inherit] before:bg-(--surface-bg,var(--color-bg)) before:opacity-0 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:content-[''] selected:before:scale-100 selected:before:opacity-100 size-12",
  },
});

const { root, item } = colorSwatchPickerVariants();

interface ColorSwatchPickerProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPicker
> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
  return (
    <ColorSwatchPickerPrimitives.ColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ColorSwatchPickerItemProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPickerItem
> {}
const ColorSwatchPickerItem = ({
  className,
  style,
  ...props
}: ColorSwatchPickerItemProps) => {
  return (
    <ColorSwatchPickerPrimitives.ColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      style={composeRenderProps(
        style,
        (style, { color }) =>
          ({
            "--color": color.toString(),
            ...style,
          }) as React.CSSProperties,
      )}
      {...props}
    >
      <ColorSwatch className="size-full rounded-[inherit]" />
    </ColorSwatchPickerPrimitives.ColorSwatchPickerItem>
  );
};

/* -------------------------------------------------------------------------- */

export type { ColorSwatchPickerItemProps, ColorSwatchPickerProps };
export { ColorSwatchPicker, ColorSwatchPickerItem };
