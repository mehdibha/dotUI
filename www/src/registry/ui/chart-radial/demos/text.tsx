'use client'

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import { ChartContainer, ChartDataTable } from '@/registry/ui/chart'

const chartData = [
  { browser: 'safari', visitors: 1260, fill: 'var(--chart-2)' },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function ChartRadialText() {
  const totalVisitors = chartData[0]?.visitors ?? 0

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px] w-full"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={250}
          innerRadius={80}
          outerRadius={90}
        >
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                        className="fill-fg text-2xl font-bold"
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
                return null
              }}
            />
          </PolarRadiusAxis>
          <RadialBar dataKey="visitors" background cornerRadius={10} />
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
