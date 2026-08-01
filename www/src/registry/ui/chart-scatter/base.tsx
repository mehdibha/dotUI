'use client'

import type { Channel, ChartBuildContext, ChartKey } from '@tanstack/charts'
import { dot } from '@tanstack/charts/dot'
import { scaleSqrt } from 'd3-scale'

import type {
  ChartBaseSpecOptions,
  ChartComponentProps,
  ChartSeriesField,
  ChartSpecOf,
  ChartXField,
  ChartYField,
} from '@/registry/ui/chart'
import {
  Chart,
  chartDefaults,
  chartFrame,
  useChartDefinition,
} from '@/registry/ui/chart'

/* Scatter has no series plan: both axes are quantitative, so there is one dot
   layer over the raw rows, optionally split by color and sized by `r`. */

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
  /** Group order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]
  /** Display names for group keys. */
  labels?: Readonly<Record<string, string>>
  /** Dot opacity — lower it when points overlap. */
  fillOpacity?: number
}

interface ScatterColors<TDatum> {
  order: readonly string[]
  color?: Channel<TDatum, ChartKey | null | undefined>
}

/* Order is explicit, never derived from iteration order of a Set over unsorted
   data, so SSR and the client agree. */
function scatterColors<TDatum>(
  options: ScatterChartSpecOptions<TDatum>,
): ScatterColors<TDatum> {
  if (options.series === undefined) return { order: [] }
  const field = options.series as keyof TDatum
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const seriesOf = (row: TDatum) => labelOf(String(row[field]))
  return {
    order: options.seriesOrder
      ? options.seriesOrder.map(labelOf)
      : [...new Set(options.data.map(seriesOf))],
    color: seriesOf,
  }
}

export function scatterChartSpec<TDatum>(
  options: ScatterChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, number> {
  const { order, color } = scatterColors(options)
  const [minRadius, maxRadius] =
    options.radiusRange ?? chartDefaults.bubbleRadius
  return {
    // A legend of one unnamed group is noise: it arrives with `series`.
    ...chartFrame(
      { ...options, legend: options.legend ?? order.length > 0 },
      ctx,
      { order, x: 'linear', y: 'linear', grid: 'both' },
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
      focus: props.focus ?? 'nearest',
      tooltipAnchor: props.tooltipAnchor ?? 'point',
    },
    scatterChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
