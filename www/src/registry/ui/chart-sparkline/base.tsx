"use client"

import type { ChartBuildContext } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { lineY } from "@tanstack/charts/line"
import { scalePoint } from "d3-scale"
import { curveMonotoneX, curveNatural, curveStepAfter } from "d3-shape"

import type {
  ChartBaseSpecOptions,
  ChartComponentProps,
  ChartCurve,
  ChartFrameOptions,
  ChartSpecOf,
  ChartXField,
  ChartXValueOf,
  ChartYField,
} from "@/registry/ui/chart"
import {
  Chart,
  chartDefaults,
  chartFrame,
  fadeGradient,
  paletteColor,
  useChartDefinition,
} from "@/registry/ui/chart"

/* Curves live in the families that draw paths, so a bar or heatmap chart never
   pulls d3-shape into the bundle. */
const CURVES = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
} as const satisfies Record<ChartCurve, unknown>

/* The host scopes declared ids with its own instance prefix, so one constant
   cannot collide across charts. */
const FILL_ID = "dotui-sparkline-fill"

/* A sparkline is one series, no chrome: the frame props (axes, grid, legend,
   tick formats) are dropped rather than ignored. */
export interface SparklineSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends Omit<ChartBaseSpecOptions<TDatum>, keyof ChartFrameOptions> {
  /** Field holding the category / time value. */
  x: TXField
  /** Field holding the value. */
  y: ChartYField<TDatum>
  mode?: "line" | "area"
  curve?: ChartCurve
  /** Any CSS color. Defaults to the first palette slot. */
  color?: string
  /** Area fill opacity, or `'gradient'` to fade it out downward. */
  fill?: number | "gradient"
  strokeWidth?: number
}

export function sparklineSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: SparklineSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const color = options.color ?? paletteColor(0)
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  const strokeWidth = options.strokeWidth ?? chartDefaults.strokeWidth
  const fill = options.fill ?? chartDefaults.fill
  const gradient = fill === "gradient"
  const channels = { x: options.x, y: options.y, key: options.rowKey }
  return {
    ...chartFrame({ axes: false, grid: false, legend: false }, ctx, {
      // No outer padding: a sparkline spans its box edge to edge. And no
      // nicening: the shape comes from the data extent, not round numbers.
      x: { scale: () => scalePoint().padding(0) },
      y: { nice: false },
    }),
    guides: false,
    // Half the stroke, so the round caps at the extremes are not clipped.
    margin: Math.ceil(strokeWidth / 2),
    marks: [
      ...(options.marksBefore ?? []),
      ...(options.mode === "area"
        ? [
            areaY(options.data, {
              ...channels,
              fill: gradient ? `url(#${FILL_ID})` : color,
              fillOpacity: gradient ? 1 : fill,
              curve,
            }),
          ]
        : []),
      lineY(options.data, { ...channels, stroke: color, strokeWidth, curve }),
      ...(options.marks ?? []),
    ],
    gradients: gradient ? [fadeGradient(FILL_ID, color)] : undefined,
  }
}

export type SparklineProps<TDatum, TXField extends ChartXField<TDatum>> = Omit<
  ChartComponentProps<
    SparklineSpecOptions<TDatum, TXField>,
    TDatum,
    ChartXValueOf<TDatum, TXField>
  >,
  "tooltip"
> & {
  /** Sparklines are read at a glance, so the tooltip is opt-in. */
  tooltip?: boolean
}

export function Sparkline<TDatum, TXField extends ChartXField<TDatum>>({
  tooltip = false,
  height = chartDefaults.sparklineHeight,
  ...props
}: SparklineProps<TDatum, TXField>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    SparklineSpecOptions<TDatum, TXField>
  >(
    { ...props, height, tooltip: tooltip ? undefined : (false as const) },
    sparklineSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
