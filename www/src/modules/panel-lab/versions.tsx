'use client'

/* The versions of the /create panel. Each version is the WHOLE panel — same
   chrome, its own chapter list — so they're read against each other end to
   end rather than section by section.

   Adding a version: copy the previous list, point the chapters you're
   changing at NEW body components, and append it below. Never edit a body an
   older version still names, or that version moves with the experiment and
   stops being a reference. */

import {
  BoxSelectIcon,
  PaletteIcon,
  ShapesIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  StretchVerticalIcon,
  TypeIcon,
} from 'lucide-react'

import { IdealColorSectionBody } from './color-ideal'
import { WorkingColorSectionBody } from './color-working'
import {
  COLOR_KEYS,
  COMPONENT_KEYS,
  EFFECT_KEYS,
  ICON_KEYS,
  SHAPE_KEYS,
  SHAPE_KEYS_V2,
  SPACE_KEYS_V2,
  TYPE_KEYS,
  WORKING_COLOR_KEYS,
} from './data'
import {
  ComponentsSectionBody,
  EffectsSectionBody,
  IconsSectionBody,
  ShapeSectionBody,
  ShapeSectionBodyV2,
  SpaceSectionBody,
  TypographySectionBody,
} from './sections'
import type { Chapter } from './variants/chapter'

/* The chapters every version shares so far — only Color has diverged. */
const SHARED_CHAPTERS: Chapter[] = [
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

export interface PanelVersion {
  id: string
  label: string
  /** One line on what this version changes — shown on its gallery card. */
  summary: string
  chapters: Chapter[]
}

export const PANEL_VERSIONS: PanelVersion[] = [
  {
    id: 'v1',
    label: 'v1',
    summary:
      'The baseline. Engine-true Color section with a fixed light/dark pair.',
    chapters: [
      {
        id: 'color',
        label: 'Color',
        icon: PaletteIcon,
        keys: COLOR_KEYS,
        Body: IdealColorSectionBody,
      },
      ...SHARED_CHAPTERS,
    ],
  },
  {
    id: 'v2',
    label: 'v2 (wip)',
    summary:
      'Color modes become a user-defined set — one to many, with archetypes and per-mode contrast. Shape and Space split; radius speaks px (#575) with a nested-corner preview and a corner-shape axis.',
    chapters: [
      {
        id: 'color',
        label: 'Color',
        icon: PaletteIcon,
        keys: WORKING_COLOR_KEYS,
        Body: WorkingColorSectionBody,
      },
      ...SHARED_CHAPTERS.flatMap((chapter) =>
        chapter.id === 'shape'
          ? [
              {
                id: 'shape',
                label: 'Shape',
                icon: ShapesIcon,
                keys: SHAPE_KEYS_V2,
                Body: ShapeSectionBodyV2,
              },
              {
                id: 'space',
                label: 'Space',
                icon: StretchVerticalIcon,
                keys: SPACE_KEYS_V2,
                Body: SpaceSectionBody,
              },
            ]
          : [chapter],
      ),
    ],
  },
]

export function findVersion(id: string): PanelVersion | undefined {
  return PANEL_VERSIONS.find((version) => version.id === id)
}
