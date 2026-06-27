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
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

interface CustomDotProps {
  cx?: number
  cy?: number
  payload?: { month: string }
  index?: number
}

export default function ChartLineDotsCustom() {
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
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={(props: CustomDotProps) => {
              const { cx, cy, payload, index } = props
              if (cx == null || cy == null) {
                return <g key={index} />
              }
              return (
                <Dot
                  key={payload?.month ?? index}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="var(--color-desktop)"
                  stroke="var(--color-desktop)"
                />
              )
            }}
          />
        </LineChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
