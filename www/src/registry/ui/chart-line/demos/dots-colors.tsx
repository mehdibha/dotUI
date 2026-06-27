'use client'

import { CartesianGrid, Dot, Line, LineChart, XAxis } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
  { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
  { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
  { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'var(--chart-1)',
  },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: 'Other', color: 'var(--chart-5)' },
} satisfies ChartConfig

interface ColoredDotProps {
  cx?: number
  cy?: number
  index?: number
  payload?: { browser: string; fill: string }
}

export default function ChartLineDotsColors() {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 24, left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="browser"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              chartConfig[value as keyof typeof chartConfig]?.label as string
            }
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
          />
          <Line
            dataKey="visitors"
            type="natural"
            stroke="var(--color-visitors)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={(props: ColoredDotProps) => {
              const { cx, cy, payload, index } = props
              if (cx == null || cy == null) {
                return <g key={index} />
              }
              return (
                <Dot
                  key={payload?.browser ?? index}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={payload?.fill}
                  stroke={payload?.fill}
                />
              )
            }}
          />
        </LineChart>
      </ChartContainer>
      <ChartDataTable
        data={chartData}
        config={chartConfig}
        labelKey="browser"
      />
    </>
  )
}
