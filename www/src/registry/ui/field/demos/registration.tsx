'use client'

import { Button } from '@/registry/ui/button'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <form className="w-full max-w-xs">
      <FieldGroup>
        <TextField>
          <Label>Username</Label>
          <Input placeholder="ada_lovelace" />
          <Description>This will be your public handle.</Description>
        </TextField>
        <TextField type="email">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
        </TextField>
        <TextField type="password">
          <Label>Password</Label>
          <Input placeholder="••••••••" />
          <Description>At least 8 characters.</Description>
        </TextField>
        <Checkbox>
          <CheckboxControl />
          <FieldContent>
            <Label>Email me product updates</Label>
            <Description>You can unsubscribe anytime.</Description>
          </FieldContent>
        </Checkbox>
        <Button type="submit" variant="primary" className="w-full">
          Create account
        </Button>
      </FieldGroup>
    </form>
  )
}
