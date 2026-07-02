'use client'

import {
  ActivityIcon,
  BlendIcon,
  ChartColumnIcon,
  CodeIcon,
  ComponentIcon,
  FocusIcon,
  FrameIcon,
  LayersIcon,
  type LucideIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SparklesIcon,
  SquareIcon,
  TypeIcon,
  Wand2Icon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export type SectionId =
  | 'theme'
  | 'color'
  | 'chart-colors'
  | 'typography'
  | 'icons'
  | 'radius'
  | 'spacing'
  | 'elevation'
  | 'motion'
  | 'borders'
  | 'focus'
  | 'surfaces'
  | 'cursor'
  | 'components'
  | 'code'

export interface SectionDef {
  id: SectionId
  label: string
  Icon: LucideIcon
  isNew?: boolean
}

export const SECTION_GROUPS: SectionDef[][] = [
  [
    { id: 'theme', label: 'Theme', Icon: Wand2Icon },
    { id: 'color', label: 'Color', Icon: PaletteIcon },
    { id: 'chart-colors', label: 'Chart colors', Icon: ChartColumnIcon },
    { id: 'typography', label: 'Typography', Icon: TypeIcon },
    { id: 'icons', label: 'Icons', Icon: ShapesIcon },
  ],
  [
    { id: 'radius', label: 'Radius', Icon: SquareIcon },
    { id: 'spacing', label: 'Spacing', Icon: RulerIcon, isNew: true },
    { id: 'elevation', label: 'Elevation', Icon: LayersIcon, isNew: true },
    { id: 'motion', label: 'Motion', Icon: ActivityIcon, isNew: true },
    { id: 'borders', label: 'Borders', Icon: FrameIcon, isNew: true },
    { id: 'focus', label: 'Focus ring', Icon: FocusIcon, isNew: true },
  ],
  [
    { id: 'surfaces', label: 'Surfaces', Icon: BlendIcon, isNew: true },
    { id: 'cursor', label: 'Cursor', Icon: MousePointer2Icon },
  ],
  [
    { id: 'components', label: 'Components', Icon: ComponentIcon },
    { id: 'code', label: 'Code style', Icon: CodeIcon },
  ],
]

export const ALL_SECTIONS: SectionDef[] = SECTION_GROUPS.flat()

export function Rail({
  active,
  onSelect,
  onOpenAssistant,
  assistantOpen,
}: {
  active: SectionId
  onSelect: (id: SectionId) => void
  onOpenAssistant: () => void
  assistantOpen: boolean
}) {
  return (
    <nav className="scrollbar-none flex w-12 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r bg-card py-2">
      <Tooltip>
        <RailButton
          label="Ask AI"
          active={assistantOpen}
          accent
          onPress={onOpenAssistant}
        >
          <SparklesIcon />
        </RailButton>
        <TooltipContent placement="right">Ask AI</TooltipContent>
      </Tooltip>
      {SECTION_GROUPS.map((group, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="my-1 h-px w-5 bg-border" />
          {group.map(({ id, label, Icon, isNew }) => (
            <Tooltip key={id}>
              <RailButton
                label={label}
                active={active === id}
                isNew={isNew}
                onPress={() => onSelect(id)}
              >
                <Icon />
              </RailButton>
              <TooltipContent placement="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </nav>
  )
}

function RailButton({
  label,
  active,
  accent,
  isNew,
  onPress,
  children,
}: {
  label: string
  active?: boolean
  accent?: boolean
  isNew?: boolean
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      aria-label={label}
      className={cn(
        'relative flex size-8 items-center justify-center rounded-md focus-reset transition-colors focus-visible:focus-ring [&_svg]:size-[18px]',
        active
          ? accent
            ? 'bg-primary/10 text-primary'
            : 'bg-primary/10 text-primary'
          : accent
            ? 'text-primary hover:bg-neutral'
            : 'text-fg-muted hover:bg-neutral hover:text-fg',
      )}
    >
      {children}
      {isNew && (
        <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
      )}
    </ButtonPrimitives.Button>
  )
}
