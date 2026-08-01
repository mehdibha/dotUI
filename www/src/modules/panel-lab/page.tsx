'use client'

/* Panel Lab — the entire /create control panel recreated in the control-lab
   row language, explored as a canvas of design directions (Figma-style
   frames) driven by ONE shared design-system state. Derived from the real
   builder schema; design only: local state, nothing wired into /create. */

import { useState } from 'react'

import { cn } from '@/registry/lib/utils'

import { DEFAULTS } from './data'
import type { Lab, LabState } from './data'
import { CardsFrame } from './variants/cards'

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
          The entire /create control panel rebuilt in the row language — the
          current chapter-cards chrome carrying the ideal, engine-true Color
          section.
        </p>
      </div>

      <div className="flex items-start justify-center gap-10 overflow-x-auto pb-8">
        {/* The real panel sits on the page bg — no card chrome around it. */}
        <Frame
          label="Chapter cards — ideal Color section"
          className="rounded-none border-0 bg-transparent"
        >
          <CardsFrame lab={lab} />
        </Frame>
      </div>
    </div>
  )
}
