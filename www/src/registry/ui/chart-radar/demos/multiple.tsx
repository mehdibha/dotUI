'use client'

import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
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
} satisfies ChartConfig

export default function ChartRadarMultiple() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px]"
      >
        <RadarChart data={chartData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar
            dataKey="desktop"
            fill="var(--color-desktop)"
            fillOpacity={0.6}
          />
          <Radar
            dataKey="mobile"
            fill="var(--color-mobile)"
            fillOpacity={0.6}
          />
          <Legend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
