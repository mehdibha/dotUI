'use client'

import type {
  ChannelField,
  ChartBuildContext,
  ChartKey,
} from '@tanstack/charts'
import { colorLegend } from '@tanstack/charts/legend'
import type { PolarGuide, PolarMark } from '@tanstack/charts/polar'
import {
  polar,
  radialArc,
  radialGrid,
  radialText,
} from '@tanstack/charts/polar'
import type { ChartTooltipBodyRenderContext } from '@tanstack/react-charts'
import { scaleLinear } from 'd3-scale'
import { arc as d3arc } from 'd3-shape'

import type {
  ChartComponentProps,
  ChartMarkLayer,
  ChartSpecOf,
} from '@/registry/ui/chart'
import {
  Chart,
  CHART_THEME,
  chartDefaults,
  useChartDefinition,
} from '@/registry/ui/chart'

const TAU = Math.PI * 2

/** A polar mark layer — what `polarMarks` and `polarMarksBefore` accept. */
// oxlint-disable-next-line no-explicit-any
export type PolarMarkLayer = PolarMark<any, any, any>

/* Geometry the radial family owns; everything shared with the other chart
   families is read from `chartDefaults`. */
const radialDefaults = {
  innerRadius: 0.35,
  outerRadius: 1,
  barPadding: 0.2,
  stackPadding: 0.04,
  gridTicks: 4,
  trackFill: 'var(--color-muted)',
  labelFontSize: 11,
} as const

/**
 * What every arc, label and focus callback carries: the resolved geometry plus
 * the row it came from.
 */
export interface RadialBarDatum<TDatum> {
  /** The row this arc was built from. */
  datum: TDatum
  /** Display name, after `labels`. */
  name: string
  value: number
  startAngle: number
  endAngle: number
  /** Ratios of the resolved layout radius. */
  inner: number
  outer: number
}

export interface RadialBarChartSpecOptions<TDatum> {
  data: readonly TDatum[]
  /** One field draws a ring per row; an array stacks the first row's fields. */
  value: ChannelField<TDatum, number> | readonly ChannelField<TDatum, number>[]
  /** Field naming each ring. */
  name: ChannelField<TDatum, ChartKey>
  /** Display names for ring keys. */
  labels?: Readonly<Record<string, string>>
  /** Angular sweep in radians. Defaults to a full turn. */
  startAngle?: number
  endAngle?: number
  /** Ratios of the resolved layout radius. */
  innerRadius?: number
  outerRadius?: number
  /** Gap between rings, as a share of a ring's thickness. */
  barPadding?: number
  cornerRadius?: number
  /** Draw an unfilled arc behind every ring. */
  track?: boolean
  trackFill?: string
  /** Value that fills the whole sweep. Defaults to the largest value. */
  max?: number
  /** Concentric rings behind the bars. */
  grid?: boolean
  gridTicks?: number
  /** Print each ring's name at the start of its arc. */
  barLabels?: boolean
  barLabelFill?: string
  barLabelFontSize?: number
  legend?: boolean
  /** Shrinks the circle inside its box. */
  radiusRatio?: number
  /** Pixel inset applied before `radiusRatio`. */
  inset?: number
  /** Polar mark layers painted under the bars. */
  polarMarksBefore?: readonly PolarMarkLayer[]
  /** Polar mark layers painted over the bars. */
  polarMarks?: readonly PolarMarkLayer[]
}

function read(row: unknown, field: string): number {
  return Number((row as Record<string, unknown>)[field] ?? 0)
}

interface RadialBars<TDatum> {
  bars: RadialBarDatum<TDatum>[]
  track: RadialBarDatum<TDatum>[]
}

/* Bars are laid out here rather than by a scale: a ring's radii are per-datum,
   and the library exposes those only through the arc generator. */
function radialBars<TDatum>(
  options: RadialBarChartSpecOptions<TDatum>,
  start: number,
  end: number,
): RadialBars<TDatum> {
  const label = (key: string) => options.labels?.[key] ?? key
  const inner = options.innerRadius ?? radialDefaults.innerRadius
  const outer = options.outerRadius ?? radialDefaults.outerRadius
  const bars: RadialBarDatum<TDatum>[] = []
  const track: RadialBarDatum<TDatum>[] = []

  if (Array.isArray(options.value)) {
    // One ring, cumulative angles — segments stack around the sweep.
    const fields = options.value as readonly string[]
    const row = options.data[0] as TDatum
    const values = fields.map((field) => read(row, field))
    const max = options.max ?? values.reduce((sum, value) => sum + value, 0)
    const gap =
      (options.barPadding ?? radialDefaults.stackPadding) * (outer - inner)
    let cursor = start
    fields.forEach((field, index) => {
      const value = values[index] ?? 0
      const span = (value / (max || 1)) * (end - start)
      bars.push({
        datum: row,
        name: label(field),
        value,
        startAngle: cursor,
        endAngle: cursor + span,
        inner: inner + gap * index,
        outer: outer - gap * (fields.length - 1 - index),
      })
      cursor += span
    })
    return { bars, track }
  }

  const field = options.value as string
  const values = options.data.map((row) => read(row, field))
  const max = options.max ?? (Math.max(...values, 0) || 1)
  const count = options.data.length
  const band = (outer - inner) / Math.max(1, count)
  const pad = band * (options.barPadding ?? radialDefaults.barPadding)
  options.data.forEach((datum, index) => {
    // Outermost row first, so ring order matches the data order.
    const slot = count - 1 - index
    const value = values[index] ?? 0
    const geometry = {
      datum,
      name: label(String((datum as Record<string, unknown>)[options.name])),
      value,
      inner: inner + slot * band + pad / 2,
      outer: inner + (slot + 1) * band - pad / 2,
    }
    bars.push({
      ...geometry,
      startAngle: start,
      endAngle: start + (value / max) * (end - start),
    })
    track.push({ ...geometry, startAngle: start, endAngle: end })
  })
  return { bars, track }
}

function barArc<TDatum>(
  id: string,
  rows: readonly RadialBarDatum<TDatum>[],
  cornerRadius: number,
  fill?: string,
) {
  return radialArc(rows, {
    id,
    cornerRadius,
    fill,
    color: (bar: RadialBarDatum<TDatum>) => bar.name,
    key: (bar: RadialBarDatum<TDatum>) => `${id}:${bar.name}`,
    generator: ({ radius }) =>
      d3arc<RadialBarDatum<TDatum>>()
        .startAngle((bar) => bar.startAngle)
        .endAngle((bar) => bar.endAngle)
        .padAngle(() => 0)
        .innerRadius((bar) => bar.inner * radius)
        .outerRadius((bar) => bar.outer * radius)
        .cornerRadius(cornerRadius),
  })
}

export function radialBarChartSpec<TDatum>(
  options: RadialBarChartSpecOptions<TDatum>,
  _ctx: ChartBuildContext,
): ChartSpecOf<RadialBarDatum<TDatum>, number> {
  const start = options.startAngle ?? 0
  const end = options.endAngle ?? TAU
  const { bars, track } = radialBars(options, start, end)
  const corner = options.cornerRadius ?? chartDefaults.barRadius
  const legend = (options.legend ?? false) ? colorLegend() : undefined
  const guides: PolarGuide[] = options.grid
    ? [
        radialGrid({
          ticks: options.gridTicks ?? radialDefaults.gridTicks,
          shape: 'circle',
          labels: false,
        }),
      ]
    : []
  return {
    x: null,
    y: null,
    color: { domain: bars.map((bar) => bar.name), legend },
    theme: CHART_THEME,
    marks: [
      polar({
        startAngle: start,
        endAngle: end,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? 1,
        /* Arcs carry their own radians and radius ratios, but `radialGrid` and
           `radialText` refuse to render without scales — identity ones keep
           the mapping honest. */
        angle: { scale: scaleLinear().domain([start, end]) },
        radius: { scale: scaleLinear().domain([0, 1]) },
        guides,
        marks: [
          ...(options.polarMarksBefore ?? []),
          ...(options.track && track.length > 0
            ? [
                barArc(
                  'radial-track',
                  track,
                  corner,
                  options.trackFill ?? radialDefaults.trackFill,
                ),
              ]
            : []),
          barArc('radial-bar', bars, corner),
          ...(options.barLabels
            ? [
                radialText(bars, {
                  id: 'radial-bar-label',
                  angle: 'startAngle',
                  radius: (bar: RadialBarDatum<TDatum>) =>
                    (bar.inner + bar.outer) / 2,
                  text: 'name',
                  anchor: 'start' as const,
                  dx: 8,
                  fill: options.barLabelFill ?? 'var(--color-fg-muted)',
                  fontSize:
                    options.barLabelFontSize ?? radialDefaults.labelFontSize,
                }),
              ]
            : []),
          ...(options.polarMarks ?? []),
        ],
      }) as ChartMarkLayer,
    ],
  }
}

/* The library's default tooltip body prints the scale values, which on a polar
   chart are radians and pixel radii — every polar family supplies its own. */
function radialTooltipBody({
  points,
}: ChartTooltipBodyRenderContext<RadialBarDatum<unknown>, number, number>) {
  return points.map((point) => (
    <div key={point.key} className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-xs"
        style={{ background: point.color }}
      />
      <span>{point.datum.name}</span>
      <span className="ml-auto font-medium tabular-nums">
        {point.datum.value.toLocaleString()}
      </span>
    </div>
  ))
}

/* Applied under the caller's props. The focus and anchor presets in
   `chartDefaults` are cartesian, and animation stays off because the `d` tween
   interpolates the SVG large-arc flag: an arc crossing half a turn renders an
   invalid path for the length of the transition. */
const radialBehavior = {
  focus: 'nearest',
  tooltipAnchor: 'point',
  animate: false,
  renderTooltipBody: radialTooltipBody,
} as const

export type RadialBarChartProps<TDatum> = ChartComponentProps<
  RadialBarChartSpecOptions<TDatum>,
  RadialBarDatum<TDatum>,
  number
>

export function RadialBarChart<TDatum>(props: RadialBarChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    RadialBarDatum<TDatum>,
    number,
    RadialBarChartSpecOptions<TDatum>
  >(
    {
      ...radialBehavior,
      ...props,
      // Ride the identity-compared keys — polar mark arrays serialize alike.
      marks: props.polarMarks,
      marksBefore: props.polarMarksBefore,
    },
    radialBarChartSpec,
  )
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}
