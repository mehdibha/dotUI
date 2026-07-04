// Live contrast measurement over shipped color values. Everything here
// computes from what the browser would paint — results are "measured",
// never to be conflated with a system's documented guarantees.

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

const named: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
}

/** Parse #rgb/#rgba/#rrggbb/#rrggbbaa, rgb()/rgba() and the few named colors the data uses. */
export function parseColor(value: string): Rgba | null {
  let v = value.trim().toLowerCase()
  v = named[v] ?? v

  const hex = /^#([0-9a-f]{3,8})$/.exec(v)?.[1]
  if (hex) {
    if (hex.length === 3 || hex.length === 4) {
      const [r, g, b, a] = [...hex].map((c) => parseInt(c + c, 16))
      return { r: r!, g: g!, b: b!, a: a !== undefined ? a / 255 : 1 }
    }
    if (hex.length === 6 || hex.length === 8) {
      const [r, g, b, a] = [0, 2, 4, 6].map((i) =>
        hex.length > i ? parseInt(hex.slice(i, i + 2), 16) : NaN,
      )
      return { r: r!, g: g!, b: b!, a: Number.isNaN(a) ? 1 : a! / 255 }
    }
    return null
  }

  const rgb =
    /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/.exec(
      v,
    )
  if (rgb) {
    const alpha = rgb[4]
      ? rgb[4].endsWith('%')
        ? parseFloat(rgb[4]) / 100
        : parseFloat(rgb[4])
      : 1
    return { r: +rgb[1]!, g: +rgb[2]!, b: +rgb[3]!, a: alpha }
  }
  return null
}

/** Source-over composite of a (possibly translucent) color onto an opaque background. */
export function composite(fg: Rgba, bg: Rgba): Rgba {
  if (fg.a >= 1) return fg
  const a = fg.a
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  }
}

function srgbToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  )
}

/** WCAG 2.x contrast ratio (1–21). Translucent foregrounds are composited first. */
export function wcagRatio(fg: Rgba, bg: Rgba): number {
  const l1 = relativeLuminance(composite(fg, bg))
  const l2 = relativeLuminance(bg)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

// APCA-W3 0.1.9 (SAPC-4g) constants — https://github.com/Myndex/apca-w3
const SA98G = {
  exp: 2.4,
  rco: 0.2126729,
  gco: 0.7151522,
  bco: 0.072175,
  normBg: 0.56,
  normTxt: 0.57,
  revTxt: 0.62,
  revBg: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWOffset: 0.027,
  loWoBOffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,
}

function apcaY({ r, g, b }: Rgba): number {
  const c = (channel: number) => Math.pow(channel / 255, SA98G.exp)
  return SA98G.rco * c(r) + SA98G.gco * c(g) + SA98G.bco * c(b)
}

function clampY(y: number): number {
  return y > SA98G.blkThrs ? y : y + Math.pow(SA98G.blkThrs - y, SA98G.blkClmp)
}

/** APCA-W3 lightness contrast Lc. Positive = dark text on light bg. */
export function apcaLc(fg: Rgba, bg: Rgba): number {
  const txtY = clampY(apcaY(composite(fg, bg)))
  const bgY = clampY(apcaY(bg))
  if (Math.abs(bgY - txtY) < SA98G.deltaYmin) return 0

  let sapc: number
  if (bgY > txtY) {
    sapc =
      (Math.pow(bgY, SA98G.normBg) - Math.pow(txtY, SA98G.normTxt)) *
      SA98G.scaleBoW
    return sapc < SA98G.loClip ? 0 : (sapc - SA98G.loBoWOffset) * 100
  }
  sapc =
    (Math.pow(bgY, SA98G.revBg) - Math.pow(txtY, SA98G.revTxt)) * SA98G.scaleWoB
  return sapc > -SA98G.loClip ? 0 : (sapc + SA98G.loWoBOffset) * 100
}

/** Measured contrast for two CSS values; null when either isn't statically resolvable. */
export function measure(
  fgValue: string,
  bgValue: string,
): { apca: number; wcag: number } | null {
  const fg = parseColor(fgValue)
  const bg = parseColor(bgValue)
  if (!fg || !bg) return null
  const opaqueBg =
    bg.a < 1 ? composite(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg
  return { apca: apcaLc(fg, opaqueBg), wcag: wcagRatio(fg, opaqueBg) }
}
