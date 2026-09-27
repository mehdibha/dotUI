"use client"

import { useLayoutEffect, useRef } from "react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { DisabledButton } from "@/modules/studio/disabled-button"
import { publishSystem } from "@/modules/studio/publish"
import { clock } from "@/modules/studio/time"
import { usePublishStatus } from "@/modules/studio/workspace"
import type { DesignSystemDoc } from "@/modules/studio/workspace"

/** Publish → Publishing… → Published ✓, which stays disabled until the
 *  next change. Every label takes the widest one's room, so nothing beside
 *  the button moves. */
export function PublishButton({
  doc,
  className,
}: {
  doc: DesignSystemDoc
  className?: string
}) {
  const status = usePublishStatus(doc)
  const last = doc.published.at(-1)
  const shown =
    status === "pending" ? "pending" : status === "current" ? "current" : "idle"
  const inert = shown !== "idle"

  // The press that made it inert swapped the focused button out: focus
  // moves to its replacement.
  const wrapper = useRef<HTMLSpanElement>(null)
  const pressed = useRef(false)
  useLayoutEffect(() => {
    if (!inert || !pressed.current) return
    pressed.current = false
    const active = document.activeElement
    if (active && active !== document.body) return
    wrapper.current?.querySelector<HTMLElement>("[role=button]")?.focus()
  }, [inert])

  const labels = {
    idle: (
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
    ),
    pending: "Publishing…",
    current: "Published ✓",
  }
  const label = (
    <span className="grid">
      {Object.entries(labels).map(([key, content]) => (
        <span
          key={key}
          className={cn(
            "col-start-1 row-start-1 flex items-center justify-center gap-1.5",
            key !== shown && "invisible",
          )}
        >
          {content}
        </span>
      ))}
    </span>
  )
  const props = {
    variant: "secondary",
    size: "sm",
    className: cn("gap-1.5", className),
  } as const

  return (
    <span ref={wrapper} className="contents">
      <Tooltip delay={0} isDisabled={shown !== "current"}>
        {inert ? (
          <DisabledButton {...props}>{label}</DisabledButton>
        ) : (
          <Button
            {...props}
            onPress={() => {
              pressed.current = true
              publishSystem(doc.id).catch(() => {})
            }}
          >
            {label}
          </Button>
        )}
        <TooltipContent>
          Up to date · published {last ? clock(last.at) : ""}
        </TooltipContent>
      </Tooltip>
    </span>
  )
}
