"use client"

/* Display and feedback illustrations — monochrome anatomy schematics (see
   ink.tsx). */

import { CircleCheckIcon } from "lucide-react"

import { Bar } from "./ink"

/** One toast chip. */
export function NoticesDemo() {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-fg/20 bg-card px-2 py-1.5 text-[10px] font-medium whitespace-nowrap text-fg/80 shadow-xs">
      <CircleCheckIcon className="size-3 shrink-0 text-fg/60" />
      Changes saved
    </span>
  )
}

/** Two resting placeholder lines. */
export function SkeletonDemo() {
  return (
    <span className="flex shrink-0 flex-col gap-1.5">
      <span className="h-2 w-20 rounded-sm bg-fg/12" />
      <span className="h-2 w-14 rounded-sm bg-fg/12" />
    </span>
  )
}

/** The indeterminate arc on its track, mid-turn. */
export function SpinnerDemo() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="size-5 shrink-0 -rotate-45 text-fg"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity=".15"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  )
}

/** One part-filled bar. */
export function ProgressDemo() {
  return (
    <span className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-fg/15">
      <span className="block h-full w-3/5 rounded-full bg-fg/75" />
    </span>
  )
}

/** A solid and a tonal pill. */
export function BadgesDemo() {
  const pill =
    "flex h-4 shrink-0 items-center rounded-full px-1.5 text-[9px] font-medium whitespace-nowrap"
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className={`${pill} bg-fg/75 text-bg`}>New</span>
      <span className={`${pill} bg-fg/12 text-fg/70`}>Beta</span>
    </span>
  )
}

/** The overlapping stack. */
export function AvatarsDemo() {
  return (
    <span className="flex shrink-0 -space-x-1.5">
      {["bg-fg/55", "bg-fg/35", "bg-fg/20"].map((tone) => (
        <span
          key={tone}
          className={`size-5 rounded-full ring-2 ring-muted ${tone}`}
        />
      ))}
    </span>
  )
}

/** Header line over two schematic rows. */
export function TablesDemo() {
  return (
    <span className="flex w-24 shrink-0 flex-col">
      <span className="flex gap-2.5 pb-1.5">
        <Bar className="w-6 bg-fg/45" />
        <Bar className="w-8 bg-fg/45" />
      </span>
      <span className="flex gap-2.5 border-t border-fg/15 py-1.5">
        <Bar className="w-8" />
        <Bar className="w-6" />
      </span>
      <span className="flex gap-2.5 border-t border-fg/10 pt-1.5">
        <Bar className="w-7" />
        <Bar className="w-8" />
      </span>
    </span>
  )
}

/** Two sparkline series, the subject on fg. */
export function ChartsDemo() {
  return (
    <svg
      viewBox="0 0 60 28"
      fill="none"
      aria-hidden
      className="h-7 w-15 shrink-0 text-fg"
    >
      <path
        d="M2 26 L16 20 L30 24 L44 16 L58 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".3"
      />
      <path
        d="M2 22 L16 12 L30 17 L44 6 L58 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".8"
      />
    </svg>
  )
}
