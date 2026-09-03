import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"

// The card itself is an <a>, so a real <Link> would nest anchors. Render the
// real link styles on a span instead — same look under every preset.
export function LinkDemo() {
  const linkStyles = useLinkStyles()
  return (
    <span data-rac="" className={linkStyles()}>
      Documentation
    </span>
  )
}
