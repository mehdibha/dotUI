import { ColorField } from "@/registry/ui/color-field"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"

export function ColorFieldDemo() {
  return (
    <ColorField defaultValue="#7f007f" className="w-full max-w-[11.5rem]">
      <Label>Color</Label>
      <Input className="w-full" />
    </ColorField>
  )
}
