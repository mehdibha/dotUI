"use client"

import { useEffect, useRef, useState } from "react"

// "humans" and "agents" are both 6 letters ending in "s" — the swap can be
// layout-stable apart from a small width tween between the two words.
const WORDS = ["humans", "agents"] as const

const EASE = "cubic-bezier(0.77, 0, 0.175, 1)" // ease-in-out-quart
const DURATION_MS = 600
const DWELL_MS = 4000
const STAGGER_MS = 35

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

export function HeroWordSwap() {
  const reduced = usePrefersReducedMotion()
  const [swapped, setSwapped] = useState(false)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setSwapped((s) => !s), DWELL_MS)
    return () => clearInterval(id)
  }, [reduced])

  // The words differ in width (~30px at hero size), so the container tracks the
  // active word's measured width and the centered line gently re-centers.
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([null, null])
  const [widths, setWidths] = useState<[number, number] | null>(null)
  useEffect(() => {
    if (reduced) return
    const measure = () => {
      const [a, b] = wordRefs.current.map(
        (el) => el?.getBoundingClientRect().width,
      )
      if (a && b) setWidths([a, b])
    }
    measure()
    // Re-measures on font swap and on the vw-clamped font-size changing.
    const ro = new ResizeObserver(measure)
    for (const el of wordRefs.current) if (el) ro.observe(el)
    return () => ro.disconnect()
  }, [reduced])

  if (reduced) {
    return <span>humans</span>
  }

  const transition = `transform ${DURATION_MS}ms ${EASE}, opacity ${DURATION_MS}ms ${EASE}`

  return (
    <>
      <span className="sr-only">humans and agents</span>
      <span
        aria-hidden
        className="relative inline-block [clip-path:inset(-0.15em_-0.4em)]"
        style={{
          width: widths ? widths[swapped ? 1 : 0] : undefined,
          transition: `width ${DURATION_MS}ms ${EASE}`,
        }}
      >
        {/* Invisible in-flow anchor: establishes the baseline and the initial
            (pre-measurement) width, while the visible word rows sit absolutely
            on top so the wider word can't inflate the animated width. */}
        <span className="invisible">{WORDS[0]}</span>
        {WORDS.map((word, wi) => {
          const active = (wi === 1) === swapped
          // Each word keeps its natural letter widths; the letters flip
          // individually with a left-to-right stagger.
          return (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[wi] = el
              }}
              className="absolute top-0 left-1/2 inline-flex -translate-x-1/2 whitespace-nowrap"
            >
              {word.split("").map((ch, i) => (
                <span
                  key={i}
                  style={{
                    transition,
                    transitionDelay: `${i * STAGGER_MS}ms`,
                    transform: active
                      ? "translateY(0)"
                      : `translateY(${wi === 0 ? "-100%" : "100%"})`,
                    opacity: active ? 1 : 0,
                    willChange: "transform",
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          )
        })}
      </span>
    </>
  )
}
