'use client'

import { LabelList, RadialBar, RadialBarChart } from 'recharts'

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
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--chart-3)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export default function ChartRadialLabel() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px] w-full"
      >
        <RadialBarChart
          data={chartData}
          startAngle={-90}
          endAngle={380}
          innerRadius={30}
          outerRadius={110}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="browser" />}
          />
          <RadialBar dataKey="visitors" background>
            <LabelList
              position="insideStart"
              dataKey="browser"
              className="fill-fg-muted capitalize"
              fontSize={11}
            />
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
      <ChartDataTable
        data={chartData}
        config={chartConfig}
        labelKey="browser"
      />
    </>
  )
}
