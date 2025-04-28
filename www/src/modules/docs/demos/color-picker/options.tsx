import { ColorPicker } from "@/components/dynamic-ui/color-picker";
import { ColorSwatch } from "@/components/dynamic-ui/color-swatch";

export default function Demo() {
  return (
    <ColorPicker variant="primary" size="sm" defaultValue="#107030">
      <ColorSwatch />
      Fill color
    </ColorPicker>
  );
}
