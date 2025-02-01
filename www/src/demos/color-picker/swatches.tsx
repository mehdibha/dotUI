import { Button } from "@/components/dynamic-core/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@/components/dynamic-core/color-picker";
import { ColorSwatch } from "@/components/dynamic-core/color-swatch";
import { Dialog, DialogRoot } from "@/components/dynamic-core/dialog";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/core/color-swatch-picker_basic";

export default function Demo() {
  return (
    <ColorPickerRoot defaultValue="#5100FF">
      <DialogRoot>
        <Button shape="square">
          <ColorSwatch />
        </Button>
        <Dialog type="popover" mobileType="drawer">
          <ColorPickerEditor />
          <ColorSwatchPicker className="mt-2 justify-between">
            <ColorSwatchPickerItem color="#A00" />
            <ColorSwatchPickerItem color="#f80" />
            <ColorSwatchPickerItem color="#080" />
            <ColorSwatchPickerItem color="#08f" />
            <ColorSwatchPickerItem color="#008" />
            <ColorSwatchPickerItem color="#fff" />
          </ColorSwatchPicker>
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
}
