/**
 * Seed anchoring (§4.5).
 *
 * Default: the seed's lightness is discarded — the ramp's L comes entirely from
 * the perceptual array (clean, even ramps; brand color not preserved exactly).
 *
 * Opt-in `preserveSeedAt`: pin the seed's lightness at a named step and rescale
 * each half of the array around it (keeping the perceptual spacing shape and the
 * endpoints), so the exact brand color lands at that step while the ramp stays
 * monotonic.
 */

/** Return a lightness array adjusted so `seedL` lands at `preserveSeedAt` (or unchanged by default). */
export function applyAnchoring(
  ls: number[],
  steps: readonly string[],
  seedL: number,
  preserveSeedAt?: string,
): number[] {
  if (!preserveSeedAt) return ls // default: array-driven, discard seed L
  const idx = steps.indexOf(preserveSeedAt)
  if (idx < 0 || ls.length < 2) return ls

  const top = ls[0]! // lightest
  const bottom = ls[ls.length - 1]! // darkest
  // Keep the pinned L strictly inside (bottom, top) so the rescale stays monotonic.
  const eps = 1e-3
  const pinned = Math.min(top - eps, Math.max(bottom + eps, seedL))

  const out = [...ls]
  out[idx] = pinned
  // Upper half: top → pinned, preserving each step's relative position in [top, ls[idx]].
  const upperSpan = ls[idx]! - top
  for (let i = 1; i < idx; i++) {
    const f = upperSpan === 0 ? i / idx : (ls[i]! - top) / upperSpan
    out[i] = top + f * (pinned - top)
  }
  // Lower half: pinned → bottom.
  const lowerSpan = bottom - ls[idx]!
  for (let i = idx + 1; i < ls.length - 1; i++) {
    const f =
      lowerSpan === 0
        ? (i - idx) / (ls.length - 1 - idx)
        : (ls[i]! - ls[idx]!) / lowerSpan
    out[i] = pinned + f * (bottom - pinned)
  }
  return out
}
