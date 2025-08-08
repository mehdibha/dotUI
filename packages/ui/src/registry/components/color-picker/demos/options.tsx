import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";

export default function Demo() {
  return (
    <ColorPicker variant="primary" size="sm" defaultValue="#107030">
      <ColorSwatch />
      Fill color
    </ColorPicker>
  );
}
