// Shared measurement helpers for the D2 research scripts.
// APCA via the official apca-w3 meter; WCAG 2 via the standard relative-
// luminance formula. Lab numbers use culori lab65 (D65, matching WCAG).

import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter } from 'culori'

export const toOklch = converter('oklch')
export const toLab65 = converter('lab65')
export const toRgb = converter('rgb')

export function hexToRgb255(hex) {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

// WCAG 2 relative luminance of an 8-bit sRGB triplet.
function wcagLuminance([r, g, b]) {
  const lin = (v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function wcagRatio(hexA, hexB) {
  const la = wcagLuminance(hexToRgb255(hexA))
  const lb = wcagLuminance(hexToRgb255(hexB))
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// Signed APCA Lc: text first, background second.
export function apcaLc(textHex, bgHex) {
  return Number(
    APCAcontrast(sRGBtoY(hexToRgb255(textHex)), sRGBtoY(hexToRgb255(bgHex))),
  )
}

export function round(n, d = 2) {
  return Number(n.toFixed(d))
}

export function median(values) {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

// Radix scale names (25 accents + 6 grays = 31 light + 31 dark).
export const RADIX_GRAYS = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand']
export const RADIX_ACCENTS = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'bronze',
  'gold',
  'brown',
  'orange',
  'amber',
  'yellow',
  'lime',
  'mint',
  'sky',
]
export const RADIX_ALL = [...RADIX_GRAYS, ...RADIX_ACCENTS]

// Extract steps 1..12 as hex from a Radix scale object like { blue1: "#..", ... }.
export function radixSteps(scaleObj) {
  const key = Object.keys(scaleObj)[0].replace(/\d+$/, '')
  const steps = {}
  for (let i = 1; i <= 12; i++) steps[i] = scaleObj[`${key}${i}`]
  return steps
}
