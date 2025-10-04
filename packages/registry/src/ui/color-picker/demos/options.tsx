import { ColorPicker } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";

export default function Demo() {
  return (
    <ColorPicker variant="primary" size="sm" defaultValue="#107030">
      <ColorSwatch />
      Fill color
    </ColorPicker>
  );
}
