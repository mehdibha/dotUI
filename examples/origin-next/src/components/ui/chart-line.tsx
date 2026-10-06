"use client";

import type { LineYOptions } from "@tanstack/charts";
import { lineY } from "@tanstack/charts/line";

import type {
  ChartCurveName,
  ChartFormat,
  ChartSeries,
  ChartSeriesOptions,
  ChartSeriesRow,
} from "@/components/ui/chart";
import {
  chartCurves,
  chartLegend,
  chartScales,
  chartSeries,
  legendEmphasis,
} from "@/components/ui/chart";

export interface LineSeriesOptions<TDatum> extends ChartSeriesOptions<TDatum> {
  /** @default "natural" */
  curve?: ChartCurveName;
  /** @default 2 */
  strokeWidth?: number;
  strokeDasharray?: string;
  /** A dot at every point. */
  points?: boolean;
  /** Focus-driven restyling — dim the lines that aren't focused. */
  states?: LineYOptions<ChartSeriesRow<TDatum>>["states"];
}

function lineMark<TDatum>(
  { rows }: ChartSeries<TDatum>,
  options: LineSeriesOptions<TDatum>,
) {
  return lineY(rows, {
    x: "x",
    y: "y",
    color: "series",
    key: "key",
    curve: chartCurves[options.curve ?? "natural"],
    strokeWidth: options.strokeWidth ?? 2,
    strokeDasharray: options.strokeDasharray,
    points: options.points ?? false,
    states: [...legendEmphasis, ...(options.states ?? [])],
  });
}

/** The lines of one or more series, as one mark. */
export function lineSeries<TDatum>(
  data: readonly TDatum[],
  options: LineSeriesOptions<TDatum>,
) {
  return lineMark(chartSeries(data, options), options);
}

export interface LineChartOptions<TDatum> extends LineSeriesOptions<TDatum> {
  /** The axes to show. @default "x" */
  axes?: boolean | "x" | "y";
  /** Horizontal gridlines. @default true */
  grid?: boolean;
  /** A color legend below the plot; `"toggle"` lets readers hide series. */
  legend?: boolean | "toggle";
  /** Formats x ticks and tooltip titles. */
  formatX?: ChartFormat;
  /** Formats y ticks and tooltip values. */
  formatY?: ChartFormat;
}

/** A complete line chart — pass it to `defineChart`, or spread it and extend. */
export function lineChart<TDatum>(
  data: readonly TDatum[],
  options: LineChartOptions<TDatum>,
) {
  const series = chartSeries(data, options);
  return {
    scales: chartScales({
      x: {
        kind: series.rows[0]?.x instanceof Date ? "time" : "point",
        format: options.formatX,
      },
      y: { format: options.formatY },
      axes: options.axes,
      grid: options.grid === false ? false : "y",
    }),
    color: {
      domain: series.names,
      legend: options.legend
        ? chartLegend({ toggle: options.legend === "toggle" })
        : undefined,
    },
    marks: [lineMark(series, options)],
  };
}
