"use client";

import React from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerStateContext,
  getColorChannels,
  composeRenderProps,
  type ColorFormat,
} from "react-aria-components";
import { Button, type ButtonProps } from "@/registry/core/button_basic";
import { ColorArea } from "@/registry/core/color-area_basic";
import { ColorField } from "@/registry/core/color-field_basic";
import { ColorSlider } from "@/registry/core/color-slider_basic";
import { ColorSwatch } from "@/registry/core/color-swatch_basic";
import { Dialog, DialogProps, DialogRoot } from "@/registry/core/dialog_basic";
import { Item } from "@/registry/core/list-box_basic";
import { Select } from "@/registry/core/select_basic";
import { cn } from "@/registry/lib/cn";

interface ColorPickerProps
  extends ColorPickerRootProps,
    Omit<ColorPickerButtonProps, "children" | "value">,
    Pick<
      ColorPickerEditorProps,
      "showAlphaChannel" | "colorFormat" | "showFormatSelector"
    >,
    Pick<DialogProps, "isOpen" | "onOpenChange"> {}
const ColorPicker = ({
  value,
  defaultValue,
  onChange,
  children,
  showAlphaChannel,
  colorFormat,
  showFormatSelector,
  isOpen,
  onOpenChange,
  ...props
}: ColorPickerProps) => {
  return (
    <ColorPickerRoot
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <DialogRoot isOpen={isOpen} onOpenChange={onOpenChange}>
            <ColorPickerButton {...props}>{children}</ColorPickerButton>
            <Dialog type="popover" mobileType="drawer">
              <ColorPickerEditor
                showAlphaChannel={showAlphaChannel}
                colorFormat={colorFormat}
                showFormatSelector={showFormatSelector}
              />
            </Dialog>
          </DialogRoot>
        </>
      ))}
    </ColorPickerRoot>
  );
};

interface ColorPickerRootProps
  extends React.ComponentProps<typeof AriaColorPicker> {}
const ColorPickerRoot = (props: ColorPickerRootProps) => {
  return <AriaColorPicker value="" onChange={() => {}} {...props} />;
};

interface ColorPickerButtonProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode;
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
      {children || (
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
  showFormatSelector?: boolean;
}
const ColorPickerEditor = ({
  showAlphaChannel = false,
  colorFormat: ColorFormatProp = "hex",
  showFormatSelector = true,
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
      <div
        className={cn(
          "flex flex-col gap-2",
          colorFormat === "hex" && "flex-row"
        )}
      >
        {showFormatSelector && (
          <Select
            aria-label="Color format"
            selectedKey={colorFormat}
            onSelectionChange={(key) =>
              setColorFormat(key as PickerColorFormat)
            }
            size="sm"
            className="w-auto"
          >
            <Item id="hex">Hex</Item>
            <Item id="rgb">RGB</Item>
            <Item id="hsl">HSL</Item>
            <Item id="hsb">HSB</Item>
          </Select>
        )}
        <div className="flex flex-1 items-center gap-2">
          {colorFormat === "hex" ? (
            <ColorField aria-label="Hex" className="w-10 flex-1" size="sm" />
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
