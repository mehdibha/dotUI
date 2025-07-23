import { ColorField } from "@dotui/ui/components/color-field";
import { PaletteIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField prefix={<PaletteIcon />} />
      <ColorField suffix={<PaletteIcon />} />
    </div>
  );
}
