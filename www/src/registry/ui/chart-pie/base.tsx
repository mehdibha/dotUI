"use client"

import type {
  ChannelField,
  ChartBuildContext,
  ChartKey,
} from "@tanstack/charts"
import type { PieDatum } from "@tanstack/charts/polar"
import { pie, polar, radialArc, radialText } from "@tanstack/charts/polar"
import { scaleLinear } from "d3-scale"

import type {
  ChartComponentProps,
  ChartSpec,
  ChartTooltipContentOf,
  PolarMarkLayer,
} from "@/registry/ui/chart"
import {
  Chart,
  CHART_THEME,
  chartLegend,
  decorative,
  orderSeries,
  polarMarksBindScales,
  useChartDefinition,
} from "@/registry/ui/chart"

const TAU = Math.PI * 2

// Radii are ratios of the resolved layout radius, never pixels.
const pieDefaults = {
  radiusRatio: 0.9,
  innerRadius: 0,
  outerRadius: 1,
  activeOffset: 0.08,
  stroke: "var(--color-bg)",
  strokeWidth: 2,
  labelFontSize: 12,
} as const

/** What the arcs are laid out from, and what a focus point's `datum` is. */
export type PieSlice<TDatum extends object> = PieDatum<TDatum>

export interface PieRingOptions<TDatum extends object> {
  /** Scopes the ring's mark ids — unique per ring. */
  id: string
  data: readonly TDatum[]
  /** Field holding the slice magnitude. */
  value: ChannelField<TDatum, number | null | undefined>
  /** Field holding the slice key. */
  name: ChannelField<TDatum, ChartKey>
  labels?: Readonly<Record<string, string>>
  innerRadius?: number
  outerRadius?: number
  startAngle?: number
  endAngle?: number
  padAngle?: number
  cornerRadius?: number
  /** Stroke painted between slices; the page background by default. */
  stroke?: string
  strokeWidth?: number
  /** Index of the slice pushed out of the ring. */
  activeIndex?: number
  activeOffset?: number
  sliceLabel?: "none" | "name" | "value"
  sliceLabelRadius?: number
  sliceLabelFill?: string
  sliceLabelFontSize?: number
}

function sliceName(
  name: string,
  labels: Readonly<Record<string, string>> | undefined,
) {
  return (slice: object) => {
    const key = String((slice as Record<string, unknown>)[name])
    return labels?.[key] ?? key
  }
}

/** One concentric ring: its arcs, the pushed-out active slice, and its labels. */
export function pieRing<TDatum extends object>(
  options: PieRingOptions<TDatum>,
): readonly PolarMarkLayer[] {
  const slices = pie(options.data, {
    value: options.value,
    startAngle: options.startAngle ?? 0,
    endAngle: options.endAngle ?? TAU,
    gapAngle: options.padAngle,
  })
  const nameOf = sliceName(options.name, options.labels)
  const inner = options.innerRadius ?? pieDefaults.innerRadius
  const outer = options.outerRadius ?? pieDefaults.outerRadius
  const arc = {
    key: nameOf,
    z: nameOf,
    color: nameOf,
    innerRadius: ({ radius }: { radius: number }) => radius * inner,
    cornerRadius: options.cornerRadius,
    stroke: options.stroke ?? pieDefaults.stroke,
    strokeWidth: options.strokeWidth ?? pieDefaults.strokeWidth,
  }
  const marks: PolarMarkLayer[] = [
    radialArc(slices, {
      id: `${options.id}-arc`,
      ...arc,
      outerRadius: ({ radius }) => radius * outer,
    }),
  ]
  const active =
    options.activeIndex === undefined ? undefined : slices[options.activeIndex]
  if (active !== undefined) {
    const grow = options.activeOffset ?? pieDefaults.activeOffset
    marks.push(
      decorative(
        radialArc([active], {
          id: `${options.id}-active`,
          ...arc,
          outerRadius: ({ radius }) => radius * (outer + grow),
        }),
      ),
    )
  }
  const kind = options.sliceLabel ?? "none"
  if (kind !== "none") {
    const at = options.sliceLabelRadius ?? (inner + outer) / 2
    marks.push(
      decorative(
        radialText(slices, {
          id: `${options.id}-label`,
          angle: (slice) => slice.angle,
          radius: () => at,
          text: (slice) =>
            kind === "name" ? nameOf(slice) : String(slice.value),
          fill: options.sliceLabelFill ?? "var(--color-fg)",
          fontSize: options.sliceLabelFontSize ?? pieDefaults.labelFontSize,
        }),
      ),
    )
  }
  return marks
}

export interface PieChartSpecOptions<TDatum extends object> extends Omit<
  PieRingOptions<TDatum>,
  "id"
> {
  legend?: boolean
  /** Leading slice order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]
  /** Share of the available radius the ring may use. */
  radiusRatio?: number
  /** Pixel inset applied before `radiusRatio`. */
  inset?: number
  /** Extra polar mark layers painted over the ring. */
  polarMarks?: readonly PolarMarkLayer[]
}

export function pieChartSpec<TDatum extends object>(
  options: PieChartSpecOptions<TDatum>,
  _ctx: ChartBuildContext,
): ChartSpec<PieSlice<TDatum>> {
  const nameOf = sliceName(options.name, options.labels)
  const order = orderSeries(
    options.seriesOrder?.map((key) => options.labels?.[key] ?? key) ?? [],
    options.data.map(nameOf),
  )
  const startAngle = options.startAngle ?? 0
  const endAngle = options.endAngle ?? TAU
  const marks = [
    ...pieRing({ ...options, id: "pie" }),
    ...(options.polarMarks ?? []),
  ]
  // Slice labels map through the container scales; bare arcs bind none.
  const bound =
    (options.sliceLabel ?? "none") !== "none" ||
    polarMarksBindScales(options.polarMarks)
  return {
    scales: { x: null, y: null },
    color: {
      domain: order,
      legend: options.legend ? chartLegend() : undefined,
    },
    theme: CHART_THEME,
    marks: [
      polar({
        scales: bound
          ? {
              angle: { scale: scaleLinear().domain([startAngle, endAngle]) },
              radius: { scale: scaleLinear().domain([0, 1]) },
            }
          : { angle: null, radius: null },
        startAngle,
        endAngle,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? pieDefaults.radiusRatio,
        marks,
      }),
    ],
  }
}

// oxlint-disable-next-line no-explicit-any
const pieTooltip: ChartTooltipContentOf<PieChartSpecOptions<any>> = (
  points,
  _context,
  options,
) => {
  const nameOf = sliceName(options.name, options.labels)
  return {
    rows: points.map((point) => {
      const slice = point.datum as PieSlice<object>
      return {
        label: nameOf(slice),
        value: slice.value.toLocaleString(),
        color: point.color,
      }
    }),
  }
}

export type PieChartProps<TDatum extends object> = ChartComponentProps<
  PieChartSpecOptions<TDatum>,
  PieSlice<TDatum>
>

export function PieChart<TDatum extends object>(props: PieChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    PieSlice<TDatum>,
    PieChartSpecOptions<TDatum>
  >(props, pieChartSpec, {
    // A slice's x value is its mid-angle, so only nearest focus reads right.
    focus: "nearest",
    tooltipAnchor: "point",
    tooltipContent: pieTooltip,
  })
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
