import { useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  getRemotionEnvironment,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

import { Controls } from "@/components/showcase/controls"
import { PRESETS } from "@/modules/presets"

import { ease, progress } from "../lib/motion"
import {
  facesReady,
  preset,
  PRESET_FONTS,
  Theme,
  WarmIcons,
} from "../lib/theme"
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
   the blended fill.

   Step 4: every component in the card, the same way: every painted box
   (pseudo-elements included), text run, icon and input text is read off
   the probes and paired up across looks by its place in the tree. */

/** Every preset, in the site's order, back to the first. */
export const ORDER = [...PRESETS.map((p) => p.id), PRESETS[0]!.id]

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
/** The card widens with the look's density, as it would given room. */
const CARD_WIDTH = {
  compact: 320,
  default: 340,
  comfortable: 370,
  spacious: 400,
  touch: 460,
}
export const cardWidth = (id: string) =>
  CARD_WIDTH[(preset(id).density ?? "default") as keyof typeof CARD_WIDTH]

export type Rgba = [number, number, number, number]

let swatch: CanvasRenderingContext2D | null = null
/** 8-bit sRGB + alpha of any CSS color, via a 1×1 canvas. */
export function rgbaOf(css: string, opacity = 1): Rgba {
  swatch ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })!
  swatch.clearRect(0, 0, 1, 1)
  swatch.fillStyle = css
  swatch.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!, (a! / 255) * opacity]
}

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: Rgba
}

/** A painted rectangle; x/y are relative to the card. */
export interface Box {
  x: number
  y: number
  width: number
  height: number
  fill: Rgba
  /** Border widths: top, right, bottom, left. */
  borders: [number, number, number, number]
  border: Rgba
  /** Corner radii: top-left, top-right, bottom-right, bottom-left. */
  radii: [number, number, number, number]
  shadows: Shadow[]
}

/** A run of text or an icon, drawn in one color over `ground`. */
interface Ink {
  cx: number
  cy: number
  /** Text run width, or icon size. */
  width: number
  color: Rgba
  /** The opaque color under it, for contrast. */
  ground: Rgba
  text?: {
    value: string
    font: string
    size: number
    spacing: number
    /** Underline offset below the baseline and thickness, if underlined. */
    underline?: [number, number]
  }
  image?: HTMLImageElement
}

interface Look {
  page: Rgba
  card: Box
  /** Everything inside the card, keyed by its place in the tree. */
  items: Map<string, Box | Ink>
  order: string[]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi)
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
}

/** Outer shadows of a computed box-shadow ("color x y blur spread, …"). */
function shadowsOf(css: string, opacity: number): Shadow[] {
  if (css === "none") return []
  return css
    .split(/,(?![^(]*\))/)
    .filter((layer) => !layer.includes("inset"))
    .map((layer) => {
      const color = layer.match(/^\s*([a-z-]+\([^)]*\)|#\w+|[a-z]+)/)?.[1]
      const [x = 0, y = 0, blur = 0, spread = 0] = [
        ...layer.replace(color ?? "", "").matchAll(/(-?[\d.]+)px/g),
      ].map((m) => Number(m[1]))
      return {
        x,
        y,
        blur,
        spread,
        color: rgbaOf(color ?? "transparent", opacity),
      }
    })
    .filter((s) => s.color[3] > 0 && (s.x || s.y || s.blur || s.spread))
}

/** `top` composited over an opaque `base`, in sRGB like the browser. */
const over = (top: Rgba, base: Rgba): Rgba => [
  lerp(base[0], top[0], top[3]),
  lerp(base[1], top[1], top[3]),
  lerp(base[2], top[2], top[3]),
  1,
]

type Rect = { x: number; y: number; width: number; height: number }

export function boxOf(cs: CSSStyleDeclaration, r: Rect, opacity: number): Box {
  const borders = [
    cs.borderTopWidth,
    cs.borderRightWidth,
    cs.borderBottomWidth,
    cs.borderLeftWidth,
  ].map(parseFloat) as Box["borders"]
  const side = ["Top", "Right", "Bottom", "Left"][
    Math.max(
      borders.findIndex((w) => w > 0),
      0,
    )
  ]!
  return {
    ...r,
    fill: rgbaOf(cs.backgroundColor, opacity),
    borders,
    border: rgbaOf(
      cs.getPropertyValue(`border-${side.toLowerCase()}-color`),
      opacity,
    ),
    radii: [
      cs.borderTopLeftRadius,
      cs.borderTopRightRadius,
      cs.borderBottomRightRadius,
      cs.borderBottomLeftRadius,
    ].map((v) => parseFloat(v) || 0) as Box["radii"],
    shadows: shadowsOf(cs.boxShadow, opacity),
  }
}

const painted = (box: Box) =>
  box.fill[3] > 0 ||
  (box.border[3] > 0 && box.borders.some((w) => w > 0)) ||
  box.shadows.length > 0

/** A pseudo-element's box: absolute ones from their insets; in-flow ones
    centered in an empty host (a radio's dot), else leading or trailing its
    content (a badge's status dot), as the controls lay them out. */
function pseudoRect(
  el: HTMLElement,
  host: DOMRect,
  ps: CSSStyleDeclaration,
  pseudo: string,
): Rect | null {
  const width = parseFloat(ps.width)
  const height = parseFloat(ps.height)
  if (!(width > 0 && height > 0)) return null
  const m = new DOMMatrix(ps.transform === "none" ? undefined : ps.transform)
  if (ps.position === "absolute") {
    const hs = getComputedStyle(el)
    const left = parseFloat(ps.left)
    const top = parseFloat(ps.top)
    if (Number.isNaN(left) || Number.isNaN(top)) return null
    return {
      x: host.x + parseFloat(hs.borderLeftWidth) + left + m.e,
      y: host.y + parseFloat(hs.borderTopWidth) + top + m.f,
      width,
      height,
    }
  }
  const y = host.y + (host.height - height) / 2 + m.f
  // Empty or visually hidden children (a radio's native input) don't count.
  const content = [...el.children].some((c) => {
    const r = c.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  })
  if (!el.textContent?.trim() && !content)
    return { x: host.x + (host.width - width) / 2 + m.e, y, width, height }
  const hs = getComputedStyle(el)
  const x =
    pseudo === "::before"
      ? host.x + parseFloat(hs.borderLeftWidth) + parseFloat(hs.paddingLeft)
      : host.right -
        parseFloat(hs.borderRightWidth) -
        parseFloat(hs.paddingRight) -
        width
  return { x: x + m.e, y, width, height }
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

let ruler: CanvasRenderingContext2D | null = null
const textWidth = (value: string, font: string, spacing: number) => {
  ruler ??= document.createElement("canvas").getContext("2d")!
  ruler.font = font
  ruler.letterSpacing = `${spacing}px`
  return ruler.measureText(value).width
}

function textOf(cs: CSSStyleDeclaration, value: string) {
  const size = parseFloat(cs.fontSize)
  return {
    value: cs.textTransform === "uppercase" ? value.toUpperCase() : value,
    font: `${cs.fontWeight} SIZE ${cs.fontFamily}`,
    size,
    spacing: parseFloat(cs.letterSpacing) || 0,
    // "auto" placement approximated from the font size.
    underline: cs.textDecorationLine.includes("underline")
      ? ([
          parseFloat(cs.textUnderlineOffset) || size * 0.14,
          parseFloat(cs.textDecorationThickness) || Math.max(size / 14, 1),
        ] as [number, number])
      : undefined,
  }
}

/* Everything painted inside the card, read off a look's hidden probe: each
   element's box (and its ::before/::after), every text run, every icon,
   and what an input shows. Items are keyed by their place in the tree, so
   the same control pairs up across looks. */
async function measure(probe: HTMLElement): Promise<Look | null> {
  const card = probe.querySelector<HTMLElement>("[data-card]")
  if (!card?.offsetHeight) return null
  const page = rgbaOf(getComputedStyle(probe).backgroundColor)
  const origin = card.getBoundingClientRect()
  const rel = (r: Rect): Rect => ({
    x: r.x - origin.x,
    y: r.y - origin.y,
    width: r.width,
    height: r.height,
  })
  const cardBox = boxOf(getComputedStyle(card), rel(origin), 1)
  const items = new Map<string, Box | Ink>()
  const order: string[] = []
  const pending: Promise<unknown>[] = []
  const add = (key: string, item: Box | Ink) => {
    items.set(key, item)
    order.push(key)
  }

  const walk = (el: Element, key: string, ground: Rgba, opacity: number) => {
    const cs = getComputedStyle(el)
    if (cs.display === "none" || cs.visibility === "hidden") return
    if (cs.clip !== "auto" || cs.clipPath !== "none") return
    const alpha = opacity * parseFloat(cs.opacity)
    if (alpha <= 0) return
    const rect = el.getBoundingClientRect()

    if (el instanceof SVGSVGElement) {
      const color = rgbaOf(cs.color, alpha)
      const ink: Ink = {
        cx: rect.x + rect.width / 2 - origin.x,
        cy: rect.y + rect.height / 2 - origin.y,
        width: rect.width,
        color: over(color, ground),
        ground,
      }
      pending.push(iconImage(el).then((image) => (ink.image = image)))
      add(key, ink)
      return
    }
    if (!(el instanceof HTMLElement)) return

    let under = ground
    if (el !== card) {
      const box = boxOf(cs, rel(rect), alpha)
      if (painted(box)) {
        add(key, box)
        under = over(box.fill, ground)
      }
    }
    for (const pseudo of ["::before", "::after"]) {
      const ps = getComputedStyle(el, pseudo)
      if (ps.content === "none" || ps.display === "none") continue
      const r = pseudoRect(el, rect, ps, pseudo)
      if (!r) continue
      const box = boxOf(ps, rel(r), alpha * parseFloat(ps.opacity))
      if (painted(box)) add(key + pseudo, box)
    }

    if (el instanceof HTMLInputElement) {
      const value = el.value || el.placeholder
      if (!value) return
      const color = el.value
        ? cs.color
        : getComputedStyle(el, "::placeholder").color
      const text = textOf(cs, value)
      const width = textWidth(
        text.value,
        text.font.replace("SIZE", `${text.size}px`),
        text.spacing,
      )
      const left =
        rect.x + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft)
      const right =
        rect.right -
        parseFloat(cs.borderRightWidth) -
        parseFloat(cs.paddingRight)
      const cx =
        cs.textAlign === "center"
          ? (left + right) / 2
          : cs.textAlign === "right" || cs.textAlign === "end"
            ? right - width / 2
            : left + width / 2
      add(key + "/value", {
        cx: cx - origin.x,
        cy: rect.y + rect.height / 2 - origin.y,
        width,
        color: over(rgbaOf(color, alpha), under),
        ground: under,
        text,
      })
      return
    }

    el.childNodes.forEach((node, i) => {
      if (node instanceof Element) walk(node, `${key}/${i}`, under, alpha)
      else if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim()) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const r = range.getBoundingClientRect()
        if (!r.width) return
        add(`${key}/${i}`, {
          cx: r.x + r.width / 2 - origin.x,
          cy: r.y + r.height / 2 - origin.y,
          width: r.width,
          color: over(rgbaOf(cs.color, alpha), under),
          ground: under,
          text: textOf(cs, node.textContent!.trim()),
        })
      }
    })
  }

  walk(card, "card", over(cardBox.fill, page), 1)
  await Promise.all(pending)
  return { page, card: cardBox, items, order }
}

const mixLab = (a: number[], b: number[], t: number) =>
  a.map((v, i) => lerp(v, b[i]!, t))

/** Two opaque colors blended in OKLab, unrounded sRGB. */
export const mixOklab = (a: Rgba, b: Rgba, t: number) =>
  srgb(mixLab(oklab(a), oklab(b), t))

export const css = ([r, g, b]: number[], alpha = 1) =>
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

/** The same box with nothing painted: what a one-sided box fades to. */
const ghost = (box: Box): Box => ({
  ...box,
  fill: [...box.fill.slice(0, 3), 0] as Rgba,
  border: [...box.border.slice(0, 3), 0] as Rgba,
  shadows: box.shadows.map((s) => ({
    ...s,
    color: [...s.color.slice(0, 3), 0] as Rgba,
  })),
})

/** Triangular noise of ±1 level, seeded so a frame always renders alike. */
export function noise(seed: number) {
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
  [tl, tr, br, bl]: number[],
) {
  const r = px < cx ? (py < cy ? tl! : bl!) : py < cy ? tr! : br!
  const qx = Math.abs(px - cx) - (hx - r)
  const qy = Math.abs(py - cy) - (hy - r)
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    r
  )
}

/** A box blended at `t`, placed from the card corner (ox, oy) in device px. */
export function paintBox(
  ctx: CanvasRenderingContext2D,
  a: Box,
  b: Box,
  t: number,
  ox: number,
  oy: number,
  scale: number,
  rand: (() => number) | null,
) {
  const x0 = ox + lerp(a.x, b.x, t) * scale
  const y0 = oy + lerp(a.y, b.y, t) * scale
  const w = lerp(a.width, b.width, t) * scale
  const h = lerp(a.height, b.height, t) * scale
  if (w <= 0 || h <= 0) return
  // A pill's radius is huge (9999px): blend each side's visible radii, or
  // the corners would snap round at the first frame.
  const visible = (box: Box, i: number) =>
    Math.min(box.radii[i]!, box.width / 2, box.height / 2)
  const radii = a.radii.map((_, i) =>
    Math.min(lerp(visible(a, i), visible(b, i), t) * scale, w / 2, h / 2),
  )
  const grown = (by: number) => radii.map((r) => Math.max(r + by, 0))
  const W = ctx.canvas.width

  const count = Math.max(a.shadows.length, b.shadows.length)
  for (let k = 0; k < count; k++) {
    const [sa, sb] = [a.shadows[k] ?? NO_SHADOW, b.shadows[k] ?? NO_SHADOW]
    const spread = lerp(sa.spread, sb.spread, t) * scale
    // Cast the shadow from a shape parked off-canvas, so only the shadow
    // lands, and only outside the box, as CSS paints outer shadows.
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, W, ctx.canvas.height)
    ctx.roundRect(x0, y0, w, h, radii)
    ctx.clip("evenodd")
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
      grown(spread),
    )
    ctx.fill()
    ctx.restore()
  }

  // The fill is computed in float and dithered, with its own antialiased
  // edge, so it never steps through 8-bit levels. A see-through side fades
  // its opacity and borrows the other side's color.
  const alpha = lerp(a.fill[3], b.fill[3], t)
  if (alpha > 0) {
    const fill = mixOklab(
      a.fill[3] ? a.fill : b.fill,
      b.fill[3] ? b.fill : a.fill,
      t,
    )
    if (!rand) {
      ctx.fillStyle = css(fill, alpha)
      ctx.beginPath()
      ctx.roundRect(x0, y0, w, h, radii)
      ctx.fill()
    } else {
      const [bx, by] = [Math.floor(x0), Math.floor(y0)]
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
            radii,
          )
          const i = (y * bw + x) * 4
          const n = rand()
          img.data[i] = fill[0]! + n
          img.data[i + 1] = fill[1]! + n
          img.data[i + 2] = fill[2]! + n
          img.data[i + 3] = clamp(0.5 - d, 0, 1) * alpha * 255
        }
      }
      const layer = canvasOf(bw, bh)
      layer.getContext("2d")!.putImageData(img, 0, 0)
      ctx.drawImage(layer, bx, by)
    }
  }

  // The border is a ring between the outer shape and the inner one, so
  // each side keeps its own (fractional) width.
  const [top, right, bottom, left] = a.borders.map(
    (v, i) => lerp(v, b.borders[i]!, t) * scale,
  ) as Box["borders"]
  if (top + right + bottom + left > 0) {
    ctx.fillStyle = mixRgba(
      a.border[3] ? a.border : ([...b.border.slice(0, 3), 0] as Rgba),
      b.border[3] ? b.border : ([...a.border.slice(0, 3), 0] as Rgba),
      t,
    )
    ctx.beginPath()
    ctx.roundRect(x0, y0, w, h, radii)
    ctx.roundRect(
      x0 + left,
      y0 + top,
      Math.max(w - left - right, 0),
      Math.max(h - top - bottom, 0),
      grown(-Math.max(top, right, bottom, left)),
    )
    ctx.fill("evenodd")
  }
}

/* An ink's color at `t`, held at its own lightness offset from the
   blended ground so it keeps its contrast while the ground moves, and its
   two runs' opacities. Runs hand over mid-way; when one look is
   light-on-dark and the other dark-on-light, any mix of the two inks lands
   on the ground, so the outgoing run fades out just before the incoming
   one fades in, as soon as the incoming ink reads better. */
function inks(a: Ink, b: Ink, t: number) {
  const [fa, fb] = [oklab(a.ground), oklab(b.ground)]
  const [ia, ib] = [oklab(a.color), oklab(b.color)]
  const groundL = (u: number) => lerp(fa[0]!, fb[0]!, u)
  const [da, db] = [ia[0]! - fa[0]!, ib[0]! - fb[0]!]
  const heldL = (u: number, d: number) => clamp(groundL(u) + d, 0, 1)
  const held = (ink: number[], d: number) =>
    css(srgb([heldL(t, d), ink[1]!, ink[2]!]))
  const flips = Math.sign(da) !== Math.sign(db) && Math.abs(da - db) > 0.2
  let handover = 0.5
  if (flips) {
    const contrast = (u: number, d: number) =>
      Math.abs(heldL(u, d) - groundL(u))
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
  const half = Math.min(0.12, handover, 1 - handover)
  const u = smoothstep(handover - half, handover + half, t)
  return {
    a: held(ia, da),
    b: held(ib, db),
    alphaA: flips ? 1 - smoothstep(handover - half, handover, t) : 1 - u,
    alphaB: flips ? smoothstep(handover, handover + half, t) : u,
  }
}

// Plain canvases, not OffscreenCanvas: Safari's offscreen canvases can't
// see the page's web fonts and draw every label in a fallback face.
const canvasOf = (width: number, height: number) =>
  Object.assign(document.createElement("canvas"), { width, height })
let glyph: HTMLCanvasElement | null = null
let mix: HTMLCanvasElement | null = null

/* A text run or icon cross-dissolves: each look's run is drawn in its own
   typeface (or icon set) into the blended slot, sized so both share the
   blended width, the two are added so the sum never dips mid-way, and the
   result is laid over what is below. Each run is rasterized on a whole
   pixel and placed at its fractional position by drawImage, so slow drifts
   glide instead of snapping. An ink only one look has fades in place. */
function paintInk(
  ctx: CanvasRenderingContext2D,
  a: Ink | undefined,
  b: Ink | undefined,
  t: number,
  ox: number,
  oy: number,
  scale: number,
) {
  const [pa, pb] = [a ?? b!, b ?? a!]
  const { width: W, height: H } = ctx.canvas
  mix ??= canvasOf(W, H)
  glyph ??= canvasOf(8, 8)
  const m = mix.getContext("2d")!
  const g = glyph.getContext("2d")!
  const ink = inks(pa, pb, t)
  const alphas = [a ? ink.alphaA : 0, b ? ink.alphaB : 0]
  if (!a) alphas[1] = t
  if (!b) alphas[0] = 1 - t

  const width = lerp(pa.width, pb.width, t) * scale
  const cx = ox + lerp(pa.cx, pb.cx, t) * scale
  const cy = oy + lerp(pa.cy, pb.cy, t) * scale
  const reach = Math.max(pa.width, pb.width) * scale * 1.5 + 24
  const region = [
    Math.floor(cx - reach),
    Math.floor(cy - reach / 2 - 24),
    Math.ceil(reach * 2),
    Math.ceil(reach + 48),
  ] as const
  m.globalCompositeOperation = "source-over"
  m.globalAlpha = 1
  m.clearRect(...region)

  let first = true
  ;[pa, pb].forEach((side, k) => {
    const alpha = alphas[k]!
    if (alpha <= 0) return
    const color = k === 0 ? ink.a : ink.b
    const zoom = width / (side.width * scale)
    let dx: number
    let dy: number
    if (side.text) {
      const { value, size, spacing } = side.text
      const font = side.text.font.replace("SIZE", `${size * scale * zoom}px`)
      const tracking = `${spacing * scale * zoom}px`
      g.font = font
      g.letterSpacing = tracking
      const run = g.measureText(value)
      const asc = Math.ceil(run.fontBoundingBoxAscent) + 2
      const desc =
        Math.ceil(
          Math.max(
            run.fontBoundingBoxDescent,
            (side.text.underline?.[0] ?? 0) * 2 * scale * zoom,
          ),
        ) + 4
      glyph!.width = Math.ceil(run.width) + 8
      glyph!.height = asc + desc
      g.font = font
      g.letterSpacing = tracking
      g.fillStyle = color
      g.fillText(value, 4, asc)
      if (side.text.underline) {
        const [offset, thickness] = side.text.underline
        g.fillRect(
          4,
          asc + offset * scale * zoom,
          run.width,
          thickness * scale * zoom,
        )
      }
      const baseline =
        cy + (run.fontBoundingBoxAscent - run.fontBoundingBoxDescent) / 2
      dx = cx - run.width / 2 - 4
      dy = baseline - asc
    } else if (side.image) {
      const px = Math.ceil(width) + 2
      glyph!.width = px
      glyph!.height = px
      g.drawImage(side.image, 1, 1, width, width)
      g.globalCompositeOperation = "source-in"
      g.fillStyle = color
      g.fillRect(0, 0, px, px)
      g.globalCompositeOperation = "source-over"
      dx = cx - width / 2 - 1
      dy = cy - width / 2 - 1
    } else return
    // The two runs add up, so their sum never dips mid-way.
    m.globalAlpha = alpha
    m.globalCompositeOperation = first ? "source-over" : "lighter"
    m.drawImage(glyph!, dx, dy)
    first = false
  })
  m.globalAlpha = 1
  m.globalCompositeOperation = "source-over"
  ctx.drawImage(mix, ...region, ...region)
}

const isInk = (item: Box | Ink): item is Ink => "ground" in item

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
  // Dithering is for the encoder's sake, and too slow to keep up live: the
  // studio preview paints flat colors.
  const rand = getRemotionEnvironment().isRendering ? noise(frame + 1) : null

  const page = mixOklab(a.page, b.page, t)
  if (!rand) {
    ctx.fillStyle = css(page)
    ctx.fillRect(0, 0, W, H)
  } else {
    const img = ctx.createImageData(W, H)
    for (let i = 0; i < img.data.length; i += 4) {
      const n = rand()
      img.data[i] = page[0]! + n
      img.data[i + 1] = page[1]! + n
      img.data[i + 2] = page[2]! + n
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }

  // The card stays centered; everything inside is placed from its corner.
  const ox = (W - lerp(a.card.width, b.card.width, t) * scale) / 2
  const oy = (H - lerp(a.card.height, b.card.height, t) * scale) / 2
  paintBox(ctx, a.card, b.card, t, ox, oy, scale, rand)

  const keys = [...a.order, ...b.order.filter((k) => !a.items.has(k))]
  for (const key of keys) {
    let [ia, ib] = [a.items.get(key), b.items.get(key)]
    // Different kinds of thing in the same place: each fades on its own.
    if (ia && ib && isInk(ia) !== isInk(ib)) {
      if (isInk(ia)) paintInk(ctx, ia, undefined, t, ox, oy, scale)
      else paintInk(ctx, undefined, ib as Ink, t, ox, oy, scale)
      ;[ia, ib] = isInk(ia) ? [undefined, ib] : [ia, undefined]
    }
    const one = (ia ?? ib)!
    if (isInk(one)) {
      paintInk(
        ctx,
        ia as Ink | undefined,
        ib as Ink | undefined,
        t,
        ox,
        oy,
        scale,
      )
    } else {
      const [ba, bb] = [ia as Box | undefined, ib as Box | undefined]
      paintBox(ctx, ba ?? ghost(bb!), bb ?? ghost(ba!), t, ox, oy, scale, rand)
    }
  }
}

const looks = new Map<string, Look>()

export function CardStep() {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()
  const { from, to, t } = swapAt(frame)
  const canvas = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<string, HTMLDivElement | null>>({})
  // Draw at the render's pixel density: 1.6 for the final 1080p, less for
  // drafts and the studio preview.
  const dpr = window.devicePixelRatio
  const w = Math.round(width * dpr)
  const h = Math.round(height * dpr)

  // A look never changes once its fonts are in, so measure each one once,
  // then drop the probes: sixteen hidden cards would relayout on every frame
  // of the live preview.
  const [measured, setMeasured] = useState(looks.size === LOOKS.length)
  const look = async (id: string) => {
    const probe = probes.current[id]
    if (looks.has(id) || !probe) return looks.get(id)
    const measured = await measure(probe)
    if (measured) looks.set(id, measured)
    return measured
  }

  useLayoutEffect(() => {
    const handle = delayRender("card step")
    let raf = 0
    let tries = 0
    let alive = true
    const attempt = async () => {
      await Promise.all(LOOKS.map(look))
      const [a, b] = [looks.get(from), looks.get(to)]
      if (!alive) return
      if (looks.size === LOOKS.length) setMeasured(true)
      if (a && b && canvas.current) {
        draw(canvas.current.getContext("2d")!, a, b, t, frame, dpr)
        continueRender(handle)
      } else if (tries++ < 600)
        raf = requestAnimationFrame(() => void attempt())
      else continueRender(handle)
    }
    // Fonts change the card's height: measure once every preset's are in,
    // since a look is measured only once.
    void facesReady(PRESET_FONTS).then(() => {
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
      {useMemo(
        () =>
          !measured &&
          LOOKS.map((id) => (
            <Theme key={id} state={preset(id)}>
              <div
                ref={(el) => {
                  probes.current[id] = el
                }}
                className="bg-bg"
                style={{
                  position: "absolute",
                  width: cardWidth(id),
                  opacity: 0,
                }}
              >
                <Controls />
              </div>
            </Theme>
          )),
        [measured],
      )}
      <canvas
        ref={canvas}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  )
}

/** The real card of the look resting at `frame`, for checking the drawing. */
export function RealCard() {
  const { from } = swapAt(useCurrentFrame())
  return (
    <AbsoluteFill>
      <WarmIcons />
      <Theme state={preset(from)}>
        <div className="flex size-full items-center justify-center bg-bg">
          <div style={{ width: cardWidth(from) }}>
            <Controls />
          </div>
        </div>
      </Theme>
    </AbsoluteFill>
  )
}
