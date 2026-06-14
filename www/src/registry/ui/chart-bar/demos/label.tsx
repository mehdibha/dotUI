'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

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

export default function ChartBarLabel() {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-fg"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
