import { PaletteIcon } from "lucide-react";
import { ColorField } from "@/lib/components/core/default/color-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField prefix={<PaletteIcon />} />
      <ColorField suffix={<PaletteIcon />} />
    </div>
  );
}
