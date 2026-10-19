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
   read off it and blended every frame.

   Step 3: the buttons. Each button's box is blended like the card; its
   label and icon cross-dissolve between the two looks' typefaces and icon
   sets inside the blended slot, in a color that keeps its contrast against
   the blended fill. */

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

/** A painted rectangle; x/y are relative to the card. */
interface Box {
  x: number
  y: number
  width: number
  height: number
  fill: Rgba
  /** The fill composited over what is under it: what text sits on. */
  ground: Rgba
  border: Rgba
  stroke: number
  radius: number
  shadows: Shadow[]
}

interface Label {
  text: string
  /** CSS font with a SIZE placeholder. */
  font: string
  size: number
  spacing: number
  /** Opaque, composited over the control's fill. */
  color: Rgba
  /** Center and width of the text run, relative to the card. */
  cx: number
  cy: number
  width: number
}

interface Icon {
  cx: number
  cy: number
  size: number
  image: HTMLImageElement
}

interface Control {
  box: Box
  label?: Label
  icon?: Icon
}

interface Look {
  page: Rgba
  card: Box
  controls: Control[]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi)
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
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

/** `top` composited over an opaque `base`, in sRGB like the browser. */
const over = (top: Rgba, base: Rgba): Rgba => [
  lerp(base[0], top[0], top[3]),
  lerp(base[1], top[1], top[3]),
  lerp(base[2], top[2], top[3]),
  1,
]

function boxOf(el: HTMLElement, origin: DOMRect, under: Rgba): Box {
  const cs = getComputedStyle(el)
  const r = el.getBoundingClientRect()
  const fill = rgbaOf(cs.backgroundColor)
  return {
    x: r.x - origin.x,
    y: r.y - origin.y,
    width: r.width,
    height: r.height,
    fill,
    ground: over(fill, under),
    border: rgbaOf(cs.borderTopColor),
    stroke: parseFloat(cs.borderTopWidth),
    radius: parseFloat(cs.borderTopLeftRadius),
    shadows: shadowsOf(cs.boxShadow),
  }
}

function labelOf(
  el: HTMLElement,
  origin: DOMRect,
  under: Rgba,
): Label | undefined {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let node: Node | null = walker.nextNode()
  while (node && !node.textContent!.trim()) node = walker.nextNode()
  if (!node) return undefined
  const range = document.createRange()
  range.selectNodeContents(node)
  const r = range.getBoundingClientRect()
  const cs = getComputedStyle(node.parentElement!)
  const text = node.textContent!.trim()
  return {
    text: cs.textTransform === "uppercase" ? text.toUpperCase() : text,
    font: `${cs.fontWeight} SIZE ${cs.fontFamily}`,
    size: parseFloat(cs.fontSize),
    spacing: parseFloat(cs.letterSpacing) || 0,
    color: over(rgbaOf(cs.color), under),
    cx: r.x + r.width / 2 - origin.x,
    cy: r.y + r.height / 2 - origin.y,
    width: r.width,
  }
}

const icons = new Map<string, Promise<HTMLImageElement>>()
/** The icon rasterized in white at a large size (tinted when drawn). */
function iconImage(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  copy.setAttribute("width", "96")
  copy.setAttribute("height", "96")
  copy.removeAttribute("class")
  copy.setAttribute(
    "style",
    `color: #fff; stroke-width: ${getComputedStyle(svg).strokeWidth}`,
  )
  const markup = copy.outerHTML
  let image = icons.get(markup)
  if (!image) {
    image = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
    })
    icons.set(markup, image)
  }
  return image
}

/** Everything drawn for one look, read off its hidden probe. */
async function measure(probe: HTMLElement): Promise<Look | null> {
  const card = probe.querySelector<HTMLElement>("[data-card]")
  if (!card?.offsetHeight) return null
  const page = rgbaOf(getComputedStyle(probe).backgroundColor)
  const origin = card.getBoundingClientRect()
  const cardBox = boxOf(card, origin, page)
  // The first row of the card: the three buttons.
  const row = card.firstElementChild!.firstElementChild!
  const controls = await Promise.all(
    [...row.children].map(async (child): Promise<Control> => {
      const el = child as HTMLElement
      const box = boxOf(el, origin, cardBox.ground)
      const svg = el.querySelector("svg")
      const s = svg?.getBoundingClientRect()
      return {
        box,
        label: labelOf(el, origin, box.ground),
        icon:
          svg && s
            ? {
                cx: s.x + s.width / 2 - origin.x,
                cy: s.y + s.height / 2 - origin.y,
                size: s.width,
                image: await iconImage(svg),
              }
            : undefined,
      }
    }),
  )
  return { page, card: cardBox, controls }
}

const mixLab = (a: number[], b: number[], t: number) =>
  a.map((v, i) => lerp(v, b[i]!, t))

/** Two opaque colors blended in OKLab, unrounded sRGB. */
const mixOklab = (a: Rgba, b: Rgba, t: number) =>
  srgb(mixLab(oklab(a), oklab(b), t))

const css = ([r, g, b]: number[], alpha = 1) =>
  `rgba(${clamp(r!, 0, 255)}, ${clamp(g!, 0, 255)}, ${clamp(b!, 0, 255)}, ${alpha})`

/** Translucent colors blend premultiplied, so a fade never darkens. */
function mixRgba(a: Rgba, b: Rgba, t: number) {
  const alpha = lerp(a[3], b[3], t)
  const ch = (i: number) =>
    alpha ? lerp(a[i]! * a[3], b[i]! * b[3], t) / alpha : 0
  return css([ch(0), ch(1), ch(2)], alpha)
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
  const next = () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return (x >>> 0) / 4294967296
  }
  return () => next() + next() - 1
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

/** A box blended at `t`, placed from the card corner (ox, oy) in device px. */
function paintBox(
  ctx: CanvasRenderingContext2D,
  a: Box,
  b: Box,
  t: number,
  ox: number,
  oy: number,
  scale: number,
  rand: () => number,
) {
  const x0 = ox + lerp(a.x, b.x, t) * scale
  const y0 = oy + lerp(a.y, b.y, t) * scale
  const w = lerp(a.width, b.width, t) * scale
  const h = lerp(a.height, b.height, t) * scale
  const r = Math.min(lerp(a.radius, b.radius, t) * scale, w / 2, h / 2)
  const W = ctx.canvas.width

  const count = Math.max(a.shadows.length, b.shadows.length)
  for (let k = 0; k < count; k++) {
    const [sa, sb] = [a.shadows[k] ?? NO_SHADOW, b.shadows[k] ?? NO_SHADOW]
    if (!sa.color[3] && !sb.color[3]) continue
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

  // The fill is computed in float and dithered, with its own antialiased
  // edge, so it never steps through 8-bit levels. A see-through side fades
  // its opacity and borrows the other side's color.
  const alpha = lerp(a.fill[3], b.fill[3], t)
  const fill = mixOklab(
    a.fill[3] ? a.fill : b.fill,
    b.fill[3] ? b.fill : a.fill,
    t,
  )
  const [bx, by] = [Math.floor(x0), Math.floor(y0)]
  if (alpha > 0) {
    const [bw, bh] = [Math.ceil(x0 + w) - bx, Math.ceil(y0 + h) - by]
    const img = new ImageData(bw, bh)
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const d = roundRectDistance(
          bx + x + 0.5,
          by + y + 0.5,
          x0 + w / 2,
          y0 + h / 2,
          w / 2,
          h / 2,
          r,
        )
        const i = (y * bw + x) * 4
        const n = rand()
        img.data[i] = fill[0]! + n
        img.data[i + 1] = fill[1]! + n
        img.data[i + 2] = fill[2]! + n
        img.data[i + 3] = clamp(0.5 - d, 0, 1) * alpha * 255
      }
    }
    const layer = new OffscreenCanvas(bw, bh)
    layer.getContext("2d")!.putImageData(img, 0, 0)
    ctx.drawImage(layer, bx, by)
  }

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

/* Each look's label color, held at its own lightness offset from the
   blended fill so it keeps its contrast while the fill moves, and when the
   label hands over from one look to the other: mid-way, or, when one look
   is light-on-dark and the other dark-on-light, as soon as the incoming
   ink reads better than the outgoing one. */
function inks(a: Control, b: Control, t: number) {
  const [fa, fb] = [oklab(a.box.ground), oklab(b.box.ground)]
  const [ia, ib] = [
    oklab(a.label?.color ?? b.label?.color ?? a.box.ground),
    oklab(b.label?.color ?? a.label?.color ?? b.box.ground),
  ]
  const fillL = (u: number) => lerp(fa[0]!, fb[0]!, u)
  const [da, db] = [ia[0]! - fa[0]!, ib[0]! - fb[0]!]
  const heldL = (u: number, d: number) => clamp(fillL(u) + d, 0, 1)
  const held = (ink: number[], d: number) =>
    css(srgb([heldL(t, d), ink[1]!, ink[2]!]))
  const flips = Math.sign(da) !== Math.sign(db)
  let handover = 0.5
  if (flips) {
    const contrast = (u: number, d: number) => Math.abs(heldL(u, d) - fillL(u))
    handover = 1
    for (let u = 0; u <= 1; u += 0.01) {
      if (contrast(u, db) >= contrast(u, da)) {
        handover = u
        break
      }
    }
    handover = clamp(handover, 0.1, 0.9)
  }
  // Two typefaces overlap only briefly, and never before t = 0 or after 1.
  // Opposite inks can't overlap at all (any mix of the two lands on the
  // fill), so the outgoing label fades out just before the incoming one
  // fades in.
  const half = Math.min(0.12, handover, 1 - handover)
  const u = smoothstep(handover - half, handover + half, t)
  return {
    a: held(ia, da),
    b: held(ib, db),
    alphaA: flips ? 1 - smoothstep(handover - half, handover, t) : 1 - u,
    alphaB: flips ? smoothstep(handover, handover + half, t) : u,
  }
}

let glyph: OffscreenCanvas | null = null
let mix: OffscreenCanvas | null = null

/* A control's label and icon cross-dissolve: each look's run is drawn in
   its own typeface into the blended slot (sized so both runs share the
   blended width), the two are added so the sum never dips mid-way, and the
   result is laid over the fill. Each run is rasterized on a whole pixel and
   placed at its fractional position by drawImage, so slow drifts glide
   instead of snapping. */
function paintInk(
  ctx: CanvasRenderingContext2D,
  a: Control,
  b: Control,
  t: number,
  ox: number,
  oy: number,
  scale: number,
) {
  const { width: W, height: H } = ctx.canvas
  mix ??= new OffscreenCanvas(W, H)
  glyph ??= new OffscreenCanvas(8, 8)
  const m = mix.getContext("2d")!
  const g = glyph.getContext("2d")!
  const ink = inks(a, b, t)
  const x = Math.floor(ox + Math.min(a.box.x, b.box.x) * scale) - 16
  const y = Math.floor(oy + Math.min(a.box.y, b.box.y) * scale) - 16
  const right =
    ox + Math.max(a.box.x + a.box.width, b.box.x + b.box.width) * scale
  const bottom =
    oy + Math.max(a.box.y + a.box.height, b.box.y + b.box.height) * scale
  const region = [
    x,
    y,
    Math.ceil(right) + 16 - x,
    Math.ceil(bottom) + 16 - y,
  ] as const
  m.globalCompositeOperation = "source-over"
  m.globalAlpha = 1
  m.clearRect(...region)

  let first = true
  const place = (alpha: number, dx: number, dy: number) => {
    m.globalAlpha = alpha
    // The two runs add up, so their sum never dips mid-way.
    m.globalCompositeOperation = first ? "source-over" : "lighter"
    m.drawImage(glyph!, dx, dy)
    first = false
  }

  for (const [side, alpha, color] of [
    [a, ink.alphaA, ink.a],
    [b, ink.alphaB, ink.b],
  ] as const) {
    if (alpha <= 0) continue
    const { label, icon } = side
    if (label && a.label && b.label) {
      const width = lerp(a.label.width, b.label.width, t) * scale
      const zoom = width / (label.width * scale)
      const font = label.font.replace("SIZE", `${label.size * scale * zoom}px`)
      const spacing = `${label.spacing * scale * zoom}px`
      g.font = font
      g.letterSpacing = spacing
      const run = g.measureText(label.text)
      const asc = Math.ceil(run.fontBoundingBoxAscent) + 2
      const desc = Math.ceil(run.fontBoundingBoxDescent) + 2
      glyph.width = Math.ceil(run.width) + 8
      glyph.height = asc + desc
      g.font = font
      g.letterSpacing = spacing
      g.fillStyle = color
      g.fillText(label.text, 4, asc)
      const cx = ox + lerp(a.label.cx, b.label.cx, t) * scale
      const cy = oy + lerp(a.label.cy, b.label.cy, t) * scale
      const baseline =
        cy + (run.fontBoundingBoxAscent - run.fontBoundingBoxDescent) / 2
      place(alpha, cx - run.width / 2 - 4, baseline - asc)
    }
    if (icon) {
      // An icon only one look has fades in place on that look's box.
      const [ia, ib] = [a.icon ?? icon, b.icon ?? icon]
      const size = lerp(ia.size, ib.size, t) * scale
      const px = Math.ceil(size) + 2
      glyph.width = px
      glyph.height = px
      g.drawImage(icon.image, 1, 1, size, size)
      g.globalCompositeOperation = "source-in"
      g.fillStyle = color
      g.fillRect(0, 0, px, px)
      g.globalCompositeOperation = "source-over"
      const cx = ox + lerp(ia.cx, ib.cx, t) * scale
      const cy = oy + lerp(ia.cy, ib.cy, t) * scale
      place(alpha, cx - size / 2 - 1, cy - size / 2 - 1)
    }
  }
  m.globalAlpha = 1
  m.globalCompositeOperation = "source-over"
  ctx.drawImage(mix, ...region, ...region)
}

/* Near-black looks differ by only ~16 levels of 8-bit, so plain fills step
   through them visibly (and the encoder wobbles the tint): every fill is
   computed in float and dithered with sub-level noise instead. Everything
   is drawn on one canvas, so edges, radii and borders move by fractions of
   a pixel instead of the browser's whole-pixel snaps. */
function draw(
  ctx: CanvasRenderingContext2D,
  a: Look,
  b: Look,
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

  // The card stays centered; everything inside is placed from its corner.
  const ox = (W - lerp(a.card.width, b.card.width, t) * scale) / 2
  const oy = (H - lerp(a.card.height, b.card.height, t) * scale) / 2
  paintBox(
    ctx,
    { ...a.card, x: 0, y: 0 },
    { ...b.card, x: 0, y: 0 },
    t,
    ox,
    oy,
    scale,
    rand,
  )
  // See-through controls go first, so one gliding to another row passes
  // behind solid neighbors instead of printing its label over theirs.
  const pairs = a.controls.map((ca, i) => [ca, b.controls[i]!] as const)
  const opacity = ([ca, cb]: (typeof pairs)[number]) =>
    ca.box.fill[3] + cb.box.fill[3]
  for (const [ca, cb] of pairs.sort((p, q) => opacity(p) - opacity(q))) {
    paintBox(ctx, ca.box, cb.box, t, ox, oy, scale, rand)
    paintInk(ctx, ca, cb, t, ox, oy, scale)
  }
}

export function CardStep() {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const { from, to, t } = swapAt(frame)
  const canvas = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<string, HTMLDivElement | null>>({})
  const w = Math.round(width * STEPS_SIZE.scale)
  const h = Math.round(height * STEPS_SIZE.scale)

  useLayoutEffect(() => {
    const handle = delayRender("card step")
    let raf = 0
    let tries = 0
    let alive = true
    const attempt = async () => {
      const [pa, pb] = [probes.current[from], probes.current[to]]
      const [a, b] = await Promise.all([pa && measure(pa), pb && measure(pb)])
      if (!alive) return
      if (a && b && canvas.current) {
        draw(canvas.current.getContext("2d")!, a, b, t, frame, STEPS_SIZE.scale)
        continueRender(handle)
      } else if (tries++ < 600)
        raf = requestAnimationFrame(() => void attempt())
      else continueRender(handle)
    }
    // Fonts change the card's height: measure once they have loaded.
    void document.fonts.ready.then(() => {
      raf = requestAnimationFrame(() => void attempt())
    })
    return () => {
      alive = false
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
