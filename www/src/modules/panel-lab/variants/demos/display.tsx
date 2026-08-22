"use client"

/* Display-chapter card demos — inert span-based specimens for the index
   strip (see ../demo.tsx). Skeleton and progress carry their own keyframes
   so they animate wherever the card mounts. */

import { CircleCheckIcon, InfoIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { LabAvatar } from "../../sections/avatars"
import { BADGE_SHAPE, BADGE_STYLE } from "../../sections/badges"
import { ALERT_FAMILY, TOAST_FAMILY } from "../../sections/notices"
import { SPINNER } from "../../sections/spinner"
import { CELLS, HEADER_FAMILY, ROW_FAMILY } from "../../sections/tables"
import type { LabState } from "../../state"

const NOTICE =
  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.8125rem] font-medium whitespace-nowrap"

/** The pair the chapter owns: the toast, then the inline alert. */
export function NoticesDemo({ state }: { state: LabState }) {
  return (
    <>
      <span
        className={cn(
          NOTICE,
          TOAST_FAMILY[state.noticeToast as keyof typeof TOAST_FAMILY],
        )}
      >
        <CircleCheckIcon className="size-3.5 shrink-0" />
        Changes saved
      </span>
      <span
        className={cn(
          NOTICE,
          ALERT_FAMILY[state.noticeAlert as keyof typeof ALERT_FAMILY],
        )}
      >
        <InfoIcon className="size-3.5 shrink-0 text-fg-info" />
        <span className="text-fg-info">A new version is available</span>
      </span>
    </>
  )
}

/** Two idle bars wearing the animation axis — still when it says none. */
export function SkeletonDemo({ state }: { state: LabState }) {
  const animation = state.skeletonAnimation
  const bar = (width: string) => (
    <span
      className={cn("h-2.5 rounded-sm bg-muted", width)}
      style={
        animation === "shimmer"
          ? {
              backgroundImage:
                "linear-gradient(to right, var(--color-muted) 33%, color-mix(in oklab, var(--color-muted), var(--color-bg) 45%), var(--color-muted) 66%)",
              backgroundSize: "300% 100%",
              backgroundRepeat: "no-repeat",
              animation: "lab-skeleton-shimmer 2s ease-in-out infinite",
            }
          : animation === "pulse"
            ? { animation: "lab-skeleton-pulse 2s ease-in-out infinite" }
            : undefined
      }
    />
  )
  return (
    <span className="flex shrink-0 flex-col gap-1.5">
      <style>{`
        @keyframes lab-skeleton-shimmer { 0% { background-position: 100% } 100% { background-position: 0% } }
        @keyframes lab-skeleton-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .5 } }
      `}</style>
      {bar("w-36")}
      {bar("w-24")}
    </span>
  )
}

/** The raw indicator, then the pending-action chip it lives in. */
export function SpinnerDemo({ state }: { state: LabState }) {
  const Spinner = SPINNER[state.spinnerStyle as keyof typeof SPINNER]
  return (
    <>
      <Spinner className="size-5 shrink-0 text-fg-muted" />
      <span className="flex shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2">
        <Spinner className="size-4 text-fg-muted" />
        <span className="text-[0.8125rem] whitespace-nowrap text-fg-muted">
          Saving…
        </span>
      </span>
    </>
  )
}

/** One part-filled bar wearing track weight and the M3 gap. */
export function ProgressDemo({ state }: { state: LabState }) {
  const height = state.progressTrack === "thick" ? "h-2" : "h-1"
  if (state.progressGap) {
    return (
      <span className={cn("flex w-44 shrink-0 items-center gap-1", height)}>
        <span className="h-full w-3/5 rounded-full bg-accent" />
        <span className="relative h-full flex-1 rounded-full bg-muted">
          <span className="absolute top-1/2 right-0 size-1 -translate-y-1/2 rounded-full bg-accent" />
        </span>
      </span>
    )
  }
  return (
    <span
      className={cn(
        "w-44 shrink-0 overflow-hidden rounded-full bg-muted",
        height,
      )}
    >
      <span className="block h-full w-3/5 rounded-full bg-accent" />
    </span>
  )
}

const BADGE =
  "flex h-5 shrink-0 items-center px-2 text-[0.6875rem] font-medium whitespace-nowrap"

/** Three intents wearing style and shape. */
export function BadgesDemo({ state }: { state: LabState }) {
  const style = BADGE_STYLE[state.badgeStyle as keyof typeof BADGE_STYLE]
  const shape = BADGE_SHAPE[state.badgeShape as keyof typeof BADGE_SHAPE]
  const badge = (intent: keyof typeof style, label: string) => (
    <span className={cn(BADGE, style[intent], shape)}>{label}</span>
  )
  return (
    <>
      {badge("success", "Success")}
      {badge("warning", "Warning")}
      {badge("neutral", "Neutral")}
    </>
  )
}

/** The overlapping stack, then a standalone with a presence dot. */
export function AvatarsDemo({ state }: { state: LabState }) {
  return (
    <>
      <span className="flex shrink-0 -space-x-2">
        {["MB", "AK", "JL"].map((initials, i) => (
          <LabAvatar
            key={initials}
            initials={initials}
            index={i}
            state={state}
            className="ring-2 ring-card"
          />
        ))}
      </span>
      <span className="relative shrink-0">
        <LabAvatar initials="ES" index={0} state={state} />
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-card" />
      </span>
    </>
  )
}

const TABLE_PEOPLE = [
  { name: "Ada", role: "Owner", status: "Active" },
  { name: "Lin", role: "Editor", status: "Active" },
]

/** Compact header + rows; top-aligned so the second row crops at the
 *  card's bottom edge. */
export function TablesDemo({ state }: { state: LabState }) {
  return (
    <span className="flex w-60 shrink-0 flex-col">
      <span
        className={cn(
          CELLS,
          "h-5 text-[10px] font-medium",
          HEADER_FAMILY[state.tableHeader as keyof typeof HEADER_FAMILY],
        )}
      >
        <span className="truncate">Name</span>
        <span className="truncate">Role</span>
        <span>Status</span>
      </span>
      {TABLE_PEOPLE.map((person) => (
        <span
          key={person.name}
          className={cn(
            CELLS,
            "h-7 text-xs tabular-nums",
            ROW_FAMILY[state.tableSeparation as keyof typeof ROW_FAMILY],
          )}
        >
          <span className="truncate font-medium text-fg">{person.name}</span>
          <span className="truncate text-fg-muted">{person.role}</span>
          <span className="text-[10px] text-fg-muted">{person.status}</span>
        </span>
      ))}
    </span>
  )
}
