import { ColorEditor } from "@dotui/registry/ui/color-editor";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
} from "@dotui/registry/ui/color-picker";

export default function Demo() {
  return (
    <ColorPicker defaultValue="#5100FF">
      <ColorPickerTrigger />
      <ColorPickerContent>
        <ColorEditor />
      </ColorPickerContent>
    </ColorPicker>
  );
}
