/* Source panes for both seats. The Recharts primitive is the real registry
   file, shown as the docs would ship it. The TanStack example is generated
   from the live knob state, so the code pane always shows exactly the
   definition the chart is rendering — the export story in miniature. */

import rechartsPrimitiveRaw from '@/registry/ui/chart/base.tsx?raw'

import { desktopAverage, slotVar, visits, type ChartSlot } from './data'
import { chartDefaults } from './primitive'
import tanstackPrimitiveRaw from './primitive.tsx?raw'

export type MarkKind = 'area' | 'line' | 'bar'
export type CurveKind = 'linear' | 'natural' | 'monotone' | 'step'
export type FocusMode = 'nearest' | 'nearest-x' | 'group-x'
export type TooltipAnchor = 'point' | 'pointer' | 'group-center'

export interface TanstackKnobs {
  desktopSlot: ChartSlot
  mobileSlot: ChartSlot
  mark: MarkKind
  curve: CurveKind
  fillOpacity: number
  strokeWidth: number
  points: boolean
  gradient: boolean
  barRadius: number
  grid: boolean
  axes: boolean
  refLine: boolean
  legend: boolean
  focusMode: FocusMode
  anchor: TooltipAnchor
  sticky: boolean
  animate: boolean
}

function toDisplaySource(raw: string): string {
  return raw
    .replace(/@\/registry\/ui\//g, '@/ui/')
    .replace(/@\/registry\//g, '@/')
    .replace(/\t/g, '  ')
    .trim()
}

export const RECHARTS_PRIMITIVE_CODE = toDisplaySource(rechartsPrimitiveRaw)

export const TANSTACK_PRIMITIVE_CODE = toDisplaySource(tanstackPrimitiveRaw)

const DATA_ROWS = visits
  .map(
    (row) =>
      `  { month: '${row.month}', desktop: ${row.desktop}, mobile: ${row.mobile} },`,
  )
  .join('\n')

const fmt = (value: number) => String(Math.round(value * 1000) / 1000)

export function rechartsExampleCode(
  desktopSlot: ChartSlot,
  mobileSlot: ChartSlot,
): string {
  return `import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/ui/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

// The two knobs. Everything below this config is frozen JSX.
const chartConfig = {
  desktop: { label: 'Desktop', color: '${slotVar(desktopSlot)}' },
  mobile: { label: 'Mobile', color: '${slotVar(mobileSlot)}' },
} satisfies ChartConfig

export function VisitorsChart() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
        <Area
          dataKey="mobile"
          type="natural"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
`
}

function indent(text: string, pad: string): string {
  return text
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n')
}

/* Component example: a prop appears only when it deviates from
   `chartDefaults`, so the emitted code stays as small as the user's actual
   decisions — the codeOptions thesis applied to charts. */
export function tanstackExampleCode(k: TanstackKnobs): string {
  const component =
    k.mark === 'bar'
      ? 'BarChart'
      : k.mark === 'line'
        ? 'LineChart'
        : 'AreaChart'

  const props: string[] = [
    `data={visits}`,
    `x="month"`,
    `y={['desktop', 'mobile']}`,
    `labels={{ desktop: 'Desktop', mobile: 'Mobile' }}`,
    `formatX={formatMonth}`,
  ]
  const push = (line: string) => props.push(line)

  if (k.mark !== 'bar') {
    if (k.curve !== chartDefaults.curve) push(`curve="${k.curve}"`)
    if (k.strokeWidth !== chartDefaults.strokeWidth) {
      push(`strokeWidth={${fmt(k.strokeWidth)}}`)
    }
    if (k.points !== chartDefaults.points) {
      push(k.points ? `points` : `points={false}`)
    }
  }
  if (k.mark === 'area') {
    if (k.gradient) push(`fill="gradient"`)
    else if (k.fillOpacity / 100 !== chartDefaults.fill) {
      push(`fill={${fmt(k.fillOpacity / 100)}}`)
    }
  }
  if (k.mark === 'bar' && k.barRadius !== chartDefaults.barRadius) {
    push(`radius={${k.barRadius}}`)
  }
  if (k.grid !== chartDefaults.grid) push(`grid={${k.grid}}`)
  if (k.axes !== chartDefaults.axes) push(`axes={${k.axes}}`)
  if (k.legend !== chartDefaults.legend) push(`legend={${k.legend}}`)
  if (k.focusMode !== chartDefaults.focus) push(`focus="${k.focusMode}"`)
  if (k.anchor !== chartDefaults.tooltipAnchor) {
    push(`tooltipAnchor="${k.anchor}"`)
  }
  if (k.sticky !== chartDefaults.tooltipSticky) {
    push(`tooltipSticky={${k.sticky}}`)
  }
  if (!k.animate) push(`animate={false}`)
  if (k.refLine) push(`marks={averageMarks}`)
  push(`ariaLabel="Visitors by month, desktop and mobile"`)

  const recolor = k.desktopSlot !== 1 || k.mobileSlot !== 2
  const element = `<${component}\n${indent(props.join('\n'), '  ')}\n/>`
  const body = recolor
    ? [
        `    <div style={{ '--slot-1': '${slotVar(k.desktopSlot)}', '--slot-2': '${slotVar(k.mobileSlot)}' } as CSSProperties}>`,
        `      {/* Series colors are CSS variables. The two levels keep a 1↔2 swap acyclic. */}`,
        `      <div style={{ '--chart-1': 'var(--slot-1)', '--chart-2': 'var(--slot-2)' } as CSSProperties}>`,
        indent(element, '        '),
        `      </div>`,
        `    </div>`,
      ].join('\n')
    : indent(element, '    ')

  const imports = [
    recolor ? `import type { CSSProperties } from 'react'` : null,
    k.refLine ? `import { ruleY } from '@tanstack/charts'` : null,
    `import { ${component} } from '@/ui/chart'`,
  ].filter((line) => line !== null)

  return `${imports.join('\n')}

const visits = [
${DATA_ROWS}
]

// Module scope: identity-compared props must stay referentially stable.
const formatMonth = (value: unknown) => String(value).slice(0, 3)
${
  k.refLine
    ? `
const averageMarks = [
  ruleY([${desktopAverage}], {
    stroke: 'currentColor',
    strokeOpacity: 0.35,
    strokeWidth: 1,
    strokeDasharray: '4 3',
  }),
]
`
    : ''
}
// Only decisions appear; every omitted prop is a house default.
export function VisitorsChart() {
  return (
${body}
  )
}
`
}
