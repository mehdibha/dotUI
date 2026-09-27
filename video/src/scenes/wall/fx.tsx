import { ease, lerp } from "../../lib/motion"
import { T } from "./timeline"

/** The selection's touch ring: one soft ring off the dot on the click (wall px). */
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
