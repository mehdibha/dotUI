import { Badge } from "@/registry/ui/badge"

export default function Demo() {
  return (
    <Badge>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-warning" />
      Pending
    </Badge>
  )
}
