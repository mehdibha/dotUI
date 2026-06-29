'use client'

import { Button } from '@/registry/ui/button'
import { Description, FieldGroup, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <form className="w-full max-w-xs">
      <FieldGroup>
        <TextField defaultValue="Ada Lovelace">
          <Label>Display name</Label>
          <Input placeholder="Your name" />
        </TextField>
        <TextField type="email" defaultValue="ada@example.com">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          <Description>Used for sign-in and notifications.</Description>
        </TextField>
        <Select defaultSelectedKey="utc" placeholder="Select timezone">
          <Label>Timezone</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="utc">UTC</SelectItem>
            <SelectItem id="est">Eastern Time</SelectItem>
            <SelectItem id="pst">Pacific Time</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="primary" className="w-full">
          Save changes
        </Button>
      </FieldGroup>
    </form>
  )
}
