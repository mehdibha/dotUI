"use client"

/* Toast — the floating notice (axes/toast.ts). The real Toast lives in a
   fixed viewport, so the hero is a still of one; there are no controls yet. */

import { CircleCheckIcon } from "lucide-react"

import { Hero } from "../hero"
import { ControlGroup } from "../rows"
import type { Studio, StudioState } from "../state"

export function ToastHero(_props: { state: StudioState }) {
  return (
    <Hero className="flex h-28 items-end justify-end">
      <div className="flex w-fit max-w-[85%] items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-fg shadow-lg">
        <CircleCheckIcon className="size-3.5 shrink-0 text-fg-success" />
        <span className="truncate text-[0.8125rem] font-medium">
          Changes saved
        </span>
      </div>
    </Hero>
  )
}

export function toastSummary(_state: StudioState): string {
  return "Default"
}

export function ToastSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <ToastHero state={studio.state} />
    </ControlGroup>
  )
}
