"use client";

import {
  Dialog as AriaDialog,
  ColorPicker as AriaColorPicker,
  DialogTrigger as AriaDialogTrigger,
  ColorSwatch as AriaColorSwatch,
  ColorSlider as AriaColorSlider,
  SliderTrack as AriaSliderTrack,
  ColorThumb as AriaColorThumb,
  type ColorPickerProps as AriaColorPickerProps,
  Input,
} from "react-aria-components";
import { Button } from "./button";
import { ColorArea } from "./color-area";
import { ColorField } from "./color-field";
import { Overlay } from "./overlay";

type ColorPickerProps = Omit<AriaColorPickerProps, "children"> & {
  children?: React.ReactNode;
};
export const ColorPicker = (props: ColorPickerProps) => {
  return (
    <AriaColorPicker {...props}>
      <AriaDialogTrigger>
        <Button variant="ghost" shape="square">
          <AriaColorSwatch className="size-5 rounded-sm border" />
        </Button>
        <Overlay type="popover">
          <AriaDialog className="space-y-2">
            {props.children ?? (
              <>
                <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
                <AriaColorSlider colorSpace="hsb" channel="hue">
                  <AriaSliderTrack className="h-7 rounded-md">
                    <AriaColorThumb className="size-6 rounded-full border-2 border-white ring-1 ring-black/40 top-1/2" />
                  </AriaSliderTrack>
                </AriaColorSlider>
                <ColorField>
                  <Input />
                </ColorField>
              </>
            )}
          </AriaDialog>
        </Overlay>
      </AriaDialogTrigger>
    </AriaColorPicker>
  );
};
