"use client";

import { ColorEditor } from "@dotui/registry/ui/color-editor";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
} from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@dotui/registry/ui/color-swatch-picker";

export function ColorPickerDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker>
        <ColorPickerTrigger>Pick a color</ColorPickerTrigger>
        <ColorPickerContent>
          <ColorEditor />
        </ColorPickerContent>
      </ColorPicker>

      <ColorPicker>
        <ColorPickerTrigger>
          <ColorSwatch />
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorEditor />
          <ColorSwatchPicker>
            <ColorSwatchPickerItem color="#A00" />
            <ColorSwatchPickerItem color="#f80" />
            <ColorSwatchPickerItem color="#080" />
            <ColorSwatchPickerItem color="#08f" />
            <ColorSwatchPickerItem color="#088" />
            <ColorSwatchPickerItem color="#008" />
          </ColorSwatchPicker>
        </ColorPickerContent>
      </ColorPicker>

      <ColorPicker>
        {({ color }) => (
          <>
            <ColorPickerTrigger>
              <ColorSwatch />
              {color.toString("hsl")}
            </ColorPickerTrigger>
            <ColorPickerContent>
              <ColorEditor />
              <ColorSwatchPicker>
                <ColorSwatchPickerItem color="#A00" />
                <ColorSwatchPickerItem color="#f80" />
                <ColorSwatchPickerItem color="#080" />
                <ColorSwatchPickerItem color="#08f" />
                <ColorSwatchPickerItem color="#088" />
                <ColorSwatchPickerItem color="#008" />
              </ColorSwatchPicker>
            </ColorPickerContent>
          </>
        )}
      </ColorPicker>
    </div>
  );
}
