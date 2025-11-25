"use client";

import { ColorEditor } from "@dotui/registry/ui/color-editor";

import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "../index";

export function ColorPickerPlayground() {
  return (
    <ColorPicker defaultValue="#ff0000">
      <ColorPickerTrigger />
      <ColorPickerContent>
        <ColorEditor />
      </ColorPickerContent>
    </ColorPicker>
  );
}

export const colorPickerControls = [];
