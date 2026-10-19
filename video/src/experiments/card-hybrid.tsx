import { AbsoluteFill, useCurrentFrame } from "remotion"

import { Controls } from "@/components/showcase/controls"

import { ease, progress } from "../lib/motion"
import { preset, WarmIcons } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { Morph } from "./morph"
import { tweenState } from "./tween"

/* Experiment 4: the engine tweens what it can (colors, hues, radius, stroke —
   tween.ts), so every frame's colors are a real, legible design system; the
   DOM morph (morph.tsx) carries what the engine can only switch (density,
   type, variants) between two copies that already share those colors. */
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
export const CARD_HYBRID_FRAMES = EVERY * ORDER.length

/* The composition is 1200×675 rendered at 1.6× (1920×1080 out), so the card
   lays out at its true size with device pixels at 1/1.6 px. Scaling a 1×
   layout up instead magnifies every whole-pixel snap into a visible jump. */
export const CARD_HYBRID_SIZE = { width: 1200, height: 675, scale: 1.6 }

function Card() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg">
      <div style={{ width: 340 }}>
        <Controls />
      </div>
    </div>
  )
}

export function CardHybrid() {
  const frame = useCurrentFrame()
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  const k = swaps.findIndex(
    (at) => frame >= at - MORPH / 2 && frame < at + MORPH / 2,
  )
  const settled = swaps.filter((at) => frame >= at + MORPH / 2).length
  const from = k >= 0 ? k : settled
  const t =
    k >= 0 ? progress(frame, swaps[k]! - MORPH / 2, MORPH, ease.camera) : 0
  const a = preset(ORDER[from]!)
  const b = preset(ORDER[k >= 0 ? k + 1 : from]!)

  return (
    <AbsoluteFill>
      <WarmIcons />
      <Morph from={tweenState(a, b, t, "a")} to={tweenState(a, b, t, "b")} t={t}>
        <Card />
      </Morph>
    </AbsoluteFill>
  )
}
