"use client"

import { useEffect, useId, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const WORDS = ["humans", "agents"] as const
const DWELL_MS = 4000

const TRANSITION = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.3,
} as const

const VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const

export function HeroWordSwap() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const word = WORDS[index]!
  const uid = useId()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % WORDS.length),
      DWELL_MS,
    )
    return () => clearInterval(id)
  }, [reduced])

  // Per-occurrence character ids: letters both words share (a, n, s) keep their
  // identity across the swap, so they slide to their new position instead of
  // fading out and back in. The rest cross-fade.
  const characters = useMemo(() => {
    const counts: Record<string, number> = {}
    return word.split("").map((char) => {
      counts[char] = (counts[char] ?? 0) + 1
      return { id: `${uid}-${char}${counts[char]}`, label: char }
    })
  }, [word, uid])

  if (reduced) {
    return <span>humans</span>
  }

  return (
    <>
      <span className="sr-only">humans and agents</span>
      {/* Sized to the wider of the two words so the swap never reflows the line:
          "for" stays put and the morph is the only thing moving. */}
      <span aria-hidden className="relative inline-block">
        <span className="invisible">humans</span>
        <span className="absolute top-0 left-0 whitespace-nowrap">
          <AnimatePresence mode="popLayout" initial={false}>
            {characters.map((character) => (
              <motion.span
                key={character.id}
                layoutId={character.id}
                className="inline-block"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={VARIANTS}
                transition={TRANSITION}
              >
                {character.label}
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
      </span>
    </>
  )
}
