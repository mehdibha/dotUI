'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80, tablet: 45 },
  { month: 'February', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'March', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'April', desktop: 73, mobile: 190, tablet: 110 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'June', desktop: 214, mobile: 140, tablet: 85 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
  tablet: {
    label: 'Tablet',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export default function ChartBarStacked() {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
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
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="var(--color-desktop)"
            radius={[0, 0, 4, 4]}
          />
          <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" />
          <Bar
            dataKey="tablet"
            stackId="a"
            fill="var(--color-tablet)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
