'use client'

/**
 * The Studio section registry — the single source of truth for the icon rail,
 * the content router and command search.
 *
 * Organized by the TIER axis (token altitude) rather than by feature domain:
 * a Brand front door, then Primitives → Semantic → Components. Each entry owns
 * its icon, label, search terms, and the component that renders its controls.
 */

import type { ComponentType } from 'react'
import {
  BlocksIcon,
  BoxSelectIcon,
  type LucideIcon,
  SparklesIcon,
  TagsIcon,
} from 'lucide-react'

import { BrandSection } from './brand'
import { ComponentsSection } from './components-section'
import { PrimitivesSection, SemanticSection } from './tiers'

/** Rail groupings — a hairline separates the front door, the global token
 *  tiers, and the per-component layer. */
export type SectionGroup = 'start' | 'foundations' | 'components'

export interface StudioSection {
  id: string
  label: string
  icon: LucideIcon
  group: SectionGroup
  /** Extra terms that should surface this section in command search. */
  keywords: string[]
  Content: ComponentType
}

export const STUDIO_SECTIONS: StudioSection[] = [
  {
    id: 'brand',
    label: 'Brand',
    icon: SparklesIcon,
    group: 'start',
    keywords: [
      'seed',
      'preset',
      'vibe',
      'generate',
      'accent',
      'theme',
      'color',
    ],
    Content: BrandSection,
  },
  {
    id: 'primitives',
    label: 'Primitives',
    icon: BlocksIcon,
    group: 'foundations',
    keywords: [
      'seed',
      'palette',
      'ramp',
      'algorithm',
      'oklch',
      'font',
      'type',
      'radius',
      'density',
      'spacing',
      'border',
      'icon',
      'stroke',
      'raw',
      'token',
    ],
    Content: PrimitivesSection,
  },
  {
    id: 'semantic',
    label: 'Semantic',
    icon: TagsIcon,
    group: 'foundations',
    keywords: [
      'role',
      'contrast',
      'gray',
      'neutral',
      'foundation',
      'cursor',
      'focus',
      'ring',
      'elevation',
      'shadow',
      'blur',
      'glass',
      'motion',
      'duration',
      'easing',
      'mode',
      'dark',
      'light',
    ],
    Content: SemanticSection,
  },
  {
    id: 'components',
    label: 'Components',
    icon: BoxSelectIcon,
    group: 'components',
    keywords: ['button', 'input', 'card', 'component', 'variant', 'anatomy'],
    Content: ComponentsSection,
  },
]

export const DEFAULT_SECTION = 'brand'

export function findSection(id: string | undefined): StudioSection {
  return STUDIO_SECTIONS.find((s) => s.id === id) ?? STUDIO_SECTIONS[0]!
}

/** Section matches for a command-search query (label or keyword hit). */
export function searchSections(query: string): StudioSection[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return STUDIO_SECTIONS.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q)),
  )
}
