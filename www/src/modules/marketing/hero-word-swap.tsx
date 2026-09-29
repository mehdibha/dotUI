"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const WORDS = ["humans", "agents"] as const
const INTERVAL_MS = 3000

const TRANSITION = { duration: 0.28, ease: [0.16, 1, 0.3, 1] } as const
const WIDTH_SPRING = { type: "spring", stiffness: 260, damping: 30 } as const

// Both words share one grid cell and run the same curve in opposite directions,
// so their opacities always sum to 1: a sequential swap blinks the slot empty.
const HIDDEN = { opacity: 0, filter: "blur(6px)" }
const SHOWN = { opacity: 1, filter: "blur(0px)" }

/**
 * Words render through `content: attr(data-word)` so crawlers read the sr-only
 * "humans and agents", not the rotating copies.
 */
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

  // Animating the real width keeps "for" from snapping; the observer catches
  // webfont swaps and fluid font-size changes.
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

  const cell =
    "col-start-1 row-start-1 justify-self-start whitespace-nowrap before:content-[attr(data-word)]"

  return (
    <>
      <span className="sr-only">humans and agents</span>
      <motion.span
        aria-hidden
        className="inline-grid items-baseline align-baseline"
        animate={width != null ? { width } : undefined}
        transition={{ width: reduce ? { duration: 0 } : WIDTH_SPRING }}
      >
        <span ref={sizerRef} data-word={word} className={`invisible ${cell}`} />
        <AnimatePresence initial={false}>
          <motion.span
            key={word}
            data-word={word}
            className={cell}
            initial={reduce ? { opacity: 0 } : HIDDEN}
            animate={reduce ? { opacity: 1 } : SHOWN}
            exit={reduce ? { opacity: 0 } : HIDDEN}
            transition={TRANSITION}
          />
        </AnimatePresence>
      </motion.span>
    </>
  )
}
