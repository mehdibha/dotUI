import { Link, type LinkProps } from "@/registry/ui/link"

export default function Demo({
  children = "View documentation",
  variant = "default",
  isDisabled = false,
}: LinkProps = {}) {
  return (
    <Link href="#" variant={variant} isDisabled={isDisabled}>
      {children}
    </Link>
  )
}
