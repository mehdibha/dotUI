'use client'

import {
  ActivityIcon,
  BarChart3Icon,
  BlendIcon,
  ComponentIcon,
  FocusIcon,
  FrameIcon,
  LayersIcon,
  type LucideIcon,
  MousePointer2Icon,
  MousePointerClickIcon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SparklesIcon,
  TypeIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

export type DomainId =
  | 'style'
  | 'color'
  | 'typography'
  | 'icons'
  | 'shape'
  | 'spacing'
  | 'elevation'
  | 'motion'
  | 'surface'
  | 'focus'
  | 'states'
  | 'cursor'
  | 'components'
  | 'charts'

export const DOMAINS: { id: DomainId; label: string; icon: LucideIcon }[] = [
  { id: 'style', label: 'Style', icon: SparklesIcon },
  { id: 'color', label: 'Color', icon: PaletteIcon },
  { id: 'typography', label: 'Type', icon: TypeIcon },
  { id: 'icons', label: 'Icons', icon: ShapesIcon },
  { id: 'shape', label: 'Shape', icon: FrameIcon },
  { id: 'spacing', label: 'Spacing', icon: RulerIcon },
  { id: 'elevation', label: 'Elevation', icon: LayersIcon },
  { id: 'motion', label: 'Motion', icon: ActivityIcon },
  { id: 'surface', label: 'Surface', icon: BlendIcon },
  { id: 'focus', label: 'Focus', icon: FocusIcon },
  { id: 'states', label: 'States', icon: MousePointerClickIcon },
  { id: 'cursor', label: 'Cursor', icon: MousePointer2Icon },
  { id: 'components', label: 'Parts', icon: ComponentIcon },
  { id: 'charts', label: 'Charts', icon: BarChart3Icon },
]

export const DOMAIN_LABELS = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d.label]),
) as Record<DomainId, string>

export function Rail({
  domain,
  onSelect,
}: {
  domain: DomainId
  onSelect: (domain: DomainId) => void
}) {
  return (
    <nav
      aria-label="Design axes"
      className="scrollbar-none flex w-16 shrink-0 flex-col gap-1 overflow-y-auto rounded-xl border bg-card p-1.5"
    >
      {DOMAINS.map((d) => {
        const active = d.id === domain
        return (
          <ButtonPrimitives.Button
            key={d.id}
            onPress={() => onSelect(d.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'bg-primary text-fg-on-primary'
                : 'text-fg-muted hover:bg-neutral hover:text-fg',
            )}
          >
            <d.icon className="size-4" />
            <span className="w-full truncate text-center">{d.label}</span>
          </ButtonPrimitives.Button>
        )
      })}
    </nav>
  )
}
