"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"

import { LinkIcon, ShareIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Input } from "@/registry/ui/input"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { TextField } from "@/registry/ui/text-field"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import { Board, BoardSection, RAC_STATE, usePresence, useReplay } from "./board"
import { REPLAY, Split, STAGE, Tip, useAnchor } from "./menus-parts"

const PEOPLE = [
  { name: "Maya Chen", role: "Owner", variant: "accent" },
  { name: "Leo Park", role: "Editor" },
  { name: "Ana Ruiz", role: "Editor" },
  { name: "Sam Ito", role: "Viewer" },
  { name: "Noor Haddad", role: "Editor" },
  { name: "Jonas Weber", role: "Viewer" },
] as const

const COPY = {
  title: "Invite to Acme Web",
  description: "Members can edit and comment.",
}

const PERSON_ROW = 52

/** A row height near `row` that ends a whole row exactly at the popover's bottom, so none peeks out half-covered. */
function useRowHeight(
  list: RefObject<HTMLElement | null>,
  popover: RefObject<HTMLElement | null>,
  row: number,
) {
  const [height, setHeight] = useState<number>()
  useLayoutEffect(() => {
    const l = list.current
    const p = popover.current
    if (!l || !p) return
    const measure = () => {
      const room =
        p.getBoundingClientRect().bottom - l.getBoundingClientRect().top
      setHeight(room / Math.max(1, Math.round(room / row)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(p)
    return () => observer.disconnect()
  }, [list, popover, row])
  return height
}

function People({
  ref,
  height = PERSON_ROW,
}: {
  ref: RefObject<HTMLUListElement | null>
  height?: number
}) {
  return (
    <ul ref={ref} className="col-start-1 row-start-1 flex flex-col self-start">
      {PEOPLE.map((person) => (
        <li
          key={person.name}
          style={{ height }}
          className="flex shrink-0 items-center gap-3 border-b px-6 text-sm last:border-b-0 max-sm:px-4"
        >
          <Avatar size="sm">
            <AvatarFallback>
              {person.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{person.name}</span>
          <Badge
            variant={"variant" in person ? person.variant : "neutral"}
            className="ml-auto"
          >
            {person.role}
          </Badge>
        </li>
      ))}
    </ul>
  )
}

function PopoverSpecimen() {
  const { popover, arrow } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  const { content: tooltip, arrow: tooltipArrow } = useTooltipStyles()()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const anchor = useAnchor(trigger, panel)
  const list = useRef<HTMLUListElement>(null)
  const height = useRowHeight(list, panel, PERSON_ROW)
  return (
    <div inert className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-6 py-3 max-sm:px-4">
        <span className="mr-auto text-sm font-medium">Acme Web</span>
        <span className="relative flex">
          <Button variant="quiet" isIconOnly aria-label="Copy link">
            <LinkIcon />
          </Button>
          <div
            data-placement="left"
            // The tooltip's 10px offset, as react-aria places it.
            className={tooltip({
              className:
                "absolute top-1/2 right-[calc(100%+10px)] -translate-y-1/2 whitespace-nowrap",
            })}
          >
            Copy link
            <Tip className={tooltipArrow()} placement="left" size={8} />
          </div>
        </span>
        <Button ref={trigger} variant="secondary">
          <ShareIcon data-icon="inline-start" />
          Share
        </Button>
      </div>
      <div className="grid">
        <People ref={list} height={height} />
        <div
          ref={panel}
          data-popover=""
          data-trigger="DialogTrigger"
          data-placement="bottom"
          className={popover({
            className:
              "relative col-start-1 row-start-1 -mt-1 mr-6 mb-6 w-72 max-w-[calc(100%-3rem)] self-start justify-self-end max-sm:mr-4 max-sm:max-w-[calc(100%-2rem)]",
          })}
        >
          <div className={content()}>
            <DialogHeader>
              <DialogTitle>{COPY.title}</DialogTitle>
              <DialogDescription>{COPY.description}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <TextField aria-label="Email" className="min-w-0 flex-1">
                <Input placeholder="Email" />
              </TextField>
              <Button variant="primary">Invite</Button>
            </div>
          </div>
          {anchor && (
            <Tip
              className={arrow()}
              placement="bottom"
              size={12}
              left={anchor.x}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const MOTION_KEYS = ["popoverMotion", "popoverEntrance"]

function PopoverReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const motion = useReplay(...MOTION_KEYS)
  const phase = usePresence(ref, motion, { closed: 600 })
  const { popover, arrow } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  return (
    <div ref={ref} inert={motion.running} className="relative h-fit">
      <Button variant="secondary">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
      {phase !== "closed" && (
        <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
          <div
            data-rac=""
            data-popover=""
            data-trigger="DialogTrigger"
            data-placement="bottom"
            {...RAC_STATE[phase]}
            className={popover({ className: "w-60" })}
            style={{ "--trigger-anchor-point": "50% 0" } as React.CSSProperties}
          >
            <div className={content()}>
              <DialogHeader>
                <DialogTitle>{COPY.title}</DialogTitle>
                <DialogDescription>{COPY.description}</DialogDescription>
              </DialogHeader>
            </div>
            <Tip className={arrow()} placement="bottom" size={12} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function PopoverBoard() {
  return (
    <Board id="popover">
      <Split>
        <BoardSection title="In context" className={STAGE}>
          <PopoverSpecimen />
        </BoardSection>
        <BoardSection title="Motion" className={cn(REPLAY, "h-44")}>
          <PopoverReplay />
        </BoardSection>
      </Split>
    </Board>
  )
}
