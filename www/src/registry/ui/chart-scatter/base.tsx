"use client"

import type { ChartBuildContext } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"
import { scaleSqrt } from "d3-scale"

import type {
  ChartBaseSpecOptions,
  ChartComponentProps,
  ChartSeriesField,
  ChartSpecOf,
  ChartXField,
  ChartYField,
} from "@/registry/ui/chart"
import {
  Chart,
  chartDefaults,
  chartFrame,
  planSeries,
  useChartDefinition,
} from "@/registry/ui/chart"

/* Both axes are quantitative, so there is a single dot layer over the raw rows:
   `series` only colors them, `r` only sizes them. */

/* A numeric field — scatter puts a linear scale on both axes. Intersecting the
   two field types keeps the numeric constraint while staying assignable to the
   mark's wider channel, which a mapped key type cannot prove on its own. */
type ScatterField<TDatum> = ChartXField<TDatum> & ChartYField<TDatum>

export interface ScatterChartSpecOptions<
  TDatum,
> extends ChartBaseSpecOptions<TDatum> {
  /** Field on the horizontal (quantitative) axis. */
  x: ScatterField<TDatum>
  /** Field on the vertical (quantitative) axis. */
  y: ScatterField<TDatum>
  /** Field sizing each dot — the bubble channel. */
  r?: ScatterField<TDatum>
  /** Pixel radius used when `r` is absent. */
  radius?: number
  /** Pixel radii `r` maps onto, through an area-preserving square-root scale. */
  radiusRange?: readonly [number, number]
  /** Field splitting rows into colored groups. */
  series?: ChartSeriesField<TDatum>
  /** Leading series order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]
  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>
  /** Dot opacity — lower it when points overlap. */
  fillOpacity?: number
}

export function scatterChartSpec<TDatum>(
  options: ScatterChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, number> {
  const { series } = options
  const plan = series === undefined ? null : planSeries({ ...options, series })
  const order = plan?.order ?? []
  const color = plan?.seriesOf
  const [minRadius, maxRadius] =
    options.radiusRange ?? chartDefaults.bubbleRadius
  return {
    // A legend of one unnamed group is noise: it arrives with `series`.
    ...chartFrame(
      { ...options, legend: options.legend ?? order.length > 0 },
      ctx,
      { order, x: "linear", y: "linear", grid: "both" },
    ),
    marks: [
      ...(options.marksBefore ?? []),
      dot(options.data, {
        x: options.x,
        y: options.y,
        z: color,
        color,
        key: options.rowKey,
        r: options.r ?? options.radius ?? chartDefaults.dotRadius,
        // Area, not radius, carries magnitude — and only when `r` is a field.
        rScale:
          options.r === undefined
            ? undefined
            : { scale: () => scaleSqrt().range([minRadius, maxRadius]) },
        fillOpacity: options.fillOpacity,
      }),
      ...(options.marks ?? []),
    ],
  }
}

export type ScatterChartProps<TDatum> = ChartComponentProps<
  ScatterChartSpecOptions<TDatum>,
  TDatum,
  number
>

/* Points sit in two dimensions, so the house `group-x` focus — built for a
   shared category axis — gives way to nearest-point focus. */
export function ScatterChart<TDatum>(props: ScatterChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    number,
    ScatterChartSpecOptions<TDatum>
  >(
    {
      ...props,
      focus: props.focus ?? "nearest",
      tooltipAnchor: props.tooltipAnchor ?? "point",
    },
    scatterChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
