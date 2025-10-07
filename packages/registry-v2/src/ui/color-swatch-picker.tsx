"use client";

import React from "react";
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
} from "react-aria-components";

import { focusRing } from "@dotui/registry-v2/lib/focus-styles";
import { cn } from "@dotui/registry-v2/lib/utils";
import { ColorSwatch } from "@dotui/registry-v2/ui/color-swatch";

interface ColorSwatchPickerProps
  extends React.ComponentProps<typeof AriaColorSwatchPicker> {}
const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
  return (
    <AriaColorSwatchPicker className={cn("flex gap-1", className)} {...props} />
  );
};

interface ColorSwatchPickerItemProps
  extends React.ComponentProps<typeof AriaColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({
  className,
  ...props
}: ColorSwatchPickerItemProps) => {
  return (
    <AriaColorSwatchPickerItem
      className={cn(
        focusRing(),
        "relative size-8 cursor-pointer rounded-md transition-shadow focus:z-10 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {({ isSelected, isDisabled }) => (
        <>
          <ColorSwatch className={cn("size-full rounded-[inherit]")} />
          {isSelected && (
            <div className="absolute inset-0 z-1 rounded-[inherit] border-2 border-bg outline-2 outline-inverse" />
          )}
          {isDisabled && (
            <div className="absolute inset-0 z-1 rounded-[inherit] bg-bg/90" />
          )}
        </>
      )}
    </AriaColorSwatchPickerItem>
  );
};

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
export { ColorSwatchPicker, ColorSwatchPickerItem };
