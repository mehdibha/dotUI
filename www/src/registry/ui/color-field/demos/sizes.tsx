import { ColorField } from '@/registry/ui/color-field'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
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
    </div>
  )
}
