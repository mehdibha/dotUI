'use client'

import { cn } from '@/registry/lib/utils'

import { AXIS_MAP } from './axes'
import { BrandInspector } from './inspectors/brand'
import { ColorInspector } from './inspectors/color'
import { ComponentsInspector } from './inspectors/components'
import { CursorInspector } from './inspectors/cursor'
import { ElevationInspector } from './inspectors/elevation'
import { IconsInspector } from './inspectors/icons'
import { MotionInspector } from './inspectors/motion'
import { ShapeInspector } from './inspectors/shape'
import { SpacingInspector } from './inspectors/spacing'
import { TypographyInspector } from './inspectors/typography'
import { useStudio } from './store'

const BODIES = {
  brand: BrandInspector,
  color: ColorInspector,
  typography: TypographyInspector,
  shape: ShapeInspector,
  spacing: SpacingInspector,
  elevation: ElevationInspector,
  motion: MotionInspector,
  icons: IconsInspector,
  cursor: CursorInspector,
  components: ComponentsInspector,
} as const

export function Inspector({ className }: { className?: string }) {
  const { axis } = useStudio()
  const meta = AXIS_MAP[axis]
  const Body = BODIES[axis]

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-xl border bg-card lg:w-[340px] lg:shrink-0',
        className,
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start gap-3 border-b p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-neutral text-fg">
          <meta.icon className="size-4.5" />
        </div>
        <div className="flex min-w-0 flex-col">
          <h2 className="text-sm font-semibold">{meta.label}</h2>
          <p className="text-[11px] leading-snug text-fg-muted">
            {meta.tagline}
          </p>
        </div>
      </div>

      {/* Body — keyed per axis so the CSS rise replays on each switch. */}
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div key={axis} className="studio-rise p-4">
          <Body />
        </div>
      </div>
    </div>
  )
}
