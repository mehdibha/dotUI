'use client'

import { MinusIcon, PlusIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'

export default function Demo() {
  return (
    <Group orientation="vertical" aria-label="Media controls" className="h-fit">
      <Button isIconOnly>
        <PlusIcon />
      </Button>
      <Button isIconOnly>
        <MinusIcon />
      </Button>
    </Group>
  )
}
