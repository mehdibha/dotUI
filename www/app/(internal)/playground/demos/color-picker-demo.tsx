"use client";

import { ColorPicker } from "@dotui/registry-v2/ui/color-picker";

export function ColorPickerDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker />

      <ColorPicker.Root>
        <ColorPicker.Trigger>
          {(color) => (
            <span className="flex items-center gap-2">
              color:{" "}
              <span
                className="rounded-md p-1"
                style={{ background: color.toString("hsl") }}
              >
                {color.toString("hsl")}
              </span>
            </span>
          )}
        </ColorPicker.Trigger>
        <ColorPicker.Overlay>
          <ColorPicker.Content>
            <ColorPicker.Editor />
          </ColorPicker.Content>
        </ColorPicker.Overlay>
      </ColorPicker.Root>

      <ColorPicker showAlphaChannel>Alpha channel</ColorPicker>

      <ColorPicker
        showAlphaChannel
        showFormatSelector={false}
        colorFormat="rgb"
      >
        Hide format selector
      </ColorPicker>
    </div>
  );
}
