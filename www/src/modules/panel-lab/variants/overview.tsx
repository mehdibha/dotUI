'use client'

/* Overview cards — dashboard-first: every section is a live summary card in a
   2-col grid; selecting one opens its full controls below. Question: does
   overview-first navigation beat a straight scroll — the whole system at a
   glance, drill only where needed? */

import { useEffect, useRef, useState } from 'react'
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from 'react-aria-components'

import { Button } from '@/registry/ui/button'

import {
  BUTTON_STYLES,
  CLUSTERS,
  COLOR_KEYS,
  COMPONENT_KEYS,
  DENSITY_OPTIONS,
  EFFECT_KEYS,
  ICON_KEYS,
  ICON_LIBRARY_OPTIONS,
  labelOf,
  SHADOW_OPTIONS,
  SHAPE_KEYS,
  TYPE_KEYS,
} from '../data'
import type { Lab, LabState } from '../data'
import { RampStrip, SwatchDots, TypeSpecimen } from '../patterns'
import {
  ColorSection,
  ComponentsSection,
  EffectsSection,
  IconsSection,
  IconStrip,
  ShapeSection,
  TypographySection,
} from '../sections'

const COMPONENT_COUNT = CLUSTERS.reduce((n, c) => n + c.items.length, 0)

const CARD =
  'flex cursor-interactive flex-col gap-2 rounded-xl bg-muted p-2.5 text-left focus-reset transition-[background-color,transform] hover:bg-highlight focus-visible:focus-ring motion-safe:pressed:scale-[0.98] selected:inset-ring-2 selected:inset-ring-accent'

interface SectionCard {
  id: string
  label: string
  keys: (keyof LabState)[]
  specimen: (state: LabState) => React.ReactNode
  summary: (state: LabState) => React.ReactNode
  Content: (props: { lab: Lab }) => React.ReactNode
}

const CARDS: SectionCard[] = [
  {
    id: 'color',
    label: 'Color',
    keys: COLOR_KEYS,
    specimen: (s) => (
      <div className="flex flex-col gap-1.5">
        <RampStrip seeds={[s.brand, s.gray]} />
        <SwatchDots
          colors={[s.success, s.warning, s.danger, s.info, s.selection]}
        />
      </div>
    ),
    summary: (s) => <span className="font-mono uppercase">{s.brand}</span>,
    Content: ColorSection,
  },
  {
    id: 'typography',
    label: 'Typography',
    keys: TYPE_KEYS,
    specimen: (s) => <TypeSpecimen heading={s.headingFont} body={s.bodyFont} />,
    summary: (s) => s.headingFont,
    Content: TypographySection,
  },
  {
    id: 'icons',
    label: 'Icons',
    keys: ICON_KEYS,
    specimen: (s) => <IconStrip stroke={s.iconStroke} />,
    summary: (s) => (
      <>
        {labelOf(ICON_LIBRARY_OPTIONS, s.iconLibrary)} ·{' '}
        {s.iconStroke.toFixed(2)}
      </>
    ),
    Content: IconsSection,
  },
  {
    id: 'shape',
    label: 'Shape',
    keys: SHAPE_KEYS,
    specimen: (s) => (
      <div className="flex justify-center py-1.5">
        {/* Tile wearing the current radius — same curve as the Radius row. */}
        <span
          className="h-9 w-16 border border-border-field bg-bg/50"
          style={{ borderRadius: `${4 + s.radius * 10}px` }}
        />
      </div>
    ),
    summary: (s) => (
      <>
        {s.radius.toFixed(2)}× · {labelOf(DENSITY_OPTIONS, s.density)}
      </>
    ),
    Content: ShapeSection,
  },
  {
    id: 'effects',
    label: 'Effects',
    keys: EFFECT_KEYS,
    specimen: (s) => (
      <div className="flex justify-center py-1.5">
        {SHADOW_OPTIONS.find((o) => o.id === s.shadows)?.preview}
      </div>
    ),
    summary: (s) => (
      <>{SHADOW_OPTIONS.find((o) => o.id === s.shadows)?.label} shadows</>
    ),
    Content: EffectsSection,
  },
  {
    id: 'components',
    label: 'Components',
    keys: COMPONENT_KEYS,
    specimen: (s) => (
      <div className="flex justify-center py-1.5">
        {BUTTON_STYLES.find((o) => o.id === s.buttonStyle)?.preview}
      </div>
    ),
    summary: (s) => (
      <>
        {BUTTON_STYLES.find((o) => o.id === s.buttonStyle)?.label} button ·{' '}
        {COMPONENT_COUNT} styled
      </>
    ),
    Content: ComponentsSection,
  },
]

export function OverviewFrame({ lab }: { lab: Lab }) {
  const [selected, setSelected] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected)
      detailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
  }, [selected])

  const active = CARDS.find((card) => card.id === selected)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-11 shrink-0 items-center border-b border-border/40 px-4">
        <span className="truncate text-[0.8125rem] font-semibold text-fg">
          Acme design system
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 *:shrink-0">
        <RacToggleButtonGroup
          aria-label="Sections"
          selectionMode="single"
          selectedKeys={selected ? [selected] : []}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            setSelected((next as string) ?? null)
          }}
          className="grid grid-cols-2 gap-2"
        >
          {CARDS.map((card) => {
            const { modified } = lab.section(card.keys)
            return (
              <RacToggleButton key={card.id} id={card.id} className={CARD}>
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-fg">
                    {card.label}
                  </span>
                  {modified && (
                    <span className="size-1 shrink-0 rounded-full bg-accent" />
                  )}
                </span>
                <div className="flex flex-1 flex-col justify-center">
                  {card.specimen(lab.state)}
                </div>
                <span className="truncate text-[11px] text-fg-muted">
                  {card.summary(lab.state)}
                </span>
              </RacToggleButton>
            )
          })}
        </RacToggleButtonGroup>

        {active ? (
          <div ref={detailRef} className="flex flex-col gap-1.5">
            <active.Content lab={lab} />
          </div>
        ) : (
          <p className="px-4 text-center text-xs/relaxed text-fg-muted">
            The whole system at a glance — select a card to open its controls.
          </p>
        )}
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-border/40 p-3">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </footer>
    </div>
  )
}
