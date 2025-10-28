"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { ColorEditor } from "@dotui/registry-v2/ui/color-editor";
import { ColorPicker } from "@dotui/registry-v2/ui/color-picker";
import { ColorSwatch } from "@dotui/registry-v2/ui/color-swatch";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@dotui/registry-v2/ui/color-swatch-picker";
import { DialogContent } from "@dotui/registry-v2/ui/dialog";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import { Popover } from "@dotui/registry-v2/ui/popover";

export function ColorPickerDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker>
        <Button>Pick a color</Button>
        <Overlay type="popover">
          <DialogContent>
            <ColorEditor />
          </DialogContent>
        </Overlay>
      </ColorPicker>

      <ColorPicker>
        <Button>
          <ColorSwatch />
        </Button>
        <Overlay type="popover">
          <DialogContent>
            <ColorEditor />
            <ColorSwatchPicker>
              <ColorSwatchPickerItem color="#A00" />
              <ColorSwatchPickerItem color="#f80" />
              <ColorSwatchPickerItem color="#080" />
              <ColorSwatchPickerItem color="#08f" />
              <ColorSwatchPickerItem color="#088" />
              <ColorSwatchPickerItem color="#008" />
            </ColorSwatchPicker>
          </DialogContent>
        </Overlay>
      </ColorPicker>

      <ColorPicker>
        {({ color }) => (
          <>
            <Button aspect="default">
              <ColorSwatch />
              {color.toString("hsl")}
            </Button>
            <Popover placement="bottom left">
              <DialogContent>
                <ColorEditor />
                <ColorSwatchPicker>
                  <ColorSwatchPickerItem color="#A00" />
                  <ColorSwatchPickerItem color="#f80" />
                  <ColorSwatchPickerItem color="#080" />
                  <ColorSwatchPickerItem color="#08f" />
                  <ColorSwatchPickerItem color="#088" />
                  <ColorSwatchPickerItem color="#008" />
                </ColorSwatchPicker>
              </DialogContent>
            </Popover>
          </>
        )}
      </ColorPicker>
    </div>
  );
}
