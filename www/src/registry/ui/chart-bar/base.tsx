"use client"

import type { BarYOptions } from "@tanstack/charts"
import { barX, barY } from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { stack } from "@tanstack/charts/stack"

import type {
  ChartFormat,
  ChartSeries,
  ChartSeriesOptions,
  ChartSeriesRow,
} from "@/registry/ui/chart"
import {
  chartColorScale,
  chartGuide,
  chartLook,
  chartMarks,
  chartScales,
  chartSeries,
  legendEmphasis,
} from "@/registry/ui/chart"

export interface BarSeriesOptions<TDatum> extends ChartSeriesOptions<TDatum> {
  /** Categories down the y axis, values along x. */
  horizontal?: boolean
  /** Series stacked in each band; `"normalize"` for a 100% stack. Otherwise series sharing a band sit side by side. */
  stacked?: boolean | "normalize"
  /** Corner radius in pixels. @default the defaults' `bars` */
  cornerRadius?: number
  /** The widest a bar gets, in pixels. @default the defaults' `bars` */
  maxThickness?: number
  /** Pixels trimmed from both categorical edges of every bar. */
  inset?: number
  /** Fill opacity. @default 1 */
  fill?: number
  /** Focus-driven restyling — dim the bars that aren't focused, outline the one that is. */
  states?: BarYOptions<ChartSeriesRow<TDatum>>["states"]
}

/* Unstacked series that share a band group side by side in it; one series per
   category keeps full-width bars. A stack rounds only its outer end, so
   segments meet flush. Bars name their series from `color` only when they
   share a band — otherwise `z` does, or the tooltip shows the mark id. */
function barMarks<TDatum>(
  { rows, names }: ChartSeries<TDatum>,
  options: BarSeriesOptions<TDatum>,
  look: ReturnType<typeof chartLook>,
) {
  const radius = options.cornerRadius ?? look.barRadius
  const bands = new Set(rows.map(({ x }) => (x instanceof Date ? +x : x)))
  const shared = bands.size < rows.length
  const bar = {
    color: "series",
    z: shared ? undefined : "series",
    key: "key",
    inset: options.inset,
    fillOpacity: options.fill,
    maxThickness: options.maxThickness ?? look.barMaxThickness,
    states: [...legendEmphasis, ...(options.states ?? [])],
    radius: options.stacked || look.barEnd ? { end: radius } : radius,
    layout: options.stacked
      ? stack({
          order: names,
          offset: options.stacked === "normalize" ? "normalize" : undefined,
        })
      : names.length > 1 && shared
        ? group({ padding: 0.15 })
        : undefined,
  } as const
  return [
    options.horizontal
      ? barX(rows, { ...bar, x: "y", y: "x" })
      : barY(rows, { ...bar, x: "x", y: "y" }),
  ] as const
}

/** The bars of one or more series, as one mark. */
export function barSeries<TDatum>(
  data: readonly TDatum[],
  options: BarSeriesOptions<TDatum>,
) {
  const series = chartSeries(data, options)
  return chartMarks((defaults) =>
    barMarks(series, options, chartLook(defaults)),
  )[0]
}

export interface BarChartOptions<TDatum> extends BarSeriesOptions<TDatum> {
  /** The axes to show. @default the category axis, and the value axis as the defaults' `axes` says */
  axes?: boolean | "x" | "y"
  /** `false` drops the gridlines. @default the defaults' `grid` */
  grid?: boolean
  /** A color legend; `"toggle"` lets readers hide series. @default the defaults' `legend` */
  legend?: boolean | "toggle"
  /** A guide at the hovered category. @default the defaults' `guide` */
  crosshair?: boolean
  /** Formats x ticks and the matching tooltip values. */
  formatX?: ChartFormat
  /** Formats y ticks and the matching tooltip values. */
  formatY?: ChartFormat
}

/** A complete bar chart — pass it to `defineChart`, or spread it and extend. */
export function barChart<TDatum>(
  data: readonly TDatum[],
  options: BarChartOptions<TDatum>,
) {
  const series = chartSeries(data, options)
  const horizontal = options.horizontal ?? false
  return {
    scales: chartScales({
      x: { kind: horizontal ? "linear" : "band", format: options.formatX },
      y: { kind: horizontal ? "band" : "linear", format: options.formatY },
      value: horizontal ? "x" : "y",
      axes: options.axes,
      grid: options.grid === false ? false : undefined,
    }),
    color: chartColorScale(series.names, options.legend),
    marks: chartMarks((defaults) =>
      barMarks(series, options, chartLook(defaults)),
    ),
    // Points sharing a band share its scene coordinate on the category axis.
    focus: horizontal ? ("group-y" as const) : ("group-x" as const),
    ...chartGuide(options.crosshair),
  }
}
