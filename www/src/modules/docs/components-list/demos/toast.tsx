'use client'

import { CircleCheckIcon } from 'lucide-react'

import { useAutoplay } from '../autoplay'

// A static, presentational stand-in for a toast — the real component is
// triggered + portaled at runtime, which doesn't preview well in a static grid.
// On hover it loops a slide-up + fade re-entry; at rest it just sits visible.
export function ToastDemo() {
  const { phase, playing } = useAutoplay([
    { name: 'out', duration: 400 },
    { name: 'in', duration: 1900 },
  ])
  const hidden = playing && phase === 'out'
  return (
    <div
      className="flex w-64 items-center gap-3 rounded-lg border bg-bg p-3 shadow-lg"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(8px)' : 'none',
        transition: 'opacity .3s, transform .3s cubic-bezier(0.32,0.72,0,1)',
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
