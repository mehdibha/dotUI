import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

// Each layer adds a larger backdrop blur over an overlapping gradient window; where
// the windows overlap the blurs compound, ramping smoothly from sharp (bottom edge)
// to heavily blurred (top). `to top` puts the strongest blur under the pinned bar.
const BLUR_LAYERS = [
  {
    blur: 0.5,
    mask: 'linear-gradient(to top, transparent 0%, #000 10%, #000 30%, transparent 40%)',
  },
  {
    blur: 1,
    mask: 'linear-gradient(to top, transparent 10%, #000 20%, #000 40%, transparent 50%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to top, transparent 15%, #000 30%, #000 50%, transparent 60%)',
  },
  {
    blur: 4,
    mask: 'linear-gradient(to top, transparent 20%, #000 40%, #000 60%, transparent 70%)',
  },
  {
    blur: 8,
    mask: 'linear-gradient(to top, transparent 40%, #000 60%, #000 80%, transparent 90%)',
  },
  { blur: 16, mask: 'linear-gradient(to top, transparent 60%, #000 80%)' },
  { blur: 24, mask: 'linear-gradient(to top, transparent 70%, #000 100%)' },
]

interface ProgressiveBlurProps {
  className?: string
  style?: CSSProperties
}

/** Reveal ramps with --blur-progress (0 → 1) on this element — driven by a scroll
 *  timeline (header) or a stuck-state transition (pinned bars). Stays mask-free: a
 *  mask here establishes a backdrop root and kills the cross-layer compounding. */
export function ProgressiveBlur({ className, style }: ProgressiveBlurProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%]',
        className,
      )}
      style={style}
    >
      {BLUR_LAYERS.map(({ blur, mask }) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
            WebkitBackdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          opacity: 'calc(var(--blur-progress, 0) * 0.9)',
          background:
            'linear-gradient(to top, transparent 0%, color-mix(in oklab, var(--color-bg) 76%, transparent) 55%, var(--color-bg) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 header-blur-dither"
        style={{ opacity: 'calc(var(--blur-progress, 0) * 0.035)' }}
      />
    </div>
  )
}
