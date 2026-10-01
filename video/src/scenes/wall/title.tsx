import type { CSSProperties } from "react"
import { AbsoluteFill } from "remotion"

import { Lockup, Mark } from "../../lib/brand"
import { ease, lerp, progress, pulse, punch } from "../../lib/motion"
import { T } from "./timeline"

const HEIGHT = 150
/** Room around the lockup for the blur halo, inside the mask box. */
const PAD = 48

/* The lockup resolves out of blur left to right — the mark, then the word,
   then "Studio", like BlurWords' stagger — lands with the beat's punch, and
   keeps breathing toward the cut while the mark's ink dot beats (the dot of a
   bare Mark laid over the lockup's, since Lockup takes no dot). `p` is the
   resolve front, in % of the box. */
export function Title({ frame }: { frame: number }) {
  if (frame < T.lockup) return null
  const p = lerp(-30, 130, progress(frame, T.lockup, 22, ease.soft))
  const scale =
    (1 + punch(frame, T.land)) *
    lerp(0.985, 1.015, (frame - T.lockup) / (T.end - T.lockup))
  const box: CSSProperties = { padding: PAD }
  const beat = T.pulses.reduce(
    (a, at, i) => a + (0.26 - i * 0.06) * pulse(frame - at),
    0,
  )
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale.toFixed(5)})`,
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            ...box,
            maskImage: `linear-gradient(90deg, #000 ${p - 26}%, transparent ${p - 4}%)`,
          }}
        >
          <Lockup height={HEIGHT} studio />
        </div>
        {p < 125 ? (
          <div
            style={{
              ...box,
              position: "absolute",
              inset: 0,
              filter: "blur(12px)",
              maskImage: `linear-gradient(90deg, transparent ${p - 26}%, #000 ${p - 10}%, #000 ${p}%, transparent ${p + 22}%)`,
            }}
          >
            <Lockup height={HEIGHT} studio />
          </div>
        ) : null}
        {beat > 0.002 ? (
          <Mark
            size={HEIGHT}
            dot={1 + beat}
            color="transparent"
            style={{ position: "absolute", left: PAD, top: PAD }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  )
}
