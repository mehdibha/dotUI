import { deflateRaw } from 'pako'
import { describe, expect, it } from 'vitest'

import { DEFAULT_COLOR_CONFIG, type ColorConfig } from '@/registry/theme'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'

/** Encode an arbitrary compact state with the same deflate+base64url pipeline
 *  as `encodePreset`, bypassing its typing — for crafting stale/v1 presets. */
function encodeRawState(state: unknown): string {
  const compressed = deflateRaw(JSON.stringify(state), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

describe('preset codec — color recipe', () => {
  it('omits the color recipe when it matches the default palette', () => {
    expect(
      encodePreset({ ...DEFAULTS, color: DEFAULT_COLOR_CONFIG }),
    ).toBeUndefined()
  })

  it('round-trips a custom color recipe through encode → decode', () => {
    const custom: ColorConfig = {
      ...DEFAULT_COLOR_CONFIG,
      seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent: '#ef4444' },
    }
    const encoded = encodePreset({ ...DEFAULTS, color: custom })
    expect(encoded).toBeTypeOf('string')
    expect(decodePreset(encoded ?? '').color).toEqual(custom)
  })

  it('decodes to an undefined color when the preset carries none', () => {
    const encoded = encodePreset({ ...DEFAULTS, density: 'comfortable' })
    expect(decodePreset(encoded ?? '').color).toBeUndefined()
  })

  it('round-trips an accent-sourced primary', () => {
    const custom: ColorConfig = { ...DEFAULT_COLOR_CONFIG, primary: 'accent' }
    const encoded = encodePreset({ ...DEFAULTS, color: custom })
    expect(encoded).toBeTypeOf('string')
    expect(decodePreset(encoded ?? '').color).toEqual(custom)
  })

  it('round-trips the engine axes (background, vividness, preserveSeed)', () => {
    const custom: ColorConfig = {
      ...DEFAULT_COLOR_CONFIG,
      background: { light: 98, dark: 'oled' },
      vividness: 1.33,
      hueShift: 1.6,
      neutralTint: 2,
      preserveSeed: true,
    }
    const encoded = encodePreset({ ...DEFAULTS, color: custom })
    expect(encoded).toBeTypeOf('string')
    expect(decodePreset(encoded ?? '').color).toEqual(custom)
  })

  it('migrates a stale v1-shaped preset onto the v2 axes', () => {
    const encoded = encodeRawState({
      c: {
        algorithm: 'contrast',
        seeds: { neutral: '#8a8f98', accent: '#5e6ad2', success: '#22c55e' },
        knobs: { chromaMult: 1.2, hueTorsion: 30 },
        primary: 'accent',
      },
    })
    expect(decodePreset(encoded).color).toEqual({
      v: 2,
      seeds: { accent: '#5e6ad2', neutral: '#8a8f98', success: '#22c55e' },
      vividness: 1.2,
      hueShift: 2,
      primary: 'accent',
    })
  })

  it('migrates the v1 default gray neutral to the auto-tinted default', () => {
    const encoded = encodeRawState({
      c: {
        algorithm: 'oklch',
        seeds: { neutral: '#808080', accent: '#ef4444' },
      },
    })
    expect(decodePreset(encoded).color).toEqual({
      v: 2,
      seeds: { accent: '#ef4444' },
    })
  })

  it('decodes an unrecognizable color slice to the default palette', () => {
    const encoded = encodeRawState({ c: { algorithm: 'fixed', ramps: {} } })
    expect(() => decodePreset(encoded)).not.toThrow()
    expect(decodePreset(encoded).color).toBeUndefined()
  })

  it('salvages valid axes when a sibling field is corrupt', () => {
    const encoded = encodeRawState({
      c: {
        v: 2,
        seeds: { accent: '#ef4444' },
        vividness: 5, // out of range — clamps, must not nuke siblings
        hueShift: 'loud', // wrong type — dropped
        background: { light: Number.NaN, dark: 3 },
        preserveSeed: true,
        primary: 'garbage',
      },
    })
    expect(decodePreset(encoded).color).toEqual({
      v: 2,
      seeds: { accent: '#ef4444' },
      vividness: 2,
      background: { dark: 3 },
      preserveSeed: true,
    })
  })

  it('replaces an unparseable seed instead of crashing the resolver', () => {
    const encoded = encodeRawState({
      c: {
        v: 2,
        seeds: { accent: 'garbage', success: '#zzz', info: '#4862ff' },
        vividness: 1.5,
      },
    })
    expect(decodePreset(encoded).color).toEqual({
      v: 2,
      seeds: { accent: DEFAULT_COLOR_CONFIG.seeds.accent, info: '#4862ff' },
      vividness: 1.5,
    })
  })

  it('drops a crafted primary value but keeps the rest of the recipe', () => {
    const encoded = encodeRawState({
      c: {
        v: 2,
        seeds: { accent: '#ef4444' },
        primary: 'red; } :root { --x: injected',
      },
    })
    const decoded = decodePreset(encoded).color
    expect(decoded?.primary).toBeUndefined()
    expect(decoded?.seeds.accent).toBe('#ef4444')
  })
})
