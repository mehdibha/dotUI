"use client"

import type {
  ChartBuildContext,
  ChartLinearGradient,
  ChartValue,
} from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { stackRowsY } from "@tanstack/charts/transform/stack"

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
  decorative,
  paletteColor,
  planChart,
  useChartDefinition,
} from "@/registry/ui/chart"

export interface AreaChartSpecOptions<
  TDatum,
> extends XYChartSpecOptions<TDatum> {
  /** Path interpolation between points. */
  curve?: ChartCurve
  /** Fill opacity, or `"gradient"` to fade the fill out toward the baseline. */
  fill?: number | "gradient"
  strokeWidth?: number
  /** Draw a dot at every point. */
  points?: boolean
  /** Series stacked on one another; `"normalize"` for a 100% stack. */
  stacked?: boolean | "normalize"
}

// The host scopes every declared id with its instance prefix, so two charts
// on a page cannot collide.
const GRADIENT_ID = "dotui-fill"

/** A vertical fade from `color` down to near-transparent. */
export function fadeGradient(id: string, color: string): ChartLinearGradient {
  return {
    id,
    y1: 1,
    y2: 0,
    stops: [
      { offset: 0, color, opacity: 0.02 },
      { offset: 1, color, opacity: 0.5 },
    ],
  }
}

interface StackedRow {
  x: ChartValue
  y1: number
  y2: number
  z: string
}

/* The fill is one mark and the edge another: an area's stroke would outline
   the whole polygon. The edge is decorative, so the area's points — which
   report a stacked segment's own value — are the only stops. */
export function areaChartSpec<TDatum>(
  options: AreaChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const plan = planChart(options)
  const stacked = options.stacked ?? false
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  const fill = options.fill ?? chartDefaults.fill
  const gradient = fill === "gradient"
  const fillOf = (label: string) =>
    `url(#${GRADIENT_ID}-${plan.order.indexOf(label)})`
  const paint = { fillOpacity: gradient ? 1 : fill, curve }
  const edge = {
    strokeWidth: options.strokeWidth ?? chartDefaults.strokeWidth,
    points: options.points ?? chartDefaults.points,
    curve,
  }
  const marks = stacked
    ? (() => {
        const x = plan.x as keyof TDatum
        const y = plan.y as keyof TDatum
        const rows = stackRowsY(plan.rows as readonly object[], {
          x: (row: object) => (row as TDatum)[x] as ChartValue,
          y: (row: object) => (row as TDatum)[y] as number | null | undefined,
          z: plan.z as (row: object) => string,
          order: plan.order,
          ...(stacked === "normalize" && { offset: "normalize" as const }),
        }) as unknown as readonly StackedRow[]
        const z = (row: StackedRow) => row.z
        const key = (row: StackedRow) => `${String(row.x)}:${row.z}`
        return [
          areaY(rows, {
            x: "x",
            y1: "y1",
            y2: "y2",
            z,
            color: z,
            key,
            fill: gradient ? (row) => fillOf(row.z) : undefined,
            ...paint,
          }),
          decorative(
            lineY(rows, { x: "x", y: "y2", z, color: z, key, ...edge }),
          ),
        ]
      })()
    : [
        areaY(plan.rows, {
          x: plan.x,
          y: plan.y,
          // An explicit baseline opts out of the library's implicit stacking.
          y1: 0,
          z: plan.z,
          color: plan.z,
          key: plan.key,
          fill: gradient ? (row) => fillOf(plan.z(row)) : undefined,
          ...paint,
        }),
        decorative(
          lineY(plan.rows, {
            x: plan.x,
            y: plan.y,
            z: plan.z,
            color: plan.z,
            key: plan.key,
            ...edge,
          }),
        ),
      ]
  return {
    ...chartFrame(options, ctx, { order: plan.order }),
    marks: [...(options.marksBefore ?? []), ...marks, ...(options.marks ?? [])],
    gradients: gradient
      ? plan.order.map((_, index) =>
          fadeGradient(`${GRADIENT_ID}-${index}`, paletteColor(index)),
        )
      : undefined,
  }
}

export type AreaChartProps<TDatum> = ChartComponentProps<
  AreaChartSpecOptions<TDatum>,
  TDatum
>

export function AreaChart<TDatum>(props: AreaChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    AreaChartSpecOptions<TDatum>
  >(props, areaChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
