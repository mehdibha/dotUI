"use client";

import React from "react";
import { getColorChannels } from "react-aria-components";
import type { ColorSpace } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { ColorPicker } from "@dotui/registry/ui/color-picker";
import {
  ColorSlider,
  ColorSliderControl,
} from "@dotui/registry/ui/color-slider";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Popover } from "@dotui/registry/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

export default function Demo() {
  const [space, setSpace] = React.useState<ColorSpace>("rgb");
  return (
    <ColorPicker defaultValue="#5100FF">
      <Button>
        <ColorSwatch />
      </Button>
      <Popover>
        <DialogContent>
          <Select
            aria-label="Color format"
            defaultValue={space}
            onChange={(key) => setSpace(key as ColorSpace)}
          >
            <SelectTrigger size="sm" />
            <SelectContent>
              <SelectItem id="rgb">RGB</SelectItem>
              <SelectItem id="hsl">HSL</SelectItem>
              <SelectItem id="hsb">HSB</SelectItem>
            </SelectContent>
          </Select>
          {getColorChannels(space).map((channel) => (
            <ColorSlider key={channel} colorSpace={space} channel={channel}>
              <Label>{channel}</Label>
              <ColorSliderControl />
            </ColorSlider>
          ))}
          <ColorSlider channel="alpha">
            <Label>Alpha</Label>
            <ColorSliderControl />
          </ColorSlider>
        </DialogContent>
      </Popover>
    </ColorPicker>
  );
}
