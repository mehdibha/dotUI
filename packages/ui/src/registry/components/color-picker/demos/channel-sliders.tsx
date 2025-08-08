"use client";

import React from "react";
import { getColorChannels } from "react-aria-components";
import type { ColorSpace } from "react-aria-components";

import {
  ColorPickerButton,
  ColorPickerRoot,
} from "@dotui/ui/components/color-picker";
import { ColorSlider } from "@dotui/ui/components/color-slider";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Select, SelectItem } from "@dotui/ui/components/select";

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
