import { Badge } from '@/registry/ui/badge'
import { Loader } from '@/registry/ui/loader'

export default function Demo() {
  return (
    <Badge>
      <Loader />
      Badge
    </Badge>
  )
}
