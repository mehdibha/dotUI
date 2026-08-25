"use client"

/* The lab panel mounted in /create's slot — design continues in the real
   context. Local lab state only; nothing wired into the create engine. */

import { cn } from "@/registry/lib/utils"

import { CHAPTERS } from "./state"
import { useLab } from "./use-lab"
import { PanelB } from "./variants/panel-b"

export function LabCreatePanel({ className }: { className?: string }) {
  const lab = useLab()
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col lg:w-76 lg:flex-none lg:shrink-0",
        className,
      )}
    >
      <PanelB chapters={CHAPTERS} lab={lab} />
    </div>
  )
}
