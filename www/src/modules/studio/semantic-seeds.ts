/* The Semantics editor's pure half: typed colors, the tone bands, hue moves
   and health, each measured on the solid the engine ships. */

import {
  CVD_GATE,
  deltaEok,
  fitSrgb,
  lstarOf,
  previewSolid,
  SEED_SNAP_BOUND,
  simulateCvd,
  SOLID_LSTAR_WINDOW,
  solveLstar,
  toHex,
  toOklch,
} from "@dotui/colors"
import type { CvdKind, Oklch } from "@dotui/colors"

import type { SemanticRole } from "./axes/color"

export function memo<A extends unknown[], R>(fn: (...args: A) => R) {
  const cache = new Map<string, R>()
  return (...args: A) => {
    const key = JSON.stringify(args)
    let hit = cache.get(key)
    if (hit === undefined) {
      if (cache.size > 2048) cache.clear()
      hit = fn(...args)
      cache.set(key, hit)
    }
    return hit
  }
}

/** The solid and label a seed ships as. */
export const shipped = memo((seed: string, vividness?: number) =>
  previewSolid(seed, { vividness }),
)

export const sameHex = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase()

export const seedHex = (seed: Oklch) => toHex(fitSrgb(seed)).toUpperCase()

/** Whether the engine snaps or clamps the seed. */
export const isMoved = (seed: string, solid: string) =>
  deltaEok(toOklch(seed), toOklch(solid)) > SEED_SNAP_BOUND

/** Any CSS color as a stored seed: alpha dropped, fitted to sRGB, uppercase
 *  hex. A pasted declaration is unwrapped first. */
export function parseSeed(raw: string): string | null {
  const text = raw
    .trim()
    .replace(/^["'`]/, "")
    .replace(/^(?:--)?[a-z][\w-]*\s*:\s*/i, "")
    .replace(/[;"'`\s]+$/, "")
    .replace(/^["'`]/, "")
  const bare = /^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(text)
  try {
    return seedHex(toOklch(bare ? `#${text}` : text))
  } catch {
    return null
  }
}

/* ---------------------------------- Tone ---------------------------------- */

// Solids under white labels, then under dark ones; the engine pins seeds between.
const DEEP = { from: SOLID_LSTAR_WINDOW.min, to: 60 }
const BRIGHT = { from: 74, to: SOLID_LSTAR_WINDOW.max }

/** The first bright step: one L* per step either side. */
export const TONE_SPLIT = DEEP.to - DEEP.from + 1
export const TONE_MAX = TONE_SPLIT + BRIGHT.to - BRIGHT.from

export const lstarAt = (tone: number) =>
  tone < TONE_SPLIT ? DEEP.from + tone : BRIGHT.from + tone - TONE_SPLIT

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** Where a shipped L* sits on the tone slider (a pinned one, on its edge). */
const toneOf = (lstar: number) =>
  lstar < (DEEP.to + BRIGHT.from) / 2
    ? clamp(Math.round(lstar - DEEP.from), 0, TONE_SPLIT - 1)
    : clamp(TONE_SPLIT + Math.round(lstar - BRIGHT.from), TONE_SPLIT, TONE_MAX)

export const shippedTone = (seed: string, vividness?: number) =>
  toneOf(lstarOf(toOklch(shipped(seed, vividness).solid)))

/** A seed whose shipped solid sits at `tone`, keeping chroma and hue. An
 *  unreachable bright tone gets the first bright solid above it. */
export const atTone = memo(
  (tone: number, c: number, h: number, vividness?: number): Oklch => {
    const target = lstarAt(tone)
    const at = (l: number) => ({ l, c, h })
    const guess = solveLstar(
      target,
      () => c,
      () => h,
    ).l
    if (shippedTone(seedHex(at(guess)), vividness) === tone) return at(guess)
    const ships = (l: number) =>
      lstarOf(toOklch(shipped(seedHex(at(l)), vividness).solid))
    let lo = 0
    let hi = 1
    for (let i = 0; i < 16; i++) {
      const l = (lo + hi) / 2
      if (ships(l) < target) lo = l
      else hi = l
    }
    return at(hi)
  },
)

/** A hue move keeps lightness and chroma, unless the engine would move that
 *  seed (or already moves this one): then it holds the tone. */
export function withHue(
  base: Oklch,
  c: number,
  h: number,
  tone: number,
  vividness?: number,
): Oklch {
  const seed = { l: base.l, c, h }
  const hex = seedHex(seed)
  const held =
    isMoved(seedHex(base), shipped(seedHex(base), vividness).solid) ||
    isMoved(hex, shipped(hex, vividness).solid)
  return held ? atTone(tone, c, h, vividness) : seed
}

/* --------------------------------- Health --------------------------------- */

export type Party = SemanticRole["palette"] | "info" | "brand"

const PARTY_LABEL: Record<Party, string> = {
  success: "Success",
  warning: "Warning",
  danger: "Danger",
  selection: "Selection",
  info: "Info",
  brand: "brand",
}

const CVD_NAME: Record<CvdKind, string> = {
  protan: "protanopia",
  deutan: "deuteranopia",
  tritan: "tritanopia",
}

interface Clash {
  a: Party
  b: Party
  /** Distance over its gate: lower is worse. */
  severity: number
  cvd?: CvdKind
}

const STATUSES = ["success", "warning", "danger", "info"] as const

/** Status solids against the engine's gates; Selection within the normal
 *  gate of Success or Danger. Selection that is the brand reads as brand. */
export function findClashes(solids: Record<Party, string>): Clash[] {
  const c = Object.fromEntries(
    Object.entries(solids).map(([party, color]) => [party, toOklch(color)]),
  ) as Record<Party, Oklch>
  const clashes: Clash[] = []
  STATUSES.forEach((a, i) => {
    for (const b of STATUSES.slice(i + 1)) {
      const d = deltaEok(c[a], c[b])
      if (d < CVD_GATE.normal) {
        clashes.push({ a, b, severity: d / CVD_GATE.normal })
        continue
      }
      for (const cvd of ["protan", "deutan", "tritan"] as const) {
        const severity =
          deltaEok(simulateCvd(c[a], cvd), simulateCvd(c[b], cvd)) /
          CVD_GATE.cvd
        if (severity < 1) clashes.push({ a, b, severity, cvd })
      }
    }
    const d = deltaEok(c[a], c.brand)
    if (d < CVD_GATE.accentProximity)
      clashes.push({ a, b: "brand", severity: d / CVD_GATE.accentProximity })
  })
  const selection = solids.selection === solids.brand ? "brand" : "selection"
  for (const b of ["danger", "success"] as const) {
    const d = deltaEok(c.selection, c[b])
    if (d < CVD_GATE.normal)
      clashes.push({ a: selection, b, severity: d / CVD_GATE.normal })
  }
  return clashes
}

/** A party's worst clash, from its side. */
export function clashFor(clashes: Clash[], party: Party) {
  const worst = clashes
    .filter((clash) => clash.a === party || clash.b === party)
    .sort((x, y) => x.severity - y.severity)[0]
  if (!worst) return undefined
  const other = PARTY_LABEL[worst.a === party ? worst.b : worst.a]
  return {
    label: `Close to ${other}`,
    detail: `Hard to tell from ${other === "brand" ? "the brand color" : other}${
      worst.cvd ? ` with ${CVD_NAME[worst.cvd]}` : ""
    }`,
  }
}
