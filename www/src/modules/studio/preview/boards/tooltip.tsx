"use client"

import { useRef } from "react"

import {
  BoldIcon,
  CopyIcon,
  InfoIcon,
  ItalicIcon,
  LinkIcon,
  UnderlineIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import { Board, BoardSection, RAC_STATE, usePresence, useReplay } from "./board"
import { REPLAY, STAGE, Tip } from "./menus-parts"

/** An open tooltip above its trigger, 10px off as react-aria places it. */
function Above({
  label,
  className,
  children,
}: {
  label: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const { content, arrow } = useTooltipStyles()()
  return (
    <span className="relative flex">
      {children}
      <div
        data-placement="top"
        className={content({
          className: cn(
            "absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
            className,
          ),
        })}
      >
        {label}
        <Tip className={arrow()} placement="top" size={8} />
      </div>
    </span>
  )
}

function ComposerSpecimen() {
  return (
    <div inert className="flex flex-col">
      <div className="flex flex-col gap-3 px-6 pt-5 text-sm/relaxed max-sm:px-4">
        <p>
          Ship the new onboarding by Friday. Link the research doc and loop in
          design before the review on Thursday.
        </p>
        <p>Leo, can you take the empty states? Ana has the copy.</p>
      </div>
      <div className="flex items-center gap-1 px-4 pt-14 pb-3 max-sm:px-2">
        <ToggleButton variant="quiet" isIconOnly aria-label="Bold" isSelected>
          <BoldIcon />
        </ToggleButton>
        <ToggleButton variant="quiet" isIconOnly aria-label="Italic">
          <ItalicIcon />
        </ToggleButton>
        <ToggleButton variant="quiet" isIconOnly aria-label="Underline">
          <UnderlineIcon />
        </ToggleButton>
        <Above label="Add link" className="whitespace-nowrap">
          <Button variant="quiet" isIconOnly aria-label="Add link">
            <LinkIcon />
          </Button>
        </Above>
        <Button variant="primary" className="ml-auto">
          Comment
        </Button>
      </div>
    </div>
  )
}

function MultiLineSpecimen() {
  return (
    <div inert className="flex pt-14">
      <Above
        label="Shared links expire after 7 days. Change it in Settings."
        className="w-max max-w-52"
      >
        <Button variant="secondary" isIconOnly aria-label="Link expiry">
          <InfoIcon />
        </Button>
      </Above>
    </div>
  )
}

const MOTION_KEYS = ["tooltipMotion", "tooltipEntrance"]

function TooltipReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const motion = useReplay(...MOTION_KEYS)
  const phase = usePresence(ref, motion, { open: 1600, closed: 600 })
  const { content, arrow } = useTooltipStyles()()
  return (
    <div ref={ref} inert={motion.running} className="relative h-fit">
      <Button variant="secondary" isIconOnly aria-label="Copy link">
        <CopyIcon />
      </Button>
      {phase !== "closed" && (
        <div className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2">
          <div
            data-rac=""
            data-placement="bottom"
            {...RAC_STATE[phase]}
            className={content({ className: "relative whitespace-nowrap" })}
            style={{ "--trigger-anchor-point": "50% 0" } as React.CSSProperties}
          >
            Copy link
            <Tip className={arrow()} placement="bottom" size={8} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function TooltipBoard() {
  return (
    <Board id="tooltip">
      <BoardSection title="In context" className={STAGE}>
        <ComposerSpecimen />
      </BoardSection>
      <div className="grid gap-8 sm:grid-cols-2">
        <BoardSection title="Multi-line" className="flex-1 py-6">
          <MultiLineSpecimen />
        </BoardSection>
        <BoardSection title="Motion" className={cn(REPLAY, "min-h-32 flex-1")}>
          <TooltipReplay />
        </BoardSection>
      </div>
    </Board>
  )
}
