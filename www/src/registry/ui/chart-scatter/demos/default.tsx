'use client'

import { ScatterChart } from '@/registry/ui/chart-scatter'

const routes = [
  { route: '/', size: 118, load: 0.8 },
  { route: '/pricing', size: 143, load: 1 },
  { route: '/blog', size: 96, load: 0.7 },
  { route: '/docs', size: 212, load: 1.4 },
  { route: '/docs/api', size: 268, load: 1.7 },
  { route: '/changelog', size: 134, load: 0.9 },
  { route: '/dashboard', size: 391, load: 2.6 },
  { route: '/settings', size: 305, load: 1.9 },
  { route: '/editor', size: 476, load: 3.2 },
  { route: '/login', size: 88, load: 0.6 },
  { route: '/signup', size: 102, load: 0.8 },
  { route: '/support', size: 176, load: 1.3 },
]

export default function ChartScatterDefault() {
  return (
    <ScatterChart
      data={routes}
      x="size"
      y="load"
      rowKey="route"
      ariaLabel="First load time by JavaScript bundle size, per route"
      formatX={{
        locale: 'en-US',
        number: { style: 'unit', unit: 'kilobyte' },
      }}
      formatY={{
        locale: 'en-US',
        number: { style: 'unit', unit: 'second', maximumFractionDigits: 1 },
      }}
    />
  )
}
