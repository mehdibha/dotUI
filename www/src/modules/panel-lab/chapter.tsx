"use client"

/* The chapter card — the real /create panel's section chrome
   (control-panel.tsx), so a section looks identical whether it's read in the
   full panel or on its own. */

import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

import type { Chapter, Lab } from "./state"

/** Label, modified dot, reset. */
function ChapterHeading({
  label,
  modified,
  onReset,
}: {
  label: string
  modified: boolean
  onReset: () => void
}) {
  return (
    <div className="mb-1.5 flex h-7 items-center gap-2 px-1">
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
  chapter: { label, defaults, Body },
  lab,
}: {
  chapter: Chapter
  lab: Lab
}) {
  const status = lab.section(defaults)
  return (
    <section className="rounded-xl border border-border/45 bg-card p-3">
      <ChapterHeading
        label={label}
        modified={status.modified}
        onReset={status.onReset}
      />
      <div className="flex flex-col gap-[var(--lab-gap-control,0.375rem)]">
        <Body lab={lab} />
      </div>
    </section>
  )
}
