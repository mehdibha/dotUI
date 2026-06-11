import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export default function Demo() {
  return (
    <Tooltip>
      <Button variant="default">Show tooltip</Button>
      <TooltipContent>
        To learn more about how this works, check out the docs. If you have any
        questions, please reach out to us.
      </TooltipContent>
    </Tooltip>
  )
}
