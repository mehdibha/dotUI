import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"

// The card itself is an <a>, so a real <Link> would nest anchors. Render the
// real link styles on spans instead — same look under every preset.
export function LinkDemo() {
  const linkStyles = useLinkStyles()
  return (
    <p className="max-w-56 text-sm text-fg-muted">
      Built on{" "}
      <span data-rac="" className={linkStyles()}>
        React Aria Components
      </span>{" "}
      and styled with{" "}
      <span data-rac="" className={linkStyles()}>
        Tailwind CSS
      </span>
      .
    </p>
  )
}
