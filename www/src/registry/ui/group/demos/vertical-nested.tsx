'use client'

import {
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCwIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'

export default function Demo() {
  return (
    <Group orientation="vertical" aria-label="Design tools palette">
      <Group orientation="vertical">
        <Button isIconOnly>
          <SearchIcon />
        </Button>
        <Button isIconOnly>
          <CopyIcon />
        </Button>
        <Button isIconOnly>
          <ShareIcon />
        </Button>
      </Group>
      <Group orientation="vertical">
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
      <Group orientation="vertical">
        <Button isIconOnly>
          <TrashIcon />
        </Button>
      </Group>
    </Group>
  )
}
