"use client"

/**
 * Rotating hero word, modeled on the x.ai hero swap. The word resolves in and out
 * of focus — `{opacity, blur(6px)}` with no vertical travel — rather than sliding,
 * and the slot springs to the incoming word's measured width so the "for" before it
 * never snaps.
 */

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const WORDS = ["humans", "agents"] as const
/** Includes the 460ms swap, so each word holds still for ~2.5s. */
const INTERVAL_MS = 3000

const ENTER_DURATION = 0.28
const EXIT_DURATION = 0.18
const EASE_OUT = [0.16, 1, 0.3, 1] as const // easeOutExpo — arrival
const EASE_IN = [0.55, 0.055, 0.675, 0.19] as const // easeInCubic — departure
const BLUR = "blur(6px)"
/** Settles in ~310ms, so the slot has finished resizing before the word sharpens. */
const WIDTH_SPRING = { type: "spring", stiffness: 260, damping: 30 } as const

// The peak blur lands at opacity 0, so you never see sharp-but-blurred text.
//
// The exit eases *in* while the enter eases out. mode="wait" hands over only once
// the exit's full duration has elapsed, so an ease-out exit would spend its whole
// tail already invisible — 145ms of empty slot on a 220ms easeOutExpo exit. Easing
// in holds the word, then releases it exactly as the incoming one mounts (9ms).
const VARIANTS = {
  initial: { opacity: 0, filter: BLUR },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: {
    opacity: 0,
    filter: BLUR,
    transition: { duration: EXIT_DURATION, ease: EASE_IN },
  },
}

/** Crossfade only — no blur, and the slot width snaps — under prefers-reduced-motion. */
const REDUCED_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export function HeroWordSwap() {
  const reduce = useReducedMotion() ?? false
  const [index, setIndex] = useState(0)
  const word = WORDS[index] ?? WORDS[0]

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % WORDS.length),
      INTERVAL_MS,
    )
    return () => window.clearInterval(id)
  }, [])

  // Measure the active word from the invisible sizer, then animate the slot to it.
  // Animating the real `width` (not a transform) is what keeps the line from
  // snapping. The ResizeObserver catches width changes without a word change: the
  // webfont swapping in, or the fluid headline font-size crossing a breakpoint.
  const sizerRef = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)
  useEffect(() => {
    const el = sizerRef.current
    if (!el) return
    const measure = () => {
      const next = Math.round(el.scrollWidth)
      setWidth((prev) => (prev === next ? prev : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [word])

  const variants = reduce ? REDUCED_VARIANTS : VARIANTS

  return (
    <>
      <span className="sr-only">humans and agents</span>
      <motion.span
        aria-hidden
        className="inline-grid items-baseline align-baseline"
        animate={width != null ? { width } : undefined}
        transition={{ width: reduce ? { duration: 0 } : WIDTH_SPRING }}
      >
        {/* Sizer: invisibly holds the current word so the slot keeps a baseline and
            a measurable width through the swap, and never collapses between words. */}
        <span
          ref={sizerRef}
          className="invisible col-start-1 row-start-1 justify-self-start whitespace-nowrap"
        >
          {word}
        </span>
        {/* Visible word, swapped sequentially over the sizer (mode="wait").
            `initial={false}` so the first word shows statically on load. */}
        <span className="col-start-1 row-start-1 justify-self-start whitespace-nowrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              className="inline-block"
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ duration: ENTER_DURATION, ease: EASE_OUT }}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </>
  )
}
