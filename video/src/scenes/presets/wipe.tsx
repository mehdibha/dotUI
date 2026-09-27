import { AbsoluteFill } from "remotion"

import { HEIGHT, WIDTH } from "../../lib/timing"
import type { Wipe } from "./slots"

/* Screen-space reveals. `t` is eased progress 0→1; inside the front the
   next look already shows. */

const CORNERS = [
  [0, 0],
  [WIDTH, 0],
  [0, HEIGHT],
  [WIDTH, HEIGHT],
] as const

/** A blade travelling along `angle` (deg from +x, y down). */
function blade(angle: number) {
  const a = (angle * Math.PI) / 180
  const d = [Math.cos(a), Math.sin(a)] as const
  const proj = CORNERS.map(
    ([x, y]) => (x - WIDTH / 2) * d[0] + (y - HEIGHT / 2) * d[1],
  )
  return { d, from: Math.min(...proj), to: Math.max(...proj) }
}

/** How far the front has travelled at `t`: px along the blade's axis, or
 *  the circle's radius. */
function front(wipe: Wipe, t: number) {
  if (wipe.kind === "circle") {
    const far = Math.max(
      ...CORNERS.map(([x, y]) => Math.hypot(x - wipe.x, y - wipe.y)),
    )
    return t * (far + 60)
  }
  const { from, to } = blade(wipe.angle)
  return from - 60 + t * (to - from + 120)
}

export function clipFor(wipe: Wipe, t: number) {
  const s = front(wipe, t)
  if (wipe.kind === "circle")
    return `circle(${s.toFixed(2)}px at ${wipe.x}px ${wipe.y}px)`
  const { d } = blade(wipe.angle)
  const n = [-d[1], d[0]] as const
  const L = 4000
  const cx = WIDTH / 2 + d[0] * s
  const cy = HEIGHT / 2 + d[1] * s
  const points = [
    [cx + n[0] * L, cy + n[1] * L],
    [cx - n[0] * L, cy - n[1] * L],
    [cx - n[0] * L - d[0] * L, cy - n[1] * L - d[1] * L],
    [cx + n[0] * L - d[0] * L, cy + n[1] * L - d[1] * L],
  ]
  return `polygon(${points.map(([x, y]) => `${x!.toFixed(2)}px ${y!.toFixed(2)}px`).join(", ")})`
}

/** The incoming look's shadow on the outgoing one, just ahead of the front:
 *  the swap reads as a sheet sliding over, not a crossfade. */
export function WipeShadow({ wipe, t }: { wipe: Wipe; t: number }) {
  const s = front(wipe, t)
  const shade = "rgba(0,0,0,0.28)"
  let background: string
  if (wipe.kind === "circle") {
    background = `radial-gradient(circle at ${wipe.x}px ${wipe.y}px, transparent ${s}px, ${shade} ${s}px, transparent ${s + 90}px)`
  } else {
    // CSS gradient angles run clockwise from "to top"; ours from +x, y down.
    const css = wipe.angle + 90
    const a = (css * Math.PI) / 180
    const length =
      Math.abs(WIDTH * Math.sin(a)) + Math.abs(HEIGHT * Math.cos(a))
    const at = s + length / 2
    background = `linear-gradient(${css}deg, transparent ${at}px, ${shade} ${at}px, transparent ${at + 90}px)`
  }
  return <AbsoluteFill style={{ opacity: 1 - t, background }} />
}

/** A hairline of the incoming brand riding the front, pushed toward white
 *  over a dark outgoing look and toward black over a light one, so a
 *  near-black or pale accent still draws a line. Render it inside the
 *  incoming Theme (for its accent) but outside the clip. */
export function WipeLine({
  wipe,
  t,
  over,
}: {
  wipe: Wipe
  t: number
  over: "light" | "dark"
}) {
  const s = front(wipe, t)
  const color = `color-mix(in oklab, var(--color-accent) ${over === "dark" ? 55 : 75}%, ${over === "dark" ? "white" : "black"})`
  const common = {
    position: "absolute",
    opacity: Math.min(1, (1 - t) * 1.6),
    boxShadow: `0 0 18px 1px color-mix(in oklab, ${color} 70%, transparent)`,
  } as const
  if (wipe.kind === "circle") {
    return (
      <div
        style={{
          ...common,
          left: wipe.x - s,
          top: wipe.y - s,
          width: s * 2,
          height: s * 2,
          borderRadius: "50%",
          border: `2px solid ${color}`,
        }}
      />
    )
  }
  const { d } = blade(wipe.angle)
  return (
    <div
      style={{
        ...common,
        left: WIDTH / 2 + d[0] * s - 2000,
        top: HEIGHT / 2 + d[1] * s - 1,
        width: 4000,
        height: 2,
        background: color,
        transform: `rotate(${wipe.angle + 90}deg)`,
      }}
    />
  )
}
