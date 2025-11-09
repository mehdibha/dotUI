import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@dotui/registry/ui/color-swatch-picker";

export default function Page() {
  return (
    <ColorSwatchPicker defaultValue="#FF6B6B">
      <ColorSwatchPickerItem color="#FF6B6B" />
      <ColorSwatchPickerItem color="#FFA07A" />
      <ColorSwatchPickerItem color="#FFD93D" />
      <ColorSwatchPickerItem color="#6BCB77" />
      <ColorSwatchPickerItem color="#4D96FF" />
      <ColorSwatchPickerItem color="#A29BFE" />
    </ColorSwatchPicker>
  );
}
