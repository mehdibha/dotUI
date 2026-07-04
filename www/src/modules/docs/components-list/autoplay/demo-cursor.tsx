'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { Pointer } from './pointer'

/**
 * A decorative macOS pointer that follows whatever control the card's autoplay is
 * currently "clicking" and dips on each click. Where the overlay cursor runs a
 * fixed choreography, this one reads the DOM: the demos already mirror real RAC
 * state onto the real elements (see interaction.tsx), so we just find the pressed
 * / selected / current element and glide the tip onto it.
 *
 * Mounted in the (unscaled) preview and measured against it, so the card's inner
 * `scale()` is absorbed by getBoundingClientRect. Purely cosmetic — aria-hidden,
 * pointer-events-none, and it never touches the real cursor.
 */

// The arrow tip's offset into the SVG at the default size — subtract it so the
// tip, not the SVG's corner, lands on the target point.
const TIP_X = 4
const TIP_Y = 3
// How long a click reads as "pressed" — long enough to cover the ripple and give
// every click (even the briefest toggle beat) a deliberate dip.
const PRESS_MS = 240

interface Point {
  x: number
  y: number
}

function firstMatch(root: HTMLElement, selector: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector)
}

export function DemoCursor({
  containerRef,
  active,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  active: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const [point, setPoint] = useState<Point | null>(null)
  const [pressed, setPressed] = useState(false)
  const [shown, setShown] = useState(false)
  // Bumping this remounts the ripple so it replays on every click.
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    if (!active || reduce) {
      setShown(false)
      return
    }

    // The element pressed on the previous frame (to detect a fresh press) and the
    // one the pointer currently rests on (to detect a selection jumping).
    let lastPressEl: Element | null = null
    let restTarget: Element | null = null
    let pressUntil = 0
    let placed = false
    let raf = 0

    const tick = (now: number) => {
      const container = containerRef.current
      if (!container) {
        raf = requestAnimationFrame(tick)
        return
      }

      const pressedEl = firstMatch(container, '[data-pressed]')
      const selectedEl =
        firstMatch(container, '[data-selected]:not([data-disabled])') ??
        firstMatch(container, '[aria-current="page"]')
      const hoveredEl = firstMatch(container, '[data-hovered]')

      // Where the pointer wants to be. A live press wins; otherwise a moving
      // selection; otherwise a plain hover. A selection that merely *contains* the
      // last press target is a fixed control (a checkbox toggling its own box) —
      // hold position there instead of jumping out to the row.
      let target: HTMLElement | null = null
      if (pressedEl) {
        target = pressedEl
      } else if (
        selectedEl &&
        !(lastPressEl && selectedEl.contains(lastPressEl))
      ) {
        target = selectedEl
      } else if (hoveredEl && !selectedEl) {
        target = hoveredEl
      }

      const pressRising = pressedEl != null && lastPressEl == null
      const targetJumped =
        target != null && restTarget != null && target !== restTarget
      if (pressRising || targetJumped) {
        pressUntil = now + PRESS_MS
        setClicks((c) => c + 1)
      }
      lastPressEl = pressedEl
      if (target) restTarget = target

      if (target) {
        const c = container.getBoundingClientRect()
        const t = target.getBoundingClientRect()
        const x = t.left - c.left + t.width / 2
        const y = t.top - c.top + t.height / 2
        setPoint((prev) =>
          prev && Math.abs(prev.x - x) < 0.5 && Math.abs(prev.y - y) < 0.5
            ? prev
            : { x, y },
        )
        // Fade in a frame after the first placement so the pointer eases in at the
        // target rather than appearing mid-air.
        if (placed) setShown(true)
        placed = true
      }

      const isPressed = now < pressUntil
      setPressed((prev) => (prev === isPressed ? prev : isPressed))

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduce, containerRef])

  if (!point) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-30"
      style={{
        transform: `translate(${point.x}px, ${point.y}px)`,
        opacity: shown ? 1 : 0,
        transition:
          'transform 340ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out',
      }}
    >
      {/* Anchor the arrow tip on the target point. */}
      <div className="absolute" style={{ left: -TIP_X, top: -TIP_Y }}>
        {clicks > 0 && (
          <span
            key={clicks}
            className="absolute size-6 [animation:cursor-click_320ms_ease-out_forwards] rounded-full bg-white/35 ring-1 ring-black/30"
            style={{ left: TIP_X, top: TIP_Y }}
          />
        )}
        <Pointer pressed={pressed} />
      </div>
    </div>
  )
}
