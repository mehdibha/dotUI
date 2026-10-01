/* The dot and its rings. Its light is drawn with the ground (ground.tsx). */

/** The dot, smeared along its path when it moves fast — its motion blur. */
export function Dot({
  x,
  y,
  d,
  v,
  angle,
}: {
  x: number
  y: number
  d: number
  v: number
  angle: number
}) {
  const stretch = Math.min(3, 1 + (0.55 * v) / d)
  const smear = Math.min(2.5, 0.04 * v)
  return (
    <div
      style={{
        position: "absolute",
        left: x - d / 2,
        top: y - d / 2,
        width: d,
        height: d,
        borderRadius: "50%",
        background: "#fff",
        filter: smear > 0.2 ? `blur(${smear.toFixed(2)}px)` : undefined,
        transform:
          stretch > 1.005
            ? `rotate(${angle.toFixed(2)}deg) scaleX(${stretch.toFixed(4)}) rotate(${(-angle).toFixed(2)}deg)`
            : undefined,
      }}
    />
  )
}

/** A thin ring of light leaving the dot (the pop, the landing). */
export function Ring({
  x,
  y,
  r,
  alpha,
}: {
  x: number
  y: number
  r: number
  alpha: number
}) {
  if (alpha < 0.004) return null
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `1.5px solid rgba(255,255,255,${alpha.toFixed(3)})`,
        boxShadow: `0 0 16px rgba(255,255,255,${(alpha * 0.45).toFixed(3)}), inset 0 0 16px rgba(255,255,255,${(alpha * 0.25).toFixed(3)})`,
      }}
    />
  )
}
