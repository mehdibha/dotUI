'use client'

import { SquarePenIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export function TooltipDemo() {
  return (
    <Tooltip>
      <Button isIconOnly>
        <SquarePenIcon />
      </Button>
      <TooltipContent>
        Create new issue <Kbd>C</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
