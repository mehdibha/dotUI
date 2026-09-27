/* The dot and its light. The bloom is three Gaussian pools — a tight halo, a
   glow, a wide spill: together a long, soft tail — each a many-stop radial
   gradient (a two-stop gradient reads as a grey disk, a Gaussian as light). */

function gaussian(alpha: number, stops = 14) {
  const out: string[] = []
  for (let i = 0; i <= stops; i++) {
    const r = i / stops // 0 → 3σ
    const a = alpha * Math.exp(-((r * 3) ** 2) / 2)
    out.push(`rgba(255,255,255,${a.toFixed(4)}) ${(r * 100).toFixed(1)}%`)
  }
  return `radial-gradient(circle closest-side, ${out.join(", ")})`
}

function Pool({
  x,
  y,
  sigma,
  alpha,
}: {
  x: number
  y: number
  sigma: number
  alpha: number
}) {
  if (alpha < 0.002) return null
  const r = sigma * 3
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        background: gaussian(alpha),
      }}
    />
  )
}

export function Bloom({
  x,
  y,
  d,
  light,
}: {
  x: number
  y: number
  d: number
  light: number
}) {
  if (light < 0.003) return null
  return (
    <>
      <Pool x={x} y={y} sigma={Math.max(50, d * 7)} alpha={0.04 * light} />
      <Pool x={x} y={y} sigma={d * 2.4} alpha={0.13 * light} />
      <Pool x={x} y={y} sigma={d * 0.85} alpha={0.5 * Math.min(light, 1.8)} />
    </>
  )
}

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
