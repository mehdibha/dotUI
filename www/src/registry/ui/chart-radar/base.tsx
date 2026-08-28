"use client"

import { useMemo } from "react"
import type { ChartBuildContext, ChartValue } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import type {
  PolarGuide,
  PolarGuideLabelContext,
  PolarLayoutContext,
  PolarMark,
} from "@tanstack/charts/polar"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialArea,
  radialDot,
  radialGrid,
  radialLine,
} from "@tanstack/charts/polar"
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip"
import { scaleLinear, scalePoint } from "d3-scale"
import { curveLinearClosed, pointRadial } from "d3-shape"

import type {
  ChartComponentProps,
  ChartFormat,
  ChartSpecOf,
  ChartXField,
  ChartXValueOf,
  ChartYField,
  XYChartSpecOptions,
} from "@/registry/ui/chart"
import {
  Chart,
  CHART_THEME,
  chartDefaults,
  finiteOrNull,
  paletteColor,
  planChart,
  resolveFormat,
  useChartDefinition,
} from "@/registry/ui/chart"

/* Radar geometry the shared defaults do not cover — a radar reads as a shape,
   so its fill is far heavier than a cartesian area's. */
const radarDefaults = {
  radiusRatio: 0.78,
  fill: 0.6,
  gridTicks: 4,
  /** Half the gap between the two lines of a detailed circumference label. */
  labelLine: 7,
} as const

/** Mark layers spliced inside the polar container — cartesian marks would land outside it. */
// oxlint-disable-next-line no-explicit-any
export type PolarMarkLayer = PolarMark<any, any, any>

export interface RadarChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends Omit<
  XYChartSpecOptions<TDatum, TXField>,
  "marks" | "marksBefore" | "y1"
> {
  /** Series fill opacity — `0` draws outlines only. */
  fill?: number
  strokeWidth?: number
  /** Draw a dot at every point. */
  points?: boolean
  /** Fraction of the available radius the chart fills. */
  radiusRatio?: number
  /** Outer value of the radius scale. */
  max?: number
  /** Ring shape. */
  gridShape?: "circle" | "polygon"
  /** Number of rings. */
  gridTicks?: number
  /** Fill opacity of the area inside the outer ring. */
  gridFill?: number
  /** Color of that fill. */
  gridFillColor?: string
  /** Draw the spokes running out to each category. */
  spokes?: boolean
  /** A second, muted label line above each category label. */
  axisDetail?: ChartFormat
  /** Extra polar mark layers painted over the series. */
  polarMarks?: readonly PolarMarkLayer[]
}

function readValue<TDatum>(row: TDatum, field: ChartYField<TDatum>): number {
  return finiteOrNull(row[field as keyof TDatum]) ?? 0
}

/* `radialGrid` hard-codes `fill: 'none'` on every ring, so a filled grid is its
   own guide. Guides paint in order, so it lands under the rings. */
function gridFillGuide(
  shape: "circle" | "polygon",
  fill: string,
  fillOpacity: number,
): PolarGuide {
  return {
    render: ({ layout }) => ({
      background: [
        {
          kind: "area",
          key: "radar-grid-fill",
          points: [],
          path: gridFillPath(layout, shape),
          style: { fill, fillOpacity },
        },
      ],
    }),
  }
}

function gridFillPath(
  layout: PolarLayoutContext,
  shape: "circle" | "polygon",
): string {
  const radius = layout.radius
  const angle = layout.scales.angle
  if (shape === "circle" || angle === undefined || angle.domain.length < 3) {
    return `M${radius},0A${radius},${radius} 0 1,1 ${-radius},0A${radius},${radius} 0 1,1 ${radius},0Z`
  }
  const corners = angle.domain.map((value) =>
    pointRadial(angle.map(value), radius),
  )
  const path = corners
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`)
    .join("")
  return `${path}Z`
}

/* Labels sitting beside or below the circle need a nudge away from it; `extra`
   opens the gap for a second line. */
function labelDy(extra: number) {
  return ({ y }: PolarGuideLabelContext) =>
    (y < -1 ? -2 : y > 1 ? 2 : 0) + extra
}

function labelDx({ x }: PolarGuideLabelContext) {
  return x < -1 ? -3 : x > 1 ? 3 : 0
}

/* One radial band per series: the fill, the outline over it, then the dots.
   All three carry the same `z`, so grouped focus still resolves exactly one
   point per series. */
export function radarChartSpec<TDatum, TXField extends ChartXField<TDatum>>(
  options: RadarChartSpecOptions<TDatum, TXField>,
  _ctx: ChartBuildContext,
): ChartSpecOf<TDatum, ChartXValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const categories = [
    ...new Set(
      options.data.map((row) => row[options.x as keyof TDatum] as ChartValue),
    ),
  ]

  let observed = 0
  for (const layer of layers) {
    for (const row of options.data) {
      observed = Math.max(observed, readValue(row, layer.channels.y))
    }
  }

  const grid = options.grid ?? chartDefaults.grid
  const spokes = options.spokes ?? grid
  const axes = options.axes ?? chartDefaults.axes
  const shape = options.gridShape ?? "polygon"
  const ticks = options.gridTicks ?? radarDefaults.gridTicks
  const fill = options.fill ?? radarDefaults.fill
  const detail = axes && options.axisDetail !== undefined

  const guides: PolarGuide[] = []
  if (options.gridFill !== undefined) {
    guides.push(
      gridFillGuide(
        shape,
        options.gridFillColor ?? paletteColor(0),
        options.gridFill,
      ),
    )
  }
  if (grid) {
    guides.push(radialGrid({ ticks, shape, labels: false }))
  }
  if (spokes || axes) {
    guides.push(
      angleGrid({
        labels: axes,
        /* Spokes and circumference labels are one guide, so labels without
           spokes means an invisible stroke. */
        strokeOpacity: spokes ? undefined : 0,
        format: resolveFormat(options.formatX),
        labelDx,
        labelDy: labelDy(detail ? radarDefaults.labelLine : 0),
      }),
    )
  }
  if (detail) {
    guides.push(
      angleGrid({
        labels: true,
        strokeOpacity: 0,
        format: resolveFormat(options.axisDetail),
        labelDx,
        labelDy: labelDy(-radarDefaults.labelLine),
        labelFill: "var(--color-fg-muted)",
      }),
    )
  }

  const marks: PolarMarkLayer[] = layers.flatMap((layer, index) => {
    const channels = {
      angle: layer.channels.x,
      radius: layer.channels.y,
      z: layer.channels.z,
      color: layer.channels.color,
      key: layer.channels.key,
    }
    return [
      ...(fill > 0
        ? [
            radialArea(options.data, {
              ...channels,
              id: `radar-area-${index}`,
              curve: curveLinearClosed,
              fillOpacity: fill,
            }),
          ]
        : []),
      radialLine(options.data, {
        ...channels,
        id: `radar-line-${index}`,
        curve: curveLinearClosed,
        strokeWidth: options.strokeWidth ?? chartDefaults.strokeWidth,
      }),
      ...((options.points ?? chartDefaults.points)
        ? [
            radialDot(options.data, {
              ...channels,
              id: `radar-dot-${index}`,
              r: chartDefaults.dotRadius,
            }),
          ]
        : []),
    ]
  })

  return {
    scales: { x: null, y: null },
    color: {
      domain: order,
      legend:
        (options.legend ?? chartDefaults.legend) ? colorLegend() : undefined,
    },
    theme: CHART_THEME,
    marks: [
      polar({
        radiusRatio: options.radiusRatio ?? radarDefaults.radiusRatio,
        scales: {
          angle: {
            scale: scalePoint<ChartValue>().domain(categories),
            wrap: true,
          },
          radius: {
            scale: scaleLinear().domain([0, options.max ?? observed]),
            // An explicit max is the domain, not a suggestion.
            nice: options.max === undefined && ticks,
          },
        },
        guides,
        marks: [...marks, ...(options.polarMarks ?? [])],
      }),
    ],
  }
}

interface RadarFormats {
  category?: (value: ChartValue) => string
  value?: (value: ChartValue) => string
}

/* The library's default tooltip body prints the scale values, which on a polar
   chart are radians and pixel radii — every polar family supplies its own. */
function radarTooltipBody(formats: RadarFormats) {
  return ({
    points,
  }: ChartTooltipBodyRenderContext<unknown, ChartValue, number>) => {
    const first = points[0]
    if (first === undefined) return null
    return (
      <>
        <div className="mb-1 font-semibold">
          {formats.category?.(first.xValue) ?? String(first.xValue)}
        </div>
        <div className="grid gap-1">
          {points.map((point) => (
            <div key={point.key} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-xs"
                style={{ background: point.color }}
              />
              <span>{point.groupLabel}</span>
              <span className="ml-3 flex-1 text-right tabular-nums">
                {formats.value?.(point.yValue) ?? String(point.yValue)}
              </span>
            </div>
          ))}
        </div>
      </>
    )
  }
}

export type RadarChartProps<
  TDatum,
  TXField extends ChartXField<TDatum>,
> = ChartComponentProps<
  RadarChartSpecOptions<TDatum, TXField>,
  TDatum,
  ChartXValueOf<TDatum, TXField>
>

export function RadarChart<TDatum, TXField extends ChartXField<TDatum>>(
  props: RadarChartProps<TDatum, TXField>,
) {
  const { formatX, formatY } = props
  const tooltipBody = useMemo(
    () =>
      radarTooltipBody({
        category: resolveFormat(formatX),
        value: resolveFormat(formatY),
      }),
    [formatX, formatY],
  )
  const { definition, host, children } = useChartDefinition<
    TDatum,
    ChartXValueOf<TDatum, TXField>,
    RadarChartSpecOptions<TDatum, TXField>
  >(
    {
      ...props,
      /* Cartesian `group-x` groups points sharing a scene x, which two spokes
         on a circle can coincide on. `focusGroupAngle` groups the nearest
         angular ray across series instead. The strategy object is not in the
         public `focus` union; it rides the untyped prop bag. */
      focus: props.focus ?? focusGroupAngle,
      renderTooltipBody: props.renderTooltipBody ?? tooltipBody,
      /* The polar mark arrays serialize into the structural key — mark objects
         key by function identity — and alias into the reference-compared
         `marks` slots. */
      marks: props.polarMarks,
    },
    radarChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
