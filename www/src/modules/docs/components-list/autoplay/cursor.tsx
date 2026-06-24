'use client'

import { cn } from '@/registry/lib/utils'

import type { ScenePhase } from './use-autoplay'

/**
 * A decorative pointer that fades in over a trigger, then dips on "press" to
 * sell the click. Purely cosmetic (aria-hidden); it never moves the real cursor.
 * CSS-transition driven so it animates inside the `inert` preview. Positioned by
 * the caller — defaults to the bottom-right corner of a centered trigger.
 */
export function FakeCursor({
  phase,
  className,
}: {
  phase: ScenePhase
  className?: string
}) {
  const visible = phase === 'hover' || phase === 'press'
  const pressed = phase === 'press'

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      className={cn(
        'pointer-events-none absolute z-30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]',
        className,
      )}
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(${visible ? '0px,0px' : '8px,8px'}) scale(${
          pressed ? 0.82 : visible ? 1 : 0.6
        })`,
        transformOrigin: 'top left',
        transition:
          'opacity 280ms ease, transform 280ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {/* Classic arrow pointer: white fill, dark outline so it reads on any bg. */}
      <path
        d="M5 3.5 L5 19 L9 15 L11.5 20.5 L14 19.3 L11.6 14 L17 14 Z"
        fill="white"
        stroke="black"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  )
}
