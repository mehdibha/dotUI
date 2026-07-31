'use client'

/* Panel Lab — the entire /create control panel recreated in the control-lab
   row language, explored as a canvas of design directions (Figma-style
   frames) all driven by ONE shared design-system state. Derived from the real
   builder schema; design only: local state, nothing wired into /create. */

import { useState } from 'react'
import { Redo2Icon, SearchIcon, ShuffleIcon, Undo2Icon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { ACCENT_POOL, BUTTON_STYLES, DEFAULTS } from './data'
import type { Lab, LabState } from './data'
import {
  ColorSection,
  ComponentsSection,
  EffectsSection,
  IconsSection,
  ShapeSection,
  TypographySection,
} from './sections'
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

/* ------------------------------ Baseline frame ------------------------------ */

/** The baseline: card shell, story scroll of grouped-row sections. */
function BaselineFrame({
  lab,
  onShuffle,
  anyModified,
}: {
  lab: Lab
  onShuffle: () => void
  anyModified: boolean
}) {
  return (
    <Frame label="Baseline — story scroll">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border/40 pr-1.5 pl-4">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[0.8125rem] font-semibold text-fg">
            Acme design system
          </span>
          {anyModified && (
            <span
              aria-label="Unsaved changes"
              className="size-1.5 shrink-0 rounded-full bg-fg-muted"
            />
          )}
        </span>
        <span className="flex shrink-0 items-center">
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Shuffle"
            onPress={onShuffle}
          >
            <ShuffleIcon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            isDisabled
            aria-label="Undo"
          >
            <Undo2Icon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            isDisabled
            aria-label="Redo"
          >
            <Redo2Icon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Search controls"
          >
            <SearchIcon />
          </Button>
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 *:shrink-0">
        <ColorSection lab={lab} />
        <TypographySection lab={lab} />
        <IconsSection lab={lab} />
        <ShapeSection lab={lab} />
        <EffectsSection lab={lab} />
        <ComponentsSection lab={lab} />
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-border/40 p-3">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </footer>
    </Frame>
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

  const anyModified = (Object.keys(DEFAULTS) as (keyof LabState)[]).some(
    (key) => state[key] !== DEFAULTS[key],
  )

  const shuffle = () =>
    setState((prev) => ({
      ...prev,
      brand:
        ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)] ??
        prev.brand,
      buttonStyle:
        BUTTON_STYLES[Math.floor(Math.random() * BUTTON_STYLES.length)]?.id ??
        prev.buttonStyle,
    }))

  return (
    <div className="flex min-h-svh flex-col gap-8 px-8 py-12">
      <div className="flex max-w-lg flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-fg">Panel Lab</h1>
        <p className="text-sm text-fg-muted">
          The entire /create control panel as a canvas of design directions —
          one shared design-system state rendered through every frame. Edit in
          any frame; the others follow.
        </p>
      </div>

      <div className="flex items-start gap-10 overflow-x-auto pb-8">
        {/* The real panel sits on the page bg — no card chrome around it. */}
        <Frame
          label="Current /create — chapter cards"
          className="rounded-none border-0 bg-transparent"
        >
          <CardsFrame lab={lab} />
        </Frame>
        <BaselineFrame
          lab={lab}
          onShuffle={shuffle}
          anyModified={anyModified}
        />
      </div>
    </div>
  )
}
