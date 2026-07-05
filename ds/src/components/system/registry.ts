import type { ComponentType } from 'react'

import type { CatalogEntry, SystemEntry } from '@/data/schema'

import { ColorSection } from './sections/color'
import { ComponentsSection } from './sections/components'
import { ElevationSection } from './sections/elevation'
import { IconsSection } from './sections/icons'
import { IllustrationSection } from './sections/illustration'
import { LayoutSection } from './sections/layout'
import { LayoutPrimitivesSection } from './sections/layout-primitives'
import { MotionSection } from './sections/motion'
import { OverviewSection } from './sections/overview'
import { ColorSystemSection } from './sections/shadcn/color-system'
import { ColorsSection } from './sections/shadcn/colors'
import { TokensSection } from './sections/shadcn/tokens'
import { ShapeSection } from './sections/shape'
import { SpacingSection } from './sections/spacing'
import { StatesSection } from './sections/states'
import { StatusStatesSection } from './sections/status-states'
import { TokenComponentsSection } from './sections/token-components'
import { TokenDocsSection } from './sections/token-docs'
import { TokenModesSection } from './sections/token-modes'
import { TokenNamingSection } from './sections/token-naming'
import { TokenPipelineSection } from './sections/token-pipeline'
import { TokenTaxonomySection } from './sections/token-taxonomy'
import { TokenTiersSection } from './sections/token-tiers'
import { TypographySection } from './sections/typography'
import { ValidationSection } from './sections/validation'

export type SectionComponent = ComponentType<{
  system: SystemEntry
  catalogEntry?: CatalogEntry
}>

export interface SectionDef {
  id: string
  label: string
  Component: SectionComponent
}

export interface SectionGroup {
  id: string
  label: string
  blurb: string
  sections: SectionDef[]
}

// Preserved Spectrum 2 explorer. Currently shelved (spectrum-2 is "planned"), so
// it isn't resolved by any slug — its sections read system.colors and are cast to
// the colors-optional SectionComponent, safe because they only ran with color data.
const SPECTRUM_2_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    blurb: 'Measured from the source of truth.',
    sections: [
      { id: 'overview', label: 'Overview', Component: OverviewSection },
    ],
  },
  {
    id: 'design-tokens',
    label: 'Design Tokens',
    blurb: 'The data substrate everything else resolves through.',
    sections: [
      {
        id: 'token-tiers',
        label: 'Tier Architecture',
        Component: TokenTiersSection,
      },
      {
        id: 'token-taxonomy',
        label: 'Type Taxonomy',
        Component: TokenTaxonomySection,
      },
      {
        id: 'token-naming',
        label: 'Naming Grammar',
        Component: TokenNamingSection,
      },
      {
        id: 'token-pipeline',
        label: 'Platform Pipeline',
        Component: TokenPipelineSection,
      },
      {
        id: 'token-modes',
        label: 'Theme & Mode',
        Component: TokenModesSection,
      },
      {
        id: 'token-components',
        label: 'Component Coverage',
        Component: TokenComponentsSection,
      },
      {
        id: 'token-docs',
        label: 'Docs & Tooling',
        Component: TokenDocsSection,
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    blurb:
      'The visual language, ordered by how much weight each decision carries.',
    sections: [
      { id: 'color', label: 'Color', Component: ColorSection },
      { id: 'typography', label: 'Typography', Component: TypographySection },
      { id: 'motion', label: 'Motion', Component: MotionSection },
      { id: 'spacing', label: 'Spacing & Density', Component: SpacingSection },
      { id: 'shape', label: 'Shape & Radius', Component: ShapeSection },
      { id: 'icons', label: 'Iconography', Component: IconsSection },
      { id: 'elevation', label: 'Elevation', Component: ElevationSection },
      { id: 'layout', label: 'Layout & Grid', Component: LayoutSection },
      { id: 'states', label: 'Interaction States', Component: StatesSection },
      {
        id: 'illustration',
        label: 'Illustration',
        Component: IllustrationSection,
      },
      {
        id: 'validation',
        label: 'Form Validation',
        Component: ValidationSection,
      },
      {
        id: 'status-states',
        label: 'Empty & Loading',
        Component: StatusStatesSection,
      },
    ],
  },
  {
    id: 'components',
    label: 'Components & Patterns',
    blurb: 'Primitives and the component catalog.',
    sections: [
      {
        id: 'layout-primitives',
        label: 'Layout Primitives',
        Component: LayoutPrimitivesSection,
      },
      {
        id: 'components',
        label: 'Component Library',
        Component: ComponentsSection,
      },
    ],
  },
] as unknown as SectionGroup[]

const SHADCN_UI_GROUPS: SectionGroup[] = [
  {
    id: 'overview',
    label: 'Sections',
    blurb: '',
    sections: [
      {
        id: 'color-system',
        label: 'Color system',
        Component: ColorSystemSection,
      },
      { id: 'colors', label: 'Colors', Component: ColorsSection },
      { id: 'tokens', label: 'Tokens', Component: TokensSection },
    ],
  },
]

const GROUPS_BY_SLUG: Record<string, SectionGroup[]> = {
  'spectrum-2': SPECTRUM_2_GROUPS,
  'shadcn-ui': SHADCN_UI_GROUPS,
}

export function getSectionGroups(slug: string): SectionGroup[] {
  return GROUPS_BY_SLUG[slug] ?? []
}

/** Flat id + label list of a system's sections, for the TOC lines and dropdown. */
export function getSectionList(slug: string): { id: string; label: string }[] {
  return getSectionGroups(slug).flatMap((group) =>
    group.sections.map(({ id, label }) => ({ id, label })),
  )
}
