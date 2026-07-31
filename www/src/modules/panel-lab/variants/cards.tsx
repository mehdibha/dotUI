'use client'

/* Chapter cards — the CURRENT /create panel layout (control-panel.tsx): every
   section its own bordered card in a story scroll, floating glass header and
   footer bars the cards dip under. The reference frame: the new row controls
   inside today's chrome, so directions are judged against what ships. */

import {
  BoxSelectIcon,
  ChevronsUpDownIcon,
  PaletteIcon,
  RotateCcwIcon,
  SearchIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
} from 'lucide-react'

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
  ColorSectionBody,
  ComponentsSectionBody,
  EffectsSectionBody,
  IconsSectionBody,
  ShapeSectionBody,
  TypographySectionBody,
} from '../sections'

const CHAPTERS: {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  keys: (keyof LabState)[]
  Body: React.ComponentType<{ lab: Lab }>
}[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    keys: COLOR_KEYS,
    Body: ColorSectionBody,
  },
  {
    id: 'typography',
    label: 'Type',
    icon: TypeIcon,
    keys: TYPE_KEYS,
    Body: TypographySectionBody,
  },
  {
    id: 'icons',
    label: 'Icons',
    icon: SmileIcon,
    keys: ICON_KEYS,
    Body: IconsSectionBody,
  },
  {
    id: 'shape',
    label: 'Shape & space',
    icon: ShapesIcon,
    keys: SHAPE_KEYS,
    Body: ShapeSectionBody,
  },
  {
    id: 'details',
    label: 'Details',
    icon: SlidersHorizontalIcon,
    keys: EFFECT_KEYS,
    Body: EffectsSectionBody,
  },
  {
    id: 'components',
    label: 'Components',
    icon: BoxSelectIcon,
    keys: COMPONENT_KEYS,
    Body: ComponentsSectionBody,
  },
]

/** The real panel's ChapterHeading: icon, label, modified dot, reset. */
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

export function CardsFrame({ lab }: { lab: Lab }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Floating glass header — cards dip under it, never past it. */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 rounded-xl border border-border/45 bg-neutral/90 p-1.5 shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
        <Button
          variant="quiet"
          size="sm"
          className="min-w-0 justify-start gap-1.5 font-medium"
        >
          <span className="truncate">Acme design system</span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </Button>
        <Button
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Search controls"
          className="shrink-0"
        >
          <SearchIcon />
        </Button>
      </div>

      {/* The story scroll: every chapter its own card. */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl pt-[56px] pb-[62px] *:shrink-0">
        {CHAPTERS.map(({ id, label, icon, keys, Body }) => {
          const status = lab.section(keys)
          return (
            <section
              key={id}
              className="rounded-xl border border-border/45 bg-card p-3"
            >
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
        })}
      </div>

      {/* Floating glass footer — same treatment as the header. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-xl border border-border/45 bg-neutral/90 p-2 shadow-[0_-4px_16px_-4px_rgb(0_0_0/0.2),0_-2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </div>
    </div>
  )
}
