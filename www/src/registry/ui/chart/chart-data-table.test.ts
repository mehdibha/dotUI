import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { ChartDataTable, type ChartConfig } from './base'

// ChartDataTable never touches Recharts; stub the module so importing this
// 'use client' primitive doesn't drag Recharts' browser globals into the node
// test environment. Only the exports the primitive reads at module load need
// stubbing.
vi.mock('recharts', () => ({
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: () => null,
}))

const longData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
]
const longConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
} satisfies ChartConfig

const wideData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
]
const wideConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig

const render = (props: Parameters<typeof ChartDataTable>[0]) =>
  renderToStaticMarkup(createElement(ChartDataTable, props))

describe('ChartDataTable', () => {
  it('renders long-format (pie/radial) data as a two-column category/value table', () => {
    const html = render({
      data: longData,
      config: longConfig,
      labelKey: 'browser',
    })

    // Category-label column header (capitalized labelKey) + the single value column.
    expect(html).toContain('<th scope="col">Browser</th>')
    expect(html).toContain('<th scope="col">Visitors</th>')
    // Each row pairs a resolved category label with its value — not empty cells.
    expect(html).toContain('<th scope="row">Chrome</th>')
    expect(html).toContain('<td>275</td>')
    expect(html).toContain('<th scope="row">Safari</th>')
    expect(html).toContain('<td>200</td>')
    // The old bug spilled one column per category and left every cell empty —
    // guard against both regressing.
    expect(html).not.toContain('<th scope="col">Chrome</th>')
    expect(html).not.toContain('<td></td>')
  })

  it('renders wide-format (bar/line/area) data as one column per series', () => {
    const html = render({
      data: wideData,
      config: wideConfig,
      labelKey: 'month',
    })

    expect(html).toContain('<th scope="col">Month</th>')
    expect(html).toContain('<th scope="col">Desktop</th>')
    expect(html).toContain('<th scope="col">Mobile</th>')
    expect(html).toContain('<th scope="row">January</th>')
    expect(html).toContain('<td>186</td>')
    expect(html).toContain('<td>80</td>')
  })
})
