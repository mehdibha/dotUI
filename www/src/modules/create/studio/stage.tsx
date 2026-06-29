import { MonitorIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

/**
 * Right panel — the stage where the live preview iframe renders. Empty for now;
 * the preview + its toolbar (device size, zoom, light/dark) are wired in next.
 */
export function Stage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-bg',
        className,
      )}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-fg-muted">
        <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
          <MonitorIcon className="size-5" />
        </div>
        <p className="text-sm font-medium">Preview</p>
        <p className="text-xs text-fg-muted">Coming next</p>
      </div>
    </div>
  )
}
