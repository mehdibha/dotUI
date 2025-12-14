import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ColorField>
        <Label>small</Label>
        <Input />
      </ColorField>
      <ColorField>
        <Label>medium</Label>
        <Input />
      </ColorField>
      <ColorField>
        <Label>large</Label>
        <Input />
      </ColorField>
    </div>
  );
}
