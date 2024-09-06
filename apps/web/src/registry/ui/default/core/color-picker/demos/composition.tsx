import { Button } from "@/registry/ui/default/core/button";
import {
  ColorEditor,
  ColorPickerRoot,
} from "@/registry/ui/default/core/color-picker";
import { ColorSwatch } from "@/registry/ui/default/core/color-swatch";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";

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
