'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef } from 'react'

import { cn } from '@/registry/lib/utils'

/**
 * Exact-fidelity state simulation for the preview cards.
 *
 * Instead of faking interaction with our own transforms, we mirror the desired
 * state onto the REAL React Aria state attributes (`data-hovered`, `data-pressed`,
 * `data-focused`, …) of the real component. The component then renders its OWN
 * state styles — the exact look it will have under any design-system preset —
 * with no interaction and without ever touching the page's real focus.
 *
 * The attributes are (re)applied in a layout effect after every render because
 * React Aria rewrites them from its internal state (always idle here) on each
 * render; re-applying post-commit, pre-paint, keeps them set with no flicker.
 */

// useLayoutEffect on the client, no-op useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export interface DemoStateFlags {
  hovered?: boolean
  pressed?: boolean
  /** Adds `data-focused` — drives `focus:` (input rings, etc.). */
  focused?: boolean
  /** Adds `data-focused` + `data-focus-visible` — drives `focus-visible:` rings. */
  focusVisible?: boolean
  selected?: boolean
  open?: boolean
  current?: boolean
}

const FLAG_ATTRS: [keyof DemoStateFlags, string][] = [
  ['hovered', 'data-hovered'],
  ['pressed', 'data-pressed'],
  ['selected', 'data-selected'],
  ['open', 'data-open'],
  ['current', 'data-current'],
]

export function applyDemoState(el: HTMLElement, flags: DemoStateFlags): void {
  for (const [key, attr] of FLAG_ATTRS) {
    if (flags[key]) el.setAttribute(attr, '')
    else el.removeAttribute(attr)
  }
  const focused = flags.focused || flags.focusVisible
  if (focused) el.setAttribute('data-focused', '')
  else el.removeAttribute('data-focused')
  if (flags.focusVisible) el.setAttribute('data-focus-visible', '')
  else el.removeAttribute('data-focus-visible')
}

/**
 * Wraps a single child in a `display:contents` span (so it adds no box) and
 * mirrors `flags` onto the child element's real state attributes. `target`
 * selects which descendant to drive when the styled element isn't the wrapper's
 * first child.
 */
export function DemoState({
  flags,
  target = 'first',
  children,
}: {
  flags: DemoStateFlags
  target?: 'first' | 'last' | 'all'
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useIsoLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    const targets =
      target === 'all'
        ? Array.from(host.children)
        : target === 'last'
          ? [host.lastElementChild]
          : [host.firstElementChild]
    for (const el of targets) {
      if (el instanceof HTMLElement) applyDemoState(el, flags)
    }
  })

  return (
    <span ref={ref} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}

/**
 * Drives the real hover / pressed states of a pressable (Button, Link,
 * ToggleButton, menu item…). Accepts either an explicit `phase`
 * (`idle | hover | press | …`) or the `hovering` / `pressing` booleans.
 */
export function DemoPress({
  phase,
  pressing,
  hovering,
  target,
  children,
}: {
  phase?: string
  pressing?: boolean
  hovering?: boolean
  target?: 'first' | 'last' | 'all'
  children: ReactNode
}) {
  const isPressed = pressing || phase === 'press'
  const isHovered = isPressed || hovering || phase === 'hover'
  return (
    <DemoState
      flags={{ hovered: isHovered, pressed: isPressed }}
      target={target}
    >
      {children}
    </DemoState>
  )
}

/**
 * Drives the real focus state of a field so it shows its actual focus ring/border
 * — without taking real focus (the preview is `inert`; we only set the attribute).
 */
export function DemoFocus({
  active,
  target,
  children,
}: {
  active: boolean
  target?: 'first' | 'last' | 'all'
  children: ReactNode
}) {
  return (
    <DemoState flags={{ focused: active }} target={target}>
      {children}
    </DemoState>
  )
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
