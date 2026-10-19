import { AbsoluteFill, useCurrentFrame } from "remotion"

import { Controls } from "@/components/showcase/controls"

import { ease, keys, progress, punches } from "../lib/motion"
import { preset, Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"

/* Experiment: the Controls showcase card alone, centered, sweeping from one
   look to the next. Each swap is a soft diagonal wipe whose midpoint lands on
   the beat; the whole frame (ground and card) carries the incoming look.

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

/** A look every two beats; the last swap lands back on the first look. */
const EVERY = BEAT * 2
const WIPE = 30
export const CARD_LOOKS_FRAMES = EVERY * (ORDER.length - 1) + EVERY

const CARD_WIDTH = 340
/** Card text at ~22 px on screen; the comfortable presets still fit 1080. */
const SCALE = 1.6
const FEATHER = 3
const GLOW = 6

function Look({ id, mask }: { id: string; mask?: string }) {
  return (
    <AbsoluteFill style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}>
      <Theme state={preset(id)} mode="dark">
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <div style={{ width: CARD_WIDTH, zoom: SCALE }}>
            <Controls />
          </div>
        </div>
      </Theme>
    </AbsoluteFill>
  )
}

export function CardLooks() {
  const frame = useCurrentFrame()
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  // The swap in flight, if any: its wipe spans [beat - WIPE/2, beat + WIPE/2].
  const k = swaps.findIndex((at) => frame >= at - WIPE / 2 && frame < at + WIPE / 2)
  const settled = swaps.filter((at) => frame >= at + WIPE / 2).length
  const from = k >= 0 ? k : settled
  const t = k >= 0 ? progress(frame, swaps[k]! - WIPE / 2, WIPE, ease.inOut) : 0
  // The edge travels past both corners so the feather never shows at rest.
  const edge = -FEATHER + t * (100 + 2 * FEATHER)
  const mask = `linear-gradient(115deg, black ${edge - FEATHER / 2}%, transparent ${edge + FEATHER / 2}%)`

  const drift = keys(frame, [[0, 1], [CARD_LOOKS_FRAMES, 1.04]], ease.linear)
  const scale = drift * (1 + punches(frame, swaps, 0.012))

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Look id={ORDER[from]!} />
        {k >= 0 && <Look id={ORDER[k + 1]!} mask={mask} />}
        {k >= 0 && (
          <AbsoluteFill
            style={{
              mixBlendMode: "plus-lighter",
              background: `linear-gradient(115deg, transparent ${edge - GLOW}%, rgb(255 255 255 / 0.09) ${edge}%, transparent ${edge + GLOW / 3}%)`,
            }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
