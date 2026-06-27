'use client'

import { Bar, BarChart, Cell, LabelList, ReferenceLine, XAxis } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { month: 'January', visitors: 186 },
  { month: 'February', visitors: 205 },
  { month: 'March', visitors: -207 },
  { month: 'April', visitors: 173 },
  { month: 'May', visitors: -209 },
  { month: 'June', visitors: 214 },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
} satisfies ChartConfig

export default function ChartBarNegative() {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator />}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Bar dataKey="visitors">
            <LabelList position="top" dataKey="month" fillOpacity={1} />
            {chartData.map((entry) => (
              <Cell
                key={entry.month}
                fill={entry.visitors > 0 ? 'var(--chart-1)' : 'var(--chart-2)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
