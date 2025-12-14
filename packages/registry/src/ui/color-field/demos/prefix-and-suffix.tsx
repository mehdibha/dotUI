import { PaletteIcon } from "@dotui/registry/icons";
import { ColorField } from "@dotui/registry/ui/color-field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField aria-label="Color field with prefix">
        <InputGroup>
          <Input />
          <InputAddon>
            <PaletteIcon />
          </InputAddon>
        </InputGroup>
      </ColorField>
      <ColorField aria-label="Color field with suffix">
        <InputGroup>
          <InputAddon>
            <PaletteIcon />
          </InputAddon>
          <Input />
        </InputGroup>
      </ColorField>
    </div>
  );
}
