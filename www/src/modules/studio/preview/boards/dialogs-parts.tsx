"use client"

import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"

import { BASE_STATE, usePresence, useReplay } from "./board"
import type { Phase } from "./board"

/** Open and live at rest; opens and closes on a loop while the panel edits one of `keys`. */
export function useEditedPresence(
  ref: React.RefObject<HTMLElement | null>,
  keys: readonly string[],
) {
  const motion = useReplay(...keys)
  const phase = usePresence(ref, motion, { open: 1600, closed: 700 })
  return { phase, live: !motion.running }
}

const PEOPLE = [
  { name: "Maya Chen", email: "maya@acme.co", role: "Owner" },
  { name: "Leo Park", email: "leo@acme.co", role: "Admin" },
  { name: "Sara Diaz", email: "sara@acme.co", role: "Editor" },
  { name: "Tom Becker", email: "tom@acme.co", role: "Viewer" },
  { name: "Ines Moreau", email: "ines@acme.co", role: "Viewer" },
]

/** The first `count` teammates, one row each. */
export function People({ count = PEOPLE.length }: { count?: number }) {
  return PEOPLE.slice(0, count).map((person) => (
    <div
      key={person.name}
      data-person=""
      className="flex items-center gap-3 py-1"
    >
      <Avatar size="sm">
        <AvatarFallback>
          {person.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{person.name}</span>
        <span className="truncate text-xs text-fg-muted">{person.email}</span>
      </div>
      <span className="text-xs text-fg-muted">{person.role}</span>
    </div>
  ))
}

const PROJECTS = [
  { name: "Acme Web", meta: "Deployed 2h ago", tone: "bg-primary" },
  { name: "Billing API", meta: "Deployed yesterday", tone: "bg-success" },
  { name: "Docs", meta: "Building", tone: "bg-warning" },
  { name: "Mobile", meta: "Failed 3d ago", tone: "bg-danger" },
  { name: "Analytics", meta: "Deployed 5d ago", tone: "bg-info" },
  { name: "Marketing", meta: "Deployed 1w ago", tone: "bg-neutral" },
]

/** What a modal layer covers: a projects page, so scrim and frost read. */
function Page() {
  return (
    <div
      aria-hidden
      inert
      className="@container absolute inset-0 flex flex-col bg-bg text-fg"
    >
      <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
        <span className="text-sm font-medium">Projects</span>
        <Button size="sm">New project</Button>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card key={project.name} size="sm">
            <CardContent className="flex flex-col gap-3">
              <div
                className={cn(
                  "h-14 rounded-(--studio-radius-item) opacity-70",
                  project.tone,
                )}
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium">{project.name}</span>
                <span className="text-xs text-fg-muted">{project.meta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** A screen-sized frame over a page: the layers' viewport, inert unless `live`. */
export function Screen({
  ref,
  height,
  live = false,
  className,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>
  height: string
  live?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      ref={ref}
      inert={!live}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={
        { height, "--visual-viewport-height": height } as React.CSSProperties
      }
    >
      <Page />
      {children}
    </div>
  )
}

/** The registry drawer's layers, held inside a Screen. */
export function DrawerLayer({
  placement,
  phase = "open",
  className,
  children,
}: {
  placement: "bottom" | "right"
  phase?: Phase
  className?: string
  children: React.ReactNode
}) {
  const { overlay, backdrop, viewport, popup, handle } = useDrawerStyles()({
    placement,
  })
  if (phase === "closed") return null
  return (
    <div className={overlay({ className: "absolute" })}>
      <div {...BASE_STATE[phase]} className={backdrop()} />
      <div className={viewport({ className: "absolute" })}>
        <div
          data-drawer=""
          {...BASE_STATE[phase]}
          className={popup({ className })}
        >
          {placement === "bottom" && (
            <div data-orientation="horizontal" className={handle()} />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
