import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@dotui/registry/ui/color-swatch-picker";

export default function Page() {
  return (
    <ColorSwatchPicker>
      <ColorSwatchPickerItem color="#f00" />
      <ColorSwatchPickerItem color="#0f0" />
      <ColorSwatchPickerItem color="#00f" />
      <ColorSwatchPickerItem color="#ff0" />
      <ColorSwatchPickerItem color="#f0f" />
      <ColorSwatchPickerItem color="#0ff" />
    </ColorSwatchPicker>
  );
}

