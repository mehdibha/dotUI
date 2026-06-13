'use client'

import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

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

export default function ChartPieDonutText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-fg text-3xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 24}
                        className="fill-fg-muted"
                      >
                        Visitors
                      </tspan>
                    </text>
                  )
                }
                return <text />
              }}
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
