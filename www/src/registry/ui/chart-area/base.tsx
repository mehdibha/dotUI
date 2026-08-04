'use client'

import type { ChartBuildContext } from '@tanstack/charts'
import { areaY } from '@tanstack/charts/area'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { lineY } from '@tanstack/charts/line'
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
  gradientPrefix,
  paletteGradients,
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

export interface AreaChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  /** Path interpolation between points. */
  curve?: ChartCurve
  /** Fill opacity, or `'gradient'` to fade the fill out toward the baseline. */
  fill?: number | 'gradient'
  strokeWidth?: number
  /** Draw a dot at every point. */
  points?: boolean
}

/* An area mark never draws its own upper edge, so each series is two layers:
   the fill, then the stroke over it. Both carry the same `z`, so grouped focus
   still resolves exactly one point per series. */
export function areaChartSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: AreaChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  const fill = options.fill ?? chartDefaults.fill
  const gradient = fill === 'gradient'
  const prefix = gradientPrefix(options.gradientIdPrefix, 'area')
  return {
    ...chartFrame(options, ctx, { order }),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.flatMap((layer) => [
        areaY(options.data, {
          ...layer.channels,
          fillOpacity: gradient ? 1 : fill,
          fill: gradient ? layer.gradientFill(prefix) : undefined,
          curve,
        }),
        lineY(options.data, {
          ...layer.channels,
          strokeWidth: options.strokeWidth ?? chartDefaults.strokeWidth,
          points: options.points ?? chartDefaults.points,
          curve,
        }),
      ]),
      ...(options.marks ?? []),
    ],
    gradients: gradient ? paletteGradients(prefix, order.length) : undefined,
  }
}

export type AreaChartProps<
  TDatum,
  TXField extends ChartXField<TDatum>,
> = ChartComponentProps<
  AreaChartSpecOptions<TDatum, TXField>,
  TDatum,
  ChartXValueOf<TDatum, TXField>
>

export function AreaChart<TDatum, TXField extends ChartXField<TDatum>>(
  props: AreaChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    AreaChartSpecOptions<TDatum, TXField>
  >(props, areaChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
