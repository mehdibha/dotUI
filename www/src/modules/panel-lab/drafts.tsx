'use client'

/* Drafts — the open PRs reworking a panel section, their actual bodies pulled
   in so each is previewed and usable here, not just linked.

   Several are competing takes on the SAME section (three at Color, two at
   Type), so this is a menu to choose from, not a changelog. A draft renders
   the full panel with its body swapped into the matching chapter, so it reads
   against v1/v2 end to end.

   Their state keys live in data.tsx under "Draft-only state". When a draft
   wins, fold its body into a new version and delete the entry. */

import { LayersIcon, PaletteIcon, SmileIcon, TypeIcon } from 'lucide-react'

import { ICON_KEYS, TYPE_KEYS, WORKING_COLOR_KEYS, type LabState } from './data'
import {
  ColorSectionV2Body as Color560,
  SurfacesSectionBody as Surfaces560,
} from './drafts/color-560'
import {
  ColorSectionV2Body as Color561,
  SurfacesSectionBody as Surfaces561,
} from './drafts/color-561'
import { ColorSectionV2Body as Color562 } from './drafts/color-562'
import { IdealIconsSectionBody as Icons564 } from './drafts/icons-564'
import { SurfacesSectionBody as Surfaces562 } from './drafts/surfaces-562'
import { IdealTypeSectionBody as Type563 } from './drafts/type-563'
import { IdealTypeSectionBody as Type565 } from './drafts/type-565'
import type { Chapter } from './variants/chapter'

const SURFACE_KEYS: (keyof LabState)[] = [
  'shadows',
  'overlayMaterial',
  'modalBlur',
  'modalBackdrop',
]
const TYPE_563_KEYS: (keyof LabState)[] = [
  ...TYPE_KEYS,
  'headingWeight',
  'headingTracking',
  'baseSize',
  'typeScale',
]
const TYPE_565_KEYS: (keyof LabState)[] = [
  ...TYPE_KEYS,
  'headingWeight',
  'headingTrackingEm',
  'typeBase',
  'typeRatio',
  'bodyLeading',
]
const ICON_564_KEYS: (keyof LabState)[] = [
  ...ICON_KEYS,
  'iconStrokeAuto',
  'iconScale',
]

const colorChapter = (Body: Chapter['Body']): Chapter => ({
  id: 'color',
  label: 'Color',
  icon: PaletteIcon,
  keys: WORKING_COLOR_KEYS,
  Body,
})

const surfacesChapter = (Body: Chapter['Body']): Chapter => ({
  id: 'surfaces',
  label: 'Surfaces',
  icon: LayersIcon,
  keys: SURFACE_KEYS,
  Body,
})

export interface Draft {
  id: string
  pr: number
  title: string
  /** What this draft explores, and how it differs from its siblings. */
  summary: string
  /** The section it reworks — drafts sharing one are alternatives. */
  section: string
  /** Chapters replacing (by id) or extending the base version's list. */
  overrides: Chapter[]
}

export const DRAFTS: Draft[] = [
  {
    id: 'pr-560',
    pr: 560,
    section: 'Color',
    title: 'Color v2 and Surfaces frames',
    summary:
      'The first working-frame experiment: an enhanced Color body read against the frozen v1, with surfaces pulled out alongside it.',
    overrides: [colorChapter(Color560), surfacesChapter(Surfaces560)],
  },
  {
    id: 'pr-561',
    pr: 561,
    section: 'Color',
    title: 'Reworked color section, surfaces frame',
    summary:
      'A simpler, more flexible take on the same ground — fewer decisions up front, with surfaces given their own frame.',
    overrides: [colorChapter(Color561), surfacesChapter(Surfaces561)],
  },
  {
    id: 'pr-562',
    pr: 562,
    section: 'Color',
    title: 'Enhanced Color section, Surfaces split out',
    summary:
      'Keeps the Color body focused on the palette and moves every canvas decision into a dedicated Surfaces frame.',
    overrides: [colorChapter(Color562), surfacesChapter(Surfaces562)],
  },
  {
    id: 'pr-563',
    pr: 563,
    section: 'Type',
    title: 'Ideal Type section',
    summary:
      'Replaces the Type body following the lab convention, with a named tracking axis and an explicit type scale.',
    overrides: [
      {
        id: 'typography',
        label: 'Type',
        icon: TypeIcon,
        keys: TYPE_563_KEYS,
        Body: Type563,
      },
    ],
  },
  {
    id: 'pr-565',
    pr: 565,
    section: 'Type',
    title: 'Ideal Type section',
    summary:
      'The other Type take: a live hero, absent-means-default state, and depth behind DetailRows — tracking as a continuous em axis.',
    overrides: [
      {
        id: 'typography',
        label: 'Type',
        icon: TypeIcon,
        keys: TYPE_565_KEYS,
        Body: Type565,
      },
    ],
  },
  {
    id: 'pr-564',
    pr: 564,
    section: 'Icons',
    title: 'Ideal Icons section',
    summary:
      'The Icons frame rebuilt for real previews from the icon registry and a fuller axis set.',
    overrides: [
      {
        id: 'icons',
        label: 'Icons',
        icon: SmileIcon,
        keys: ICON_564_KEYS,
        Body: Icons564,
      },
    ],
  },
]

/** A draft's panel: the base chapters with its overrides swapped in by id,
 *  and any chapter it adds (Surfaces) appended after the one it extends. */
export function draftChapters(base: Chapter[], draft: Draft): Chapter[] {
  const byId = new Map(draft.overrides.map((c) => [c.id, c]))
  const merged = base.map((chapter) => byId.get(chapter.id) ?? chapter)
  const added = draft.overrides.filter((c) => !base.some((b) => b.id === c.id))
  if (added.length === 0) return merged
  // New chapters follow Color, which is what they were split out of.
  const at = merged.findIndex((c) => c.id === 'color') + 1
  return [...merged.slice(0, at), ...added, ...merged.slice(at)]
}

export function draftUrl(pr: number): string {
  return `https://github.com/mehdibha/dotUI/pull/${pr}`
}
