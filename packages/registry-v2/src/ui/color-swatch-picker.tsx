"use client";

import type React from "react";
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { ColorSwatch } from "@dotui/registry-v2/ui/color-swatch";

const colorSwatchPickerStyles = tv({
  slots: {
    root: "flex flex-wrap gap-1",
    item: [
      "relative size-8 rounded-md transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]",
      // focus state
      "focus-reset focus-visible:focus-ring",
      // disabled state
      "disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!",
      // selected state
      "before:absolute before:inset-0 before:scale-90 before:rounded-[inherit] before:bg-bg before:opacity-0 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-[''] selected:before:scale-100 selected:before:opacity-100",
    ],
  },
});

const { root, item } = colorSwatchPickerStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ColorSwatchPickerProps
  extends React.ComponentProps<typeof AriaColorSwatchPicker> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSwatchPickerItemProps
  extends React.ComponentProps<typeof AriaColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({
  className,
  style,
  ...props
}: ColorSwatchPickerItemProps) => {
  return (
    <AriaColorSwatchPickerItem
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
    </AriaColorSwatchPickerItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
  Item: ColorSwatchPickerItem,
});

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
export {
  CompoundColorSwatchPicker as ColorSwatchPicker,
  ColorSwatchPickerItem,
};
