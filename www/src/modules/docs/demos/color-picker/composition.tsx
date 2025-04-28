import { Button } from "@/components/dynamic-ui/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@/components/dynamic-ui/color-picker";
import { ColorSwatch } from "@/components/dynamic-ui/color-swatch";
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
        </Dialog>
      </DialogRoot>
    </ColorPickerRoot>
  );
}
