import { SlidersHorizontalIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

/**
 * Left panel — the controls surface. Empty for now; the color, foundations and
 * per-component editors are built into it step by step.
 */
export function CustomizePanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'flex w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-bg',
        className,
      )}
    >
      <EmptyState
        icon={<SlidersHorizontalIcon className="size-5" />}
        label="Customize"
      />
    </aside>
  )
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-fg-muted">
      <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
        {icon}
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-fg-muted">Coming next</p>
    </div>
  )
}
