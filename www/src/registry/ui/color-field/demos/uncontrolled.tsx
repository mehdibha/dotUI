import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  return (
    <ColorField defaultValue="#7f007f">
      <Label>Color</Label>
      <Input />
    </ColorField>
  )
}
