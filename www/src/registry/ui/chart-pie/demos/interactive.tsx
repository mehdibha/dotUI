'use client'

import * as React from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts'

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

const browsers = chartData.map((item) => item.browser)

export default function ChartPieInteractive() {
  const [activeBrowser, setActiveBrowser] = React.useState(
    browsers[0] ?? 'chrome',
  )

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.browser === activeBrowser),
    [activeBrowser],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-1.5">
        {browsers.map((key) => {
          const config = chartConfig[key as keyof typeof chartConfig]
          if (!config) {
            return null
          }
          const isActive = key === activeBrowser
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveBrowser(key)}
              aria-pressed={isActive}
              className={
                isActive
                  ? 'flex items-center gap-1.5 rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-fg'
                  : 'flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-xs text-fg-muted'
              }
            >
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: `var(--color-${key})` }}
              />
              {config.label}
            </button>
          )
        })}
      </div>
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
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  const active = chartData[activeIndex]
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
                        {active?.visitors.toLocaleString()}
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
    </div>
  )
}
