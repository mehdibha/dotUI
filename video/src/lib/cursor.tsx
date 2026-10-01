import { useCurrentFrame } from "remotion"

import { clamp01, ease } from "./motion"

/* A synthetic pointer: keyframed path, click dips with a ripple, held presses
   for drags. Coordinates are in the parent's px space, so put it inside the
   same Camera/plane as the UI it drives. */

export type CursorKey = readonly [frame: number, x: number, y: number]

export function cursorAt(frame: number, path: readonly CursorKey[]) {
  const first = path[0]!
  if (frame <= first[0]) return [first[1], first[2]] as const
  for (let i = 1; i < path.length; i++) {
    const [f1, x1, y1] = path[i]!
    const [f0, x0, y0] = path[i - 1]!
    if (frame <= f1) {
      const t = ease.camera(clamp01((frame - f0) / Math.max(1, f1 - f0)))
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] as const
    }
  }
  const last = path[path.length - 1]!
  return [last[1], last[2]] as const
}

export function Cursor({
  path,
  clicks = [],
  presses = [],
  from,
  to,
  size = 1,
  tone = "light",
}: {
  path: readonly CursorKey[]
  clicks?: readonly number[]
  presses?: ReadonlyArray<readonly [number, number]>
  /** Visible window (defaults to the path's span). */
  from?: number
  to?: number
  size?: number
  tone?: "light" | "dark"
}) {
  const frame = useCurrentFrame()
  const start = from ?? path[0]![0]
  const end = to ?? Infinity
  if (frame < start || frame > end) return null
  const [x, y] = cursorAt(frame, path)
  const fadeIn = clamp01((frame - start) / 8)
  const fadeOut = end === Infinity ? 1 : clamp01((end - frame) / 8)
  const dip = clicks.reduce((acc, c) => {
    const d = frame - c
    return d >= 0 && d < 10
      ? Math.min(acc, 1 - 0.16 * Math.sin((d / 10) * Math.PI))
      : acc
  }, 1)
  const held = presses.some(([a, b]) => frame >= a && frame <= b) ? 0.86 : 1
  const fill = tone === "light" ? "#0a0a0a" : "#ffffff"
  const stroke = tone === "light" ? "#ffffff" : "#0a0a0a"
  return (
    <>
      {clicks
        .map((c) => frame - c)
        .filter((d) => d >= 0 && d < 24)
        .map((d, i) => {
          const t = ease.out(d / 24)
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 24 * size,
                top: y - 24 * size,
                width: 48 * size,
                height: 48 * size,
                borderRadius: 999,
                border: `${2 * size}px solid rgba(255,255,255,0.85)`,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
                transform: `scale(${0.25 + t * 0.95})`,
                opacity: (1 - t) * fadeIn,
                pointerEvents: "none",
              }}
            />
          )
        })}
      <svg
        width={28 * size}
        height={34 * size}
        viewBox="0 0 28 34"
        style={{
          position: "absolute",
          left: x - 4 * size,
          top: y - 3 * size,
          transformOrigin: `${4 * size}px ${3 * size}px`,
          transform: `scale(${dip * held})`,
          opacity: fadeIn * fadeOut,
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <path
          d="M4 3 L4 26.5 L10 21 L14.2 30.6 L18.4 28.8 L14.3 19.4 L22.4 19.4 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </>
  )
}
