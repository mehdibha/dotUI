'use client'

import { cn } from '@/lib/utils'

interface ModeSwitcherProps {
  modes: string[]
  mode: string
  onChange: (mode: string) => void
}

export function ModeSwitcher({ modes, mode, onChange }: ModeSwitcherProps) {
  if (modes.length < 2) return null
  return (
    <div
      role="group"
      aria-label="Color mode"
      className="inline-flex items-center gap-0.5 rounded-lg border p-0.5"
    >
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={m === mode}
          onClick={() => onChange(m)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1 text-sm capitalize transition-colors',
            m === mode
              ? 'bg-inverse text-bg'
              : 'text-fg-muted hover:bg-muted hover:text-fg',
          )}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
