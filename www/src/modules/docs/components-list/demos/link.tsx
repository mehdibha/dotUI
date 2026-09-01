import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"

// The card itself is an <a>, so a real <Link> would nest anchors. Render the
// real link styles on spans instead — same look under every preset.
export function LinkDemo() {
  const linkStyles = useLinkStyles()
  return (
    <div className="flex items-center gap-4 text-sm">
      <span data-rac="" className={linkStyles()}>
        Documentation
      </span>
      <span data-rac="" className={linkStyles({ variant: "quiet" })}>
        Changelog
      </span>
    </div>
  )
}
