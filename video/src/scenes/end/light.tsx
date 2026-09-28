import { useLayoutEffect, useRef } from "react"

/* Every pool of light in End on one canvas, computed per pixel and dithered:
   a near-black radial falloff in plain CSS quantizes into rings a level
   apart, which a re-encode turns into blocks. Sources combine like screen
   blending (white over the ground at the summed alpha). */

export type Light = {
  x: number
  y: number
  radius: number
  alpha: number
  /** Gaussian falloff instead of the pool's hot core and long tail. */
  soft?: boolean
}

const W = 1920
const H = 1080

/* The pool's profile (was a CSS gradient: stop, level). */
const POOL = [
  [0, 0.42],
  [0.07, 0.24],
  [0.18, 0.11],
  [0.34, 0.045],
  [0.56, 0.015],
  [0.78, 0.004],
  [1, 0],
] as const

const STEPS = 2048
const lut = (f: (r: number) => number) =>
  Float32Array.from({ length: STEPS + 1 }, (_, i) => f(i / STEPS))

const POOL_LUT = lut((r) => {
  for (let i = 1; i < POOL.length; i++) {
    const [r1, v1] = POOL[i]!
    const [r0, v0] = POOL[i - 1]!
    if (r <= r1) return v0 + ((v1 - v0) * (r - r0)) / (r1 - r0)
  }
  return 0
})
const SOFT_LUT = lut((r) => Math.exp(-4.5 * r * r) * (1 - r * r))

let noise: Float32Array | undefined
/** Static per-pixel dither, triangular over ±1 level (strong enough to
 *  outlive an H.264 pass), fixed in screen space so the grain never crawls. */
function ditherAt(size: number) {
  if (noise?.length !== size) {
    noise = new Float32Array(size)
    let h = 0x9e3779b9
    const next = () => {
      h ^= h << 13
      h ^= h >>> 17
      h ^= h << 5
      return (h >>> 0) / 4294967296
    }
    for (let i = 0; i < size; i++) noise[i] = next() + next() - 1
  }
  return noise
}

export function Lights({ lights }: { lights: readonly Light[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    const cw = Math.round(W * dpr)
    const ch = Math.round(H * dpr)
    if (canvas.width !== cw) {
      canvas.width = cw
      canvas.height = ch
    }
    ctx.clearRect(0, 0, cw, ch)
    const live = lights.filter((l) => l.alpha > 0.002 && l.radius > 0)
    if (!live.length) return

    // Union of the sources' boxes, in canvas pixels.
    const box = (l: Light) => [
      Math.max(0, Math.floor((l.x - l.radius) * dpr)),
      Math.max(0, Math.floor((l.y - l.radius) * dpr)),
      Math.min(cw, Math.ceil((l.x + l.radius) * dpr)),
      Math.min(ch, Math.ceil((l.y + l.radius) * dpr)),
    ]
    const boxes = live.map(box)
    const x0 = Math.min(...boxes.map((b) => b[0]!))
    const y0 = Math.min(...boxes.map((b) => b[1]!))
    const x1 = Math.max(...boxes.map((b) => b[2]!))
    const y1 = Math.max(...boxes.map((b) => b[3]!))
    const bw = x1 - x0
    const bh = y1 - y0
    if (bw <= 0 || bh <= 0) return

    // Transmittance: each source lets 1 - a of what's beneath through.
    const clear = new Float32Array(bw * bh).fill(1)
    live.forEach((l, s) => {
      const [lx0, ly0, lx1, ly1] = boxes[s]!
      const table = l.soft ? SOFT_LUT : POOL_LUT
      const cx = l.x * dpr
      const cy = l.y * dpr
      const inv = STEPS / (l.radius * dpr)
      for (let py = ly0!; py < ly1!; py++) {
        const dy = py + 0.5 - cy
        const row = (py - y0) * bw - x0
        for (let px = lx0!; px < lx1!; px++) {
          const dx = px + 0.5 - cx
          const i = Math.sqrt(dx * dx + dy * dy) * inv
          if (i >= STEPS) continue
          const a = Math.min(1, table[i | 0]! * l.alpha)
          const j = row + px
          clear[j] = clear[j]! * (1 - a)
        }
      }
    })

    const grain = ditherAt(cw * ch)
    const image = ctx.createImageData(bw, bh)
    const data = image.data
    for (let py = 0; py < bh; py++) {
      for (let px = 0; px < bw; px++) {
        const i = py * bw + px
        const a = 1 - clear[i]!
        if (a <= 0) continue
        const v = Math.round(a * 255 + grain[(py + y0) * cw + px + x0]!)
        if (v <= 0) continue
        const o = i * 4
        data[o] = 255
        data[o + 1] = 255
        data[o + 2] = 255
        data[o + 3] = Math.min(255, v)
      }
    }
    ctx.putImageData(image, x0, y0)
  })
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: W,
        height: H,
        pointerEvents: "none",
      }}
    />
  )
}
