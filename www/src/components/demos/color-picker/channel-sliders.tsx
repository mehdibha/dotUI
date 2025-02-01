"use client";

import React from "react";
import { getColorChannels, type ColorSpace } from "react-aria-components";
import {
  ColorPickerRoot,
  ColorPickerButton,
} from "@/components/dynamic-core/color-picker";
import { Dialog, DialogRoot } from "@/components/dynamic-core/dialog";
import { ColorSlider } from "@/registry/core/color-slider_basic";
import { Item } from "@/registry/core/list-box_basic";
import { Select } from "@/registry/core/select_basic";

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
            <Item id="rgb">RGB</Item>
            <Item id="hsl">HSL</Item>
            <Item id="hsb">HSB</Item>
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
