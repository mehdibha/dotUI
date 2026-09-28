import { useLayoutEffect, useRef } from "react"
import { AbsoluteFill, useRemotionEnvironment } from "remotion"

/* The ground and the dot's light, drawn per pixel so nothing bands or clips:
   INK, the bloom — three Gaussian pools (a tight halo, a glow, a wide spill),
   each falling to exactly zero at 4σ — and Stage's vignette, dithered once.
   Stands in for Stage's own vignette (render the Stage with it off). */

const INK = [8, 8, 10] as const
const W = 1920
const H = 1080

/** Stage's vignette: ellipse 90% 80% at 50% 45%, clear to 55%, 0.55 black at 100%. */
const VIG = { cx: W / 2, cy: H * 0.45, rx: W * 0.9, ry: H * 0.8 }

const E4 = Math.exp(-8)
const LUT_STEP = 4 // entries per px of radius
/** Dither grain in frame px: finer is erased by the JPEG frames the render pipes. */
const GRAIN = 2

export function Ground({
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
  const ref = useRef<HTMLCanvasElement>(null)
  // Renders at the output scale; the Studio preview at half, to keep playback live.
  const { isRendering } = useRemotionEnvironment()
  const k = isRendering ? window.devicePixelRatio || 1 : 0.5
  const width = Math.round(W * k)
  const height = Math.round(H * k)
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d")
    if (ctx) draw(ctx, width, height, x, y, d, light)
  }, [width, height, x, y, d, light])
  return (
    <AbsoluteFill>
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  )
}

function pools(d: number, light: number) {
  return [
    { sigma: Math.max(50, d * 7), alpha: 0.04 * light },
    { sigma: d * 2.4, alpha: 0.13 * light },
    { sigma: d * 0.85, alpha: 0.5 * Math.min(light, 1.8) },
  ].filter((p) => p.alpha > 0.0005)
}

/** The bloom's coverage by radius (frame px), sampled every 1/LUT_STEP px. */
function bloomLut(d: number, light: number) {
  const layers = pools(d, light)
  const reach = Math.max(0, ...layers.map((p) => 4 * p.sigma))
  const lut = new Float32Array(Math.ceil(reach * LUT_STEP) + 2)
  for (let i = 0; i < lut.length; i++) {
    const r = i / LUT_STEP
    let clear = 1
    for (const p of layers) {
      const g = Math.exp(-(r * r) / (2 * p.sigma * p.sigma))
      clear *= 1 - (p.alpha * Math.max(0, g - E4)) / (1 - E4)
    }
    lut[i] = 1 - clear
  }
  return { lut, reach }
}

let buffer: ImageData | null = null

function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: number,
  y: number,
  d: number,
  light: number,
) {
  if (buffer?.width !== width || buffer.height !== height) {
    buffer = ctx.createImageData(width, height)
  }
  const data = buffer.data
  const k = width / W
  const cell = Math.max(1, Math.round(GRAIN * k))
  const { lut, reach } =
    light > 0.003 ? bloomLut(d, light) : { lut: null, reach: 0 }
  const last = lut ? lut.length - 2 : 0
  const reach2 = reach * reach

  for (let py = 0; py < height; py++) {
    const fy = (py + 0.5) / k
    const vy = (fy - VIG.cy) / VIG.ry
    const by = fy - y
    for (let px = 0; px < width; px++) {
      const i = (py * width + px) * 4
      const fx = (px + 0.5) / k
      const vx = (fx - VIG.cx) / VIG.rx
      const t2 = vx * vx + vy * vy
      const shade =
        t2 > 0.3025 ? 1 - 0.55 * Math.min(1, (Math.sqrt(t2) - 0.55) / 0.45) : 1

      let a = 0
      const bx = fx - x
      const r2 = bx * bx + by * by
      if (lut && r2 < reach2) {
        const f = Math.sqrt(r2) * LUT_STEP
        const j = Math.min(last, f | 0)
        a = lut[j]! + (lut[j + 1]! - lut[j]!) * (f - j)
      }

      if (a === 0 && shade === 1) {
        data[i] = INK[0]
        data[i + 1] = INK[1]
        data[i + 2] = INK[2]
      } else {
        // Interleaved gradient noise: a fixed ±1 LSB dither, no shimmer.
        const q =
          0.06711056 * ((px / cell) | 0) + 0.00583715 * ((py / cell) | 0)
        const n = 2 * ((52.9829189 * (q - Math.floor(q))) % 1) - 0.5
        data[i] = ((INK[0] + (255 - INK[0]) * a) * shade + n) | 0
        data[i + 1] = ((INK[1] + (255 - INK[1]) * a) * shade + n) | 0
        data[i + 2] = ((INK[2] + (255 - INK[2]) * a) * shade + n) | 0
      }
      data[i + 3] = 255
    }
  }
  ctx.putImageData(buffer, 0, 0)
}
