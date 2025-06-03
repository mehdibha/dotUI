"use client";

import React from "react";
import { ColorSwatch } from "@/components/dynamic-ui/color-swatch";
import { focusRing } from "@/registry/lib/focus-styles";
import { cn } from "@/registry/lib/utils";
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
} from "react-aria-components";

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
        className
      )}
      {...props}
    >
      {({ isSelected, isDisabled }) => (
        <>
          <ColorSwatch className={cn("size-full rounded-[inherit]")} />
          {isSelected && (
            <div className="border-bg outline-bg-inverse absolute inset-0 z-1 rounded-[inherit] border-2 outline-2" />
          )}
          {isDisabled && (
            <div className="bg-bg/90 absolute inset-0 z-1 rounded-[inherit]" />
          )}
        </>
      )}
    </AriaColorSwatchPickerItem>
  );
};

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
export { ColorSwatchPicker, ColorSwatchPickerItem };
