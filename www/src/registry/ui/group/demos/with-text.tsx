'use client'

import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { Group, GroupText } from '@/registry/ui/group'
import { Input, InputGroup } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Group>
        <GroupText>Text</GroupText>
        <Button>Another Button</Button>
      </Group>
      <Group>
        <Label htmlFor="input-text">GPU Size</Label>
        <InputGroup>
          <Input id="input-text" placeholder="Type something here..." />
        </InputGroup>
      </Group>
    </div>
  )
}
