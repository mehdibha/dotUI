"use client"

import type { ChartBuildContext } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"

import type {
  ChartComponentProps,
  ChartCurve,
  ChartSpec,
  XYChartSpecOptions,
} from "@/registry/ui/chart"
import {
  Chart,
  chartDefaults,
  chartFrame,
  CURVES,
  planChart,
  useChartDefinition,
} from "@/registry/ui/chart"

export interface LineChartSpecOptions<
  TDatum,
> extends XYChartSpecOptions<TDatum> {
  /** Path interpolation between points. */
  curve?: ChartCurve
  strokeWidth?: number
  /** Draw a dot at every point. */
  points?: boolean
}

export function lineChartSpec<TDatum>(
  options: LineChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const plan = planChart(options)
  return {
    ...chartFrame(options, ctx, { order: plan.order }),
    marks: [
      ...(options.marksBefore ?? []),
      lineY(plan.rows, {
        x: plan.x,
        y: plan.y,
        z: plan.z,
        color: plan.z,
        key: plan.key,
        strokeWidth: options.strokeWidth ?? chartDefaults.strokeWidth,
        points: options.points ?? chartDefaults.points,
        curve: CURVES[options.curve ?? chartDefaults.curve],
      }),
      ...(options.marks ?? []),
    ],
  }
}

export type LineChartProps<TDatum> = ChartComponentProps<
  LineChartSpecOptions<TDatum>,
  TDatum
>

export function LineChart<TDatum>(props: LineChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    LineChartSpecOptions<TDatum>
  >(props, lineChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
