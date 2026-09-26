"use client"

import { Focusable } from "react-aria-components/Focusable"

import { cn } from "@/registry/lib/utils"
import { Button, useButtonStyles } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { publishSystem } from "@/modules/studio/publish"
import { clock } from "@/modules/studio/time"
import { usePublishStatus } from "@/modules/studio/workspace"
import type { DesignSystemDoc } from "@/modules/studio/workspace"

/** Publish → Publishing… → Published ✓, which stays disabled until the
 *  next change. */
export function PublishButton({
  doc,
  className,
}: {
  doc: DesignSystemDoc
  className?: string
}) {
  const status = usePublishStatus(doc)
  const styles = useButtonStyles()
  const last = doc.published.at(-1)

  if (status === "current" && last)
    return (
      <Tooltip delay={0}>
        <Focusable>
          <span
            role="button"
            tabIndex={0}
            aria-disabled="true"
            data-disabled=""
            className={styles({
              variant: "secondary",
              size: "sm",
              className: cn("gap-1.5", className),
            })}
          >
            Published ✓
          </span>
        </Focusable>
        <TooltipContent>Up to date · published {clock(last.at)}</TooltipContent>
      </Tooltip>
    )

  return (
    <Button
      variant="secondary"
      size="sm"
      isPending={status === "pending"}
      onPress={() => publishSystem(doc.id).catch(() => {})}
      className={cn("gap-1.5", className)}
    >
      {status === "pending" ? (
        "Publishing…"
      ) : (
        <>
          Publish
          {(status === "never" || status === "changed") && (
            <span
              role="img"
              aria-label="Unpublished changes"
              className="size-1.5 shrink-0 rounded-full bg-accent"
            />
          )}
        </>
      )}
    </Button>
  )
}
