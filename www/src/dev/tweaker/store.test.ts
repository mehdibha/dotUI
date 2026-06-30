import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  __resetStoreForTests,
  coerceTweakValue,
  getValue,
  registerControl,
  setValue,
  subscribe,
  unregisterControl,
} from './store'

afterEach(() => {
  __resetStoreForTests()
})

describe('coerceTweakValue', () => {
  test('boolean type-guards', () => {
    expect(coerceTweakValue({ type: 'boolean', default: true }, 'nope')).toBe(
      true,
    )
    expect(coerceTweakValue({ type: 'boolean', default: true }, false)).toBe(
      false,
    )
  })

  test('number rejects NaN/non-numbers and clamps into range', () => {
    const cfg = { type: 'number', default: 10, min: 0, max: 20 } as const
    expect(coerceTweakValue(cfg, 50)).toBe(20)
    expect(coerceTweakValue(cfg, -5)).toBe(0)
    expect(coerceTweakValue(cfg, 7)).toBe(7)
    expect(coerceTweakValue(cfg, Number.NaN)).toBe(10)
    expect(coerceTweakValue(cfg, 'x')).toBe(10)
  })

  test('select falls back to default when the option is gone', () => {
    const cfg = { type: 'select', options: ['a', 'b'], default: 'a' } as const
    expect(coerceTweakValue(cfg, 'b')).toBe('b')
    expect(coerceTweakValue(cfg, 'gone')).toBe('a')
  })

  test('color/text guard strings', () => {
    expect(coerceTweakValue({ type: 'color', default: '#000' }, 5)).toBe('#000')
    expect(coerceTweakValue({ type: 'color', default: '#000' }, '#fff')).toBe(
      '#fff',
    )
    expect(coerceTweakValue({ type: 'text', default: 'hi' }, 9)).toBe('hi')
    expect(coerceTweakValue({ type: 'text', default: 'hi' }, 'yo')).toBe('yo')
  })
})

describe('register / value lifetime', () => {
  test('register seeds the default', () => {
    const id = registerControl(
      'Layout',
      { type: 'select', options: ['a', 'b'], default: 'a' },
      'owner-1',
    )
    expect(getValue(id)).toBe('a')
  })

  test('a chosen value survives unregister + re-register (StrictMode / HMR)', () => {
    const cfg = { type: 'select', options: ['a', 'b'], default: 'a' } as const
    const id = registerControl('Layout', cfg, 'owner-1')
    setValue(id, 'b')
    expect(getValue(id)).toBe('b')

    unregisterControl(id)
    expect(getValue(id)).toBe('b') // value is NOT cleared on unmount

    const id2 = registerControl('Layout', cfg, 'owner-1')
    expect(id2).toBe(id)
    expect(getValue(id)).toBe('b')
  })

  test('re-register re-coerces a now-invalid value to the default', () => {
    const id = registerControl(
      'Size',
      { type: 'select', options: ['sm', 'lg'], default: 'sm' },
      'owner-1',
    )
    setValue(id, 'lg')
    unregisterControl(id)

    // The agent edited the config: 'lg' is no longer a valid option.
    registerControl(
      'Size',
      { type: 'select', options: ['sm', 'md'], default: 'sm' },
      'owner-1',
    )
    expect(getValue(id)).toBe('sm')
  })

  test('group + label form the id', () => {
    const id = registerControl(
      'Padding',
      { type: 'number', default: 8, group: 'Header' },
      'owner-1',
    )
    expect(id).toBe('Header::Padding')
  })
})

describe('setValue', () => {
  test('no-ops (no notify) on an equal value', () => {
    const id = registerControl(
      'On',
      { type: 'boolean', default: false },
      'owner-1',
    )
    const listener = vi.fn<() => void>()
    const unsub = subscribe(listener)

    setValue(id, true)
    expect(listener).toHaveBeenCalledTimes(1)

    setValue(id, true) // equal → no-op, no notification
    expect(listener).toHaveBeenCalledTimes(1)

    unsub()
  })

  test('coerces against the registered config', () => {
    const id = registerControl(
      'Gap',
      { type: 'number', default: 8, min: 0, max: 16 },
      'owner-1',
    )
    setValue(id, 999)
    expect(getValue(id)).toBe(16) // clamped to max
  })
})
