/* ----------------------------------------------------------------------------
 * Tiny self-contained color math for the (simulated) AI engine.
 *
 * The engine maps natural-language intents onto the live color recipe, so it
 * needs to nudge a seed hex by hue / saturation. We deliberately stay in HSL
 * with no dependencies — the kernel (`@dotui/colors`) owns perceptual ramp
 * generation downstream; here we only need a believable seed to hand it.
 * -------------------------------------------------------------------------- */

export interface Hsl {
  h: number // 0..360
  s: number // 0..100
  l: number // 0..100
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function hexToHsl(hex: string): Hsl {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let hue = 0
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6
    else if (max === g) hue = (b - r) / d + 2
    else hue = (r - g) / d + 4
    hue *= 60
    if (hue < 0) hue += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h: Math.round(hue), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex({ h, s, l }: Hsl): string {
  const sn = clamp(s, 0, 100) / 100
  const ln = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hp = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0]
  else if (hp < 2) [r, g, b] = [x, c, 0]
  else if (hp < 3) [r, g, b] = [0, c, x]
  else if (hp < 4) [r, g, b] = [0, x, c]
  else if (hp < 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const m = ln - c / 2
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** Rotate a hex's hue by `deg` (positive = toward warm/red→…→cool depending on start). */
export function shiftHue(hex: string, deg: number): string {
  const hsl = hexToHsl(hex)
  return hslToHex({ ...hsl, h: hsl.h + deg })
}

/** Multiply saturation, keeping hue + lightness. */
export function scaleSaturation(hex: string, mult: number): string {
  const hsl = hexToHsl(hex)
  return hslToHex({ ...hsl, s: clamp(hsl.s * mult, 6, 100) })
}

/** Set a fresh, legible seed for a named hue while preserving a sensible S/L. */
export function seedForHue(hue: number): string {
  return hslToHex({ h: hue, s: 68, l: 54 })
}

/**
 * The shortest signed rotation from `hex`'s hue toward `targetHue` — used to
 * "warm" / "cool" by a bounded amount rather than snapping to an absolute hue.
 */
export function rotationToward(hex: string, targetHue: number): number {
  const { h } = hexToHsl(hex)
  let diff = (targetHue - h) % 360
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff
}

/** Canonical hue per common color word — lets "make it teal" map to a seed. */
export const HUE_WORDS: Record<string, number> = {
  red: 2,
  crimson: 350,
  rose: 345,
  pink: 330,
  fuchsia: 305,
  magenta: 310,
  purple: 282,
  violet: 268,
  indigo: 246,
  blue: 220,
  sky: 205,
  cyan: 190,
  teal: 175,
  emerald: 155,
  green: 142,
  lime: 95,
  yellow: 52,
  amber: 42,
  gold: 46,
  orange: 28,
  coral: 14,
}
