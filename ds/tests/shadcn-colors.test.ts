// Guards the committed shadcn-ui colors.json and its snapshot. Reads only
// committed files — never the network — so it doubles as a data contract.
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { parseColor } from '@/lib/color-math'
import { colorsFileSchema } from '@/data/schema'

import { parseOklch } from '../scripts/lib/extract'
import { verifySnapshot } from '../scripts/lib/snapshot'

/** Mirrors the extractor's baseUtility(): strip variant prefixes down to the
    base utility (everything after the last top-level ':' not inside []). */
function baseUtility(cls: string): string {
  let depth = 0
  let lastColon = -1
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i]
    if (ch === '[') depth++
    else if (ch === ']') depth--
    else if (ch === ':' && depth === 0) lastColon = i
  }
  return cls.slice(lastColon + 1)
}

const root = path.resolve(import.meta.dirname, '..')
const colorsPath = path.join(root, 'systems', 'shadcn-ui', 'colors.json')
const sourcesDir = path.join(root, 'sources', 'shadcn-ui')

const raw = JSON.parse(fs.readFileSync(colorsPath, 'utf8'))
const parsed = colorsFileSchema.safeParse(raw)

/** A value the browser could paint: oklch, rgb/hex/named, a var(), or the
    color-mix / relative-oklch expressions the derived colours use. */
function isValidColor(value: string): boolean {
  const v = value.trim()
  if (parseOklch(v)) return true
  if (parseColor(v)) return true
  if (/^(color-mix\(|oklch\(from |var\()/.test(v)) return true
  return false
}

describe('shadcn-ui colors.json', () => {
  it('parses against colorsFileSchema', () => {
    if (!parsed.success) throw new Error(parsed.error.message)
    expect(parsed.success).toBe(true)
  })

  const colors = colorsFileSchema.parse(raw)
  const modes = new Set(colors.modes)

  it('every colour value is a valid colour', () => {
    for (const ramp of colors.ramps) {
      for (const step of ramp.steps) {
        for (const value of Object.values(step.values)) {
          expect(
            isValidColor(value),
            `ramp ${ramp.name} ${step.step}: ${value}`,
          ).toBe(true)
        }
      }
    }
    for (const group of colors.tokenGroups) {
      for (const token of group.tokens) {
        for (const value of Object.values(token.values)) {
          expect(isValidColor(value), `token ${token.name}: ${value}`).toBe(
            true,
          )
        }
      }
    }
  })

  it('ships the full family inventory (9 neutrals, 17 chromatic, black/white)', () => {
    const neutrals = colors.ramps
      .filter((r) => r.kind === 'neutral')
      .map((r) => r.name)
      .sort()
    expect(neutrals).toEqual([
      'gray',
      'mauve',
      'mist',
      'neutral',
      'olive',
      'slate',
      'stone',
      'taupe',
      'zinc',
    ])
    expect(colors.ramps.filter((r) => r.kind === 'chromatic')).toHaveLength(17)
    expect(
      colors.ramps
        .filter((r) => r.kind === 'static')
        .map((r) => r.name)
        .sort(),
    ).toEqual(['black', 'white'])
    expect(colors.ramps).toHaveLength(28)
  })

  it('ramp values use normalized space-separated oklch (no comma syntax)', () => {
    const bad = colors.ramps.flatMap((ramp) =>
      ramp.steps
        .flatMap((s) => Object.values(s.values))
        .filter((v) => v.includes(','))
        .map((v) => `${ramp.name}: ${v}`),
    )
    expect(bad).toEqual([])
  })

  it('every ramp is complete (11 steps 50→950, except black/white)', () => {
    const expected = [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ]
    const shape = colors.ramps.map((ramp) => ({
      name: ramp.name,
      steps: ramp.steps.map((s) => s.step),
    }))
    const wrong = shape.filter((ramp) =>
      ramp.name === 'black' || ramp.name === 'white'
        ? ramp.steps.length !== 1
        : JSON.stringify(ramp.steps) !== JSON.stringify(expected),
    )
    expect(wrong).toEqual([])
  })

  it('every per-mode key is a declared mode', () => {
    const check = (values: Record<string, string>, where: string) => {
      for (const mode of Object.keys(values)) {
        expect(modes.has(mode), `${where}: ${mode}`).toBe(true)
      }
    }
    for (const ramp of colors.ramps) {
      for (const step of ramp.steps) check(step.values, `ramp ${ramp.name}`)
    }
    for (const group of colors.tokenGroups) {
      for (const token of group.tokens)
        check(token.values, `token ${token.name}`)
    }
  })

  it('every non-null token ref resolves to a ramp step or white/black', () => {
    const rampSteps = new Set<string>()
    for (const ramp of colors.ramps) {
      for (const step of ramp.steps) rampSteps.add(`${ramp.name}-${step.step}`)
    }
    for (const group of colors.tokenGroups) {
      for (const token of group.tokens) {
        if (!token.ref) continue
        const inner = token.ref.replace(/^\{|\}$/g, '')
        if (inner === 'white' || inner === 'black') continue
        expect(
          rampSteps.has(inner),
          `${group.name} ${token.name} → ${token.ref}`,
        ).toBe(true)
      }
    }
  })

  it('carries provenance with a pinned ref', () => {
    expect(colors.provenance.method).toBe('script')
    expect(colors.provenance.sources.length).toBeGreaterThan(0)
    const repo = colors.provenance.sources.find((s) => s.kind === 'repo')
    expect(repo?.ref).toMatch(/^[0-9a-f]{40}$/)
  })

  it('has non-empty derivedColors, each with ≥1 usedBy and ≥1 class', () => {
    expect(colors.derivedColors).not.toBeNull()
    const entries = colors.derivedColors?.entries ?? []
    expect(entries.length).toBeGreaterThan(0)
    const emptyUsedBy = entries.filter((entry) => entry.usedBy.length === 0)
    expect(emptyUsedBy).toEqual([])
    const emptyClasses = entries.flatMap((entry) =>
      entry.usedBy
        .filter((u) => u.classes.length === 0)
        .map((u) => `${entry.expression} → ${u.component}`),
    )
    expect(emptyClasses).toEqual([])
  })

  it('every usedBy class resolves back to its entry expression', () => {
    const entries = colors.derivedColors?.entries ?? []
    // Tailwind escapes spaces inside arbitrary-value brackets as `_`; the
    // extractor restores them for the expression, so normalize the same way.
    const normalize = (cls: string) => {
      const base = baseUtility(cls)
      return base.includes('[') ? base.replace(/_/g, ' ') : base
    }
    const mismatches = entries.flatMap((entry) =>
      entry.usedBy.flatMap((u) =>
        u.classes
          .filter((cls) => normalize(cls) !== entry.expression)
          .map((cls) => `${entry.expression}: ${u.component} → ${cls}`),
      ),
    )
    expect(mismatches).toEqual([])
  })
})

describe('shadcn-ui snapshot', () => {
  it('every vendored file matches its manifest sha256', () => {
    const bad = verifySnapshot(sourcesDir)
    expect(bad, `mismatched: ${bad.join(', ')}`).toEqual([])
  })
})
