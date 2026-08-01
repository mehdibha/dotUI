'use client'

/* Panel Lab — the entire /create control panel recreated in the control-lab
   row language, explored as a canvas of frames (Figma-style) driven by ONE
   shared design-system state. Derived from the real builder schema; design
   only: local state, nothing wired into /create.

   The canvas: v1 — the whole panel, frozen as the reference — followed by one
   frame per section, where sections get enhanced and read against it. */

import { useState } from 'react'

import { cn } from '@/registry/lib/utils'

import { DEFAULTS } from './data'
import type { Lab, LabState } from './data'
import { CardsFrame } from './variants/cards'
import { SectionFrame, WORKING_CHAPTERS } from './variants/section-frames'

/* ---------------------------------- Frame ----------------------------------- */

function Frame({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-2">
      <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      <div
        className={cn(
          'flex h-[720px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------------------------------- Page ----------------------------------- */

export function PanelLab() {
  const [state, setState] = useState<LabState>(DEFAULTS)

  const set =
    <K extends keyof LabState>(key: K) =>
    (value: LabState[K]) =>
      setState((prev) => ({ ...prev, [key]: value }))

  const section = (keys: (keyof LabState)[]) => ({
    modified: keys.some((key) => state[key] !== DEFAULTS[key]),
    onReset: () =>
      setState((prev) => ({
        ...prev,
        ...(Object.fromEntries(
          keys.map((key) => [key, DEFAULTS[key]]),
        ) as Partial<LabState>),
      })),
  })

  const lab: Lab = { state, set, section }

  return (
    <div className="flex min-h-svh flex-col gap-8 px-8 py-12">
      <div className="flex max-w-lg flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-fg">Panel Lab</h1>
        <p className="text-sm text-fg-muted">
          The /create control panel rebuilt in the row language. v1 is the whole
          panel, frozen; each section then gets its own frame to be enhanced in
          and read back against v1. One shared state drives every frame.
        </p>
      </div>

      {/* `w-max` + `mx-auto`: centered while the row fits, and once it
          overflows the margins collapse so v1 stays reachable at the start. */}
      <div className="overflow-x-auto pb-8">
        <div className="mx-auto flex w-max items-start gap-10">
          {/* The real panel sits on the page bg — no card chrome around it. */}
          <Frame label="v1" className="rounded-none border-0 bg-transparent">
            <CardsFrame lab={lab} />
          </Frame>
          {WORKING_CHAPTERS.map((chapter) => (
            <SectionFrame key={chapter.id} chapter={chapter} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  )
}
