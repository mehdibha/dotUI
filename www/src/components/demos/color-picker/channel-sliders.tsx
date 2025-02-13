"use client";

import React from "react";
import { getColorChannels, type ColorSpace } from "react-aria-components";
import {
  ColorPickerRoot,
  ColorPickerButton,
} from "@/components/dynamic-core/color-picker";
import { Dialog, DialogRoot } from "@/components/dynamic-core/dialog";
import { ColorSlider } from "@/registry/core/color-slider_basic";
import { Select, SelectItem } from "@/registry/core/select_basic";

export default function Demo() {
  const [space, setSpace] = React.useState<ColorSpace>("rgb");
  return (
    <ColorPickerRoot defaultValue="#5100FF">
      <DialogRoot>
        <ColorPickerButton />
        <Dialog type="popover" mobileType="drawer" className="space-y-2">
          <Select
            aria-label="Color format"
            selectedKey={space}
            onSelectionChange={(key) => setSpace(key as ColorSpace)}
            size="sm"
          >
            <SelectItem id="rgb">RGB</SelectItem>
            <SelectItem id="hsl">HSL</SelectItem>
            <SelectItem id="hsb">HSB</SelectItem>
          </Select>
          {getColorChannels(space).map((channel) => (
            <ColorSlider
              key={channel}
              colorSpace={space}
              channel={channel}
              label={channel}
            />
          ))}
          <ColorSlider channel="alpha" label="alpha" />
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
}
