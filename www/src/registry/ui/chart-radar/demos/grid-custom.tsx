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
  { month: 'February', desktop: 285 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 203 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 264 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function ChartRadarGridCustom() {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px]"
      >
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid
            className="fill-(--color-desktop) opacity-20"
            gridType="circle"
          />
          <Radar dataKey="desktop" fill="var(--color-desktop)" />
        </RadarChart>
      </ChartContainer>
      <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
    </>
  )
}
