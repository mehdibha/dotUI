import { PaletteIcon } from "lucide-react";
import { ColorField } from "@/components/dynamic-ui/color-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField prefix={<PaletteIcon />} />
      <ColorField suffix={<PaletteIcon />} />
    </div>
  );
}
