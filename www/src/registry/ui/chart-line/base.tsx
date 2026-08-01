'use client'

import type { ChartBuildContext } from '@tanstack/charts'
import { lineY } from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { curveMonotoneX, curveNatural, curveStepAfter } from 'd3-shape'

import type {
  ChartComponentProps,
  ChartCurve,
  ChartSpecOf,
  ChartXField,
  ChartXValueOf,
  XYChartSpecOptions,
} from '@/registry/ui/chart'
import {
  Chart,
  chartDefaults,
  chartFrame,
  planChart,
  useChartDefinition,
} from '@/registry/ui/chart'

/* Curves live in the families that draw paths, so a bar or heatmap chart never
   pulls d3-shape into the bundle. */
const CURVES = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
} as const satisfies Record<ChartCurve, unknown>

export interface LineChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  /** Path interpolation between points. */
  curve?: ChartCurve
  strokeWidth?: number
  /** Draw a dot at every point. */
  points?: boolean
}

/* One line per series, each carrying the `z` its plan assigned — so grouped
   focus resolves exactly one point, and one tooltip row, per series. An
   annotation passed through `marks` joins a series' row by reusing its `z`. */
export function lineChartSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: LineChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  return {
    ...chartFrame(options, ctx, { order }),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.map((layer) =>
        lineY(options.data, {
          ...layer.channels,
          strokeWidth: options.strokeWidth ?? chartDefaults.strokeWidth,
          points: options.points ?? chartDefaults.points,
          curve,
        }),
      ),
      ...(options.marks ?? []),
    ],
  }
}

export type LineChartProps<
  TDatum,
  TXField extends ChartXField<TDatum>,
> = ChartComponentProps<
  LineChartSpecOptions<TDatum, TXField>,
  TDatum,
  ChartXValueOf<TDatum, TXField>
>

export function LineChart<TDatum, TXField extends ChartXField<TDatum>>(
  props: LineChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    LineChartSpecOptions<TDatum, TXField>
  >(props, lineChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
