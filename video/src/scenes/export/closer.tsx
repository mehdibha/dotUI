import { useCurrentFrame } from "remotion"

import { ArrowUpRightIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { ease, lerp, progress, springAt } from "../../lib/motion"
import { Theme } from "../../lib/theme"
import { BlurWords, HEADLINE, TYPE } from "../../lib/type"
import { T } from "./data"

/* Bar 3's left column: the line, and the pill that lands last. Positions are
   screen px; the column drifts up slowly and keeps drifting past the cut. */

export const CLOSER = {
  left: 128,
  top: 318,
  pillTop: 642,
  /** The lg Button's 14 px label, zoomed to the CTA size. */
  pillZoom: TYPE.cta / 14,
} as const

/** The column's vertical drift (px), still moving past the cut. */
export const drift = (frame: number) => 12 - (frame - T.closer) * 0.1

export function Line() {
  const frame = useCurrentFrame()
  return (
    <div
      style={{
        ...HEADLINE,
        position: "absolute",
        left: CLOSER.left,
        top: CLOSER.top + drift(frame),
        fontSize: TYPE.statement,
        whiteSpace: "nowrap",
      }}
    >
      <div>
        <BlurWords text="Own the" start={T.closer} stagger={5} />
      </div>
      <div>
        <BlurWords text="code." start={T.closer + 12} stagger={5} />
      </div>
    </div>
  )
}

export function Pill() {
  const frame = useCurrentFrame()
  if (frame < T.pill) return null
  const pop = springAt(frame, T.pill, "pop")
  const ring = progress(frame, T.pill + 4, 34, ease.out)
  return (
    <div
      style={{
        position: "absolute",
        left: CLOSER.left + 4,
        top: CLOSER.pillTop + drift(frame),
        transformOrigin: "0 50%",
        transform: `translateY(${((1 - pop) * 30).toFixed(2)}px) scale(${lerp(0.72, 1, pop).toFixed(4)})`,
        opacity: progress(frame, T.pill, 8, ease.linear),
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          zoom: CLOSER.pillZoom,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.75)",
            transform: `scale(${1 + 0.4 * ring})`,
            opacity: 0.6 * (1 - ring),
          }}
        />
        <Theme mode="dark">
          <Button variant="primary" size="lg" className="rounded-full px-4">
            Open in v0
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </Theme>
      </div>
    </div>
  )
}
