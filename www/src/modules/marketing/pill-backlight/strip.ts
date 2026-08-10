/**
 * The LED strip: a ring of emitters riding the pill's stadium boundary — two
 * semicircular caps and two straight runs. Each emitter carries a quadrature
 * weight (the arc length it stands for), normalised so the weights sum to 1,
 * making the shader's accumulation a weighted average of the strip regardless
 * of how it was sampled.
 *
 * The parameterisation starts at the top-left cap/edge junction and runs
 * clockwise on screen (top edge, right cap, bottom edge, left cap).
 *
 * The budget is a shader compile-time constant, so it's fixed and split
 * across the four segments proportionally to their arc length at build time —
 * the pill's flat edges are ~10× a cap's length, and even spacing is what
 * keeps the tight rim lobe continuous instead of beading per emitter.
 */
// 192 vec4s + scalars stays under WebGL2's guaranteed 224 fragment uniforms.
export const LED_COUNT = 192
const MIN_PER_SEGMENT = 4

// Brightness envelope travelling along the strip: a wrapped Gaussian bump over
// a low floor, so one cluster reads hot while the whole rim keeps a faint
// glow. The shader's analytic rim mirrors this envelope — keep ENVELOPE_SIGMA
// in sync with ENV_2SIGMA2 in fragment.ts.
const ENVELOPE_FLOOR = 0.1
const ENVELOPE_PEAK = 1
const ENVELOPE_SIGMA = 0.18

// Whole-rim hover glow: while the pill is hovered the cluster gives way to a
// band of light around the entire perimeter, kept alive by waves circling it.
// The count must be an integer so the pattern tiles around the loop; speed is
// in laps per second. Mirrored in fragment.ts via template constants.
export const WAVE_BASE = 0.55
export const WAVE_AMP = 0.3
export const WAVE_COUNT = 2
export const WAVE_SPEED = 0.25

export type Led = {
  x: number
  y: number
  /** Outward unit normal scaled by the quadrature weight. */
  nx: number
  ny: number
  /** Position along the strip, normalised arc length in [0, 1). */
  s: number
}

/** Stadium in shader space: origin at canvas centre, y up, half-height 0.5. */
export type Stadium = {
  cx: number
  cy: number
  /** Half the straight-edge length. */
  halfFlat: number
  radius: number
}

/** Split LED_COUNT across segments proportionally to length, exactly. */
function allocateLeds(lengths: number[]): number[] {
  const total = lengths.reduce((a, b) => a + b, 0)
  const counts = lengths.map((l) =>
    Math.max(MIN_PER_SEGMENT, Math.floor((LED_COUNT * l) / total)),
  )
  // Settle the rounding difference against the longest segments.
  const order = lengths
    .map((_, i) => i)
    .sort((a, b) => (lengths[b] ?? 0) - (lengths[a] ?? 0))
  let diff = LED_COUNT - counts.reduce((a, b) => a + b, 0)
  for (let i = 0; diff !== 0; i++) {
    const idx = order[i % order.length] ?? 0
    const step = Math.sign(diff)
    const next = (counts[idx] ?? 0) + step
    if (next >= MIN_PER_SEGMENT) {
      counts[idx] = next
      diff -= step
    }
  }
  return counts
}

export function buildStrip({ cx, cy, halfFlat, radius }: Stadium): Led[] {
  const leds: Led[] = []
  const edgeLen = 2 * halfFlat
  const capLen = Math.PI * radius
  const [nTop, nRight, nBottom, nLeft] = allocateLeds([
    edgeLen,
    capLen,
    edgeLen,
    capLen,
  ]) as [number, number, number, number]

  const edge = (x0: number, x1: number, y: number, ny: number, n: number) => {
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n
      leds.push({ x: x0 + (x1 - x0) * t, y, nx: 0, ny, s: edgeLen / n })
    }
  }
  // Semicircle from `a0`, sweeping clockwise on screen.
  const cap = (capX: number, a0: number, n: number) => {
    for (let k = 0; k < n; k++) {
      const a = a0 - Math.PI * ((k + 0.5) / n)
      const nx = Math.cos(a)
      const ny = Math.sin(a)
      leds.push({
        x: capX + nx * radius,
        y: cy + ny * radius,
        nx,
        ny,
        s: capLen / n,
      })
    }
  }

  edge(cx - halfFlat, cx + halfFlat, cy + radius, 1, nTop)
  cap(cx + halfFlat, Math.PI / 2, nRight)
  edge(cx + halfFlat, cx - halfFlat, cy - radius, -1, nBottom)
  cap(cx - halfFlat, -Math.PI / 2, nLeft)

  // `s` currently holds each emitter's raw arc length. Turn it into normalised
  // arc position and fold the normalised weight into the stored normal.
  const total = leds.reduce((sum, led) => sum + led.s, 0)
  let walked = 0
  for (const led of leds) {
    const length = led.s
    const weight = length / total
    led.nx *= weight
    led.ny *= weight
    led.s = (walked + length * 0.5) / total
    walked += length
  }
  return leds
}

/**
 * Pack the strip into the shader's uniform array: xy = position, zw = outward
 * normal times quadrature weight times brightness. Folding all three into one
 * vector lets the shader recover cosine, weight and brightness from a single
 * dot product — the weight cancels against the `1/r` in the cosine.
 *
 * `hover` crossfades the travelling bump toward the circling whole-rim wave
 * (the floor stays), with `phase` its position in laps.
 */
export function packStrip(
  leds: Led[],
  target: number,
  out: Float32Array,
  hover = 0,
  phase = 0,
) {
  let o = 0
  for (const led of leds) {
    let ds = Math.abs(led.s - target)
    if (ds > 0.5) ds = 1 - ds
    const bump = Math.exp(-(ds * ds) / (2 * ENVELOPE_SIGMA ** 2))
    const wave =
      WAVE_BASE +
      WAVE_AMP * Math.cos(2 * Math.PI * (led.s * WAVE_COUNT - phase))
    const b = ENVELOPE_FLOOR + ENVELOPE_PEAK * (bump + (wave - bump) * hover)
    out[o] = led.x
    out[o + 1] = led.y
    out[o + 2] = led.nx * b
    out[o + 3] = led.ny * b
    o += 4
  }
}
