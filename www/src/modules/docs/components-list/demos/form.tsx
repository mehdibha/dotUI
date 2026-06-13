import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { Form } from '@/registry/ui/form'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export function FormDemo() {
  return (
    <Form className="w-56">
      <TextField name="email">
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
      </TextField>
      <Button type="submit" variant="primary" className="w-fit">
        Subscribe
      </Button>
    </Form>
  )
}
