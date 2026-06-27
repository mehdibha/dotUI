'use client'

import React from 'react'
import type * as MenuPrimitives from 'react-aria-components/Menu'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/registry/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/registry/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

const chartData = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-08', desktop: 167, mobile: 120 },
  { date: '2024-04-15', desktop: 242, mobile: 260 },
  { date: '2024-04-22', desktop: 130, mobile: 90 },
  { date: '2024-04-29', desktop: 165, mobile: 180 },
  { date: '2024-05-06', desktop: 293, mobile: 340 },
  { date: '2024-05-13', desktop: 197, mobile: 180 },
  { date: '2024-05-20', desktop: 153, mobile: 230 },
  { date: '2024-05-27', desktop: 305, mobile: 390 },
  { date: '2024-06-03', desktop: 103, mobile: 120 },
  { date: '2024-06-10', desktop: 220, mobile: 280 },
  { date: '2024-06-17', desktop: 275, mobile: 200 },
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

const rangeDays: Record<string, number> = {
  '90d': 90,
  '30d': 30,
  '7d': 7,
}

export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState<MenuPrimitives.Key | null>(
    '90d',
  )

  const filteredData = React.useMemo(() => {
    const days = rangeDays[String(timeRange)] ?? 90
    const referenceDate = new Date('2024-06-17')
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - days)
    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [timeRange])

  return (
    <>
      <div className="flex items-center justify-end">
        <Select
          aria-label="Time range"
          value={timeRange}
          onChange={setTimeRange}
        >
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="90d">Last 3 months</SelectItem>
            <SelectItem id="30d">Last 30 days</SelectItem>
            <SelectItem id="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart
          accessibilityLayer
          data={filteredData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) =>
                  new Date(String(value)).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
            }
          />
          <defs>
            <linearGradient id="fillDesktopRange" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobileRange" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="mobile"
            type="natural"
            fill="url(#fillMobileRange)"
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="url(#fillDesktopRange)"
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
      <ChartDataTable
        data={filteredData}
        config={chartConfig}
        labelKey="date"
      />
    </>
  )
}
