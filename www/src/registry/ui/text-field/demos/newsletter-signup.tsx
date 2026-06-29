'use client'

import { Button } from '@/registry/ui/button'
import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField type="email" autoComplete="email" isRequired>
        <Label>Subscribe to our newsletter</Label>
        <Input placeholder="you@example.com" />
        <Description>
          Get product updates. No spam, unsubscribe anytime.
        </Description>
      </TextField>
      <Button type="submit" className="w-full">
        Subscribe
      </Button>
    </form>
  )
}
