"use client";

import React from "react";
import {
  composeRenderProps,
  Dialog as AriaDialog,
  ColorPicker as AriaColorPicker,
  DialogTrigger as AriaDialogTrigger,
  type ColorPickerProps as AriaColorPickerProps,
  type ColorSpace,
  getColorChannels,
} from "react-aria-components";
import { Button, type ButtonProps } from "./button";
import { ColorArea } from "./color-area";
import { ColorField } from "./color-field";
import { ColorSlider } from "./color-slider";
import { ColorSwatch } from "./color-swatch";
import { Overlay } from "./overlay";
import { Select, SelectItem } from "./select";

type ColorPickerProps = AriaColorPickerProps & Omit<ButtonProps, "children"> & { label?: string };
export const ColorPicker = ({ label, shape, ...props }: ColorPickerProps) => {
  const [space, setSpace] = React.useState<ColorSpace>("rgb");
  return (
    <AriaColorPicker {...props}>
      {composeRenderProps(props.children, (children) => (
        <>
          <AriaDialogTrigger>
            <Button shape={shape ?? label ? "rectangle" : "square"} {...props}>
              <ColorSwatch />
              {label && <span className="ml-2">{label}</span>}
            </Button>
            <Overlay type="popover" className="">
              <AriaDialog className="space-y-2 p-2 outline-none">
                {children ?? (
                  <>
                    <div className="flex gap-2">
                      <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
                      <ColorSlider
                        orientation="vertical"
                        colorSpace="hsb"
                        channel="hue"
                        className="items-center"
                        showValueLabel={false}
                      />
                      <ColorSlider
                        orientation="vertical"
                        colorSpace="hsb"
                        channel="alpha"
                        showValueLabel={false}
                      />
                    </div>
                    <div className="flex w-[250px] items-end gap-1">
                      <Select
                        selectedKey={space}
                        onSelectionChange={(s) => setSpace(s as ColorSpace)}
                      >
                        <SelectItem id="rgb">RGB</SelectItem>
                        <SelectItem id="hsl">HSL</SelectItem>
                        <SelectItem id="hsb">HSB</SelectItem>
                      </Select>
                      {getColorChannels(space).map((channel) => (
                        <ColorField
                          key={channel}
                          colorSpace={space}
                          channel={channel}
                          style={{ flex: 1 }}
                          size="sm"
                        />
                      ))}
                    </div>
                  </>
                )}
              </AriaDialog>
            </Overlay>
          </AriaDialogTrigger>
        </>
      ))}
    </AriaColorPicker>
  );
};
