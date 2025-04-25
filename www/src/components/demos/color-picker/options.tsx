import { ColorPicker } from "@/components/dynamic-core/color-picker";
import { ColorSwatch } from "@/components/dynamic-core/color-swatch";

export default function Demo() {
  return (
    <ColorPicker variant="primary" size="sm" defaultValue="#107030">
      <ColorSwatch />
      Fill color
    </ColorPicker>
  );
}
