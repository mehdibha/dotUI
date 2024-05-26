"use client";

import {
  Dialog as AriaDialog,
  ColorPicker as AriaColorPicker,
  DialogTrigger as AriaDialogTrigger,
  ColorSwatch as AriaColorSwatch,
  ColorSlider as AriaColorSlider,
  type ColorPickerProps as AriaColorPickerProps,
  Input,
} from "react-aria-components";
import { Button } from "./button";
import { ColorArea } from "./color-area";
import { ColorField } from "./color-field";
import { Overlay } from "./overlay";

type ColorPickerProps = AriaColorPickerProps;
export const ColorPicker = (props: ColorPickerProps) => {
  return (
    <AriaColorPicker {...props}>
      <AriaDialogTrigger>
        <Button>
          <AriaColorSwatch />
          <span>color</span>
        </Button>
        <Overlay type="popover">
          <AriaDialog className="color-picker-dialog">
            <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
            <AriaColorSlider colorSpace="hsb" channel="hue" />
            <ColorField>
              <Input />
            </ColorField>
          </AriaDialog>
        </Overlay>
      </AriaDialogTrigger>
    </AriaColorPicker>
  );
};
