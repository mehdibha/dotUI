"use client"

/* Overlay and navigation illustrations — monochrome anatomy schematics (see
   ink.tsx). Floating panels sit on bg-card, the one lifted surface the
   schematics allow; panels taller than the row band top-align and crop. */

import { ChevronDownIcon, ChevronLeftIcon, CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Bar } from "./ink"

/** A floating list, the first item highlighted. */
export function MenusDemo() {
  return (
    <span className="flex w-18 shrink-0 flex-col rounded-md border border-fg/15 bg-card p-0.5 text-[9px] leading-none font-medium text-fg/75 shadow-sm">
      <span className="rounded-[4px] bg-fg/10 px-1.5 py-[3px]">Copy</span>
      <span className="px-1.5 py-[3px]">Paste</span>
    </span>
  )
}

/** A dimmed viewport with the card resting at its center. */
export function DialogsDemo() {
  return (
    <span className="relative h-8 w-24 shrink-0 overflow-hidden rounded-md bg-fg/10">
      <span className="absolute top-1/2 left-1/2 flex w-13 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-[5px] bg-card p-1 shadow-md">
        <Bar className="w-6 bg-fg/50" />
        <span className="flex justify-end gap-1">
          <span className="h-2 w-3.5 rounded-[2px] bg-fg/15" />
          <span className="h-2 w-3.5 rounded-[2px] bg-fg/70" />
        </span>
      </span>
    </span>
  )
}

/** The anchored panel alone, tip up. */
export function PopoversDemo() {
  return (
    <span className="relative mt-1 flex w-20 shrink-0 flex-col gap-1 rounded-lg border border-fg/15 bg-card p-2 shadow-sm">
      <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[1px] border-t border-l border-fg/15 bg-card" />
      <Bar className="w-9 bg-fg/50" />
      <Bar className="w-12 bg-fg/15" />
    </span>
  )
}

/** The chip pinned over the control it names. */
export function TooltipsDemo() {
  return (
    <span className="flex shrink-0 flex-col items-center gap-1">
      <span className="rounded-[4px] bg-fg/80 px-1.5 py-[3px] text-[9px] leading-none font-medium text-bg">
        Copy
      </span>
      <span className="flex size-4 items-center justify-center rounded-[5px] border border-fg/25">
        <CopyIcon className="size-2.5 text-fg/55" />
      </span>
    </span>
  )
}

/** Two tabs on the content edge, the first carrying the line. */
export function TabsDemo() {
  return (
    <span className="flex shrink-0 gap-3 border-b border-fg/15 px-0.5 text-[10px] font-medium whitespace-nowrap">
      <span className="relative pb-1.5 text-fg/85">
        Overview
        <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-fg/80" />
      </span>
      <span className="pb-1.5 text-fg/45">Activity</span>
    </span>
  )
}

/** A short trail, the current crumb on fg. */
export function BreadcrumbsDemo() {
  return (
    <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium whitespace-nowrap">
      <span className="text-fg/50">Home</span>
      <span className="text-fg/30">/</span>
      <span className="text-fg/50">Team</span>
      <span className="text-fg/30">/</span>
      <span className="text-fg/85">Billing</span>
    </span>
  )
}

/** A short page run, the current page solid. */
export function PaginationDemo() {
  const item =
    "flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-medium"
  return (
    <span className="flex shrink-0 items-center gap-1">
      <span className={cn(item, "text-fg/55")}>
        <ChevronLeftIcon className="size-3" />
      </span>
      <span className={cn(item, "text-fg/70")}>1</span>
      <span className={cn(item, "bg-fg/75 text-bg")}>2</span>
      <span className={cn(item, "text-fg/70")}>3</span>
    </span>
  )
}

/** Two collapsed rows and the hairline between them. */
export function AccordionDemo() {
  const row =
    "flex items-center justify-between gap-2 py-1.5 text-[10px] font-medium text-fg/75"
  return (
    <span className="flex w-24 shrink-0 flex-col">
      <span className={row}>
        Shipping
        <ChevronDownIcon className="size-2.5 shrink-0 text-fg/45" />
      </span>
      <span className={cn(row, "border-t border-fg/15")}>
        Returns
        <ChevronDownIcon className="size-2.5 shrink-0 text-fg/45" />
      </span>
    </span>
  )
}
