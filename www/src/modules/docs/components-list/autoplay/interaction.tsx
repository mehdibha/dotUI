'use client'

import type * as React from 'react'

import { cn } from '@/registry/lib/utils'

/**
 * Generic, component-agnostic "this is being interacted with" wrapper. It maps a
 * phase to a small scale + brightness shift on whatever it wraps, so a button,
 * link, swatch or menu item reads as hovered → pressed without us needing to
 * know its colours.
 *
 * Animations are plain CSS transitions on inline styles (not a JS animation
 * library): the previews live inside an `inert` subtree, where script-driven
 * transform animations don't run, but CSS transitions do — and they cost nothing
 * when idle. It styles nothing permanently and never fires real events.
 */
const PRESS_TRANSFORM: Record<string, string> = {
  idle: 'scale(1)',
  hover: 'scale(1.045)',
  press: 'scale(0.95)',
}
const PRESS_FILTER: Record<string, string> = {
  idle: 'brightness(1)',
  hover: 'brightness(1.07)',
  press: 'brightness(0.92)',
}

export function DemoPress({
  phase,
  pressing,
  hovering,
  className,
  children,
}: {
  /** Explicit phase. Takes precedence over the boolean shorthands. */
  phase?: 'idle' | 'hover' | 'press' | (string & {})
  /** Shorthand: show the press state. */
  pressing?: boolean
  /** Shorthand: show the hover state. */
  hovering?: boolean
  className?: string
  children: React.ReactNode
}) {
  const resolved =
    phase && phase in PRESS_TRANSFORM
      ? phase
      : pressing
        ? 'press'
        : hovering
          ? 'hover'
          : 'idle'

  return (
    <div
      className={cn('inline-flex', className)}
      style={{
        transform: PRESS_TRANSFORM[resolved] ?? PRESS_TRANSFORM.idle,
        filter: PRESS_FILTER[resolved] ?? PRESS_FILTER.idle,
        transformOrigin: 'center',
        transition:
          'transform 220ms cubic-bezier(0.32,0.72,0,1), filter 220ms ease',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Faux focus-ring classes. Applied to the real field element via a custom
 * `data-demo-focus` attribute so we replicate the exact focus look (the same
 * `border-border-focus` + `ring-border-focus-muted` tokens RAC uses) without
 * the field actually being `:focus`. The attribute selector out-specifies the
 * resting `border-border-field`, so toggling `data-demo-focus` flips the ring.
 *
 * Usage: spread `demoFocusProps(active)` onto the bordered field element.
 */
export const DEMO_FOCUS_RING =
  'transition-[box-shadow,border-color] duration-200 data-demo-focus:border-border-focus data-demo-focus:ring-2 data-demo-focus:ring-border-focus-muted'

export function demoFocusProps(active: boolean) {
  return {
    'data-demo-focus': active ? '' : undefined,
    className: DEMO_FOCUS_RING,
  }
}

/**
 * A blinking text caret, for fields where the typed text sits in normal flow
 * (search, command palette) rather than inside a real `<input>`.
 */
export function DemoCaret({
  visible = true,
  className,
}: {
  visible?: boolean
  className?: string
}) {
  if (!visible) return null
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block h-[1.1em] w-px translate-y-[0.15em] animate-caret-blink bg-fg',
        className,
      )}
    />
  )
}
