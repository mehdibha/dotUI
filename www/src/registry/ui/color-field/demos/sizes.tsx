import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
export default function Demo() {
  return (
    <>
      <ColorField>
        <Label>small</Label>
        <Input size="sm" />
      </ColorField>
      <ColorField>
        <Label>medium</Label>
        <Input size="md" />
      </ColorField>
      <ColorField>
        <Label>large</Label>
        <Input size="lg" />
      </ColorField>
    </>
  )
}
