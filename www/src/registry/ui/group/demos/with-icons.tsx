'use client'

import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCwIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'

export default function Demo() {
  return (
    <Group>
      <Button isIconOnly>
        <FlipHorizontalIcon />
      </Button>
      <Button isIconOnly>
        <FlipVerticalIcon />
      </Button>
      <Button isIconOnly>
        <RotateCwIcon />
      </Button>
    </Group>
  )
}
