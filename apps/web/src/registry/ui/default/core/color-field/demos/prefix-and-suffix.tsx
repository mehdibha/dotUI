import { PaletteIcon } from "@/__icons__";
import { ColorField } from "@/registry/ui/default/core/color-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField prefix={<PaletteIcon />} />
      <ColorField suffix={<PaletteIcon />} />
    </div>
  );
}
