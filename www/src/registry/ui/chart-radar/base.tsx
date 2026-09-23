"use client"

import type { ChartBuildContext, ChartValue } from "@tanstack/charts"
import type {
  PolarGuide,
  PolarGuideLabelContext,
  PolarLayoutContext,
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
import { scaleLinear, scalePoint } from "d3-scale"
import { curveLinearClosed, pointRadial } from "d3-shape"

import type {
  ChartComponentProps,
  ChartFormat,
  ChartSpec,
  ChartTooltipContentOf,
  PolarMarkLayer,
  XYChartSpecOptions,
} from "@/registry/ui/chart"
import {
  Chart,
  CHART_THEME,
  chartDefaults,
  chartLegend,
  finiteOrNull,
  paletteColor,
  planChart,
  useChartDefinition,
} from "@/registry/ui/chart"

// A radar reads as a shape: heavier fill, lighter outline than a cartesian area.
const radarDefaults = {
  radiusRatio: 0.78,
  fill: 0.6,
  strokeWidth: 1.5,
  gridTicks: 4,
  /** Half the gap between the two lines of a detailed circumference label. */
  labelLine: 7,
} as const

export interface RadarChartSpecOptions<TDatum> extends Omit<
  XYChartSpecOptions<TDatum>,
  "marks" | "marksBefore"
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
  gridShape?: "circle" | "polygon"
  /** Number of rings. */
  gridTicks?: number
  /** Fill opacity of the area inside the outer ring. */
  gridFill?: number
  gridFillColor?: string
  /** Draw the spokes running out to each category. */
  spokes?: boolean
  /** A second, muted label line above each category label. */
  axisDetail?: ChartFormat
  /** Extra polar mark layers painted over the series. */
  polarMarks?: readonly PolarMarkLayer[]
}

/* `radialGrid` reads its rings from the nicened radius scale, so the filled
   outer ring is drawn from the layout instead. */
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
  const path = angle.domain
    .map((value) => pointRadial(angle.map(value), radius))
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`)
    .join("")
  return `${path}Z`
}

// Labels beside or below the circle need a nudge away from it; `extra` opens
// the gap for a second line.
function labelDy(extra: number) {
  return ({ y }: PolarGuideLabelContext) =>
    (y < -1 ? -2 : y > 1 ? 2 : 0) + extra
}

function labelDx({ x }: PolarGuideLabelContext) {
  return x < -1 ? -3 : x > 1 ? 3 : 0
}

export function radarChartSpec<TDatum>(
  options: RadarChartSpecOptions<TDatum>,
  _ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const plan = planChart(options)
  const categories = [
    ...new Set(
      options.data.map((row) => row[options.x as keyof TDatum] as ChartValue),
    ),
  ]
  const observed = plan.rows.reduce(
    (max, row) => Math.max(max, finiteOrNull(row[plan.y as keyof TDatum]) ?? 0),
    0,
  )

  const grid = options.grid ?? chartDefaults.grid
  const spokes = options.spokes ?? grid
  // One label ring, so the per-axis values mean "on". On by default: the
  // ring labels are the categories, not axis chrome.
  const axes = (options.axes ?? true) !== false
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
  if (grid) guides.push(radialGrid({ ticks, shape, labels: false }))
  if (spokes || axes) {
    guides.push(
      angleGrid({
        labels: axes,
        // Spokes and circumference labels are one guide.
        strokeOpacity: spokes ? undefined : 0,
        format: options.formatX,
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
        format: options.axisDetail,
        labelDx,
        labelDy: labelDy(-radarDefaults.labelLine),
        labelFill: "var(--color-fg-muted)",
      }),
    )
  }

  const channels = {
    angle: plan.x,
    radius: plan.y,
    z: plan.z,
    color: plan.z,
    key: plan.key,
  }
  const marks: PolarMarkLayer[] = [
    ...(fill > 0
      ? [
          radialArea(plan.rows, {
            ...channels,
            id: "radar-area",
            radius1: 0,
            curve: curveLinearClosed,
            fillOpacity: fill,
          }),
        ]
      : []),
    radialLine(plan.rows, {
      ...channels,
      id: "radar-line",
      curve: curveLinearClosed,
      strokeWidth: options.strokeWidth ?? radarDefaults.strokeWidth,
    }),
    ...((options.points ?? chartDefaults.points)
      ? [
          radialDot(plan.rows, {
            ...channels,
            id: "radar-dot",
            r: chartDefaults.dotRadius,
          }),
        ]
      : []),
  ]

  return {
    scales: { x: null, y: null },
    color: {
      domain: plan.order,
      legend:
        (options.legend ?? chartDefaults.legend) ? chartLegend() : undefined,
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

// oxlint-disable-next-line no-explicit-any
const radarTooltip: ChartTooltipContentOf<RadarChartSpecOptions<any>> = (
  points,
  _context,
  options,
) => {
  const first = points[0]
  const formatX = options.formatX ?? String
  const formatY = options.formatY ?? String
  return {
    title: first === undefined ? undefined : formatX(first.xValue),
    rows: points.map((point) => ({
      label: point.groupLabel,
      value: formatY(point.yValue),
      color: point.color,
    })),
  }
}

export type RadarChartProps<TDatum> = ChartComponentProps<
  RadarChartSpecOptions<TDatum>,
  TDatum
>

export function RadarChart<TDatum>(props: RadarChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    RadarChartSpecOptions<TDatum>
  >(props, radarChartSpec, {
    // Two spokes can share a scene x; group by the nearest angular ray instead.
    focus: focusGroupAngle,
    tooltipContent: radarTooltip,
  })
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
