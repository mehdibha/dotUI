import {
  BoxIcon,
  type LucideIcon,
  LayersIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

/* ----------------------------------------------------------------------------
 * The axes of the design system — the spine of the studio. The left rail lists
 * them; selecting one swaps the inspector. "Every visual decision is a user-
 * configurable axis" (CLAUDE.md), so this list is the contract the rest of the
 * studio renders against — add an axis here and it appears everywhere at once.
 * -------------------------------------------------------------------------- */

export type AxisId =
  | 'brand'
  | 'color'
  | 'typography'
  | 'shape'
  | 'spacing'
  | 'elevation'
  | 'motion'
  | 'icons'
  | 'cursor'
  | 'components'

export type AxisGroup = 'start' | 'foundations' | 'surface'

export interface Axis {
  id: AxisId
  label: string
  /** One-line promise shown in the inspector header. */
  tagline: string
  icon: LucideIcon
  group: AxisGroup
}

export const AXES: Axis[] = [
  {
    id: 'brand',
    label: 'Brand',
    tagline: 'Seed the whole system from your brand.',
    icon: SparklesIcon,
    group: 'start',
  },
  {
    id: 'color',
    label: 'Color',
    tagline: 'One seed to a full, accessible color system.',
    icon: PaletteIcon,
    group: 'foundations',
  },
  {
    id: 'typography',
    label: 'Type',
    tagline: 'Font pairing, scale and rhythm.',
    icon: TypeIcon,
    group: 'foundations',
  },
  {
    id: 'shape',
    label: 'Shape',
    tagline: 'Corner radius and border weight.',
    icon: ShapesIcon,
    group: 'foundations',
  },
  {
    id: 'spacing',
    label: 'Space',
    tagline: 'Density and the spacing scale.',
    icon: RulerIcon,
    group: 'foundations',
  },
  {
    id: 'elevation',
    label: 'Depth',
    tagline: 'Shadows, surfaces and the glass switch.',
    icon: LayersIcon,
    group: 'foundations',
  },
  {
    id: 'motion',
    label: 'Motion',
    tagline: 'How the whole system moves.',
    icon: ZapIcon,
    group: 'foundations',
  },
  {
    id: 'icons',
    label: 'Icons',
    tagline: 'Icon library and stroke.',
    icon: SmileIcon,
    group: 'foundations',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    tagline: 'Pointer feedback across states.',
    icon: MousePointer2Icon,
    group: 'foundations',
  },
  {
    id: 'components',
    label: 'Components',
    tagline: 'Per-component styles, in synced groups.',
    icon: BoxIcon,
    group: 'surface',
  },
]

export const AXIS_MAP: Record<AxisId, Axis> = Object.fromEntries(
  AXES.map((a) => [a.id, a]),
) as Record<AxisId, Axis>
