import { clamp01, ease, lerp, progress } from "../../lib/motion"
import { WALL_H, WALL_W } from "./layout"
import { T } from "./timeline"

/* Light on the wall, in wall px (inside the layout zoom). */

/** The selection's touch ring: one soft ring off the dot on the click. */
export function ClickRing({
  frame,
  anchor: [ox, oy],
}: {
  frame: number
  anchor: [number, number]
}) {
  const age = frame - T.click
  if (age < 0 || age > 26) return null
  const t = ease.out(age / 26)
  const r = lerp(9, 70, t)
  return (
    <div
      style={{
        position: "absolute",
        left: ox - r,
        top: oy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.9)",
        opacity: (1 - t) * 0.7,
        pointerEvents: "none",
      }}
    />
  )
}

export type Glint = { left: number; top: number; alpha: number }

/** A slow glint that crosses the wall while the line is up (null when off). */
export function glintAt(frame: number): Glint | null {
  const t = progress(frame, 96, 200, ease.inOut)
  const alpha = 0.13 * Math.sin(clamp01(t) * Math.PI)
  if (alpha <= 0.001) return null
  return {
    left: -WALL_W / 2 + lerp(-0.75, 0.75, t) * WALL_W,
    top: -WALL_H / 2,
    alpha,
  }
}

/** The glint's slice over one tile: the same wall-sized gradient, offset. */
export function GlintLayer({
  glint,
  x,
  y,
}: {
  glint: Glint
  x: number
  y: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 12,
        backgroundImage: `linear-gradient(112deg, transparent 44%, rgba(255,255,255,${glint.alpha.toFixed(3)}) 50%, transparent 56%)`,
        backgroundSize: `${WALL_W * 2}px ${WALL_H * 2}px`,
        backgroundPosition: `${glint.left - x}px ${glint.top - y}px`,
        backgroundRepeat: "no-repeat",
        mixBlendMode: "plus-lighter",
        pointerEvents: "none",
      }}
    />
  )
}
