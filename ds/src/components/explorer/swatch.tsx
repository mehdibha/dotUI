'use client'

import { cn } from '@/lib/utils'

/** A value the browser can paint directly (no unresolved var(), no bare numbers). */
export function isPaintable(value: string) {
  if (value.includes('var(')) return false
  return /^(#|rgb|hsl|oklch|lab|lch|color\(|color-mix\()/i.test(value.trim())
}

const checkerboard =
  'linear-gradient(45deg, rgba(127,127,127,0.25) 25%, transparent 25%, transparent 75%, rgba(127,127,127,0.25) 75%), linear-gradient(45deg, rgba(127,127,127,0.25) 25%, transparent 25%, transparent 75%, rgba(127,127,127,0.25) 75%)'

interface SwatchProps {
  value: string
  label: string
  className?: string
}

/** A color chip: checkerboard under translucent values, copies its value on click. */
export function Swatch({ value, label, className }: SwatchProps) {
  const paintable = isPaintable(value)
  return (
    <button
      type="button"
      title={`${label} · ${value} — click to copy`}
      onClick={() => void navigator.clipboard?.writeText(value)}
      className={cn(
        'relative block h-8 min-w-4 flex-1 cursor-pointer overflow-hidden outline-offset-1 focus-visible:z-10 focus-visible:outline-2',
        !paintable && 'border border-dashed',
        className,
      )}
      style={
        paintable
          ? {
              backgroundImage: checkerboard,
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 6px 6px',
            }
          : undefined
      }
    >
      {paintable ? (
        <span className="absolute inset-0" style={{ backgroundColor: value }} />
      ) : (
        <span className="flex h-full items-center justify-center px-1 font-mono text-[9px] text-fg-muted">
          {value.length > 10 ? 'var' : value}
        </span>
      )}
    </button>
  )
}
