import { useLayoutEffect, useRef, useState } from "react"
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from "remotion"

import { ease, progress } from "../lib/motion"
import { preset, Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"

/* Step-by-step rebuild of the morph, one layer at a time.

   Step 1: the background alone. Each look's page color is read from the
   real theme (a hidden swatch per look), and the frame blends the two in
   OKLab — exact at both ends, nothing else moving. */

export const ORDER = [
  "origin",
  "claude",
  "carbon",
  "duolingo",
  "material3",
  "airbnb",
  "spotify",
  "stripe",
  "origin",
] as const

export const EVERY = BEAT * 2
export const MORPH = 44
export const STEPS_FRAMES = EVERY * ORDER.length

/** 1200×675 rendered at 1.6× (1920×1080 out): layout at true size. */
export const STEPS_SIZE = { width: 1200, height: 675, scale: 1.6 }

/** The look pair and eased progress at `frame`. */
export function swapAt(frame: number) {
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  const k = swaps.findIndex(
    (at) => frame >= at - MORPH / 2 && frame < at + MORPH / 2,
  )
  const settled = swaps.filter((at) => frame >= at + MORPH / 2).length
  const from = k >= 0 ? k : settled
  return {
    from: ORDER[from]!,
    to: ORDER[k >= 0 ? k + 1 : from]!,
    t: k >= 0 ? progress(frame, swaps[k]! - MORPH / 2, MORPH, ease.camera) : 0,
  }
}

/** Every look's page color, read once from the real themes. */
function usePageColors() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [colors, setColors] = useState<Record<string, string> | null>(null)
  const [handle] = useState(() => delayRender("page colors"))
  useLayoutEffect(() => {
    if (colors) return
    const read: Record<string, string> = {}
    for (const id of new Set(ORDER)) {
      read[id] = getComputedStyle(refs.current[id]!).backgroundColor
    }
    setColors(read)
    continueRender(handle)
  }, [colors, handle])
  const swatches = [...new Set(ORDER)].map((id) => (
    <Theme key={id} state={preset(id)}>
      <div
        ref={(el) => {
          refs.current[id] = el
        }}
        className="bg-bg"
        style={{ position: "absolute", width: 0, height: 0 }}
      />
    </Theme>
  ))
  return { colors, swatches }
}

export function BackgroundStep() {
  const frame = useCurrentFrame()
  const { from, to, t } = swapAt(frame)
  const { colors, swatches } = usePageColors()
  const background = colors
    ? `color-mix(in oklab, ${colors[from]}, ${colors[to]} ${(t * 100).toFixed(3)}%)`
    : "transparent"
  return (
    <AbsoluteFill>
      {swatches}
      <AbsoluteFill style={{ background }} />
    </AbsoluteFill>
  )
}
