"use client"

import type { ChartBuildContext } from "@tanstack/charts"
import { barX, barY } from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleBand } from "d3-scale"

import type {
  ChartComponentProps,
  ChartSpecOf,
  ChartXField,
  ChartXValueOf,
  XYChartSpecOptions,
} from "@/registry/ui/chart"
import {
  Chart,
  chartDefaults,
  chartFrame,
  planChart,
  useChartDefinition,
} from "@/registry/ui/chart"

export interface BarChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  /** Categories down the y axis, values along x. */
  horizontal?: boolean
  /** Side-by-side series inside each category band. */
  grouped?: boolean
  /** Corner radius in pixels. */
  radius?: number
  /** Pixels trimmed from both categorical edges of every bar. */
  inset?: number
  /** Bar fill opacity. */
  fillOpacity?: number
}

export function barChartSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: BarChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const horizontal = options.horizontal ?? false
  const grouped = (options.grouped ?? layers.length > 1) && order.length > 1
  const bar = {
    radius: options.radius ?? chartDefaults.barRadius,
    inset: options.inset,
    fillOpacity: options.fillOpacity,
    /* Every series is its own mark, so an inferred group domain would hold a
       single value and park each series in the middle of the band. */
    layout: grouped
      ? group({
          scale: scaleBand<string>()
            .domain([...order])
            .padding(chartDefaults.groupPadding),
        })
      : undefined,
  }
  return {
    ...chartFrame(
      options,
      ctx,
      horizontal
        ? { order, x: "linear", y: "band", grid: "x" }
        : { order, x: "band", grid: "y" },
    ),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.map((layer) =>
        horizontal
          ? barX(options.data, {
              x: layer.channels.y,
              x1: layer.channels.y1,
              y: layer.channels.x,
              z: layer.channels.z,
              color: layer.channels.color,
              key: layer.channels.key,
              ...bar,
            })
          : barY(options.data, { ...layer.channels, ...bar }),
      ),
      ...(options.marks ?? []),
    ],
  }
}

export type BarChartProps<
  TDatum,
  TXField extends ChartXField<TDatum>,
> = ChartComponentProps<
  BarChartSpecOptions<TDatum, TXField>,
  TDatum,
  ChartXValueOf<TDatum, TXField>
>

export function BarChart<TDatum, TXField extends ChartXField<TDatum>>(
  props: BarChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    BarChartSpecOptions<TDatum, TXField>
  >(
    {
      ...props,
      /* `group-x` groups points sharing a scene x — the value axis when the
         bars run horizontally. Group along the categories instead. */
      focus: props.focus ?? (props.horizontal ? "group-y" : undefined),
    },
    barChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
