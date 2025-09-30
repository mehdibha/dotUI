"use client";

import React from "react";
import { getColorChannels } from "react-aria-components";
import type { ColorSpace } from "react-aria-components";

import {
  ColorPickerButton,
  ColorPickerRoot,
} from "@dotui/registry/ui/color-picker";
import { ColorSlider } from "@dotui/registry/ui/color-slider";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import { Select, SelectItem } from "@dotui/registry/ui/select";

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
