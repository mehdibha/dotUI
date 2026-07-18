/**
 * Alpha-twin parity (SPEC D10): the exact-solve must reproduce the published
 * @radix-ui/colors alpha scales — light twins over #ffffff, dark twins over
 * #111111 (grayDark-1, Radix's dark compositing base). Channels must match
 * exactly; alpha within 1/255 (Radix rounds to 2 hex digits).
 */

import * as radix from '@radix-ui/colors'
import { expect, test } from 'vitest'

import { solveAlphaRgb8 } from './index'

const FAMILIES = ['blue', 'red', 'green', 'amber', 'purple', 'gray'] as const

interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

/** Parse #rrggbb or #rrggbbaa (6-digit hex is fully opaque). */
function parseHex(hex: string): Rgba {
  const raw = hex.slice(1)
  const byte = (i: number) => parseInt(raw.slice(i, i + 2), 16)
  return {
    r: byte(0),
    g: byte(2),
    b: byte(4),
    a: raw.length === 8 ? byte(6) / 255 : 1,
  }
}

function parseRgbFn(value: string): Rgba {
  const match = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(value)
  if (!match) throw new Error(`unexpected twin format: ${value}`)
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: Number(match[4]),
  }
}

function familyMismatches(
  solids: Record<string, string>,
  published: Record<string, string>,
  background: [number, number, number],
): string[] {
  const mismatches: string[] = []
  const solidKeys = Object.keys(solids)
  const alphaKeys = Object.keys(published)
  for (const [i, solidKey] of solidKeys.entries()) {
    const want = parseHex(published[alphaKeys[i]!]!)
    const solid = parseHex(solids[solidKey]!)
    const got = parseRgbFn(
      solveAlphaRgb8([solid.r, solid.g, solid.b], background),
    )
    // Alpha compared in 8-bit space: ≤ 1/255 apart (our `rgb()` twins carry
    // 4-decimal alphas, Radix hex carries exact bytes).
    if (Math.abs(Math.round(got.a * 255) - Math.round(want.a * 255)) > 1) {
      mismatches.push(`${solidKey}: alpha ${got.a} vs ${want.a}`)
      continue
    }
    // A fully transparent twin has no visible channels to compare.
    if (want.a === 0 && got.a === 0) continue
    if (got.r !== want.r || got.g !== want.g || got.b !== want.b)
      mismatches.push(
        `${solidKey}: rgb(${got.r} ${got.g} ${got.b}) vs rgb(${want.r} ${want.g} ${want.b})`,
      )
  }
  return mismatches
}

test('light alpha twins match Radix digit-for-digit over #ffffff', () => {
  for (const family of FAMILIES) {
    const solids = radix[family] as Record<string, string>
    const published = radix[`${family}A`] as Record<string, string>
    expect(Object.keys(solids)).toHaveLength(12)
    expect(
      familyMismatches(solids, published, [255, 255, 255]),
      `${family}/light`,
    ).toEqual([])
  }
})

test('dark alpha twins match Radix digit-for-digit over #111111', () => {
  for (const family of FAMILIES) {
    const solids = radix[`${family}Dark`] as Record<string, string>
    const published = radix[`${family}DarkA`] as Record<string, string>
    expect(Object.keys(solids)).toHaveLength(12)
    expect(
      familyMismatches(solids, published, [17, 17, 17]),
      `${family}/dark`,
    ).toEqual([])
  }
})
