"use client"

import type { ChartBuildContext } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { text } from "@tanstack/charts/text"
import { scaleBand, scaleQuantize, scaleThreshold } from "d3-scale"

import type {
  ChartBaseSpecOptions,
  ChartComponentProps,
  ChartFormat,
  ChartMarkLayer,
  ChartSpec,
  ChartXField,
  ChartYField,
} from "@/registry/ui/chart"
import {
  Chart,
  chartDefaults,
  chartFrame,
  decorative,
  finiteOrNull,
  paletteColor,
  useChartDefinition,
} from "@/registry/ui/chart"

/* A sequential ramp mixed from one palette slot: the low half fades into the
   surface, the high half toward the foreground, so luminance stays monotone
   in light and dark. */
export function heatmapColors(
  color: string = paletteColor(0),
  steps: number = 5,
): readonly string[] {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 0.5 : index / (steps - 1)
    const [weight, target] =
      t <= 0.5
        ? [20 + t * 160, "var(--color-bg)"]
        : [100 - (t - 0.5) * 136, "var(--color-fg)"]
    return `color-mix(in oklab, ${color} ${Math.round(weight)}%, ${target})`
  })
}

const HEATMAP_COLORS = /* @__PURE__ */ heatmapColors()

// Black or white ink from the cell's own lightness; the 0.58 crossover
// measures ≥ 4.9:1 across the default ramp.
function contrastInk(color: string): string {
  return `oklch(from ${color} calc((0.58 - l) * 100) 0 0)`
}

/* The cell edges are the grid, so `grid` is dropped rather than ignored. */
export interface HeatmapChartSpecOptions<TDatum> extends Omit<
  ChartBaseSpecOptions<TDatum>,
  "grid"
> {
  /** Field holding the column category. */
  x: ChartXField<TDatum>
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

/* Which ramp step a value lands on: the chart's own color scale rebuilt over
   step indices, nicened domain included, so a label never disagrees with the
   cell under it. */
function binner<TDatum>(
  options: HeatmapChartSpecOptions<TDatum>,
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

export function heatmapChartSpec<TDatum>(
  options: HeatmapChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const colors = options.colors ?? HEATMAP_COLORS
  const format = options.formatValue ?? String
  const read = (row: TDatum) => finiteOrNull(row[options.value as keyof TDatum])
  const print = (row: TDatum) => {
    const value = read(row)
    return value === null ? null : format(value)
  }
  const cells: ChartMarkLayer = cell(options.data, {
    x: options.x,
    y: options.y,
    color: read,
    // The tooltip titles a point with its group; a cell's group is its value.
    z: (row: TDatum) => {
      const value = print(row)
      if (value === null) return null
      return options.label ? `${options.label}: ${value}` : value
    },
    key: options.rowKey,
    radius: chartDefaults.cellRadius,
    inset: chartDefaults.cellInset,
  })
  const bin = binner(options, read, colors.length)
  const values: ChartMarkLayer = decorative(
    text(options.data, {
      x: options.x,
      y: options.y,
      text: print,
      fill: (row: TDatum) => contrastInk(colors[bin(row)] ?? paletteColor(0)),
      fontSize: 11,
    }),
  )
  return {
    // Axes and legend on by default: the labels are the cells' identity and
    // the ramp is the only key to the color.
    ...chartFrame(
      {
        ...options,
        axes: options.axes ?? true,
        legend: options.legend ?? true,
      },
      ctx,
      {
        x: { scale: scaleBand, nice: false, label: options.labelX },
        y: { scale: scaleBand, nice: false, label: options.labelY },
        grid: "none",
        color: {
          scale: options.thresholds
            ? scaleThreshold<number, string>
            : scaleQuantize<string>,
          domain: options.thresholds,
          range: colors,
          nice: options.thresholds ? undefined : true,
          legend: colorLegend({
            label: options.label,
            format: options.formatValue,
          }),
        },
      },
    ),
    marks: [
      ...(options.marksBefore ?? []),
      cells,
      ...(options.values ? [values] : []),
      ...(options.marks ?? []),
    ],
  }
}

export type HeatmapChartProps<TDatum> = ChartComponentProps<
  HeatmapChartSpecOptions<TDatum>,
  TDatum
>

export function HeatmapChart<TDatum>(props: HeatmapChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    HeatmapChartSpecOptions<TDatum>
  >(props, heatmapChartSpec, {
    // A cell is read on its own, not against its column.
    focus: "nearest",
    tooltipAnchor: "point",
  })
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
