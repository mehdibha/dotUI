"use client"

import type {
  ChartPoint,
  ChartTooltipContentContext,
  ChartValue,
} from "@tanstack/charts"
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
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"
import { curveLinearClosed, pointRadial } from "d3-shape"

import type {
  ChartDefaults,
  ChartFormat,
  ChartSeriesOptions,
} from "@/registry/ui/chart"
import {
  chartColor,
  chartColorScale,
  chartLook,
  chartMarks,
  chartSeries,
  polarDecorative,
} from "@/registry/ui/chart"

// oxlint-disable-next-line no-explicit-any
type AnyPolarMark = PolarMark<any, any, any, any, any>

/* Half the gap between the two lines of a detailed circumference label. */
const LABEL_LINE = 7

export interface RadarChartOptions<TDatum> extends ChartSeriesOptions<TDatum> {
  /** Series fill opacity — `0` draws outlines only. @default 0.6 */
  fill?: number
  /** @default 1.5 */
  strokeWidth?: number
  /** A dot at every point. */
  points?: boolean
  /** Share of the available radius the radar fills. @default 0.78, or 0.68 with a legend */
  radiusRatio?: number
  /** The value at the outer ring. @default the largest value, nicened */
  max?: number
  /** @default "polygon" */
  gridShape?: "circle" | "polygon"
  /** Number of rings. @default 4 */
  gridTicks?: number
  /** Rings behind the series. @default true */
  grid?: boolean
  /** Spokes out to each category. @default `grid` */
  spokes?: boolean
  /** Fill opacity of the area inside the outer ring. */
  gridFill?: number
  /** @default the first series color */
  gridFillColor?: string
  /** The category labels around the circle. @default true */
  axes?: boolean
  /** A second, muted label line above each category. */
  axisDetail?: ChartFormat
  /** A color legend. @default the defaults' `legend` */
  legend?: boolean
  /** Formats category labels and tooltip titles. */
  formatX?: ChartFormat
  /** Formats tooltip values. */
  formatY?: ChartFormat
  /** More polar layers drawn over the series. */
  marks?: readonly AnyPolarMark[]
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

/** A complete radar chart — pass it to `defineChart`, or spread it and extend. */
export function radarChart<TDatum>(
  data: readonly TDatum[],
  options: RadarChartOptions<TDatum>,
) {
  const { rows, names } = chartSeries(data, options)
  const categories = [...new Set(rows.map((row) => row.x))]
  const observed = rows.reduce((max, row) => Math.max(max, row.y ?? 0), 0)

  const grid = options.grid ?? true
  const spokes = options.spokes ?? grid
  const axes = options.axes ?? true
  const shape = options.gridShape ?? "polygon"
  const ticks = options.gridTicks ?? 4
  const fill = options.fill ?? 0.6
  const detail = axes && options.axisDetail !== undefined

  const build = (defaults: ChartDefaults) => {
    const dash = chartLook(defaults).gridDash
    const legend =
      options.legend ?? (defaults.legend !== "off" && names.length > 1)
    const guides: PolarGuide[] = []
    if (options.gridFill !== undefined) {
      guides.push(
        gridFillGuide(
          shape,
          options.gridFillColor ?? chartColor(0),
          options.gridFill,
        ),
      )
    }
    if (grid) {
      guides.push(
        radialGrid({ ticks, shape, labels: false, strokeDasharray: dash }),
      )
    }
    if (spokes || axes) {
      guides.push(
        angleGrid({
          labels: axes,
          // Spokes and circumference labels are one guide.
          strokeOpacity: spokes ? undefined : 0,
          strokeDasharray: dash,
          format: options.formatX,
          labelDx,
          labelDy: labelDy(detail ? LABEL_LINE : 0),
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
          labelDy: labelDy(-LABEL_LINE),
          labelFill: "var(--color-fg-muted)",
        }),
      )
    }

    const channels = {
      angle: "x",
      radius: "y",
      color: "series",
      key: "key",
    } as const
    const marks: AnyPolarMark[] = [
      ...(fill > 0
        ? [
            radialArea(rows, {
              ...channels,
              id: "radar-area",
              radius1: 0,
              curve: curveLinearClosed,
              fillOpacity: fill,
            }),
          ]
        : []),
      radialLine(rows, {
        ...channels,
        id: "radar-line",
        curve: curveLinearClosed,
        strokeWidth: options.strokeWidth ?? 1.5,
      }),
      ...(options.points
        ? // The line already carries each point's focus.
          [
            polarDecorative(
              radialDot(rows, { ...channels, id: "radar-dot", r: 4 }),
            ),
          ]
        : []),
      ...(options.marks ?? []),
    ]

    return [
      polar({
        // The category labels sit outside the circle: a legend needs the room.
        radiusRatio: options.radiusRatio ?? (legend ? 0.68 : 0.78),
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
        marks,
      }),
    ] as const
  }

  const formatX = options.formatX ?? String
  return {
    scales: { x: null, y: null },
    color: chartColorScale(names, options.legend),
    marks: chartMarks(build),
    // Two spokes can share a scene x; group by the nearest ray instead.
    focus: focusGroupAngle,
    tooltip: {
      use: tooltip,
      content: (
        points: readonly ChartPoint[],
        context: ChartTooltipContentContext,
      ) => ({
        title: points[0] && formatX(points[0].xValue),
        rows: points.map((point) => ({
          label: point.groupLabel,
          value: (options.formatY ?? context.formatY)(point.yValue),
          color: point.color,
        })),
      }),
    },
  }
}
