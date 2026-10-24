import { AbsoluteFill, useCurrentFrame } from "remotion"

import { Controls } from "@/components/showcase/controls"

import { ease, keys, progress } from "../lib/motion"
import { preset, WarmIcons } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { Morph } from "./morph"

/* Experiment 2: the Controls card morphing from look to look — every size,
   padding, radius, color and shadow travels; the typeface and icon glyphs
   switch at the midpoint, which lands on the beat.

   linear, vercel and polaris are left out: their grouped surfaces render a
   white card with near-white text in dark mode in the rig (open bug). */
const ORDER = [
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

const EVERY = BEAT * 2
const MORPH = 44
export const CARD_MORPH_FRAMES = EVERY * ORDER.length

/** Card text at ~22 px on screen; the comfortable presets still fit 1080. */
const SCALE = 1.6

function Card() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg">
      <div style={{ width: 340, transform: `scale(${SCALE})` }}>
        <Controls />
      </div>
    </div>
  )
}

export function CardMorph() {
  const frame = useCurrentFrame()
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  const k = swaps.findIndex(
    (at) => frame >= at - MORPH / 2 && frame < at + MORPH / 2,
  )
  const settled = swaps.filter((at) => frame >= at + MORPH / 2).length
  const from = k >= 0 ? k : settled
  const t =
    k >= 0 ? progress(frame, swaps[k]! - MORPH / 2, MORPH, ease.camera) : 0
  const drift = keys(
    frame,
    [
      [0, 1],
      [CARD_MORPH_FRAMES, 1.04],
    ],
    ease.linear,
  )

  return (
    <AbsoluteFill style={{ transform: `scale(${drift})` }}>
      <WarmIcons />
      <Morph
        from={preset(ORDER[from]!)}
        to={preset(ORDER[k >= 0 ? k + 1 : from]!)}
        t={t}
      >
        <Card />
      </Morph>
    </AbsoluteFill>
  )
}
