import { PaletteIcon } from "@dotui/registry/icons";
import { ColorField } from "@dotui/registry/ui/color-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField
        prefix={<PaletteIcon />}
        aria-label="Color field with prefix"
      />
      <ColorField
        suffix={<PaletteIcon />}
        aria-label="Color field with suffix"
      />
    </div>
  );
}
