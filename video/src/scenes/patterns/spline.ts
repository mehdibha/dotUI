/* Monotone cubic (Fritsch–Carlson) through keyframes: C1-smooth camera
   channels with no overshoot. Tangents at the ends are free unless pinned —
   `startSlope: 0` starts from rest. */

export type Key = readonly [frame: number, value: number]

export function spline(
  points: readonly Key[],
  { startSlope, endSlope }: { startSlope?: number; endSlope?: number } = {},
) {
  const n = points.length
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const d: number[] = []
  for (let i = 0; i < n - 1; i++)
    d.push((ys[i + 1]! - ys[i]!) / (xs[i + 1]! - xs[i]!))
  const m: number[] = new Array(n).fill(0)
  m[0] = startSlope ?? d[0]!
  m[n - 1] = endSlope ?? d[n - 2]!
  for (let i = 1; i < n - 1; i++) {
    const a = d[i - 1]!
    const b = d[i]!
    m[i] = a * b <= 0 ? 0 : (a + b) / 2
  }
  for (let i = 0; i < n - 1; i++) {
    const di = d[i]!
    if (di === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i]! / di
    const b = m[i + 1]! / di
    const h = a * a + b * b
    if (h > 9) {
      const t = 3 / Math.sqrt(h)
      m[i] = t * a * di
      m[i + 1] = t * b * di
    }
  }
  return (x: number) => {
    if (x <= xs[0]!) return ys[0]! + (x - xs[0]!) * (startSlope ?? 0)
    if (x >= xs[n - 1]!) return ys[n - 1]! + (x - xs[n - 1]!) * m[n - 1]!
    let i = 0
    while (x > xs[i + 1]!) i++
    const h = xs[i + 1]! - xs[i]!
    const t = (x - xs[i]!) / h
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i]! +
      (t3 - 2 * t2 + t) * h * m[i]! +
      (-2 * t3 + 3 * t2) * ys[i + 1]! +
      (t3 - t2) * h * m[i + 1]!
    )
  }
}
