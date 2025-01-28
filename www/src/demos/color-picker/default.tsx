import {
  ColorPicker,
  ColorPickerRoot,
  ColorPickerButton,
  ColorPickerEditor,
} from "@/registry/core/color-picker_new";
import { Dialog, DialogRoot } from "@/registry/core/dialog_basic";

export default function Demo() {
  return (
    <div className="flex gap-10">
      <ColorPicker />
      {/* <div className="bg-bg-muted w-120 isolate flex rounded-sm border p-2">
        <ColorPickerRoot defaultValue="#292222">
          <ColorPickerEditor showAlphaChannel />
        </ColorPickerRoot>
      </div> */}
    </div>
  );
}
