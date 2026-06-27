'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 97, mobile: 180 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 242, mobile: 260 },
  { date: '2024-04-05', desktop: 373, mobile: 290 },
  { date: '2024-04-06', desktop: 301, mobile: 340 },
  { date: '2024-04-07', desktop: 245, mobile: 180 },
]

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type ActiveChart = keyof Omit<typeof chartConfig, 'views'>

export default function ChartBarInteractive() {
  const [activeChart, setActiveChart] = React.useState<ActiveChart>('desktop')

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  )

  return (
    <div className="w-full">
      <div className="flex">
        {(['desktop', 'mobile'] as const).map((key) => (
          <button
            key={key}
            type="button"
            data-active={activeChart === key}
            onClick={() => setActiveChart(key)}
            className="flex flex-1 flex-col gap-1 border-b border-border px-6 py-4 text-left data-[active=true]:bg-popover"
          >
            <span className="text-xs text-fg-muted">
              {chartConfig[key].label}
            </span>
            <span className="text-lg leading-none font-bold text-fg">
              {total[key].toLocaleString()}
            </span>
          </button>
        ))}
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelKey="date"
              />
            }
          />
          <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
        </BarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="date" />
    </div>
  )
}
