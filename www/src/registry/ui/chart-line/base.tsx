"use client"

import type { LineYOptions } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"

import type {
  ChartCurveName,
  ChartFormat,
  ChartSeries,
  ChartSeriesOptions,
  ChartSeriesRow,
} from "@/registry/ui/chart"
import {
  chartColorScale,
  chartCurves,
  chartGuide,
  chartLook,
  chartMarks,
  chartScales,
  chartSeries,
  legendEmphasis,
} from "@/registry/ui/chart"

export interface LineSeriesOptions<TDatum> extends ChartSeriesOptions<TDatum> {
  /** @default the defaults' `lines` */
  curve?: ChartCurveName
  /** @default the defaults' `lines` */
  strokeWidth?: number
  strokeDasharray?: string
  /** A dot at every point. */
  points?: boolean
  /** Focus-driven restyling — dim the lines that aren't focused. */
  states?: LineYOptions<ChartSeriesRow<TDatum>>["states"]
}

function lineMarks<TDatum>(
  { rows }: ChartSeries<TDatum>,
  options: LineSeriesOptions<TDatum>,
  look: ReturnType<typeof chartLook>,
) {
  return [
    lineY(rows, {
      x: "x",
      y: "y",
      color: "series",
      key: "key",
      curve: chartCurves[options.curve ?? look.curve],
      strokeWidth: options.strokeWidth ?? look.strokeWidth,
      strokeDasharray: options.strokeDasharray,
      points: options.points ?? false,
      states: [...legendEmphasis, ...(options.states ?? [])],
    }),
  ] as const
}

/** The lines of one or more series, as one mark. */
export function lineSeries<TDatum>(
  data: readonly TDatum[],
  options: LineSeriesOptions<TDatum>,
) {
  const series = chartSeries(data, options)
  return chartMarks((defaults) =>
    lineMarks(series, options, chartLook(defaults)),
  )[0]
}

export interface LineChartOptions<TDatum> extends LineSeriesOptions<TDatum> {
  /** The axes to show. @default the defaults' `axes` */
  axes?: boolean | "x" | "y"
  /** `false` drops the gridlines. @default the defaults' `grid` */
  grid?: boolean
  /** A color legend; `"toggle"` lets readers hide series. @default the defaults' `legend` */
  legend?: boolean | "toggle"
  /** A guide at the hovered position. @default the defaults' `guide` */
  crosshair?: boolean
  /** Formats x ticks and tooltip titles. */
  formatX?: ChartFormat
  /** Formats y ticks and tooltip values. */
  formatY?: ChartFormat
}

/** A complete line chart — pass it to `defineChart`, or spread it and extend. */
export function lineChart<TDatum>(
  data: readonly TDatum[],
  options: LineChartOptions<TDatum>,
) {
  const series = chartSeries(data, options)
  return {
    scales: chartScales({
      x: {
        kind: series.rows[0]?.x instanceof Date ? "time" : "point",
        format: options.formatX,
      },
      y: { format: options.formatY },
      axes: options.axes,
      grid: options.grid === false ? false : undefined,
    }),
    color: chartColorScale(series.names, options.legend),
    marks: chartMarks((defaults) =>
      lineMarks(series, options, chartLook(defaults)),
    ),
    ...chartGuide(options.crosshair),
  }
}
