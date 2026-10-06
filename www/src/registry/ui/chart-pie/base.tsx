"use client"

import type {
  ChannelField,
  ChartKey,
  ChartPoint,
  ChartTooltipContentContext,
} from "@tanstack/charts"
import type { PieDatum, PolarMark } from "@tanstack/charts/polar"
import { pie, polar, radialArc, radialText } from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip } from "@tanstack/charts/tooltip"

import type { ChartField, ChartFormat } from "@/registry/ui/chart"
import { chartLegend, polarDecorative } from "@/registry/ui/chart"

const TAU = Math.PI * 2

// oxlint-disable-next-line no-explicit-any
type AnyPolarMark = PolarMark<any, any, any, any, any>

/** A slice: your row plus its laid-out `value` and angles. */
export type PieSlice<TDatum extends object> = PieDatum<TDatum>

export interface PieRingOptions<TDatum extends object> {
  /** Field holding the slice size. */
  value: ChannelField<TDatum, number | null | undefined>
  /** Field naming each slice — its color and its legend entry. */
  name: ChartField<TDatum, ChartKey>
  /** Display names for slice keys. */
  labels?: Readonly<Record<string, string>>
  /** Scopes the ring's mark ids when a chart draws several rings. @default "pie" */
  id?: string
  /** Hole radius, as a share of the chart radius. @default 0 */
  innerRadius?: number
  /** @default 1 */
  outerRadius?: number
  /** Radians, clockwise from twelve o'clock. @default 0 */
  startAngle?: number
  /** @default 2π */
  endAngle?: number
  /** Gap between slices, in radians. */
  padAngle?: number
  cornerRadius?: number
  /** The line between slices; the surface color by default. */
  stroke?: string
  /** @default 2 */
  strokeWidth?: number
  /** A slice pushed out of the ring. */
  activeIndex?: number
  /** How far the active slice grows, as a share of the radius. @default 0.08 */
  activeOffset?: number
  /** Text drawn on each slice. */
  sliceLabel?: "name" | "value"
  /** Where slice labels sit, as a share of the radius. @default the ring's middle */
  sliceLabelRadius?: number
  sliceLabelFill?: string
  /** @default 12 */
  sliceLabelFontSize?: number
  /** Formats slice values in labels and the tooltip. */
  formatValue?: ChartFormat
}

function nameReader<TDatum extends object>(
  options: Pick<PieRingOptions<TDatum>, "name" | "labels">,
) {
  const { name, labels } = options
  // Slices are rows plus their layout, so this reads either.
  return (row: object) => {
    const source = row as TDatum
    const key = String(
      typeof name === "function" ? name(source) : source[name as keyof TDatum],
    )
    return labels?.[key] ?? key
  }
}

/** One ring of slices — its arcs, the active slice, and the slice labels. */
export function pieRing<TDatum extends object>(
  data: readonly TDatum[],
  options: PieRingOptions<TDatum>,
): AnyPolarMark[] {
  const id = options.id ?? "pie"
  const slices = pie(data, {
    value: options.value,
    startAngle: options.startAngle ?? 0,
    endAngle: options.endAngle ?? TAU,
    gapAngle: options.padAngle,
  })
  const nameOf = nameReader(options)
  const inner = options.innerRadius ?? 0
  const outer = options.outerRadius ?? 1
  const arc = {
    key: nameOf,
    color: nameOf,
    innerRadius: ({ radius }: { radius: number }) => radius * inner,
    cornerRadius: options.cornerRadius,
    stroke: options.stroke ?? "var(--surface-bg,var(--color-bg))",
    strokeWidth: options.strokeWidth ?? 2,
  }
  const marks: AnyPolarMark[] = [
    radialArc(slices, {
      ...arc,
      id: `${id}-arc`,
      outerRadius: ({ radius }) => radius * outer,
    }),
  ]
  const active =
    options.activeIndex === undefined ? undefined : slices[options.activeIndex]
  if (active !== undefined) {
    const grow = options.activeOffset ?? 0.08
    marks.push(
      polarDecorative(
        radialArc([active], {
          ...arc,
          id: `${id}-active`,
          outerRadius: ({ radius }) => radius * (outer + grow),
        }),
      ),
    )
  }
  if (options.sliceLabel !== undefined) {
    const format = options.formatValue ?? ((value) => value.toLocaleString())
    const at = options.sliceLabelRadius ?? (inner + outer) / 2
    marks.push(
      polarDecorative(
        radialText(slices, {
          id: `${id}-label`,
          angle: (slice) => slice.angle,
          radius: () => at,
          text: (slice) =>
            options.sliceLabel === "name" ? nameOf(slice) : format(slice.value),
          fill: options.sliceLabelFill ?? "var(--color-fg)",
          fontSize: options.sliceLabelFontSize ?? 12,
        }),
      ),
    )
  }
  return marks
}

/* A configured polar scale that no mark reads is rejected, so the identity
   scales exist only when a layer maps through them — slice labels do, bare
   arcs don't. */
function bindsScales(marks: readonly AnyPolarMark[]) {
  return marks.some((mark) => {
    const probed = mark.initialize({ markIndex: 0, parentId: "probe" })
    return Boolean(
      probed.angleScale ??
      probed.radiusScale ??
      (probed.requiresAngleScale || probed.requiresRadiusScale),
    )
  })
}

export interface PieChartOptions<
  TDatum extends object,
> extends PieRingOptions<TDatum> {
  /** A color legend below the pie. */
  legend?: boolean
  /** Share of the available radius the pie fills. @default 0.9 */
  radiusRatio?: number
  /** Pixels kept clear around the pie. */
  inset?: number
  /** More polar layers drawn over the ring — another ring, labels. */
  marks?: readonly AnyPolarMark[]
}

/** A complete pie or donut chart — pass it to `defineChart`, or spread it and extend. */
export function pieChart<TDatum extends object>(
  data: readonly TDatum[],
  options: PieChartOptions<TDatum>,
) {
  const nameOf = nameReader(options)
  const startAngle = options.startAngle ?? 0
  const endAngle = options.endAngle ?? TAU
  const marks = [...pieRing(data, options), ...(options.marks ?? [])]
  return {
    scales: { x: null, y: null },
    color: {
      domain: [...new Set(data.map(nameOf))],
      legend: options.legend ? chartLegend() : undefined,
    },
    marks: [
      polar({
        scales: bindsScales(marks)
          ? {
              angle: { scale: scaleLinear().domain([startAngle, endAngle]) },
              radius: { scale: scaleLinear().domain([0, 1]) },
            }
          : { angle: null, radius: null },
        startAngle,
        endAngle,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? 0.9,
        marks,
      }),
    ],
    // A slice's x value is its angle: only nearest focus reads right.
    focus: "nearest" as const,
    tooltip: {
      use: tooltip,
      anchor: "point" as const,
      content: (
        points: readonly ChartPoint[],
        context: ChartTooltipContentContext,
      ) => ({
        // Points from layers added through `marks` aren't slices.
        rows: points.map((point) => {
          if (!point.markId.endsWith("-arc")) {
            return {
              label: point.groupLabel,
              value: context.formatY(point.yValue),
              color: point.color,
            }
          }
          const slice = point.datum as PieSlice<TDatum>
          return {
            label: nameOf(slice),
            value: (options.formatValue ?? context.formatY)(slice.value),
            color: point.color,
          }
        }),
      }),
    },
  }
}
