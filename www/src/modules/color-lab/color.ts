/* Self-contained color math for the color lab. Deliberately independent from
   @dotui/colors — the lab exists to judge that engine's rewrite, so it must not
   share its code. Conversions follow Björn Ottosson's OKLab reference. */

export interface Oklch {
  l: number // 0..1
  c: number
  h: number // degrees, 0..360
  alpha: number
}

export interface Rgb {
  r: number // 0..1
  g: number
  b: number
  alpha: number
}

// --- parsing ---------------------------------------------------------------

export function parseColor(input: string): Rgb | null {
  const str = input.trim().toLowerCase()
  if (str.startsWith('#')) return parseHex(str)
  const fn = str.match(/^([a-z-]+)\(([^)]*)\)$/)
  if (!fn?.[1] || fn[2] === undefined) return null
  const name = fn[1]
  const args = fn[2]
    .replace(/\//g, ' ')
    .replace(/,/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const isColorFn = name === 'color'
  const [a0, a1, a2, a3] = isColorFn ? args.slice(1) : args
  if (a0 === undefined || a1 === undefined || a2 === undefined) return null
  const alpha = a3 === undefined ? 1 : channel(a3, 1)
  switch (name) {
    case 'rgb':
    case 'rgba':
      return {
        r: channel(a0, 255),
        g: channel(a1, 255),
        b: channel(a2, 255),
        alpha,
      }
    case 'hsl':
    case 'hsla':
      return {
        ...hslToRgb(parseFloat(a0), channel(a1, 100), channel(a2, 100)),
        alpha,
      }
    case 'oklch': {
      const c = a1.endsWith('%') ? (parseFloat(a1) / 100) * 0.4 : parseFloat(a1)
      return oklchToRgb({
        l: channel(a0, 1),
        c,
        h: a2 === 'none' ? 0 : parseFloat(a2),
        alpha,
      })
    }
    case 'oklab':
      return oklabToRgb(channel(a0, 1), parseFloat(a1), parseFloat(a2), alpha)
    case 'color': {
      // color(display-p3 r g b) — approximate by treating channels as sRGB;
      // close enough for comparison strips.
      const space = args[0]
      if (space !== 'display-p3' && space !== 'srgb') return null
      return { r: channel(a0, 1), g: channel(a1, 1), b: channel(a2, 1), alpha }
    }
    default:
      return null
  }
}

function channel(value: string, scale: number): number {
  if (value.endsWith('%')) return parseFloat(value) / 100
  return parseFloat(value) / scale
}

function parseHex(hex: string): Rgb | null {
  const h = hex.slice(1)
  const expand = (s = 'f') => parseInt(s.length === 1 ? s + s : s, 16) / 255
  if (h.length === 3 || h.length === 4) {
    return {
      r: expand(h[0]),
      g: expand(h[1]),
      b: expand(h[2]),
      alpha: h.length === 4 ? expand(h[3]) : 1,
    }
  }
  if (h.length === 6 || h.length === 8) {
    return {
      r: expand(h.slice(0, 2)),
      g: expand(h.slice(2, 4)),
      b: expand(h.slice(4, 6)),
      alpha: h.length === 8 ? expand(h.slice(6, 8)) : 1,
    }
  }
  return null
}

function hslToRgb(h: number, s: number, l: number): Omit<Rgb, 'alpha'> {
  const hue = ((h % 360) + 360) % 360
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + hue / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return { r: f(0), g: f(8), b: f(4) }
}

// --- sRGB <-> OKLab --------------------------------------------------------

const srgbToLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
const linearToSrgb = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(a, bb)
  let h = (Math.atan2(bb, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h: c < 1e-5 ? 0 : h, alpha: rgb.alpha }
}

export function oklchToRgb(color: Oklch): Rgb {
  const hr = (color.h * Math.PI) / 180
  return oklabToRgb(
    color.l,
    color.c * Math.cos(hr),
    color.c * Math.sin(hr),
    color.alpha,
  )
}

function oklabToRgb(L: number, a: number, b: number, alpha: number): Rgb {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3)
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3)
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3)
  const clamp = (v: number) => Math.min(1, Math.max(0, linearToSrgb(v)))
  return {
    r: clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    alpha,
  }
}

export function rgbToHex(rgb: Rgb): string {
  const to = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`
}

// --- contrast --------------------------------------------------------------

/** WCAG 2.x relative luminance. */
export function wcagLuminance(rgb: Rgb): number {
  return (
    0.2126 * srgbToLinear(rgb.r) +
    0.7152 * srgbToLinear(rgb.g) +
    0.0722 * srgbToLinear(rgb.b)
  )
}

/** WCAG 2.x contrast ratio, 1..21. */
export function wcagContrast(a: Rgb, b: Rgb): number {
  const la = wcagLuminance(a)
  const lb = wcagLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** APCA-W3 (0.0.98G-4g) lightness contrast Lc. Positive = dark text on light
    bg, negative = light text on dark bg. |Lc| 90 ≈ ideal body, 60 ≈ minimum
    body, 45 ≈ large text, 30 ≈ absolute minimum for any text. */
export function apcaContrast(text: Rgb, bg: Rgb): number {
  const y = (c: Rgb) => {
    const v =
      0.2126729 * Math.pow(c.r, 2.4) +
      0.7151522 * Math.pow(c.g, 2.4) +
      0.072175 * Math.pow(c.b, 2.4)
    return v < 0.022 ? v + Math.pow(0.022 - v, 1.414) : v
  }
  const yTxt = y(text)
  const yBg = y(bg)
  let sapc: number
  if (yBg > yTxt) {
    sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14
    return sapc < 0.1 ? 0 : (sapc - 0.027) * 100
  }
  sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14
  return sapc > -0.1 ? 0 : (sapc + 0.027) * 100
}

// --- color-vision-deficiency simulation ------------------------------------

export type CvdType = 'protanopia' | 'deuteranopia' | 'tritanopia'

// Machado, Oliveira & Fernandes (2009), severity 1.0, applied in linear RGB.
type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]
const CVD_MATRICES: Record<CvdType, Mat3> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
}

export function simulateCvd(rgb: Rgb, type: CvdType): Rgb {
  const m = CVD_MATRICES[type]
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)
  const clamp = (v: number) => Math.min(1, Math.max(0, linearToSrgb(v)))
  return {
    r: clamp(m[0] * r + m[1] * g + m[2] * b),
    g: clamp(m[3] * r + m[4] * g + m[5] * b),
    b: clamp(m[6] * r + m[7] * g + m[8] * b),
    alpha: rgb.alpha,
  }
}
