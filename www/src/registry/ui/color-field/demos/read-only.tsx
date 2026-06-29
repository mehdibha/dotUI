import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'

export default function Demo() {
  return (
    <ColorField
      className="max-w-xs"
      aria-label="Color"
      isReadOnly
      value="#121212"
    >
      <Label>Read only</Label>
      <Input />
    </ColorField>
  )
}
