'use client'

import type { ChartBuildContext } from '@tanstack/charts'
import { colorLegend } from '@tanstack/charts/legend'
import { cell } from '@tanstack/charts/rect'
import { text } from '@tanstack/charts/text'
import { scaleBand, scaleQuantize, scaleThreshold } from 'd3-scale'

import type {
  ChartBaseSpecOptions,
  ChartComponentProps,
  ChartFormat,
  ChartMarkLayer,
  ChartSpecOf,
  ChartXField,
  ChartXValueOf,
  ChartYField,
} from '@/registry/ui/chart'
import {
  Chart,
  chartDefaults,
  chartFrame,
  decorative,
  paletteColor,
  resolveFormat,
  useChartDefinition,
} from '@/registry/ui/chart'

/* One rectangle per row: two categorical axes, and the value on the color
   scale. Both scales are band scales, so the grid is the chart. */

/* A sequential ramp mixed from a single palette slot: the low half fades into
   the surface, the high half toward the foreground. Both ends therefore invert
   with the theme, which keeps luminance monotone in light and dark. */
export function heatmapColors(
  color: string = paletteColor(0),
  steps: number = 5,
): readonly string[] {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 0.5 : index / (steps - 1)
    const [weight, target] =
      t <= 0.5
        ? [20 + t * 160, 'var(--color-bg)']
        : [100 - (t - 0.5) * 136, 'var(--color-fg)']
    return `color-mix(in oklab, ${color} ${Math.round(weight)}%, ${target})`
  })
}

const HEATMAP_COLORS = /* @__PURE__ */ heatmapColors()

/* Black or white ink, whichever the cell under it can carry — resolved by the
   browser from the cell's own lightness, so it stays right in both themes and
   for any ramp. The 0.58 crossover measures ≥ 4.9:1 across the default ramp. */
function contrastInk(color: string): string {
  return `oklch(from ${color} calc((0.58 - l) * 100) 0 0)`
}

export interface HeatmapChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends ChartBaseSpecOptions<TDatum> {
  /** Field holding the column category. */
  x: TXField
  /** Field holding the row category. */
  y: ChartXField<TDatum>
  /** Numeric field the color scale reads. */
  value: ChartYField<TDatum>
  /** Ramp from low to high. The number of colors is the number of bins. */
  colors?: readonly string[]
  /** Explicit cuts between bins — one fewer than `colors`. */
  thresholds?: readonly number[]
  /** Draw each value inside its cell. */
  values?: boolean
  /** Formats values in the legend, the tooltip, and the cells. */
  formatValue?: ChartFormat
  /** What the value means — the legend title and the tooltip label. */
  label?: string
  /** Axis titles. They also name the two coordinates in the tooltip. */
  labelX?: string
  labelY?: string
}

function fieldReader<TDatum>(field: string) {
  return (row: TDatum) => {
    const value = (row as Record<string, unknown>)[field]
    return typeof value === 'number' && Number.isFinite(value) ? value : null
  }
}

/* Which ramp step a value lands on. It rebuilds the chart's own color scale
   over step indices — nicened domain included — rather than re-deriving the
   cuts, so a label can never disagree with the cell under it. */
function binner<TDatum>(
  options: HeatmapChartSpecOptions<TDatum, ChartXField<TDatum>>,
  read: (row: TDatum) => number | null,
  steps: number,
): (row: TDatum) => number {
  const range = Array.from({ length: steps }, (_, index) => index)
  if (options.thresholds) {
    const scale = scaleThreshold<number, number>()
      .domain(options.thresholds)
      .range(range)
    return (row) => scale(read(row) ?? -Infinity)
  }
  let minimum = Infinity
  let maximum = -Infinity
  for (const row of options.data) {
    const value = read(row)
    if (value === null) continue
    minimum = Math.min(minimum, value)
    maximum = Math.max(maximum, value)
  }
  if (!Number.isFinite(minimum)) return () => 0
  const scale = scaleQuantize<number>()
    .range(range)
    .domain([minimum, maximum])
    .nice(5)
  return (row) => scale(read(row) ?? minimum)
}

/* The value written inside each cell, inked against the cell it sits on. */
function valueLabels<TDatum>(
  options: HeatmapChartSpecOptions<TDatum, ChartXField<TDatum>>,
  read: (row: TDatum) => number | null,
  print: (row: TDatum) => string | null,
  colors: readonly string[],
): ChartMarkLayer {
  const bin = binner(options, read, colors.length)
  return decorative(
    text(options.data, {
      x: options.x,
      y: options.y,
      text: print,
      fill: (row: TDatum) => contrastInk(colors[bin(row)] ?? paletteColor(0)),
      fontSize: 11,
    }),
  )
}

export function heatmapChartSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: HeatmapChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const colors = options.colors ?? HEATMAP_COLORS
  const format = resolveFormat(options.formatValue)
  const read = fieldReader<TDatum>(options.value)
  const print = (row: TDatum) => {
    const value = read(row)
    if (value === null) return null
    return format ? format(value) : String(value)
  }
  const cells: ChartMarkLayer = cell(options.data, {
    x: options.x,
    y: options.y,
    color: read,
    // The tooltip titles a point with its group, and a cell's group is its
    // own value — otherwise the reading is the one thing it would not show.
    z: (row: TDatum) => {
      const value = print(row)
      if (value === null) return null
      return options.label ? `${options.label}: ${value}` : value
    },
    key: options.rowKey,
    radius: chartDefaults.cellRadius,
    inset: chartDefaults.cellInset,
  })
  return {
    ...chartFrame(options, ctx, {
      // Band scales with d3's zero padding: cells tile the plot, and the
      // inset above cuts the gutter. `nice` is not a band-scale operation.
      x: { scale: scaleBand, nice: false, label: options.labelX },
      y: { scale: scaleBand, nice: false, label: options.labelY },
      grid: 'none',
      color: {
        scale: options.thresholds
          ? scaleThreshold<number, string>
          : scaleQuantize<string>,
        domain: options.thresholds,
        range: colors,
        nice: options.thresholds ? undefined : true,
        legend: colorLegend({ label: options.label, format }),
      },
    }),
    marks: [
      ...(options.marksBefore ?? []),
      cells,
      ...(options.values ? [valueLabels(options, read, print, colors)] : []),
      ...(options.marks ?? []),
    ],
  }
}

export type HeatmapChartProps<
  TDatum,
  TXField extends ChartXField<TDatum>,
> = ChartComponentProps<
  HeatmapChartSpecOptions<TDatum, TXField>,
  TDatum,
  ChartXValueOf<TDatum, TXField>
>

export function HeatmapChart<TDatum, TXField extends ChartXField<TDatum>>(
  props: HeatmapChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    HeatmapChartSpecOptions<TDatum, TXField>
  >(
    {
      ...props,
      // A cell is read on its own, not against its column.
      focus: props.focus ?? 'nearest',
      tooltipAnchor: props.tooltipAnchor ?? 'point',
    },
    heatmapChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
