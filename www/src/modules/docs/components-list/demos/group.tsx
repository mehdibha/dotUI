'use client'

import { EllipsisIcon } from 'lucide-react'

import { SearchIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'

import { DemoPress, useAutoplay } from '../autoplay'

export function GroupDemo() {
  const { phase } = useAutoplay([
    { name: 'idle', duration: 900 },
    { name: 'hover', duration: 540 },
    { name: 'press', duration: 260 },
  ])
  return (
    <div className="flex flex-col items-center gap-4">
      <Group orientation="horizontal">
        <Button>Button</Button>
        {/* Wrapping the trailing cell in DemoPress makes the wrapper the
            Group's last child, so the Group's positional `rounded-l-none`
            lands on the wrapper instead of the button — re-flatten the
            button's left edge here to keep the segmented seam. */}
        <DemoPress phase={phase}>
          <Button isIconOnly className="rounded-l-none">
            <EllipsisIcon />
          </Button>
        </DemoPress>
      </Group>
      <Group orientation="horizontal">
        <Input className="w-32" />
        <Button isIconOnly>
          <SearchIcon />
        </Button>
      </Group>
    </div>
  )
}
