"use client"

import type {
  ChannelField,
  ChartBuildContext,
  ChartKey,
} from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import type { PolarMark } from "@tanstack/charts/polar"
import { polar, radialArc, radialText } from "@tanstack/charts/polar"
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip"
import { scaleLinear } from "d3-scale"
import { arc as d3Arc, pie as d3Pie } from "d3-shape"

import type { ChartComponentProps, ChartSpecOf } from "@/registry/ui/chart"
import {
  Chart,
  CHART_THEME,
  decorative,
  finiteOrNull,
  useChartDefinition,
} from "@/registry/ui/chart"

const TAU = Math.PI * 2

/* Polar geometry has no home in core `chartDefaults` yet — one list here
   rather than literals scattered through the builder. Radii are ratios of the
   resolved layout radius, never pixels. */
const pieDefaults = {
  radiusRatio: 0.9,
  innerRadius: 0,
  outerRadius: 1,
  padAngle: 0,
  cornerRadius: 0,
  activeOffset: 0.08,
  labelFontSize: 12,
} as const

/** Mark layers spliced inside the polar container — cartesian marks would land outside it. */
// oxlint-disable-next-line no-explicit-any
export type PolarMarkLayer = PolarMark<any, any, any>

/** What d3.pie lays out, and what a focus point's `datum` actually is. */
export interface PieSlice<TDatum> {
  /** The row this slice was laid out from. */
  datum: TDatum
  name: string
  value: number
  startAngle: number
  endAngle: number
  padAngle: number
  midAngle: number
}

export interface PieRingOptions<TDatum> {
  /** Scopes the ring's mark ids — unique per ring. */
  id: string
  data: readonly TDatum[]
  /** Field holding the slice magnitude. */
  value: ChannelField<TDatum, number>
  /** Field holding the slice key. */
  name: ChannelField<TDatum, ChartKey>
  labels?: Readonly<Record<string, string>>
  innerRadius?: number
  outerRadius?: number
  startAngle?: number
  endAngle?: number
  padAngle?: number
  cornerRadius?: number
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

function sliceRows<TDatum>(
  options: PieRingOptions<TDatum>,
): PieSlice<TDatum>[] {
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const layout = d3Pie<TDatum>()
    .sort(null)
    /* A non-finite magnitude would poison the whole layout, not just its own
       slice: d3.pie divides by the total. */
    .value((row) => finiteOrNull(row[options.value as keyof TDatum]) ?? 0)
    .startAngle(options.startAngle ?? 0)
    .endAngle(options.endAngle ?? TAU)
    .padAngle(options.padAngle ?? pieDefaults.padAngle)
  return layout(options.data as TDatum[]).map((slice) => ({
    datum: slice.data,
    name: labelOf(String(slice.data[options.name as keyof TDatum])),
    value: slice.value,
    startAngle: slice.startAngle,
    endAngle: slice.endAngle,
    padAngle: slice.padAngle,
    midAngle: (slice.startAngle + slice.endAngle) / 2,
  }))
}

/** One concentric ring: its arcs, plus its slice labels. */
export function pieRing<TDatum>(
  options: PieRingOptions<TDatum>,
): readonly PolarMarkLayer[] {
  const slices = sliceRows(options)
  const inner = options.innerRadius ?? pieDefaults.innerRadius
  const outer = options.outerRadius ?? pieDefaults.outerRadius
  const corner = options.cornerRadius ?? pieDefaults.cornerRadius
  const active = options.activeIndex
  const grow =
    active === undefined
      ? 0
      : (options.activeOffset ?? pieDefaults.activeOffset)
  const marks: PolarMarkLayer[] = [
    radialArc(slices, {
      id: `${options.id}-arc`,
      startAngle: "startAngle",
      endAngle: "endAngle",
      padAngle: "padAngle",
      cornerRadius: corner,
      color: (slice: PieSlice<TDatum>) => slice.name,
      key: (slice: PieSlice<TDatum>) => `${options.id}:${slice.name}`,
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
      /* `innerRadius`/`outerRadius` are per-mark lengths, not channels, so a
         per-slice radius is only reachable through the arc generator. */
      generator: ({ radius }) =>
        d3Arc<PieSlice<TDatum>>()
          .startAngle((slice) => slice.startAngle)
          .endAngle((slice) => slice.endAngle)
          .padAngle((slice) => slice.padAngle)
          .innerRadius(radius * inner)
          .outerRadius((_slice, index) =>
            index === active ? radius * (outer + grow) : radius * outer,
          )
          .cornerRadius(corner),
    }),
  ]
  const kind = options.sliceLabel ?? "none"
  if (kind !== "none") {
    const at = options.sliceLabelRadius ?? (inner + outer) / 2
    marks.push(
      decorative(
        radialText(slices, {
          id: `${options.id}-label`,
          angle: "midAngle",
          radius: () => at,
          text: (slice: PieSlice<TDatum>) =>
            kind === "name" ? slice.name : String(slice.value),
          fill: options.sliceLabelFill ?? "var(--color-fg)",
          fontSize: options.sliceLabelFontSize ?? pieDefaults.labelFontSize,
        }),
      ),
    )
  }
  return marks
}

export interface PieChartSpecOptions<TDatum> extends Omit<
  PieRingOptions<TDatum>,
  "id"
> {
  /** Show the color legend. */
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

/* `radialText` requires angle and radius scales even where the geometry comes
   from raw radians, so the container carries identity ones. */
function identityScales(startAngle: number, endAngle: number) {
  return {
    angle: { scale: scaleLinear().domain([startAngle, endAngle]) },
    radius: { scale: scaleLinear().domain([0, 1]) },
  }
}

export function pieChartSpec<TDatum>(
  options: PieChartSpecOptions<TDatum>,
  _ctx: ChartBuildContext,
): ChartSpecOf<PieSlice<TDatum>, number> {
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const leading = options.seriesOrder?.map(labelOf) ?? []
  const listed = new Set(leading)
  const found = options.data.map((row) =>
    labelOf(String(row[options.name as keyof TDatum])),
  )
  /* `seriesOrder` leads; slices it omits follow in data order, so the color
     domain covers every slice and the legend never hides one. */
  const order = [
    ...leading,
    ...new Set(found.filter((name) => !listed.has(name))),
  ]
  const startAngle = options.startAngle ?? 0
  const endAngle = options.endAngle ?? TAU
  return {
    // A pie has no axes: its scales live on the polar container.
    x: null,
    y: null,
    color: {
      domain: order,
      legend: (options.legend ?? false) ? colorLegend() : undefined,
    },
    theme: CHART_THEME,
    marks: [
      polar({
        ...identityScales(startAngle, endAngle),
        startAngle,
        endAngle,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? pieDefaults.radiusRatio,
        marks: [
          ...pieRing({ ...options, id: "pie" }),
          ...(options.polarMarks ?? []),
        ],
      }),
    ],
  }
}

/* The library's default tooltip body prints the scale values, which on a polar
   chart are radians and pixel radii — every polar family supplies its own. */
function pieTooltipBody({
  points,
}: ChartTooltipBodyRenderContext<PieSlice<unknown>, number, number>) {
  return (
    <div className="grid gap-1">
      {points.map((point) => (
        <div key={point.key} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-xs"
            style={{ background: point.color }}
          />
          <span>{point.datum.name}</span>
          <span className="ml-3 flex-1 text-right tabular-nums">
            {String(point.datum.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export type PieChartProps<TDatum> = ChartComponentProps<
  PieChartSpecOptions<TDatum>,
  PieSlice<TDatum>,
  number
>

export function PieChart<TDatum>(props: PieChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    PieSlice<TDatum>,
    number,
    PieChartSpecOptions<TDatum>
  >(
    {
      ...props,
      /* The cartesian presets in `chartDefaults` do not fit slices: a slice's
         x value is its mid-angle in radians, so only `nearest` and a point
         anchor read right. */
      focus: props.focus ?? "nearest",
      tooltipAnchor: props.tooltipAnchor ?? "point",
      renderTooltipBody: props.renderTooltipBody ?? pieTooltipBody,
      /* The polar mark arrays serialize into the structural key — mark objects
         key by function identity — and alias into the reference-compared
         `marks` slots. */
      marks: props.polarMarks,
    },
    pieChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
