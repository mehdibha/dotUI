// Extract-support: small parsing helpers the per-system extractors share.
// Deliberately tiny — no CSS AST, just enough regex to read the shapes we
// vendor. Everything here is pure and deterministic.
import type { Provenance, ProvenanceSource } from '../../src/data/schema'

export interface Oklch {
  l: number
  c: number
  h: number
  a: number
}

/** Parse an oklch() string in either form: space-separated full precision
    (`oklch(0.145 0 0)`, optional `/ 10%` alpha) or the comma shorthand the
    shadcn colors index emits (`oklch(0.98,0.00,248)`). */
export function parseOklch(value: string): Oklch | null {
  const match = value.match(/oklch\(([^)]+)\)/i)
  if (!match) return null
  const [body, alphaRaw] = match[1]!.split('/').map((s) => s.trim())
  const parts = body!.split(/[\s,]+/).filter(Boolean)
  if (parts.length < 1) return null
  const num = (s: string) =>
    s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s)
  return {
    l: num(parts[0]!),
    c: num(parts[1] ?? '0'),
    h: num(parts[2] ?? '0'),
    a: alphaRaw ? num(alphaRaw) : 1,
  }
}

/** Pure white / pure black, ignoring hue noise on the achromatic axis. */
export function isPureWhite(value: string): boolean {
  const p = parseOklch(value)
  return !!p && p.a >= 1 && p.l >= 0.999 && p.c < 0.001
}
export function isPureBlack(value: string): boolean {
  const p = parseOklch(value)
  return !!p && p.a >= 1 && p.l < 0.001 && p.c < 0.001
}

/** Collapse internal whitespace so two spellings of the same value compare equal. */
export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

/** One step of a family ramp, keyed for numeric ref matching. */
export interface RampStep {
  family: string
  step: string
  oklch: string
}

/** Numeric ref match against a set of ramp steps. The shadcn colors index
    (from _legacy-colors.ts) rounds L/C to 2dp and hue to an integer, and drifts
    slightly from the newer themes.ts palette, so we match within a tolerance
    that absorbs both rather than by string equality. L is the strongest
    discriminator (steps within a family differ mostly in lightness); hue keeps
    families apart. Returns `family-step`, or null when nothing is close. */
export function matchRampStep(
  value: string,
  steps: RampStep[],
  preferFamily?: string | null,
): { family: string; step: string } | null {
  const p = parseOklch(value)
  if (!p) return null
  let best: RampStep | null = null
  let bestDist = Infinity
  for (const s of steps) {
    const q = parseOklch(s.oklch)
    if (!q) continue
    const dl = Math.abs(p.l - q.l)
    const dc = Math.abs(p.c - q.c)
    let dh = Math.abs(p.h - q.h)
    dh = Math.min(dh, 360 - dh)
    // Gates. L must be tight — far below the ~0.05 inter-step gap, but loose
    // enough for the legacy palette's drift from the current one. C absorbs
    // the source's 2-dp rounding, which clips hardest on high-chroma colours.
    // Hue keeps families apart: strict for chromatic values, loose for tinted
    // greys, ignored only when both sides are effectively achromatic. A grey
    // must not match a clearly-tinted step (or vice versa) on chroma
    // coincidence alone.
    if (dl > 0.013 || dc > (p.c > 0.1 ? 0.04 : 0.025) + 1e-9) continue
    if (Math.min(p.c, q.c) < 0.008 && dc > 0.012) continue
    if (p.c > 0.03) {
      if (dh > 4) continue
    } else if (Math.max(p.c, q.c) >= 0.008 && dh > 30) {
      continue
    }
    // Rank by lightness, then hue (meaningless on true greys), then chroma;
    // a tiny penalty on non-preferred families breaks exact-tie greys.
    const familyPenalty = preferFamily && s.family !== preferFamily ? 1e-4 : 0
    const dist = dl * 100 + (p.c < 0.008 ? 0 : dh) + dc * 10 + familyPenalty
    if (dist < bestDist) {
      bestDist = dist
      best = s
    }
  }
  return best ? { family: best.family, step: String(best.step) } : null
}

/** Build a provenance block. `sources` are already-shaped provenance sources. */
export function buildProvenance(opts: {
  method: Provenance['method']
  extractor: string | null
  sources: ProvenanceSource[]
  notes: string | null
}): Provenance {
  return {
    method: opts.method,
    extractor: opts.extractor,
    sources: opts.sources,
    notes: opts.notes,
  }
}

/** Deep sort helper so emitted JSON is byte-stable regardless of insertion order. */
export function sortByKey<T>(items: T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => key(a).localeCompare(key(b)))
}
