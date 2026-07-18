/**
 * Alpha twins (D10): the exact-solve for the most-transparent RGBA that
 * composites over the mode's app background to reproduce the solid step.
 * Verified digit-for-digit against @radix-ui/colors published alpha scales
 * (144/144 hex-exact) — see research/alpha-parity.mjs.
 */

import { type Oklch, toSrgb8 } from './space'

const PRECISION = 255

function composeChannel(bg: number, fg: number, alpha: number): number {
  return Math.round(bg * (1 - alpha)) + Math.round(fg * alpha)
}

/** Solve the alpha twin of `target` over `background`, as `rgb(r g b / a)`. */
export function alphaTwin(target: Oklch, background: Oklch): string {
  return solveAlphaRgb8(toSrgb8(target), toSrgb8(background))
}

/** 8-bit core of the twin solve (exported for the Radix parity tests). */
export function solveAlphaRgb8(
  t: [number, number, number],
  b: [number, number, number],
): string {

  if (t[0] === b[0] && t[1] === b[1] && t[2] === b[2])
    return `rgb(${t[0]} ${t[1]} ${t[2]} / 0)`

  // Pure-gray shortcut: exact one-shot solve toward the nearer pole.
  const isGray =
    t[0] === t[1] && t[1] === t[2] && b[0] === b[1] && b[1] === b[2]
  if (isGray) {
    const desired = t[0]! < b[0]! ? 0 : 255
    const alpha = (t[0]! - b[0]!) / (desired - b[0]!)
    const a = Math.ceil(alpha * PRECISION) / PRECISION
    const channel = desired === 0 ? 0 : 255
    return formatRgba([channel, channel, channel], a)
  }

  // Overlay direction: toward white if any target channel is lighter than the
  // background's, else toward black.
  const desired = t.some((tc, i) => tc > b[i]!) ? 255 : 0

  let maxAlpha = 0
  for (let i = 0; i < 3; i++) {
    if (desired === b[i]!) continue
    maxAlpha = Math.max(maxAlpha, (t[i]! - b[i]!) / (desired - b[i]!))
  }
  const a = Math.min(1, Math.ceil(maxAlpha * PRECISION) / PRECISION)
  if (a <= 0) return `rgb(${t[0]} ${t[1]} ${t[2]} / 0)`

  const channels = [0, 0, 0] as [number, number, number]
  for (let i = 0; i < 3; i++) {
    let c = Math.ceil(Math.max(0, Math.min(255, -(b[i]! * (1 - a) - t[i]!) / a)))
    // ±1 correction against the browser's per-term rounding.
    for (const candidate of [c, c - 1, c + 1]) {
      if (candidate < 0 || candidate > 255) continue
      if (composeChannel(b[i]!, candidate, a) === t[i]!) {
        c = candidate
        break
      }
    }
    channels[i] = Math.max(0, Math.min(255, c))
  }
  return formatRgba(channels, a)
}

function formatRgba(rgb: [number, number, number], alpha: number): string {
  const a = Math.round(alpha * 10000) / 10000
  return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / ${a})`
}
