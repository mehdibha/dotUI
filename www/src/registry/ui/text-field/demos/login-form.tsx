'use client'

import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField type="email" autoComplete="email" isRequired>
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
      </TextField>
      <TextField type="password" autoComplete="current-password" isRequired>
        <Label>Password</Label>
        <Input placeholder="••••••••" />
      </TextField>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  )
}
