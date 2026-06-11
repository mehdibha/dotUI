'use client'

import { Button } from '@/registry/ui/button'
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
} from '@/registry/ui/tooltip'

export default function Demo({
  content = 'Tooltip content',
  placement = 'top',
  hideArrow = false,
}: {
  content?: string
  placement?: TooltipContentProps['placement']
  hideArrow?: boolean
} = {}) {
  return (
    <Tooltip>
      <Button>Hover me</Button>
      <TooltipContent
        data-control-target
        placement={placement}
        hideArrow={hideArrow}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
