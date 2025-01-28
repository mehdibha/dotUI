"use client";

import React from "react";
import {
  getColorChannels,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
  type ColorSpace,
  composeRenderProps,
  ColorPickerStateContext,
  Color,
  ColorFormat,
} from "react-aria-components";
import { Button, type ButtonProps } from "@/registry/core/button-01";
import { ColorArea } from "@/registry/core/color-area";
import { ColorField } from "@/registry/core/color-field";
import { ColorSlider } from "@/registry/core/color-slider";
import { ColorSwatch } from "@/registry/core/color-swatch";
import {
  Dialog,
  DialogRoot,
  DialogRootProps,
} from "@/registry/core/dialog_basic";
import { Item } from "@/registry/core/list-box";
import { Select } from "@/registry/core/select";
import { cn } from "@/registry/lib/cn";

interface ColorPickerProps extends ColorPickerButtonProps {}
const ColorPicker = ({ ...props }: ColorPickerProps) => {
  return (
    <ColorPickerRoot>
      <DialogRoot>
        <ColorPickerButton {...props} />
        <Dialog type="popover" mobileType="drawer">
          <ColorPickerEditor />
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
};

interface ColorPickerRootProps
  extends React.ComponentProps<typeof AriaColorPicker> {}
const ColorPickerRoot = (props: ColorPickerRootProps) => {
  return <AriaColorPicker {...props} />;
};

interface ColorPickerButtonProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode | ((color: Color) => React.ReactNode);
  format?: ColorFormat | "css";
  showValue?: boolean;
}
const ColorPickerButton = ({
  children,
  format = "hex",
  showValue = true,
  ...props
}: ColorPickerButtonProps) => {
  const state = React.use(ColorPickerStateContext)!;
  return (
    <Button {...props}>
      {(typeof children === "function" ? children(state.color) : children) || (
        <>
          <ColorSwatch />
          {showValue && (
            <span className="w-14 truncate text-left">
              {state.color.toString(format)}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

type PickerColorFormat = "hex" | "rgb" | "hsl" | "hsb";
interface ColorPickerEditorProps extends React.ComponentProps<"div"> {
  showAlphaChannel?: boolean;
  colorFormat?: PickerColorFormat;
}
const ColorPickerEditor = ({
  showAlphaChannel = false,
  colorFormat: ColorFormatProp = "hex",
  className,
  ...props
}: ColorPickerEditorProps) => {
  const [colorFormat, setColorFormat] =
    React.useState<PickerColorFormat>(ColorFormatProp);
  return (
    <div className={cn("mx-auto flex flex-col gap-2", className)} {...props}>
      <div className="flex gap-2">
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        />
        <ColorSlider orientation="vertical" colorSpace="hsb" channel="hue" />
        {showAlphaChannel && (
          <ColorSlider
            orientation="vertical"
            colorSpace="hsb"
            channel="alpha"
          />
        )}
      </div>
      <Select
        aria-label="Color format"
        selectedKey={colorFormat}
        onSelectionChange={(key) => setColorFormat(key as PickerColorFormat)}
        size="sm"
        className="w-auto"
      >
        <Item id="hex">Hex</Item>
        <Item id="rgb">RGB</Item>
        <Item id="hsl">HSL</Item>
        <Item id="hsb">HSB</Item>
      </Select>
      <div className="flex items-center gap-2">
        {colorFormat === "hex" ? (
          <ColorField aria-label="Hex" className="w-auto flex-1" size="sm" />
        ) : (
          getColorChannels(colorFormat).map((channel) => (
            <ColorField
              key={channel}
              colorSpace={colorFormat}
              channel={channel}
              className="w-10 flex-1"
              size="sm"
            />
          ))
        )}
      </div>
    </div>
  );
};

export type {
  ColorPickerProps,
  ColorPickerRootProps,
  ColorPickerButtonProps,
  ColorPickerEditorProps,
};
export { ColorPicker, ColorPickerRoot, ColorPickerButton, ColorPickerEditor };
