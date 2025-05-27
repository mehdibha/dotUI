import { Button } from "@/components/dynamic-ui/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@/components/dynamic-ui/color-picker";
import { ColorSwatch } from "@/components/dynamic-ui/color-swatch";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/dynamic-ui/color-swatch-picker";
import { Dialog, DialogRoot } from "@/components/dynamic-ui/dialog";

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
