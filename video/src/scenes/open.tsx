import { AbsoluteFill, useCurrentFrame } from "remotion"

import { ease, lerp, progress } from "../lib/motion"
import { Stage } from "../lib/stage"
import { Dot, Ring } from "./open/dot"
import { Ground } from "./open/ground"
import { useLayout } from "./open/measure"
import { Sentence } from "./open/sentence"
import {
  CX,
  CY,
  dotAt,
  pushAt,
  T,
  velocityAt,
  wipeAt,
  wordStarts,
} from "./open/timeline"

/* Scene 1 — the cold open. A white dot pops into the dark and pulses on
   every beat. "Every product is built on" resolves while the dot drops to the start
   of the next line, then it writes "a design system" — the words resolving in
   its wake — and lands as the sentence's true period on the downbeat. The
   words blur away; the dot recentres at Wall's 10 px. */

export function Open() {
  const frame = useCurrentFrame()
  const { layout, probe } = useLayout()
  const dot = dotAt(frame, layout)
  const { v, angle } = velocityAt(frame, layout)
  const s = pushAt(frame)

  return (
    <Stage grid={false} vignette={false}>
      <Ground x={dot.x} y={dot.y} d={dot.d} light={dot.light} />
      {probe}
      <AbsoluteFill
        style={{
          transform: `scale(${s.toFixed(5)})`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      >
        <Sentence
          top={layout.top}
          starts={wordStarts(layout)}
          wipe={wipeAt(frame, layout)}
        />
      </AbsoluteFill>
      <PopRing frame={frame} />
      <LandRing frame={frame} x={dot.x} y={dot.y} />
      <Dot x={dot.x} y={dot.y} d={dot.d} v={v} angle={angle} />
    </Stage>
  )
}

function PopRing({ frame }: { frame: number }) {
  const t = progress(frame, 1, 56, ease.out)
  return (
    <Ring x={CX} y={CY} r={lerp(20, 360, t)} alpha={0.26 * (1 - t) ** 1.6} />
  )
}

function LandRing({ frame, x, y }: { frame: number; x: number; y: number }) {
  if (frame < T.land) return null
  const t = progress(frame, T.land, 40, ease.out)
  return <Ring x={x} y={y} r={lerp(10, 120, t)} alpha={0.22 * (1 - t) ** 1.6} />
}
