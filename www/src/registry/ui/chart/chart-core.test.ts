import { describe, expect, it } from 'vitest'

import { decorative, planChart, resolveFormat, stackY } from './base'

interface Row {
  month: string
  desktop?: number | null
  mobile?: number | null
}

describe('stackY', () => {
  const rows: Row[] = [
    { month: 'Jan', desktop: 10, mobile: 30 },
    { month: 'Feb', desktop: null, mobile: 5 },
    { month: 'Mar', desktop: 0, mobile: 0 },
  ]
  const options = { x: 'month', y: ['desktop', 'mobile'] } as const

  it('accumulates base and top, keeping the raw contribution in value', () => {
    const [janDesktop, janMobile] = stackY(rows.slice(0, 1), options)
    expect(janDesktop).toMatchObject({ value: 10, base: 0, top: 10 })
    expect(janMobile).toMatchObject({ value: 30, base: 10, top: 40 })
  })

  it('leaves a gap for a null contribution and preserves the base', () => {
    const feb = stackY(rows.slice(1, 2), options)
    expect(feb[0]).toMatchObject({ value: null, top: null, base: 0 })
    expect(feb[1]).toMatchObject({ value: 5, base: 0, top: 5 })
  })

  it('normalizes each x group to shares of its own total', () => {
    const jan = stackY(rows.slice(0, 1), { ...options, normalize: true })
    expect(jan[0]?.value).toBeCloseTo(0.25)
    expect(jan[1]?.value).toBeCloseTo(0.75)
    expect(jan[1]?.top).toBeCloseTo(1)
  })

  it('normalizes an all-zero group to zero-height bands, not a gap', () => {
    const mar = stackY(rows.slice(2, 3), { ...options, normalize: true })
    expect(mar[0]).toMatchObject({ value: 0, base: 0, top: 0 })
    expect(mar[1]).toMatchObject({ value: 0, base: 0, top: 0 })
  })
})

describe('resolveFormat', () => {
  it('passes a function through untouched', () => {
    const format = (value: unknown) => `#${String(value)}`
    expect(resolveFormat(format)).toBe(format)
  })

  it('builds a locale-pinned number formatter from options', () => {
    const format = resolveFormat({
      locale: 'en-US',
      number: { style: 'percent', maximumFractionDigits: 0 },
    })
    expect(format?.(0.42)).toBe('42%')
  })

  it('builds a date formatter accepting timestamps and Dates', () => {
    const format = resolveFormat({
      locale: 'en-US',
      date: { month: 'short', timeZone: 'UTC' },
    })
    expect(format?.(Date.UTC(2026, 0, 15))).toBe('Jan')
    expect(format?.(new Date(Date.UTC(2026, 0, 15)))).toBe('Jan')
  })

  it('returns undefined for undefined', () => {
    expect(resolveFormat(undefined)).toBeUndefined()
  })
})

describe('planChart', () => {
  const rows: Row[] = [
    { month: 'Jan', desktop: 1, mobile: 2 },
    { month: 'Feb', desktop: 3, mobile: 4 },
  ]

  it('gives wide rows one layer per y field, in seriesOrder', () => {
    const plan = planChart({
      data: rows,
      x: 'month',
      y: ['desktop', 'mobile'],
      seriesOrder: ['mobile', 'desktop'],
      labels: { desktop: 'Desktop', mobile: 'Mobile' },
    })
    expect(plan.order).toEqual(['Mobile', 'Desktop'])
    expect(plan.layers).toHaveLength(2)
    expect(plan.layers[0]?.channels.y).toBe('mobile')
  })

  it('derives series order from data insertion order in long mode', () => {
    const long = [
      { month: 'Jan', kind: 'b', value: 1 },
      { month: 'Jan', kind: 'a', value: 2 },
      { month: 'Feb', kind: 'b', value: 3 },
    ]
    const plan = planChart({
      data: long,
      x: 'month',
      y: 'value',
      series: 'kind',
    })
    expect(plan.order).toEqual(['b', 'a'])
    expect(plan.layers).toHaveLength(1)
  })
})

describe('decorative', () => {
  it('strips focus points but keeps nodes and the rest of the mark', () => {
    const mark = {
      initialize: () => ({
        id: 'label',
        render: () => ({
          nodes: [{ kind: 'text' }],
          points: [{ key: 'p0' }],
        }),
      }),
    }
    const initialized = decorative(mark).initialize()
    expect(initialized.id).toBe('label')
    const scene = initialized.render()
    expect(scene.nodes).toEqual([{ kind: 'text' }])
    expect('points' in scene).toBe(false)
  })
})
