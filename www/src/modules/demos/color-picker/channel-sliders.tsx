"use client";

import React from "react";
import { getColorChannels, type ColorSpace } from "react-aria-components";
import {
  ColorPickerRoot,
  ColorPickerButton,
} from "@/components/dynamic-ui/color-picker";
import { ColorSlider } from "@/components/dynamic-ui/color-slider";
import { Dialog, DialogRoot } from "@/components/dynamic-ui/dialog";
import { Select, SelectItem } from "@/components/dynamic-ui/select";

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
