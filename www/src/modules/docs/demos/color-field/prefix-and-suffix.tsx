import { ColorField } from "@/components/dynamic-ui/color-field";
import { PaletteIcon } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField prefix={<PaletteIcon />} />
      <ColorField suffix={<PaletteIcon />} />
    </div>
  );
}
