'use client'

import { CircleCheckIcon } from 'lucide-react'

import { useAutoplay } from '../autoplay'

// A static, presentational stand-in for a toast — the real component is
// triggered + portaled at runtime, which doesn't preview well in a static grid.
// The surface + entrance mirror the real toast (bg-card, slide up from below the
// frame, like its `data-[starting-style]` enter); at rest it just sits visible.
export function ToastDemo() {
  const { phase, playing } = useAutoplay([
    { name: 'out', duration: 450 },
    { name: 'in', duration: 1900 },
  ])
  const hidden = playing && phase === 'out'
  return (
    <div
      className="flex w-64 items-center gap-3 rounded-lg border bg-card p-3 text-fg shadow-lg"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(calc(100% + 1rem))' : 'translateY(0)',
        transition:
          'opacity .3s ease, transform .45s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <CircleCheckIcon className="size-5 shrink-0 text-fg-success" />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-fg">
          Event has been created
        </span>
        <span className="truncate text-xs text-fg-muted">
          Sunday at 9:00 AM
        </span>
      </div>
    </div>
  )
}
