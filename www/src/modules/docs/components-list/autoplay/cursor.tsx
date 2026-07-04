'use client'

import { cn } from '@/registry/lib/utils'

import { Pointer } from './pointer'
import type { ScenePhase } from './use-autoplay'

/**
 * A decorative pointer for the overlay scenes. It glides in toward the trigger
 * (a smooth, decelerating travel), gives a quick press dip, and emits a click
 * ripple — then drifts away as the overlay opens. Purely cosmetic (aria-hidden);
 * it never moves the real cursor.
 *
 * All CSS-driven so it animates inside the `inert` preview. The ripple mounts
 * only during the press phase, so it replays from the start on every loop.
 */
export function FakeCursor({
  phase,
  className,
}: {
  phase: ScenePhase
  className?: string
}) {
  const arrived = phase === 'hover' || phase === 'press'
  const pressed = phase === 'press'
  const leaving = phase === 'open'

  // Resting just inside the trigger; far down-right before arrival; a small drift
  // out as the overlay takes over.
  const transform = arrived
    ? 'translate(-5px, -5px) scale(1)'
    : leaving
      ? 'translate(4px, 4px) scale(0.85)'
      : 'translate(42px, 36px) scale(0.55)'

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute z-30', className)}
      style={{
        opacity: arrived ? 1 : 0,
        transform,
        transformOrigin: 'top left',
        // Glide in slowly with a natural deceleration; leave a touch quicker.
        transition: arrived
          ? 'opacity 180ms ease-out, transform 520ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'opacity 260ms ease-in, transform 320ms cubic-bezier(0.4, 0, 1, 1)',
      }}
    >
      {/* Click ripple — keyed to the press phase so it remounts and replays. */}
      {pressed && (
        <span
          className="absolute size-6 [animation:cursor-click_320ms_ease-out_forwards] rounded-full bg-white/35 ring-1 ring-black/30"
          style={{ left: 4, top: 3 }}
        />
      )}
      <Pointer pressed={pressed} />
    </div>
  )
}
