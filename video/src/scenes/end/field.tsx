import { useLayoutEffect, useRef } from "react"

import { springAt } from "../../lib/motion"
import { CX, CY, T } from "./timeline"

/* The film's dot grid, drawn dot by dot on a canvas so space itself can
   react: it sags toward the core while everything falls in, rebounds on
   impact, and every later beat sends a ring through it. */

const GAP = 28
const COLS = 38
const ROWS = 22

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
  if (frame < T.impact) return peak * (Math.max(0, frame) / T.impact) ** 2.4
  return (
    peak *
    (1 - springAt(frame, T.impact, { damping: 9, stiffness: 120, mass: 0.8 }))
  )
}

export function Field({
  frame,
  ripples,
  zoom = 1,
  offset = [0, 0],
  opacity = 1,
}: {
  frame: number
  ripples: readonly Ripple[]
  zoom?: number
  /** Grid phase, px (0,0 puts a dot on the centre). */
  offset?: readonly [number, number]
  opacity?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== 1920 * dpr) {
      canvas.width = 1920 * dpr
      canvas.height = 1080 * dpr
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Zoom about the centre.
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, 0, 0)
    ctx.translate(CX * (1 / zoom - 1), CY * (1 / zoom - 1))
    ctx.fillStyle = "#fff"

    const pull = pullAt(frame)
    const live = ripples.filter(
      (r) => frame >= r.at && frame - r.at < r.decay * 4,
    )
    for (let j = -ROWS; j <= ROWS; j++) {
      for (let i = -COLS; i <= COLS; i++) {
        let x = CX + i * GAP + offset[0]
        let y = CY + j * GAP + offset[1]
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
        ctx.globalAlpha = Math.min(0.9, 0.11 * bright)
        ctx.beginPath()
        ctx.arc(x, y, Math.min(2.2, 1.15 + (bright - 1) * 0.18), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  })
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: 1920,
        height: 1080,
        opacity,
        maskImage:
          "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  )
}
