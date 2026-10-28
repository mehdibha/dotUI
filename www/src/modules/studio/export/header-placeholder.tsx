import { LinkIcon } from "lucide-react"

import { buttonStyles } from "@/registry/ui/button"

const BLANK = "border-transparent bg-fg/8 text-transparent shadow-none"

/** The studio's header actions while it loads: blanks the size of the real
 *  buttons. The server can't know the viewport or the design system, so
 *  media variants pick the layout and the picker's blank has no name. */
export function StudioHeaderPlaceholder() {
  return (
    <>
      <span
        className={buttonStyles({
          variant: "quiet",
          size: "sm",
          className: `order-first mr-auto hidden w-20 dock-stacked:inline-flex ${BLANK}`,
        })}
      />
      <span aria-hidden className="flex shrink-0 items-center gap-2">
        <span
          data-icon-only=""
          className={buttonStyles({
            variant: "secondary",
            size: "sm",
            isIconOnly: true,
            className: `md:hidden dock-stacked:hidden ${BLANK}`,
          })}
        >
          <LinkIcon />
        </span>
        <span
          className={buttonStyles({
            variant: "secondary",
            size: "sm",
            className: `max-md:hidden dock-stacked:hidden ${BLANK}`,
          })}
        >
          <LinkIcon />
          Share
        </span>
        <span
          className={buttonStyles({
            variant: "primary",
            size: "sm",
            className: BLANK,
          })}
        >
          Export
        </span>
      </span>
    </>
  )
}
