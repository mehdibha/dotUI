'use client'

import { useMemo, useState } from 'react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { usePanelConfig } from './config'
import { MacroFrontDoor } from './macros'
import { ControlRow, SectionHeading } from './primitives'
import { ALL_CONTROLS, sectionsFor } from './schema'
import type { Control, Section } from './types'

/* ----------------------------------------------------------------------------
 * Layouts render the SAME sections through materially different IA. They share
 * one input — the section list for the current grouping, filtered by the
 * advanced toggle — and differ only in navigation shape.
 * -------------------------------------------------------------------------- */

function useVisibleSections(): Section[] {
  const { config } = usePanelConfig()
  const sections = sectionsFor(config.grouping)
  if (config.advanced) return sections
  // Hobbyist front door: macros only.
  return sections
    .map((s) => ({
      ...s,
      controls: s.controls.filter((ctrl) => ctrl.tempo === 'macro'),
    }))
    .filter((s) => s.controls.length > 0)
}

function ControlList({ controls }: { controls: Control[] }) {
  const { config } = usePanelConfig()
  return (
    <div
      className={cn(
        'flex flex-col',
        config.density === 'compact' ? 'gap-3.5' : 'gap-5',
      )}
    >
      {controls.map((control) => (
        <ControlRow key={control.id} control={control} />
      ))}
    </div>
  )
}

/* ------------------------------ Long scroll ------------------------------ */

function ScrollLayout({ sections }: { sections: Section[] }) {
  return (
    <div className="flex flex-col gap-7 px-3 pt-3 pb-6">
      {sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-3">
          <SectionHeading
            icon={section.icon}
            label={section.label}
            count={section.controls.length}
            className="sticky top-0 z-10 -mx-3 bg-card/85 px-3 py-1.5 backdrop-blur-sm"
          />
          <ControlList controls={section.controls} />
        </section>
      ))}
    </div>
  )
}

/* --------------------------------- Tabs ---------------------------------- */

function TabsLayout({ sections }: { sections: Section[] }) {
  if (sections.length === 0) return null
  return (
    <Tabs defaultSelectedKey={sections[0]?.id} className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 scrollbar-none overflow-x-auto bg-card/85 px-3 pt-3 backdrop-blur-sm">
        <TabList className="w-max">
          {sections.map((section) => (
            <Tab key={section.id} id={section.id} className="gap-1.5">
              <section.icon className="size-3.5" />
              {section.label}
            </Tab>
          ))}
        </TabList>
      </div>
      {sections.map((section) => (
        <TabPanel key={section.id} id={section.id} className="px-3 pb-6">
          <ControlList controls={section.controls} />
        </TabPanel>
      ))}
    </Tabs>
  )
}

/* ------------------------------- Accordion ------------------------------- */

function AccordionLayout({ sections }: { sections: Section[] }) {
  return (
    <div className="flex flex-col px-3 pt-2 pb-6">
      {sections.map((section, i) => (
        <Disclosure
          key={section.id}
          defaultExpanded={i === 0}
          className="border-b"
        >
          <DisclosureTrigger className="py-3">
            <SectionHeading
              icon={section.icon}
              label={section.label}
              count={section.controls.length}
            />
          </DisclosureTrigger>
          <DisclosurePanel>
            <div className="pt-1">
              <ControlList controls={section.controls} />
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  )
}

/* -------------------------------- Sidebar -------------------------------- */

function SidebarLayout({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  const current = sections.find((s) => s.id === active) ?? sections[0]
  if (!current) return null
  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex shrink-0 flex-col gap-1 border-r p-2">
        {sections.map((section) => {
          const isActive = section.id === current.id
          return (
            <Tooltip key={section.id} delay={300}>
              <ButtonPrimitives.Button
                onPress={() => setActive(section.id)}
                className={cn(
                  'flex size-9 items-center justify-center rounded-md focus-reset transition-colors focus-visible:focus-ring',
                  isActive
                    ? 'text-primary-fg bg-primary'
                    : 'text-fg-muted hover:bg-neutral hover:text-fg',
                )}
              >
                <section.icon className="size-4" />
              </ButtonPrimitives.Button>
              <TooltipContent placement="right">{section.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      <div className="min-w-0 flex-1 overflow-y-auto p-3">
        <SectionHeading
          icon={current.icon}
          label={current.label}
          count={current.controls.length}
          className="mb-3"
        />
        <ControlList controls={current.controls} />
      </div>
    </div>
  )
}

/* ----------------------------- Command-first ----------------------------- */

function matches(control: Control, query: string): boolean {
  const t = query.trim().toLowerCase()
  if (!t) return true
  return (
    control.label.toLowerCase().includes(t) ||
    control.domain.includes(t) ||
    control.tier.includes(t) ||
    (control.keywords?.some((k) => k.includes(t)) ?? false)
  )
}

function CommandLayout({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState('')
  const allowed = useMemo(
    () => new Set(sections.flatMap((s) => s.controls.map((ctrl) => ctrl.id))),
    [sections],
  )
  const results = useMemo(
    () => ALL_CONTROLS.filter((c) => allowed.has(c.id) && matches(c, query)),
    [allowed, query],
  )
  return (
    <div className="flex flex-col gap-4 p-3">
      <SearchField
        aria-label="Search controls"
        autoFocus
        value={query}
        onChange={setQuery}
        className="w-full"
      >
        <Input placeholder="Search every control…" className="w-full" />
      </SearchField>
      {results.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-fg-muted">
          No control matches “{query}”.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {results.map((control) => (
            <div key={control.id} className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] tracking-wide text-fg-muted/70 uppercase">
                {control.domain} · {control.tier}
              </span>
              <ControlRow control={control} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ Dispatcher ------------------------------- */

export function PanelBody() {
  const { config } = usePanelConfig()
  const sections = useVisibleSections()

  const macros = config.showMacros ? (
    <div className="px-3 pt-3">
      <MacroFrontDoor />
    </div>
  ) : null

  // Sidebar manages its own scroll/height; the others scroll as one column.
  if (config.layout === 'sidebar') {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {macros}
        <SidebarLayout sections={sections} />
      </div>
    )
  }

  const body =
    config.layout === 'tabs' ? (
      <TabsLayout sections={sections} />
    ) : config.layout === 'accordion' ? (
      <AccordionLayout sections={sections} />
    ) : config.layout === 'command' ? (
      <CommandLayout sections={sections} />
    ) : (
      <ScrollLayout sections={sections} />
    )

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {macros}
      {body}
    </div>
  )
}
