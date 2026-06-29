import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  return (
    <ColorField className="max-w-xs">
      <Label>Background</Label>
      <Input />
    </ColorField>
  )
}
