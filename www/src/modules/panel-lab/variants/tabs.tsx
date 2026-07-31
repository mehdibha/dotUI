'use client'

/* Sectioned tabs — an icon tab bar replaces the story scroll: exactly one
   section on screen at a time. The question: does killing the scroll make the
   panel feel calmer, or fragmented? */

import {
  BoxSelectIcon,
  PaletteIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
} from 'lucide-react'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'

import { Button } from '@/registry/ui/button'

import {
  COLOR_KEYS,
  COMPONENT_KEYS,
  EFFECT_KEYS,
  ICON_KEYS,
  SHAPE_KEYS,
  TYPE_KEYS,
} from '../data'
import type { Lab, LabState } from '../data'
import {
  ColorSection,
  ComponentsSection,
  EffectsSection,
  IconsSection,
  ShapeSection,
  TypographySection,
} from '../sections'

interface TabEntry {
  id: string
  label: string
  icon: typeof PaletteIcon
  keys: (keyof LabState)[]
  render: (lab: Lab) => React.ReactNode
}

const TABS: TabEntry[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    keys: COLOR_KEYS,
    render: (lab) => <ColorSection lab={lab} />,
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: TypeIcon,
    keys: TYPE_KEYS,
    render: (lab) => <TypographySection lab={lab} />,
  },
  {
    id: 'icons',
    label: 'Icons',
    icon: SmileIcon,
    keys: ICON_KEYS,
    render: (lab) => <IconsSection lab={lab} />,
  },
  {
    id: 'shape',
    label: 'Shape',
    icon: ShapesIcon,
    keys: SHAPE_KEYS,
    render: (lab) => <ShapeSection lab={lab} />,
  },
  {
    id: 'effects',
    label: 'Effects',
    icon: SlidersHorizontalIcon,
    keys: EFFECT_KEYS,
    render: (lab) => <EffectsSection lab={lab} />,
  },
  {
    id: 'components',
    label: 'Components',
    icon: BoxSelectIcon,
    keys: COMPONENT_KEYS,
    render: (lab) => <ComponentsSection lab={lab} />,
  },
]

export function TabsFrame({ lab }: { lab: Lab }) {
  const anyModified = TABS.some((tab) => lab.section(tab.keys).modified)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-11 shrink-0 items-center border-b border-border/40 px-4">
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
      </header>

      <Tabs defaultSelectedKey="color" className="flex min-h-0 flex-1 flex-col">
        <TabList
          aria-label="Panel sections"
          className="flex shrink-0 items-center gap-1 border-b border-border/40 px-3 py-2"
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              aria-label={tab.label}
              className="relative flex h-9 flex-1 cursor-interactive items-center justify-center rounded-lg text-fg-muted focus-reset transition-[background-color,color] hover:bg-muted/60 hover:text-fg focus-visible:focus-ring selected:bg-muted selected:text-fg"
            >
              <tab.icon className="size-4" />
              {lab.section(tab.keys).modified && (
                <span
                  aria-label="Modified"
                  className="absolute top-1.5 right-2 size-1 rounded-full bg-accent"
                />
              )}
            </Tab>
          ))}
        </TabList>

        {TABS.map((tab) => (
          <TabPanel
            key={tab.id}
            id={tab.id}
            className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 focus-reset *:shrink-0 focus-visible:focus-ring"
          >
            {tab.render(lab)}
          </TabPanel>
        ))}
      </Tabs>

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
