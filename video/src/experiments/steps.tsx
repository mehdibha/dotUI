import { useLayoutEffect, useRef } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

import { Controls } from "@/components/showcase/controls"

import { ease, progress } from "../lib/motion"
import { preset, Theme, WarmIcons } from "../lib/theme"
import { BEAT } from "../lib/timing"

/* Step-by-step rebuild of the morph, one layer at a time.

   Step 1: the background alone. Each look's page color is read from the
   real theme (a hidden swatch per look), and the frame blends the two in
   OKLab: exact at both ends, nothing else moving.

   Step 2: the card surface, empty. Each look's real Controls card is laid
   out in a hidden probe, and its box, fill, border, radius and shadows are
   read off it and blended every frame. */

export const ORDER = [
  "origin",
  "claude",
  "carbon",
  "duolingo",
  "material3",
  "airbnb",
  "spotify",
  "stripe",
  "origin",
] as const

export const EVERY = BEAT * 2
export const MORPH = 44
export const STEPS_FRAMES = EVERY * ORDER.length

/** 1200×675 rendered at 1.6× (1920×1080 out): layout at true size. */
export const STEPS_SIZE = { width: 1200, height: 675, scale: 1.6 }

/** The look pair and eased progress at `frame`. */
export function swapAt(frame: number) {
  const swaps = ORDER.slice(1).map((_, i) => (i + 1) * EVERY)
  const k = swaps.findIndex(
    (at) => frame >= at - MORPH / 2 && frame < at + MORPH / 2,
  )
  const settled = swaps.filter((at) => frame >= at + MORPH / 2).length
  const from = k >= 0 ? k : settled
  return {
    from: ORDER[from]!,
    to: ORDER[k >= 0 ? k + 1 : from]!,
    t: k >= 0 ? progress(frame, swaps[k]! - MORPH / 2, MORPH, ease.camera) : 0,
  }
}

const toLinear = (c: number) =>
  (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const toSrgb = (c: number) =>
  255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function oklab([r, g, b]: readonly number[]) {
  const [lr, lg, lb] = [toLinear(r!), toLinear(g!), toLinear(b!)]
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

/** OKLab → sRGB, unrounded (0–255 floats). */
function srgb([L, a, b]: number[]) {
  const l = (L! + 0.3963377774 * a! + 0.2158037573 * b!) ** 3
  const m = (L! - 0.1055613458 * a! - 0.0638541728 * b!) ** 3
  const s = (L! - 0.0894841775 * a! - 1.291485548 * b!) ** 3
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

const LOOKS = [...new Set(ORDER)]
const CARD_WIDTH = 340

type Rgba = [number, number, number, number]

let swatch: CanvasRenderingContext2D | null = null
/** 8-bit sRGB + alpha of any CSS color, via a 1×1 canvas. */
function rgbaOf(css: string): Rgba {
  swatch ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })!
  swatch.clearRect(0, 0, 1, 1)
  swatch.fillStyle = css
  swatch.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!, a! / 255]
}

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: Rgba
}

interface Surface {
  page: Rgba
  fill: Rgba
  border: Rgba
  stroke: number
  radius: number
  width: number
  height: number
  shadows: Shadow[]
}

/** Outer shadows of a computed box-shadow ("color x y blur spread, …"). */
function shadowsOf(css: string): Shadow[] {
  if (css === "none") return []
  return css
    .split(/,(?![^(]*\))/)
    .filter((layer) => !layer.includes("inset"))
    .map((layer) => {
      const color = layer.match(/^\s*([a-z-]+\([^)]*\)|#\w+|[a-z]+)/)?.[1]
      const [x = 0, y = 0, blur = 0, spread = 0] = [
        ...layer.replace(color ?? "", "").matchAll(/(-?[\d.]+)px/g),
      ].map((m) => Number(m[1]))
      return { x, y, blur, spread, color: rgbaOf(color ?? "transparent") }
    })
}

/** The surface of the card inside a probe (null until it has laid out). */
function measure(probe: HTMLElement): Surface | null {
  const card = probe.querySelector<HTMLElement>("[data-card]")
  if (!card?.offsetHeight) return null
  const cs = getComputedStyle(card)
  return {
    page: rgbaOf(getComputedStyle(probe).backgroundColor),
    fill: rgbaOf(cs.backgroundColor),
    border: rgbaOf(cs.borderTopColor),
    stroke: parseFloat(cs.borderTopWidth),
    radius: parseFloat(cs.borderTopLeftRadius),
    width: card.offsetWidth,
    height: card.offsetHeight,
    shadows: shadowsOf(cs.boxShadow),
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Two opaque colors blended in OKLab, unrounded sRGB. */
const mixOklab = (a: Rgba, b: Rgba, t: number) => {
  const [la, lb] = [oklab(a), oklab(b)]
  return srgb(la.map((v, i) => lerp(v, lb[i]!, t)))
}

/** `top` composited over an opaque `base`, in sRGB like the browser. */
const over = (top: Rgba, base: Rgba): Rgba => [
  lerp(base[0], top[0], top[3]),
  lerp(base[1], top[1], top[3]),
  lerp(base[2], top[2], top[3]),
  1,
]

/** Translucent colors blend premultiplied, so a fade never darkens. */
function mixRgba(a: Rgba, b: Rgba, t: number) {
  const alpha = lerp(a[3], b[3], t)
  const ch = (i: number) =>
    alpha ? lerp(a[i]! * a[3], b[i]! * b[3], t) / alpha : 0
  return `rgba(${ch(0)}, ${ch(1)}, ${ch(2)}, ${alpha})`
}

const NO_SHADOW: Shadow = {
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  color: [0, 0, 0, 0],
}

/** Triangular noise of ±1 level, seeded so a frame always renders alike. */
function noise(seed: number) {
  let x = seed * 0x9e3779b1 || 1
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    const a = (x >>> 0) / 4294967296
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return a + (x >>> 0) / 4294967296 - 1
  }
}

/** Distance from a pixel to a rounded rect's edge (negative inside). */
function roundRectDistance(
  px: number,
  py: number,
  cx: number,
  cy: number,
  hx: number,
  hy: number,
  r: number,
) {
  const qx = Math.abs(px - cx) - (hx - r)
  const qy = Math.abs(py - cy) - (hy - r)
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    r
  )
}

/* Near-black looks differ by only ~16 levels of 8-bit, so a plain fill
   steps through them visibly (and the encoder wobbles the tint). The page
   and the card fill are computed in float and dithered with sub-level noise
   instead, so the in-between shades average out smoothly on screen. The
   card is drawn on the canvas too, so its edges, radius and border width
   move by fractions of a pixel instead of the browser's whole-pixel snaps. */
function draw(
  ctx: CanvasRenderingContext2D,
  a: Surface,
  b: Surface,
  t: number,
  frame: number,
  scale: number,
) {
  const { width: W, height: H } = ctx.canvas
  const rand = noise(frame + 1)

  const page = mixOklab(a.page, b.page, t)
  const img = ctx.createImageData(W, H)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = rand()
    img.data[i] = page[0]! + n
    img.data[i + 1] = page[1]! + n
    img.data[i + 2] = page[2]! + n
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)

  const w = lerp(a.width, b.width, t) * scale
  const h = lerp(a.height, b.height, t) * scale
  const r = Math.min(lerp(a.radius, b.radius, t) * scale, w / 2, h / 2)
  const [x0, y0] = [(W - w) / 2, (H - h) / 2]

  const count = Math.max(a.shadows.length, b.shadows.length)
  for (let k = 0; k < count; k++) {
    const [sa, sb] = [a.shadows[k] ?? NO_SHADOW, b.shadows[k] ?? NO_SHADOW]
    const spread = lerp(sa.spread, sb.spread, t) * scale
    // Cast the shadow from a shape parked off-canvas, so only the shadow lands.
    ctx.save()
    ctx.shadowColor = mixRgba(sa.color, sb.color, t)
    ctx.shadowBlur = lerp(sa.blur, sb.blur, t) * scale
    ctx.shadowOffsetX = lerp(sa.x, sb.x, t) * scale + 2 * W
    ctx.shadowOffsetY = lerp(sa.y, sb.y, t) * scale
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.roundRect(
      x0 - spread - 2 * W,
      y0 - spread,
      w + 2 * spread,
      h + 2 * spread,
      Math.max(r + spread, 0),
    )
    ctx.fill()
    ctx.restore()
  }

  const fill = mixOklab(over(a.fill, a.page), over(b.fill, b.page), t)
  const [bx, by] = [Math.floor(x0), Math.floor(y0)]
  const [bw, bh] = [Math.ceil(x0 + w) - bx, Math.ceil(y0 + h) - by]
  const card = new ImageData(bw, bh)
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const d = roundRectDistance(
        bx + x + 0.5,
        by + y + 0.5,
        W / 2,
        H / 2,
        w / 2,
        h / 2,
        r,
      )
      const i = (y * bw + x) * 4
      const n = rand()
      card.data[i] = fill[0]! + n
      card.data[i + 1] = fill[1]! + n
      card.data[i + 2] = fill[2]! + n
      card.data[i + 3] = Math.min(Math.max(0.5 - d, 0), 1) * 255
    }
  }
  const layer = new OffscreenCanvas(bw, bh)
  layer.getContext("2d")!.putImageData(card, 0, 0)
  ctx.drawImage(layer, bx, by)

  const stroke = lerp(a.stroke, b.stroke, t) * scale
  if (stroke > 0) {
    ctx.strokeStyle = mixRgba(a.border, b.border, t)
    ctx.lineWidth = stroke
    ctx.beginPath()
    ctx.roundRect(
      x0 + stroke / 2,
      y0 + stroke / 2,
      w - stroke,
      h - stroke,
      Math.max(r - stroke / 2, 0),
    )
    ctx.stroke()
  }
}

export function CardSurfaceStep() {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const { from, to, t } = swapAt(frame)
  const canvas = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<string, HTMLDivElement | null>>({})
  const w = Math.round(width * STEPS_SIZE.scale)
  const h = Math.round(height * STEPS_SIZE.scale)

  useLayoutEffect(() => {
    const handle = delayRender("card surface")
    let raf = 0
    let tries = 0
    const attempt = () => {
      const [pa, pb] = [probes.current[from], probes.current[to]]
      const [a, b] = [pa && measure(pa), pb && measure(pb)]
      if (a && b && canvas.current) {
        draw(canvas.current.getContext("2d")!, a, b, t, frame, STEPS_SIZE.scale)
        continueRender(handle)
      } else if (tries++ < 600) raf = requestAnimationFrame(attempt)
      else continueRender(handle)
    }
    // Fonts change the card's height: measure once they have loaded.
    void document.fonts.ready.then(() => {
      raf = requestAnimationFrame(attempt)
    })
    return () => {
      cancelAnimationFrame(raf)
      continueRender(handle)
    }
  }, [from, to, t, frame])

  return (
    <AbsoluteFill>
      <WarmIcons />
      {LOOKS.map((id) => (
        <Theme key={id} state={preset(id)}>
          <div
            ref={(el) => {
              probes.current[id] = el
            }}
            className="bg-bg"
            style={{
              position: "absolute",
              width: CARD_WIDTH,
              visibility: "hidden",
            }}
          >
            <Controls />
          </div>
        </Theme>
      ))}
      <canvas
        ref={canvas}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  )
}
