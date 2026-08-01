'use client'

/* v1 — the reference frame. The CURRENT /create panel layout
   (control-panel.tsx): every section its own bordered card in a story scroll,
   floating glass header and footer bars the cards dip under.

   FROZEN: this frame is the baseline every section experiment is judged
   against, so it must keep rendering what it renders today. V1_CHAPTERS below
   pins the bodies it uses. To enhance a section, write a NEW body and point
   the working list (section-frames.tsx) at it — never edit a body V1_CHAPTERS
   still names, or the reference moves with the experiment. */

import {
  BoxSelectIcon,
  ChevronsUpDownIcon,
  PaletteIcon,
  SearchIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'

import { IdealColorSectionBody } from '../color-ideal'
import {
  COLOR_KEYS,
  COMPONENT_KEYS,
  EFFECT_KEYS,
  ICON_KEYS,
  SHAPE_KEYS,
  TYPE_KEYS,
} from '../data'
import type { Lab } from '../data'
import {
  ComponentsSectionBody,
  EffectsSectionBody,
  IconsSectionBody,
  ShapeSectionBody,
  TypographySectionBody,
} from '../sections'
import { ChapterCard } from './chapter'
import type { Chapter } from './chapter'

const V1_CHAPTERS: Chapter[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    keys: COLOR_KEYS,
    Body: IdealColorSectionBody,
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
        {V1_CHAPTERS.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} lab={lab} />
        ))}
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
