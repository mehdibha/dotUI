'use client'

import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { CodePane, SeatViewBar, type SeatView } from './code-view'
import { RECHARTS_PRIMITIVE_CODE, rechartsExampleCode } from './codegen'
import { PanelSection, SlotSelect } from './controls'
import { slotVar, visits, type ChartSlot } from './data'
import type { ChartConfig } from './recharts-chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './recharts-chart'

/* The shadcn seat: the chart is frozen JSX, and `ChartConfig` — label, icon,
   color per series — is the entire runtime customization surface. */
export function RechartsSeat() {
  const [desktopSlot, setDesktopSlot] = useState<ChartSlot>(1)
  const [mobileSlot, setMobileSlot] = useState<ChartSlot>(2)
  const [view, setView] = useState<SeatView>('preview')

  const config = useMemo(
    () =>
      ({
        desktop: { label: 'Desktop', color: slotVar(desktopSlot) },
        mobile: { label: 'Mobile', color: slotVar(mobileSlot) },
      }) satisfies ChartConfig,
    [desktopSlot, mobileSlot],
  )

  return (
    <div className="flex h-full flex-col">
      <SeatViewBar view={view} onChange={setView} />
      {view === 'primitive' && (
        <CodePane title="ui/chart.tsx" code={RECHARTS_PRIMITIVE_CODE} />
      )}
      {view !== 'primitive' && (
        <>
          {view === 'example' ? (
            <CodePane
              title="visitors-chart.tsx"
              code={rechartsExampleCode(desktopSlot, mobileSlot)}
            />
          ) : (
            <div className="p-4">
              <ChartContainer
                config={config}
                className="aspect-auto h-64 w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={visits}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    isAnimationActive={false}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    isAnimationActive={false}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
          <div className="flex-1 space-y-5 border-t border-border p-4">
            <PanelSection title="Palette">
              <SlotSelect
                label="Desktop series"
                value={desktopSlot}
                onChange={setDesktopSlot}
              />
              <SlotSelect
                label="Mobile series"
                value={mobileSlot}
                onChange={setMobileSlot}
              />
            </PanelSection>
            <p className="text-xs leading-relaxed text-fg-muted">
              That's the whole runtime surface: <code>ChartConfig</code> carries
              a label, an icon, and a color per series. Curve, fill, grid,
              tooltip behavior — all frozen in JSX; changing them means shipping
              a different component.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
