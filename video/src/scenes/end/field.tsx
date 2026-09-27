import { memo } from "react"

import { springAt } from "../../lib/motion"
import { CX, CY, T } from "./timeline"

/* The film's dot grid, drawn dot by dot so space itself can react: it sags
   toward the core while everything falls in, rebounds on impact, and every
   later beat sends a ring through it. */

const GAP = 28
const COLS = 36
const ROWS = 21

export type Ripple = {
  at: number
  x: number
  y: number
  /** Outward push, px. */
  push: number
  /** Extra brightness at the front. */
  glow: number
  /** Initial front speed, px per frame; the front eases out toward `reach`. */
  speed: number
  reach: number
  /** Frames until it has faded to ~1/e. */
  decay: number
  /** Band half-width, px. */
  width?: number
}

/** Radius of a ripple's front `t` frames after it starts. */
export const rippleFront = (rp: Ripple, t: number) =>
  rp.reach * (1 - Math.exp((-t * rp.speed) / rp.reach))

function pullAt(frame: number) {
  const peak = 0.6
  if (frame < T.impact) return peak * (frame / T.impact) ** 2.4
  return (
    peak *
    (1 - springAt(frame, T.impact, { damping: 9, stiffness: 120, mass: 0.8 }))
  )
}

export const Field = memo(function Field({
  frame,
  ripples,
  zoom = 1,
  opacity = 1,
}: {
  frame: number
  ripples: readonly Ripple[]
  zoom?: number
  opacity?: number
}) {
  const pull = pullAt(frame)
  const live = ripples.filter(
    (r) => frame >= r.at && frame - r.at < r.decay * 4,
  )
  const dots: React.ReactNode[] = []
  for (let j = -ROWS; j <= ROWS; j++) {
    for (let i = -COLS; i <= COLS; i++) {
      let x = CX + i * GAP
      let y = CY + j * GAP
      const r0 = Math.hypot(x - CX, y - CY)
      const sink = pull * Math.exp(-((r0 / 560) ** 2))
      x = CX + (x - CX) * (1 - sink)
      y = CY + (y - CY) * (1 - sink)
      let bright = 1 + 5 * pull * Math.exp(-((r0 / 240) ** 2))
      for (const rp of live) {
        const dx = x - rp.x
        const dy = y - rp.y
        const d = Math.hypot(dx, dy) || 1
        const t = frame - rp.at
        const front = rippleFront(rp, t)
        const fade = Math.exp(-t / rp.decay)
        const band = Math.exp(-(((d - front) / (rp.width ?? 56)) ** 2))
        const push = rp.push * band * fade
        x += (dx / d) * push
        y += (dy / d) * push
        bright += rp.glow * band * fade
      }
      dots.push(
        <circle
          key={`${i}.${j}`}
          cx={x.toFixed(2)}
          cy={y.toFixed(2)}
          r={Math.min(2.2, 1.15 + (bright - 1) * 0.18).toFixed(2)}
          fillOpacity={Math.min(0.9, 0.11 * bright).toFixed(3)}
        />,
      )
    }
  }
  return (
    <svg
      width={1920}
      height={1080}
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: zoom === 1 ? undefined : `scale(${zoom})`,
        transformOrigin: `${CX}px ${CY}px`,
        maskImage:
          "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
      }}
    >
      <g fill="#fff">{dots}</g>
    </svg>
  )
})
