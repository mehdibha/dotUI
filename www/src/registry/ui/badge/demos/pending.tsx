import { Badge } from '@/registry/ui/badge'

export default function Demo() {
  return (
    <Badge>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
      Pending
    </Badge>
  )
}
