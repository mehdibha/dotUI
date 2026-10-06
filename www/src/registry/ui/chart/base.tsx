"use client"

import type { ReactNode } from "react"
import { useMemo } from "react"
import type {
  ChannelField,
  ChartAxisOptions,
  ChartKey,
  ChartMotionDefinition,
  ChartPoint,
  ChartTheme,
  ChartTooltipContent,
  ChartTooltipContentContext,
  ChartTooltipInput,
  ChartTooltipOptions,
  ChartValue,
  DomChartDefinition,
  MarkScene,
} from "@tanstack/charts"
import { isResponsiveChartDefinition } from "@tanstack/charts"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend"
import { decorative } from "@tanstack/charts/mark/decorative"
import { motion, stagger } from "@tanstack/charts/motion"
import type { PolarMark } from "@tanstack/charts/polar"
import type { RendererChartCommonProps } from "@tanstack/charts/react/tooltip"
import { RendererChart } from "@tanstack/charts/react/tooltip"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"
import { portal } from "@tanstack/charts/tooltip/portal"
import { scaleUtc } from "d3-scale"
import { curveMonotoneX, curveNatural, curveStepAfter } from "d3-shape"

import { cn } from "@/registry/lib/utils"

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

/** The series colors, in slot order. The library's own theme has six. */
export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const

export function chartColor(index: number): string {
  return chartColors[index % chartColors.length] ?? chartColors[0]
}

export const chartTheme = {
  palette: chartColors,
  foreground: "var(--color-fg-muted)",
  muted: "var(--color-fg-muted)",
  grid: "var(--color-border)",
} satisfies Partial<ChartTheme>

export type ChartCurveName = "linear" | "natural" | "monotone" | "step"

export const chartCurves = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
} as const satisfies Record<ChartCurveName, unknown>

export type ChartFormat = (value: ChartValue) => string

/* ------------------------------------------------------------------ */
/* Series                                                              */
/* ------------------------------------------------------------------ */

/** A field name, or a function reading the value from a row. */
export type ChartField<TDatum, TValue> =
  | ChannelField<TDatum, TValue>
  | ((row: TDatum) => TValue)

export interface ChartSeriesOptions<TDatum> {
  /** Field holding the category or time value. */
  x: ChartField<TDatum, ChartValue | null | undefined>
  /** The value field, or one field per series when rows are wide. */
  y:
    | ChartField<TDatum, number | null | undefined>
    | readonly ChannelField<TDatum, number | null | undefined>[]
  /** Field naming each row's series, when rows are long. */
  series?: ChartField<TDatum, ChartKey | null | undefined>
  /** Display names for series keys, read by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>
  /** Series keys in color and stacking order; series it leaves out follow in data order. */
  order?: readonly string[]
  /** Stable row identity, so reordered or filtered rows move instead of respawning. */
  key?: ChartField<TDatum, ChartKey>
}

/** One plotted value: the source row, its position, and the series it belongs to. */
export interface ChartSeriesRow<TDatum> {
  x: ChartValue
  /** `null` is a gap, never a zero. */
  y: number | null
  series: string
  /** Identity within its series: the `key` option, or the x value. */
  key: ChartKey
  datum: TDatum
}

export interface ChartSeries<TDatum> {
  rows: readonly ChartSeriesRow<TDatum>[]
  /** Series names, in color-slot order. */
  names: readonly string[]
}

function read<TDatum, TValue>(
  row: TDatum,
  field: ChartField<TDatum, TValue>,
): TValue {
  return typeof field === "function"
    ? field(row)
    : (row[field as keyof TDatum] as TValue)
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

/* Wide rows (several `y` fields) and long rows (a `series` field) both come
   out as one row per value, so a single mark draws every series and the
   library's stack and group layouts apply. */
export function chartSeries<TDatum>(
  data: readonly TDatum[],
  options: ChartSeriesOptions<TDatum>,
): ChartSeries<TDatum> {
  const label = (key: string) => options.labels?.[key] ?? key
  const ordered = (keys: readonly string[]) => [
    ...new Set([
      ...(options.order ?? []).filter((key) => keys.includes(key)),
      ...keys,
    ]),
  ]
  const row = (
    datum: TDatum,
    y: unknown,
    series: string,
  ): ChartSeriesRow<TDatum> => {
    const x = read(datum, options.x) as ChartValue
    return {
      x,
      y: finite(y),
      series,
      key:
        options.key === undefined
          ? x instanceof Date
            ? +x
            : x
          : read(datum, options.key),
      datum,
    }
  }

  if (Array.isArray(options.y)) {
    const fields = ordered(options.y as readonly string[]) as (keyof TDatum &
      string)[]
    return {
      rows: data.flatMap((datum) =>
        fields.map((field) => row(datum, datum[field], label(field))),
      ),
      names: fields.map(label),
    }
  }

  const y = options.y as ChartField<TDatum, number | null | undefined>
  const { series } = options
  if (series === undefined) {
    const name = label(typeof y === "string" ? y : "value")
    return {
      rows: data.map((datum) => row(datum, read(datum, y), name)),
      names: [name],
    }
  }
  const keys = data.map((datum) => String(read(datum, series)))
  const rows = data.map((datum, index) =>
    row(datum, read(datum, y), label(keys[index] ?? "")),
  )
  return { rows, names: ordered([...new Set(keys)]).map(label) }
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

export type ChartScaleKind = "point" | "band" | "linear" | "time"

/* An axis format rides on the scale, so the tooltip reads it even when the
   axis is hidden. A symbol, so the library never sees it. */
const FORMAT = Symbol("chart-format")

const SCALES = {
  point: () => scalePoint(),
  band: () => scaleBand().paddingInner(0.2).paddingOuter(0.1),
  linear: scaleLinear,
  time: scaleUtc,
} satisfies Record<ChartScaleKind, ChartAxisOptions["scale"]>

/* No `viewport`: the spec checker only admits one on a continuous scale. */
// oxlint-disable-next-line no-explicit-any
export type ChartScale = Omit<ChartAxisOptions<any>, "viewport">

export interface ChartAxis extends Partial<ChartScale> {
  /** The scale family. Ignored when `scale` is set. */
  kind?: ChartScaleKind
  /** Formats the tick labels — and the tooltip values on this axis. */
  format?: ChartFormat
  /** Axis title. */
  label?: string
}

export interface ChartScalesOptions {
  /** @default "point" */
  x?: ChartScaleKind | ChartAxis
  /** @default "linear" */
  y?: ChartScaleKind | ChartAxis
  /** The axes to show. @default "x" */
  axes?: boolean | "x" | "y"
  /** The axis drawing gridlines. @default "y" */
  grid?: "x" | "y" | false
}

function chartAxis(
  input: ChartScaleKind | ChartAxis,
  fallback: ChartScaleKind,
  grid: boolean,
  visible: boolean,
): ChartScale {
  const {
    kind = fallback,
    format,
    label,
    ...rest
  } = typeof input === "string" ? { kind: input } : input
  return {
    scale: SCALES[kind],
    nice: kind === "linear" || kind === "time",
    grid,
    axis: visible && {
      ...(format && { ticks: { format } }),
      ...(label && { label }),
    },
    ...rest,
    ...(format && { [FORMAT]: format }),
  }
}

/** The x and y scales, with the axes and gridlines the house look shows. */
export function chartScales({
  x = "point",
  y = "linear",
  axes = "x",
  grid = "y",
}: ChartScalesOptions = {}): { x: ChartScale; y: ChartScale } {
  return {
    x: chartAxis(x, "point", grid === "x", axes === true || axes === "x"),
    y: chartAxis(y, "linear", grid === "y", axes === true || axes === "y"),
  }
}

export function chartLegend() {
  return colorLegend({
    placement: "bottom",
    items: colorLegendItems({
      justify: "center",
      gap: 16,
      indicator: { shape: "square", width: 8, height: 8, gap: 6 },
    }),
  })
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const CHART_MOTION: ChartMotionDefinition = {
  transition: { type: "spring", stiffness: 170, damping: 26 },
  // Lines and areas are single paths; dots and cells can number in the
  // hundreds.
  ...stagger({ each: 25, roles: ["arc", "bar"] }),
}

/* The library's tooltip surface defaults to UA `Canvas` colors and
   `system-ui`. The vars sit on the tooltip itself, so the portal can't
   detach them from the chart. */
const TOOLTIP_CLASS = [
  "[--ts-chart-tooltip-background:color-mix(in_oklab,var(--color-popover)_var(--popover-alpha),transparent)]",
  "[backdrop-filter:var(--popover-backdrop-filter)]",
  "[--ts-chart-tooltip-color:var(--color-fg)]",
  "[--ts-chart-tooltip-border:1px_solid_var(--overlay-border)]",
  "[--ts-chart-tooltip-border-radius:var(--studio-popover-radius)]",
  "[--ts-chart-tooltip-shadow:var(--shadow-popover,var(--shadow-md))]",
  "[--ts-chart-tooltip-font:500_0.75rem/1.3_var(--font-sans)]",
].join(" ")

interface AxisFormats {
  x?: ChartFormat
  y?: ChartFormat
}

type SpecLike = {
  scales?: Record<string, unknown>
  theme?: Partial<ChartTheme>
}

/* The house axis: no domain line, no tick marks, labels clear of the plot.
   The library paints the grid at 11% — the border token is already a
   hairline. */
function houseScale(entry: unknown): unknown {
  if (entry === null || typeof entry !== "object" || !("scale" in entry)) {
    return entry
  }
  const scale = entry as ChartScale
  const { grid, axis } = scale
  return {
    ...scale,
    grid:
      grid === true
        ? { strokeOpacity: 1 }
        : grid && { strokeOpacity: 1, ...grid },
    axis: axis !== false && {
      line: false,
      ...axis,
      ticks: axis?.ticks !== false && {
        size: 0,
        padding: 10,
        ...axis?.ticks,
      },
    },
  }
}

function tickFormat(entry: unknown): ChartFormat | undefined {
  if (entry === null || typeof entry !== "object") return undefined
  const { axis, [FORMAT]: format } = entry as ChartScale & {
    [FORMAT]?: ChartFormat
  }
  return (axis ? (axis.ticks || undefined)?.format : undefined) ?? format
}

function houseSpec<TSpec extends SpecLike>(
  spec: TSpec,
  formats: AxisFormats,
): TSpec {
  const scales = Object.fromEntries(
    Object.entries(spec.scales ?? {}).map(([id, entry]) => [
      id,
      houseScale(entry),
    ]),
  )
  formats.x = tickFormat(scales.x)
  formats.y = tickFormat(scales.y)
  return { ...spec, scales, theme: { ...chartTheme, ...spec.theme } }
}

function sameValue(left: ChartValue, right: ChartValue) {
  return left instanceof Date && right instanceof Date
    ? +left === +right
    : Object.is(left, right)
}

/* The value a point stands for: a stacked segment reports its own size. */
function pointValue(
  point: ChartPoint,
  axis: "x" | "y",
  format: (value: ChartValue) => string,
): string {
  const interval = axis === "x" ? point.xInterval : point.yInterval
  const start = axis === "x" ? point.x1Value : point.y1Value
  const end = axis === "x" ? point.x2Value : point.y2Value
  if (
    interval === "difference" &&
    typeof start === "number" &&
    typeof end === "number"
  ) {
    return format(end - start)
  }
  if (interval === "range" && start !== undefined && end !== undefined) {
    return `${format(start)}–${format(end)}`
  }
  return format(axis === "x" ? point.xValue : point.yValue)
}

/* Title from the category axis, one row per series. Values read the way the
   axes print them. */
export function chartTooltipContent(
  points: readonly ChartPoint[],
  context: ChartTooltipContentContext,
): ChartTooltipContent {
  const first = points[0]
  if (first === undefined) return { rows: [] }
  const byY =
    points.length > 1
      ? points.every((point) => sameValue(point.yValue, first.yValue)) &&
        !points.every((point) => sameValue(point.xValue, first.xValue))
      : typeof first.xValue === "number" && typeof first.yValue !== "number"
  const [titleAxis, valueAxis] = byY
    ? (["y", "x"] as const)
    : (["x", "y"] as const)
  const formatOf = (axis: "x" | "y") =>
    axis === "x" ? context.formatX : context.formatY
  return {
    title: formatOf(titleAxis)(titleAxis === "x" ? first.xValue : first.yValue),
    rows: points.map((point) => ({
      label: point.groupLabel,
      value: pointValue(point, valueAxis, formatOf(valueAxis)),
      color: point.color,
      active: points.length > 1 && point === context.primaryPoint,
    })),
  }
}

type TooltipCallbacks = Pick<
  ChartTooltipOptions,
  "content" | "format" | "formatGroup"
>

function houseTooltip(
  input: ChartTooltipInput<never, never, never, "dom"> | false | undefined,
  formats: AxisFormats,
) {
  if (input === false) return false
  const options = (
    input === undefined ? {} : "use" in input ? input : { use: input }
  ) as ChartTooltipOptions & TooltipCallbacks
  // Callbacks read values the way the axes print them.
  const withFormats = (context: ChartTooltipContentContext) => ({
    ...context,
    formatX: formats.x ?? context.formatX,
    formatY: formats.y ?? context.formatY,
  })
  const { content, format, formatGroup, items } = options
  const custom = format ?? formatGroup ?? items
  return {
    use: tooltip,
    anchor: "group-center",
    sort: "color-domain",
    portal,
    ...options,
    className: cn(TOOLTIP_CLASS, options.className),
    content:
      content || !custom
        ? (
            points: readonly ChartPoint[],
            context: ChartTooltipContentContext,
          ) => (content ?? chartTooltipContent)(points, withFormats(context))
        : undefined,
    format:
      format &&
      ((point: ChartPoint, context: ChartTooltipContentContext) =>
        format(point, withFormats(context))),
    formatGroup:
      formatGroup &&
      ((points: readonly ChartPoint[], context: ChartTooltipContentContext) =>
        formatGroup(points, withFormats(context))),
  }
}

/**
 * Fills in what a definition leaves unset — the theme, the axis look, focus,
 * keyboard, the tooltip and motion — and keeps everything it sets. Pure, so
 * any host can apply it; `<Chart>` does.
 */
export function withChartDefaults<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(
  definition: DomChartDefinition<TDatum, TXValue, TYValue>,
): DomChartDefinition<TDatum, TXValue, TYValue> {
  const formats: AxisFormats = {}
  const behavior = {
    focus: definition.focus ?? "group-x",
    keyboard: definition.keyboard ?? true,
    tooltip: houseTooltip(
      definition.tooltip as ChartTooltipInput<never, never, never, "dom">,
      formats,
    ),
    motion: definition.motion ?? CHART_MOTION,
  }
  if (isResponsiveChartDefinition(definition)) {
    const build = definition.chart
    return {
      ...definition,
      ...behavior,
      chart: (context) => houseSpec(build(context), formats),
    } as DomChartDefinition<TDatum, TXValue, TYValue>
  }
  return {
    ...houseSpec(definition, formats),
    ...behavior,
  } as DomChartDefinition<TDatum, TXValue, TYValue>
}

/* ------------------------------------------------------------------ */
/* Polar                                                               */
/* ------------------------------------------------------------------ */

// oxlint-disable-next-line no-explicit-any
type AnyPolarMark = PolarMark<any, any, any, any, any>

/* Paints without becoming a focus stop or tooltip target. The library's
   `decorative` strips interaction in `postDomain`, which `polar()` never
   calls — this runs it in `render`. */
export function polarDecorative<TMark extends AnyPolarMark>(
  mark: TMark,
): TMark {
  const wrapped = decorative(mark as never) as unknown as TMark
  return {
    ...wrapped,
    initialize: (context) => {
      const initialized = wrapped.initialize(context)
      const { postDomain } = initialized as {
        postDomain?: (scene: MarkScene) => MarkScene
      }
      return {
        ...initialized,
        render: (renderContext) => {
          const scene = initialized.render(renderContext)
          return postDomain ? postDomain(scene) : scene
        },
      }
    },
  }
}

/* ------------------------------------------------------------------ */
/* Host                                                                */
/* ------------------------------------------------------------------ */

/* Module scope: a renderer identity change remounts the surface. `initial:
   "always"` because the React adapter adopts its own prerendered markup,
   which would otherwise skip the entrance. */
const RENDERER = motion({ initial: "always" })

export type ChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = Omit<
  RendererChartCommonProps<TDatum, TXValue, TYValue>,
  "renderer" | "measureText"
> & {
  /** Keep its identity stable: define it at module scope, or memoize it. */
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
  /** HTML laid over the chart — a donut's total, a badge. */
  children?: ReactNode
}

export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  definition,
  children,
  className,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) {
  const themed = useMemo(() => withChartDefaults(definition), [definition])
  return (
    <div className={cn("relative", className)}>
      <RendererChart
        renderer={RENDERER}
        aspectRatio={props.height === undefined ? 16 / 9 : undefined}
        definition={themed}
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  )
}
