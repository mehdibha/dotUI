"use client";

import { ColorPicker } from "@dotui/registry-v2/ui/color-picker";

export function ColorPickerDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker defaultValue="#ff0000" />

      <ColorPicker defaultValue="#00ff00">Pick a color</ColorPicker>

      <ColorPicker defaultValue="#0000ff" showAlphaChannel />

      <ColorPicker defaultValue="#ff00ff" colorFormat="rgb" />

      <ColorPicker defaultValue="#00ffff" colorFormat="hsl" />

      <ColorPicker defaultValue="#ffff00" showAlphaChannel showFormatSelector />

      <ColorPicker defaultValue="#ff5500" variant="quiet" />
    </div>
  );
}
