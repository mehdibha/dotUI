import { useLayoutEffect, useRef, useState } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

import { ease, progress } from "../lib/motion"
import { preset, Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"

/* Step-by-step rebuild of the morph, one layer at a time.

   Step 1: the background alone. Each look's page color is read from the
   real theme (a hidden swatch per look), and the frame blends the two in
   OKLab: exact at both ends, nothing else moving. */

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

/** Every look's page color, read once from the real themes. */
function usePageColors() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [colors, setColors] = useState<Record<string, string> | null>(null)
  const [handle] = useState(() => delayRender("page colors"))
  useLayoutEffect(() => {
    if (colors) return
    const read: Record<string, string> = {}
    for (const id of new Set(ORDER)) {
      read[id] = getComputedStyle(refs.current[id]!).backgroundColor
    }
    setColors(read)
    continueRender(handle)
  }, [colors, handle])
  const swatches = [...new Set(ORDER)].map((id) => (
    <Theme key={id} state={preset(id)}>
      <div
        ref={(el) => {
          refs.current[id] = el
        }}
        className="bg-bg"
        style={{ position: "absolute", width: 0, height: 0 }}
      />
    </Theme>
  ))
  return { colors, swatches }
}

/** 8-bit sRGB of any CSS color, via a 1×1 canvas. */
function rgbOf(css: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d")!
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!]
}

const toLinear = (c: number) =>
  (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const toSrgb = (c: number) =>
  255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function oklab([r, g, b]: [number, number, number]) {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
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

/* Near-black looks differ by only ~16 levels of 8-bit, so a plain fill
   steps through them visibly (and the encoder wobbles the tint). The blend
   is computed in float and dithered with sub-level noise instead, so the
   in-between shades average out smoothly on screen. */
export function BackgroundStep() {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const { from, to, t } = swapAt(frame)
  const { colors, swatches } = usePageColors()
  const canvas = useRef<HTMLCanvasElement>(null)
  const w = Math.round(width * STEPS_SIZE.scale)
  const h = Math.round(height * STEPS_SIZE.scale)

  useLayoutEffect(() => {
    if (!colors || !canvas.current) return
    const [a, b] = [oklab(rgbOf(colors[from]!)), oklab(rgbOf(colors[to]!))]
    const c = srgb(a.map((v, i) => v + (b[i]! - v) * t))
    const ctx = canvas.current.getContext("2d")!
    const img = ctx.createImageData(w, h)
    let seed = (frame + 1) * 0x9e3779b1
    const rand = () => {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      return (seed >>> 0) / 4294967296
    }
    for (let i = 0; i < img.data.length; i += 4) {
      const n = rand() + rand() - 1 // triangular, ±1 level
      img.data[i] = c[0]! + n
      img.data[i + 1] = c[1]! + n
      img.data[i + 2] = c[2]! + n
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, [colors, from, to, t, frame, w, h])

  return (
    <AbsoluteFill>
      {swatches}
      <canvas
        ref={canvas}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  )
}
