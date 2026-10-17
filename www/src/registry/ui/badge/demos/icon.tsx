import { BadgeCheckIcon } from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge>
        <BadgeCheckIcon />
        Verified
      </Badge>
    </div>
  )
}
