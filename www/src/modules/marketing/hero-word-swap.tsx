"use client"

import { useEffect, useRef, useState } from "react"

import { useTweak } from "@/dev/tweaker"

const WORDS = ["humans", "agents"] as const

const EASING = {
  "letter-flip": "cubic-bezier(0.77, 0, 0.175, 1)", // ease-in-out-quart
  "slide-blur": "cubic-bezier(0.645, 0.045, 0.355, 1)", // ease-in-out-cubic
  crossfade: "ease",
} as const

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
  const treatment = useTweak("Treatment", {
    type: "select",
    options: ["letter-flip", "slide-blur", "crossfade"],
    default: "letter-flip",
    group: "Hero swap",
  })
  const cycle = useTweak("Cycle", {
    type: "select",
    // loop: alternate forever · settle: humans → agents → humans, stop · once: humans → agents, stop
    options: ["loop", "settle", "once"],
    default: "loop",
    group: "Hero swap",
  })
  const dwell = useTweak("Dwell (s)", {
    type: "number",
    min: 2,
    max: 8,
    step: 0.5,
    default: 4,
    group: "Hero swap",
  })
  const duration = useTweak("Duration (ms)", {
    type: "number",
    min: 300,
    max: 900,
    step: 50,
    default: 600,
    group: "Hero swap",
  })
  const emphasize = useTweak("Emphasize word", {
    type: "boolean",
    default: false,
    group: "Hero swap",
  })

  const reduced = usePrefersReducedMotion()
  const [swapped, setSwapped] = useState(false)
  const toggles = useRef(0)

  useEffect(() => {
    // Restart the sequence whenever a tweak changes, so each option is seen fresh.
    toggles.current = 0
    setSwapped(false)
    if (reduced) return
    const max = cycle === "loop" ? Infinity : cycle === "once" ? 1 : 2
    const id = setInterval(() => {
      if (toggles.current >= max) {
        clearInterval(id)
        return
      }
      toggles.current += 1
      setSwapped((s) => !s)
    }, dwell * 1000)
    return () => clearInterval(id)
  }, [reduced, cycle, dwell, duration, treatment])

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
  }, [reduced, treatment])

  const emphasisClass = emphasize ? "text-fg" : undefined

  if (reduced) {
    return <span className={emphasisClass}>humans</span>
  }

  const ease = EASING[treatment]
  const transition = `transform ${duration}ms ${ease}, opacity ${duration}ms ${ease}, filter ${duration}ms ${ease}`
  const clip =
    treatment === "crossfade" ? "" : "[clip-path:inset(-0.15em_-0.4em)]"

  return (
    <>
      <span className="sr-only">humans and agents</span>
      <span
        aria-hidden
        className={`relative inline-block ${clip} ${emphasisClass ?? ""}`}
        style={{
          width: widths ? widths[swapped ? 1 : 0] : undefined,
          transition: `width ${duration}ms ${ease}`,
        }}
      >
        {/* Invisible in-flow anchor: establishes the baseline and the initial
            (pre-measurement) width, while the visible word rows sit absolutely
            on top so the wider word can't inflate the animated width. */}
        <span className="invisible">{WORDS[0]}</span>
        {WORDS.map((word, wi) => {
          const active = (wi === 1) === swapped
          if (treatment === "letter-flip") {
            // Each word keeps its natural letter widths and kerning; the
            // letters flip individually with a left-to-right stagger.
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
          }
          return (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[wi] = el
              }}
              className="absolute top-0 left-1/2 whitespace-nowrap"
              style={{
                transition,
                transform: `translateX(-50%) ${
                  active
                    ? "translateY(0)"
                    : treatment === "slide-blur"
                      ? `translateY(${wi === 0 ? "-0.7em" : "0.7em"})`
                      : "translateY(0)"
                }`,
                opacity: active ? 1 : 0,
                filter: active
                  ? "blur(0px)"
                  : treatment === "slide-blur"
                    ? "blur(6px)"
                    : "blur(3px)",
                willChange: "transform, filter",
              }}
            >
              {word}
            </span>
          )
        })}
      </span>
    </>
  )
}
