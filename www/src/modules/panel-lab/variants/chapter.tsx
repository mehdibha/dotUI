"use client"

/* The chapter card — the real /create panel's section chrome (control-panel.tsx),
   shared by the v1 frame and the per-section frames so a section looks identical
   whether it's read in the full panel or on its own. */

import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

import type { Lab, LabState } from "../data"

export interface Chapter {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  keys: (keyof LabState)[]
  Body: React.ComponentType<{ lab: Lab }>
}

/** Icon, label, modified dot, reset. */
function ChapterHeading({
  icon: Icon,
  label,
  modified,
  onReset,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  modified: boolean
  onReset: () => void
}) {
  return (
    <div className="mb-1.5 flex h-7 items-center gap-2 px-1">
      <Icon className="size-3.5 text-fg-muted" />
      <span className="text-[0.8125rem] font-medium text-fg">{label}</span>
      {modified && (
        <>
          <span
            aria-label="Modified"
            className="size-1 rounded-full bg-accent"
          />
          <Button
            size="xs"
            variant="quiet"
            isIconOnly
            aria-label={`Reset ${label.toLowerCase()}`}
            onPress={onReset}
            className="ml-auto text-fg-muted"
          >
            <RotateCcwIcon />
          </Button>
        </>
      )}
    </div>
  )
}

/** One section as a bordered card: heading + body. */
export function ChapterCard({
  chapter: { label, icon, keys, Body },
  lab,
}: {
  chapter: Chapter
  lab: Lab
}) {
  const status = lab.section(keys)
  return (
    <section className="rounded-xl border border-border/45 bg-card p-3">
      <ChapterHeading
        icon={icon}
        label={label}
        modified={status.modified}
        onReset={status.onReset}
      />
      <div className="flex flex-col gap-1.5">
        <Body lab={lab} />
      </div>
    </section>
  )
}
