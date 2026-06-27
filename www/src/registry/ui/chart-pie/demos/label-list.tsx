'use client'

import { LabelList, Pie, PieChart } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
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

export default function ChartPieLabelList() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px] w-full [&_.recharts-pie-label-text]:fill-fg"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
          />
          <Pie data={chartData} dataKey="visitors">
            <LabelList
              dataKey="browser"
              className="fill-fg"
              stroke="none"
              fontSize={12}
              formatter={(value: unknown) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartDataTable
        data={chartData}
        config={chartConfig}
        labelKey="browser"
      />
    </>
  )
}
