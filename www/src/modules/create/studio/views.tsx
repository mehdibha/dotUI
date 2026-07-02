'use client'

import type { ComponentType, ReactNode } from 'react'
import {
  GaugeIcon,
  type LucideIcon,
  LayersIcon,
  MoonIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import { getComponentDisplayName } from '../components'
import { ComponentEditor, ComponentsBrowser } from './components-browser'
import {
  ChartColorsEditor,
  ColorEditor,
  ElevationEditor,
  IconsEditor,
  InteractionEditor,
  ModesEditor,
  MotionEditor,
  ShapeEditor,
  SpacingEditor,
  TypographyEditor,
} from './foundations'

/* ----------------------------------------------------------------------------
 * The single source of truth for what a navigation target shows. Home renders
 * the cards, the command palette indexes them, and the panel shell renders the
 * detail — all from this one registry, so they can never drift.
 * -------------------------------------------------------------------------- */

export interface FoundationDef {
  id: string
  label: string
  subtitle: string
  icon: LucideIcon
  /** Drives the live preview today (vs captured design intent applied on export). */
  live: boolean
  /** Visible in Simple mode (the rest appear only in Pro). */
  simple: boolean
  Editor: ComponentType
}

export const FOUNDATION_INDEX: FoundationDef[] = [
  {
    id: 'color',
    label: 'Color',
    subtitle: 'Seed one colour, or design every palette by hand.',
    icon: PaletteIcon,
    live: true,
    simple: true,
    Editor: ColorEditor,
  },
  {
    id: 'typography',
    label: 'Typography',
    subtitle: 'Fonts, scale, weight and tracking.',
    icon: TypeIcon,
    live: false,
    simple: true,
    Editor: TypographyEditor,
  },
  {
    id: 'shape',
    label: 'Shape & radius',
    subtitle: 'Corner radius and border weight.',
    icon: ShapesIcon,
    live: true,
    simple: true,
    Editor: ShapeEditor,
  },
  {
    id: 'spacing',
    label: 'Spacing & density',
    subtitle: 'How tight or roomy the whole UI feels.',
    icon: RulerIcon,
    live: true,
    simple: true,
    Editor: SpacingEditor,
  },
  {
    id: 'elevation',
    label: 'Elevation & depth',
    subtitle: 'Shadows, surfaces and the overall style family.',
    icon: LayersIcon,
    live: false,
    simple: false,
    Editor: ElevationEditor,
  },
  {
    id: 'motion',
    label: 'Motion',
    subtitle: 'Transition speed, easing and hover feel.',
    icon: ZapIcon,
    live: false,
    simple: false,
    Editor: MotionEditor,
  },
  {
    id: 'icons',
    label: 'Icons',
    subtitle: 'Icon library and stroke weight.',
    icon: SmileIcon,
    live: false,
    simple: false,
    Editor: IconsEditor,
  },
  {
    id: 'interaction',
    label: 'Interaction',
    subtitle: 'Cursors and focus rings.',
    icon: MousePointer2Icon,
    live: true,
    simple: false,
    Editor: InteractionEditor,
  },
  {
    id: 'modes',
    label: 'Light & dark',
    subtitle: 'Which appearance the system boots in.',
    icon: MoonIcon,
    live: false,
    simple: false,
    Editor: ModesEditor,
  },
  {
    id: 'chart-colors',
    label: 'Chart palette',
    subtitle: 'Categorical colours for data visualisation.',
    icon: GaugeIcon,
    live: true,
    simple: false,
    Editor: ChartColorsEditor,
  },
]

const foundationById = new Map(FOUNDATION_INDEX.map((f) => [f.id, f]))

export interface ResolvedView {
  title: string
  subtitle?: string
  node: ReactNode
}

/** Resolve a navigation target into a titled detail view for the panel shell. */
export function resolveView(view: string): ResolvedView | null {
  const foundation = foundationById.get(view)
  if (foundation) {
    const { Editor } = foundation
    return {
      title: foundation.label,
      subtitle: foundation.subtitle,
      node: <Editor />,
    }
  }
  if (view === 'components') {
    return {
      title: 'Components',
      subtitle: 'Style each component — synced families stay in step.',
      node: <ComponentsBrowser />,
    }
  }
  if (view.startsWith('component:')) {
    const name = view.slice('component:'.length)
    return {
      title: getComponentDisplayName(name),
      node: <ComponentEditor name={name} />,
    }
  }
  return null
}
