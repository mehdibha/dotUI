import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export default function Demo() {
  return (
    <Tooltip>
      <Button variant="secondary">Hover me</Button>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  )
}
