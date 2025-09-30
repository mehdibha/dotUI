import { Button } from "@dotui/registry/ui/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";

export default function Demo() {
  return (
    <ColorPickerRoot defaultValue="#5100FF">
      <DialogRoot>
        <Button shape="square">
          <ColorSwatch />
        </Button>
        <Dialog type="popover" mobileType="drawer">
          <ColorPickerEditor />
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
}
