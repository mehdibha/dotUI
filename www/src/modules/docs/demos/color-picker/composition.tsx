import { Button } from "@dotui/ui/components/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";

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
