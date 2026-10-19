import { Badge, type BadgeProps } from "@/registry/ui/badge"

export default function Demo({
  children = "Badge",
  appearance = "solid",
  variant = "neutral",
  size = "md",
}: BadgeProps = {}) {
  return (
    <Badge appearance={appearance} variant={variant} size={size}>
      {children}
    </Badge>
  )
}
