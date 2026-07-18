/**
 * APCA port parity (SPEC D3): our SAPC-4g port must agree with the official
 * `apca-w3` meter. Colors are built from 8-bit hexes so both sides see the
 * same bytes (our apca rounds Oklch to 8-bit sRGB internally).
 */

import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { expect, test } from 'vitest'

import { apca, toOklch } from './index'

/** Deterministic PRNG (mulberry32) — no Math.random in the corpus. */
function mulberry32(seed: number): () => number {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomRgb8(next: () => number): [number, number, number] {
  const byte = () => Math.min(255, Math.floor(next() * 256))
  return [byte(), byte(), byte()]
}

function hexOf([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

test('apca matches apca-w3 within ±0.6 Lc on 200 random sRGB pairs', () => {
  const next = mulberry32(0xd0701)
  for (let i = 0; i < 200; i++) {
    const text = randomRgb8(next)
    const bg = randomRgb8(next)
    const ours = apca(toOklch(hexOf(text)), toOklch(hexOf(bg)))
    const theirs = APCAcontrast(sRGBtoY(text), sRGBtoY(bg))
    expect(
      Math.abs(ours - theirs),
      `pair ${i}: ${hexOf(text)} on ${hexOf(bg)} (ours ${ours.toFixed(2)}, apca-w3 ${theirs.toFixed(2)})`,
    ).toBeLessThanOrEqual(0.6)
  }
})
