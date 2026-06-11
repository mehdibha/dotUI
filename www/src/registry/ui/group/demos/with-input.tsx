'use client'

import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Input, InputGroup } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Group>
        <Button>Button</Button>
        <InputGroup>
          <Input placeholder="Type something here..." />
        </InputGroup>
      </Group>
      <Group>
        <InputGroup>
          <Input placeholder="Type something here..." />
        </InputGroup>
        <Button>Button</Button>
      </Group>
    </div>
  )
}
