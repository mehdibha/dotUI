'use client'

/* The working frames — one per section, each just that section's card on its
   own. This is where a section gets enhanced; v1 (cards.tsx) stays put as the
   reference to judge it against.

   To enhance a section: write a NEW body component and point that section's
   entry below at it. v1 keeps naming the old body, so it doesn't move. First
   experiment: Color v2 (color-v2.tsx), which also splits backgrounds out into
   a Surfaces section v1 doesn't have. */

import {
  BoxSelectIcon,
  LayersIcon,
  PaletteIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
} from 'lucide-react'

import { ColorSectionV2Body, SurfacesSectionBody } from '../color-v2'
import {
  COLOR_V2_KEYS,
  COMPONENT_KEYS,
  EFFECT_KEYS,
  ICON_KEYS,
  SHAPE_KEYS,
  SURFACE_KEYS,
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

export const WORKING_CHAPTERS: Chapter[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    keys: COLOR_V2_KEYS,
    Body: ColorSectionV2Body,
  },
  {
    id: 'surfaces',
    label: 'Surfaces',
    icon: LayersIcon,
    keys: SURFACE_KEYS,
    Body: SurfacesSectionBody,
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

/**
 * One section on its own: the same card v1 renders, at panel width, hugging
 * its content instead of filling a 720px panel — the section is the subject,
 * so nothing else competes for the frame.
 */
export function SectionFrame({ chapter, lab }: { chapter: Chapter; lab: Lab }) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-2">
      <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
        {chapter.label}
      </span>
      <ChapterCard chapter={chapter} lab={lab} />
    </div>
  )
}
