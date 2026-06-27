'use client'

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

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
  { month: 'April', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function ChartRadarLabelCustom() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px]"
      >
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis
            dataKey="month"
            tick={({ x, y, textAnchor, index, ...props }) => {
              const data = chartData[index]

              return (
                <text
                  x={x}
                  y={index === 0 ? Number(y) - 10 : y}
                  textAnchor={textAnchor}
                  fontSize={13}
                  fontWeight={500}
                  {...props}
                >
                  <tspan className="fill-fg-muted">{data?.desktop}</tspan>
                  <tspan className="fill-fg" x={x} dy={'1rem'}>
                    {data?.month}
                  </tspan>
                </text>
              )
            }}
          />
          <PolarGrid />
          <Radar
            dataKey="desktop"
            fill="var(--color-desktop)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
