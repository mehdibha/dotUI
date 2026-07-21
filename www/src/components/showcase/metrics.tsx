'use client'

import * as React from 'react'

import { TrendingDownIcon, TrendingUpIcon } from '@/registry/icons'
import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

// Twelve months of revenue (in $k). Hardcoded snapshot.
const revenue = [14, 18, 15, 22, 20, 26, 24, 30, 28, 34, 40, 46]

const ranges = [
  { id: '3m', label: '3M', months: 3 },
  { id: '6m', label: '6M', months: 6 },
  { id: '12m', label: '12M', months: 12 },
] as const

type RangeId = (typeof ranges)[number]['id']

// Build a smooth (Catmull-Rom -> cubic bezier) sparkline path inside the
// 300x80 viewBox. Returns both the line and the closed area-under-line path.
function buildSparkline(values: number[]) {
  const width = 300
  const height = 80
  const pad = 4
  const top = 6 // headroom so the peak isn't clipped by the stroke
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const n = values.length

  const x = (i: number) =>
    n === 1 ? width / 2 : pad + (i * (width - 2 * pad)) / (n - 1)
  const y = (v: number) =>
    height - pad - ((v - min) / span) * (height - 2 * pad - top)

  const px = values.map((_, i) => x(i))
  const py = values.map((v) => y(v))
  // Clamped, index-safe reader (values are all defined; this satisfies TS).
  const at = (arr: number[], i: number) =>
    arr[Math.max(0, Math.min(arr.length - 1, i))] ?? 0

  let line = `M ${at(px, 0)} ${at(py, 0)}`
  for (let i = 0; i < n - 1; i++) {
    const x1 = at(px, i)
    const y1 = at(py, i)
    const x2 = at(px, i + 1)
    const y2 = at(py, i + 1)
    const x0 = at(px, i === 0 ? 0 : i - 1)
    const y0 = at(py, i === 0 ? 0 : i - 1)
    const x3 = at(px, i + 2 < n ? i + 2 : n - 1)
    const y3 = at(py, i + 2 < n ? i + 2 : n - 1)
    const c1x = x1 + (x2 - x0) / 6
    const c1y = y1 + (y2 - y0) / 6
    const c2x = x2 - (x3 - x1) / 6
    const c2y = y2 - (y3 - y1) / 6
    line += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`
  }

  const baseline = height - pad
  const area = `${line} L ${at(px, n - 1).toFixed(1)} ${baseline} L ${at(px, 0).toFixed(1)} ${baseline} Z`

  return { line, area }
}

function summarize(values: number[]) {
  const total = values.reduce((sum, v) => sum + v, 0)
  const latest = values[values.length - 1] ?? 0
  const previous = (values.length > 1 ? values[values.length - 2] : latest) ?? 0
  const delta = previous === 0 ? 0 : ((latest - previous) / previous) * 100
  return { total, delta }
}

export function Metrics({ className, ...props }: React.ComponentProps<'div'>) {
  const [range, setRange] = React.useState<RangeId>('12m')

  const active = ranges.find((r) => r.id === range) ?? ranges[2]
  const values = revenue.slice(revenue.length - active.months)
  const { line, area } = React.useMemo(() => buildSparkline(values), [values])
  const { total, delta } = summarize(values)
  const isUp = delta >= 0

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardAction>
          <ToggleButtonGroup
            size="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[range]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (typeof next === 'string') setRange(next as RangeId)
            }}
            aria-label="Time range"
          >
            {ranges.map((r) => (
              <ToggleButton key={r.id} id={r.id}>
                {r.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-1">
            <p className="text-3xl font-semibold tabular-nums">
              ${total.toLocaleString()}k
            </p>
            <p className="text-sm text-fg-muted">Last {active.label} revenue</p>
          </div>
          <Badge variant={isUp ? 'success' : 'danger'}>
            {isUp ? (
              <TrendingUpIcon aria-hidden />
            ) : (
              <TrendingDownIcon aria-hidden />
            )}
            {isUp ? '+' : ''}
            {delta.toFixed(1)}%
          </Badge>
        </div>
        <svg
          viewBox="0 0 300 80"
          className="h-20 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Revenue trend over the last ${active.label}`}
        >
          <path d={area} className="fill-primary/10" />
          <path
            d={line}
            className="fill-none stroke-primary"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </CardContent>
    </Card>
  )
}
