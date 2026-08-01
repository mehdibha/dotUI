'use client'

import { Sparkline } from '@/registry/ui/chart-sparkline'

interface Point {
  month: string
  value: number
}

const signups: Point[] = [
  { month: 'Jan', value: 142 },
  { month: 'Feb', value: 168 },
  { month: 'Mar', value: 155 },
  { month: 'Apr', value: 194 },
  { month: 'May', value: 221 },
  { month: 'Jun', value: 268 },
]

const activeUsers: Point[] = [
  { month: 'Jan', value: 1840 },
  { month: 'Feb', value: 1795 },
  { month: 'Mar', value: 1860 },
  { month: 'Apr', value: 1620 },
  { month: 'May', value: 1508 },
  { month: 'Jun', value: 1372 },
]

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
})

/* One series, colored by its own direction — the whole point of `color`. The
   delta is printed too, so color is never the only signal. */
function trend(series: Point[]) {
  const first = series[0]?.value ?? 0
  const last = series.at(-1)?.value ?? 0
  const down = last < first
  return {
    down,
    delta: percent.format((last - first) / first),
    color: down ? 'var(--color-danger)' : 'var(--color-success)',
  }
}

function Metric({ label, data }: { label: string; data: Point[] }) {
  const { delta, down, color } = trend(data)
  return (
    <div className="space-y-1">
      <p className="flex items-baseline justify-between text-xs text-fg-muted">
        <span>{label}</span>
        <span
          className={
            down ? 'font-medium text-fg-danger' : 'font-medium text-fg-success'
          }
        >
          {delta}
        </span>
      </p>
      <Sparkline
        data={data}
        x="month"
        y="value"
        mode="area"
        color={color}
        ariaLabel={`${label} over the last six months, ${delta}`}
      />
    </div>
  )
}

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-6">
      <Metric label="Signups" data={signups} />
      <Metric label="Active users" data={activeUsers} />
    </div>
  )
}
