import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <TextField>
        <Label>Email</Label>
        <Input />
      </TextField>
      <TextField aria-label="Email">
        <Input />
      </TextField>
    </div>
  )
}
