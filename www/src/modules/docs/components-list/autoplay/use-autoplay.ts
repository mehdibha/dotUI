'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { useCardHover } from './card-hover'

/**
 * Looping timeline primitives that drive the component-card preview animations.
 *
 * Every hook here is gated on two things: the card being hovered/focused
 * (`useCardHover`) and `prefers-reduced-motion` being off. When either is false
 * the hook returns its resting value (phase 0 / empty text / default selection)
 * so the card looks exactly like the static preview did before — the animation
 * is strictly additive and only ever plays on hover.
 */

export interface AutoplayPhase {
  /** Phase name the demo switches on. */
  name: string
  /** How long to stay in this phase before advancing, in ms. */
  duration: number
}

export interface AutoplayState {
  /** Current phase name (resting phase when not playing). */
  phase: string
  /** Index of the current phase in the timeline. */
  index: number
  /** How many full loops have completed. */
  cycle: number
  /** True while the timeline is actively advancing. */
  playing: boolean
}

interface AutoplayOptions {
  /** Override the active signal (defaults to the card's hover/focus state). */
  active?: boolean
  /** Loop back to the first phase after the last (default true). */
  loop?: boolean
  /** Delay before the first advance, in ms. */
  startDelay?: number
}

function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false
}

/**
 * Steps through `phases` while active, then loops. Returns the resting phase
 * (index 0) whenever inactive or under reduced motion. Timers are torn down on
 * deactivation/unmount, so an un-hovered card runs nothing.
 */
export function useAutoplay(
  phases: AutoplayPhase[],
  options: AutoplayOptions = {},
): AutoplayState {
  const hovered = useCardHover()
  const reduce = usePrefersReducedMotion()
  const { active = hovered, loop = true, startDelay = 0 } = options

  const [index, setIndex] = useState(0)
  const [cycle, setCycle] = useState(0)

  const phasesRef = useRef(phases)
  phasesRef.current = phases

  // Restart the timeline whenever its shape changes, not just its array identity.
  const shape = phases.map((p) => `${p.name}:${p.duration}`).join('|')
  const enabled = active && !reduce && phases.length > 1

  useEffect(() => {
    if (!enabled) {
      setIndex(0)
      setCycle(0)
      return
    }

    let i = 0
    let c = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    setIndex(0)
    setCycle(0)

    const advance = (delay: number) => {
      timer = setTimeout(() => {
        if (cancelled) return
        const list = phasesRef.current
        i += 1
        if (i >= list.length) {
          if (!loop) return
          i = 0
          c += 1
        }
        setIndex(i)
        setCycle(c)
        advance(list[i]?.duration ?? 600)
      }, delay)
    }

    advance(startDelay + (phasesRef.current[0]?.duration ?? 600))

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [enabled, loop, startDelay, shape])

  const resolvedIndex = enabled ? index : 0
  const phase = phases[resolvedIndex]?.name ?? phases[0]?.name ?? 'idle'

  return { phase, index: resolvedIndex, cycle, playing: enabled }
}

export interface TypewriterState {
  /** Currently visible substring. */
  value: string
  /** True while characters are still being added. */
  typing: boolean
  /** True once the full string is shown. */
  done: boolean
  /** True while active — use to show a faux focus ring / caret. */
  active: boolean
}

interface TypewriterOptions extends Pick<AutoplayOptions, 'active' | 'loop'> {
  /** Delay before the first character, in ms. */
  startDelay?: number
  /** Time between characters, in ms. */
  charInterval?: number
  /** Hold the full string this long before clearing to loop, in ms. */
  holdAfter?: number
}

/**
 * Reveals `text` one character at a time while active, then (looping) clears and
 * retypes. Returns an empty string when inactive so the field shows its
 * placeholder. Pair `value` with a controlled, read-only field and `active` with
 * a faux focus ring.
 */
export function useTypewriter(
  text: string,
  options: TypewriterOptions = {},
): TypewriterState {
  const hovered = useCardHover()
  const reduce = usePrefersReducedMotion()
  const {
    active = hovered,
    loop = true,
    startDelay = 450,
    charInterval = 65,
    holdAfter = 1400,
  } = options

  const [count, setCount] = useState(0)
  const enabled = active && !reduce && text.length > 0

  useEffect(() => {
    if (!enabled) {
      setCount(0)
      return
    }

    let n = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    setCount(0)

    const tick = () => {
      if (cancelled) return
      if (n < text.length) {
        n += 1
        setCount(n)
        timer = setTimeout(tick, charInterval)
        return
      }
      if (!loop) return
      timer = setTimeout(() => {
        if (cancelled) return
        n = 0
        setCount(0)
        timer = setTimeout(tick, charInterval)
      }, holdAfter)
    }

    timer = setTimeout(tick, startDelay)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [enabled, text, charInterval, holdAfter, startDelay, loop])

  const value = enabled ? text.slice(0, count) : ''
  return {
    value,
    typing: enabled && count < text.length,
    done: enabled && count >= text.length,
    active: enabled,
  }
}

export interface ToggleAutoplayState {
  /** The simulated on/off (or selected) value. */
  selected: boolean
  /** True for a brief beat around each flip — drive a press dip with it. */
  pressing: boolean
}

/**
 * Flips a boolean on/off on a loop while active, with a short "pressing" beat
 * around each flip so the control can show a click. Used by checkbox, switch,
 * single-checkbox-style toggles, etc.
 */
export function useToggleAutoplay(
  options: AutoplayOptions & { initial?: boolean } = {},
): ToggleAutoplayState {
  const { initial = false, ...rest } = options
  const { phase } = useAutoplay(
    [
      { name: 'rest-a', duration: 1100 },
      { name: 'press-a', duration: 170 },
      { name: 'rest-b', duration: 1100 },
      { name: 'press-b', duration: 170 },
    ],
    rest,
  )
  const pressing = phase === 'press-a' || phase === 'press-b'
  // After press-a we're "on", after press-b we're "off" again.
  const flipped = phase === 'press-a' || phase === 'rest-b'
  return { selected: initial ? !flipped : flipped, pressing }
}

export interface StepAutoplayState {
  /** Currently selected step index. */
  index: number
  /** True for a brief beat around each step change. */
  pressing: boolean
}

/**
 * Cycles a selected index through `0..count-1` on a loop while active, with a
 * short press beat at each change. Used for tabs, segmented/toggle-button
 * groups, radio groups, single-select lists, pagination, etc.
 */
export function useStepAutoplay(
  count: number,
  options: AutoplayOptions & {
    /** Where the cycle rests when not playing. */
    initial?: number
    /** How long each step is shown, in ms. */
    dwell?: number
  } = {},
): StepAutoplayState {
  const { initial = 0, dwell = 1150, ...rest } = options
  const safeCount = Math.max(1, count)

  const phases: AutoplayPhase[] = []
  for (let i = 0; i < safeCount; i += 1) {
    phases.push({ name: `press-${i}`, duration: 180 })
    phases.push({ name: `dwell-${i}`, duration: dwell })
  }

  const { index: phaseIndex, playing } = useAutoplay(phases, rest)
  if (!playing) return { index: initial, pressing: false }

  const step = Math.floor(phaseIndex / 2) % safeCount
  const pressing = phaseIndex % 2 === 0
  return { index: step, pressing }
}

/**
 * Cycles through `items` and returns the current ITEM (typed, never undefined)
 * — a typed convenience over `useStepAutoplay` for selection demos that map an
 * index back to a key/value (lists, tag groups, segmented controls).
 */
export function useCycle<T>(
  items: readonly T[],
  options: AutoplayOptions & { initial?: number; dwell?: number } = {},
): { item: T; index: number; pressing: boolean } {
  const { index, pressing } = useStepAutoplay(items.length, options)
  const len = items.length
  const safe = len > 0 ? ((index % len) + len) % len : 0
  return { item: items[safe] as T, index: safe, pressing }
}

export type ScenePhase = 'idle' | 'hover' | 'press' | 'open'

/**
 * The shared timeline for overlay triggers: trigger sits idle, a cursor moves in
 * and hovers, presses, then the overlay opens and holds before looping. Feed the
 * returned `phase` straight into `<OverlayScene>`.
 */
export function useOpenAutoplay(
  options: AutoplayOptions & {
    /** How long the opened overlay holds before looping, in ms. */
    holdOpen?: number
  } = {},
): { phase: ScenePhase; cycle: number } {
  const { holdOpen = 2000, ...rest } = options
  const { phase, cycle } = useAutoplay(
    [
      { name: 'idle', duration: 750 },
      { name: 'hover', duration: 480 },
      { name: 'press', duration: 240 },
      { name: 'open', duration: holdOpen },
    ],
    rest,
  )
  return { phase: phase as ScenePhase, cycle }
}

export interface ValueAutoplayState {
  /** The current animated value. */
  value: number
  /** True while the thumb/fill is moving toward a new target. */
  moving: boolean
}

/**
 * Oscillates a numeric value between waypoints while active (sliders), or sweeps
 * once to a target and holds (progress). Returns `from` when inactive.
 */
export function useValueAutoplay(
  waypoints: number[],
  options: AutoplayOptions & { dwell?: number } = {},
): ValueAutoplayState {
  const { dwell = 950, ...rest } = options
  const stops = waypoints.length > 0 ? waypoints : [0]

  const phases: AutoplayPhase[] = stops.map((_, i) => ({
    name: `stop-${i}`,
    duration: dwell,
  }))

  const { index, playing } = useAutoplay(phases, rest)
  const first = stops[0] ?? 0
  return {
    value: playing ? (stops[index] ?? first) : first,
    moving: playing,
  }
}
