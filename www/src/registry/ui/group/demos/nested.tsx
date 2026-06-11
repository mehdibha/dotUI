'use client'

import { MicIcon, PlusIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export default function Demo() {
  return (
    <Group>
      <Group>
        <Button isIconOnly>
          <PlusIcon />
        </Button>
      </Group>
      <Group>
        <InputGroup>
          <Input placeholder="Send a message..." />
          <InputGroupAddon>
            <Tooltip>
              <Button isIconOnly variant="quiet">
                <MicIcon />
              </Button>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </Group>
    </Group>
  )
}
