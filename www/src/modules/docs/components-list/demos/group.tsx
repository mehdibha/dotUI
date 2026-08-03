import { EllipsisIcon } from 'lucide-react'

import { SearchIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'

export function GroupDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Group orientation="horizontal">
        <Button>Button</Button>
        <Button isIconOnly>
          <EllipsisIcon />
        </Button>
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
