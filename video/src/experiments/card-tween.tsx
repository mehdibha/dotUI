import { AbsoluteFill, useCurrentFrame } from "remotion"

import { Controls } from "@/components/showcase/controls"

import { ease, keys, progress } from "../lib/motion"
import { preset, Theme, WarmIcons } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { tweenState } from "./tween"

/* Experiment 3: the Controls card, with the design system itself tweened
   between looks (see tween.ts). Same lineup as experiments 1 and 2. */
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
const TWEEN = 44
export const CARD_TWEEN_FRAMES = EVERY * ORDER.length

export function CardTween() {
  const frame = useCurrentFrame()
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  const k = swaps.findIndex(
    (at) => frame >= at - TWEEN / 2 && frame < at + TWEEN / 2,
  )
  const settled = swaps.filter((at) => frame >= at + TWEEN / 2).length
  const from = k >= 0 ? k : settled
  const t =
    k >= 0 ? progress(frame, swaps[k]! - TWEEN / 2, TWEEN, ease.camera) : 0
  const state = tweenState(
    preset(ORDER[from]!),
    preset(ORDER[k >= 0 ? k + 1 : from]!),
    t,
  )
  const drift = keys(
    frame,
    [
      [0, 1],
      [CARD_TWEEN_FRAMES, 1.04],
    ],
    ease.linear,
  )

  return (
    <AbsoluteFill style={{ transform: `scale(${drift})` }}>
      <WarmIcons />
      <Theme state={state}>
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <div style={{ width: 340, transform: "scale(1.6)" }}>
            <Controls />
          </div>
        </div>
      </Theme>
    </AbsoluteFill>
  )
}
