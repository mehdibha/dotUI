import { ArrowUpRightIcon } from 'lucide-react'

import { Badge } from '@/registry/ui/badge'

export default function Demo() {
  return (
    <Badge variant="accent">
      Open Link <ArrowUpRightIcon data-icon-inline-end="" />
    </Badge>
  )
}
