import { Button } from "@/components/dynamic-core/button";
import {
  ColorEditor,
  ColorPickerRoot,
} from "@/components/dynamic-core/color-picker";
import { ColorSwatch } from "@/components/dynamic-core/color-swatch";
import { Dialog, DialogRoot } from "@/components/dynamic-core/dialog";

export default function Demo() {
  return (
    <ColorPickerRoot defaultValue="#5100FF">
      <DialogRoot>
        <Button shape="square">
          <ColorSwatch />
        </Button>
        <Dialog type="popover" mobileType="drawer">
          <ColorEditor />
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
}
