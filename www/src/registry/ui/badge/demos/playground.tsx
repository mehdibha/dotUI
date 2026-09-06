import { Badge, type BadgeProps } from "@/registry/ui/badge"

export default function Demo({
  children = "Badge",
  variant = "neutral",
}: BadgeProps = {}) {
  return <Badge variant={variant}>{children}</Badge>
}
