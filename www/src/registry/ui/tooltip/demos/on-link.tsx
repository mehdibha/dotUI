import { Link } from '@/registry/ui/link'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export default function Demo() {
  return (
    <Tooltip>
      <Link href="#">Learn more</Link>
      <TooltipContent>Click to read the documentation</TooltipContent>
    </Tooltip>
  )
}
