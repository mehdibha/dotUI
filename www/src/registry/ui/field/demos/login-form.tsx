'use client'

import { Button } from '@/registry/ui/button'
import { Description, FieldError, FieldGroup, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <form className="w-full max-w-xs">
      <FieldGroup>
        <TextField type="email" defaultValue="ada@example" isInvalid>
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          <FieldError>Enter a valid email address.</FieldError>
        </TextField>
        <TextField type="password" isRequired>
          <Label>Password</Label>
          <Input placeholder="••••••••" />
          <Description>At least 8 characters.</Description>
        </TextField>
        <Button type="submit" variant="primary" className="w-full">
          Sign in
        </Button>
      </FieldGroup>
    </form>
  )
}
