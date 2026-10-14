"use client"

import type { ReactNode } from "react"
import { useMemo } from "react"
import type {
  ChartAxisPresentationOptions,
  ChartGuideLineStyle,
  ChartLinearGradient,
  ChartMotionTransition,
  ChartPoint,
  ChartTheme,
  ChartTooltipContent,
  ChartTooltipContentContext,
  ChartTooltipInput,
  ChartValue,
  DomChartDefinition,
  MarkScene,
} from "@tanstack/charts"
import { isResponsiveChartDefinition } from "@tanstack/charts"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend"
import { decorative } from "@tanstack/charts/mark/decorative"
import { motion, stagger } from "@tanstack/charts/motion"
import type { PolarGuideLabelContext, PolarMark } from "@tanstack/charts/polar"
import type { RendererChartCommonProps } from "@tanstack/charts/react/tooltip"
import { RendererChart } from "@tanstack/charts/react/tooltip"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { portal } from "@tanstack/charts/tooltip/portal"
import { curveMonotoneX, curveNatural, curveStepAfter } from "d3-shape"

import { cn } from "@/registry/lib/utils"

/** The series colors, in slot order. */
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

export const chartCurves = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
}

export interface ChartLook {
  /** Interpolation of lines and area edges. */
  curve: (typeof chartCurves)[keyof typeof chartCurves]
  /** Width of lines and area edges. */
  strokeWidth: number
  /** Fill opacity of areas. */
  areaOpacity: number
  /** Corner radius of bars, radial bars and heatmap cells. */
  barRadius: number
  /** The widest a bar gets, in pixels. */
  barMaxThickness: number | undefined
  /** The value axis labels; `false` keeps only its gridlines. */
  valueAxis: false | ChartAxisPresentationOptions
  /** Gridlines, wherever a scale sets `grid: true`. */
  grid: ChartGuideLineStyle
  /** Where `chartLegend` sits. */
  legend: "top" | "bottom"
  /** How marks move between data states; `false` jumps. */
  motion: ChartMotionTransition | false
}

/**
 * The design system's chart look, written by the studio. Charts read it, so
 * changing a value here restyles every chart that does.
 */
export const chartLook: ChartLook = {
  curve: chartCurves.natural,
  strokeWidth: 2,
  areaOpacity: 0.4,
  barRadius: 4,
  barMaxThickness: undefined,
  valueAxis: false,
  grid: { strokeOpacity: 1 },
  legend: "bottom",
  motion: { type: "spring", stiffness: 170, damping: 26 },
}

/** A band scale with room between and around the bands. */
export const chartBand = () => scaleBand().paddingInner(0.2).paddingOuter(0.1)

function legendAt(placement: ChartLook["legend"]) {
  return colorLegend({
    placement,
    items: colorLegendItems({
      justify: "center",
      gap: 16,
      indicator: { shape: "square", width: 8, height: 8, gap: 6 },
    }),
  })
}

/** The color legend. */
export const chartLegend = legendAt(chartLook.legend)

/** One fade toward the baseline per series color; fill with `url(#chart-fade-N)`. */
export const chartFades: ChartLinearGradient[] = chartColors.map(
  (color, slot) => ({
    id: `chart-fade-${slot}`,
    y1: 1,
    y2: 0,
    stops: [
      { offset: 0, color, opacity: 0.02 },
      { offset: 1, color, opacity: 0.5 },
    ],
  }),
)

/* ------------------------------------------------------------------ */
/* Polar                                                               */
/* ------------------------------------------------------------------ */

/**
 * A tooltip for slices and rings, whose x and y are an angle and a radius:
 * a row per focused datum, named and valued from its own fields.
 */
export function chartSliceTooltip(
  label: string,
  value: string,
  format: (value: number) => string = (value) => value.toLocaleString(),
) {
  return {
    use: tooltip,
    anchor: "point" as const,
    content: (points: readonly ChartPoint[]) => ({
      rows: points.map((point) => {
        const datum = point.datum as Record<string, unknown>
        return {
          label: String(datum[label]),
          value: format(Number(datum[value])),
          color: point.color,
        }
      }),
    }),
  }
}

/** Nudges circumference labels clear of the circle, for `angleGrid`. */
export const chartAngleLabels = {
  labelDx: ({ x }: PolarGuideLabelContext) => (x < -1 ? -3 : x > 1 ? 3 : 0),
  labelDy: ({ y }: PolarGuideLabelContext) => (y < -1 ? -2 : y > 1 ? 2 : 0),
}

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

const theme = {
  palette: chartColors,
  foreground: "var(--color-fg-muted)",
  muted: "var(--color-fg-muted)",
  grid: "var(--color-border)",
} satisfies Partial<ChartTheme>

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

// Lines and areas are single paths; dots and cells can number in the hundreds.
const STAGGER = stagger({ each: 25, roles: ["arc", "bar"] })

type Spec = {
  scales?: Record<string, unknown>
  color?: { legend?: unknown }
  theme?: Partial<ChartTheme>
}

type Scale = {
  grid?: boolean | ChartGuideLineStyle
  axis?: false | ChartAxisPresentationOptions
}

/* No domain line or tick marks, labels clear of the plot, and the look's
   gridlines — the library paints its own at 11%. */
function styleScale(scale: Scale, look: ChartLook): Scale {
  const { grid, axis } = scale
  return {
    ...scale,
    grid: grid === true ? look.grid : grid && { ...look.grid, ...grid },
    axis: axis !== false && {
      line: false,
      ...axis,
      ticks: axis?.ticks !== false && { size: 0, padding: 10, ...axis?.ticks },
    },
  }
}

function styleSpec<TSpec extends Spec>(spec: TSpec, look: ChartLook): TSpec {
  const scales = Object.fromEntries(
    Object.entries(spec.scales ?? {}).map(([id, scale]) => [
      id,
      scale && typeof scale === "object" ? styleScale(scale, look) : scale,
    ]),
  )
  // The house legend follows the look's placement.
  const legend =
    spec.color?.legend === chartLegend && look.legend !== chartLook.legend
      ? legendAt(look.legend)
      : spec.color?.legend
  return {
    ...spec,
    scales,
    ...(spec.color && { color: { ...spec.color, legend } }),
    theme: { ...theme, ...spec.theme },
  }
}

type Format = (value: ChartValue) => string

type TooltipOptions = {
  className?: string
  items?: readonly unknown[]
  content?: unknown
  format?: unknown
  formatGroup?: unknown
}

type ItemText = (
  point: ChartPoint,
  context: ChartTooltipContentContext,
) => string | null | undefined

function tickFormat(scale: unknown): Format | undefined {
  const { axis } = (scale ?? {}) as Scale
  return axis && axis.ticks ? axis.ticks.format : undefined
}

function sameValue(left: ChartValue, right: ChartValue) {
  return left instanceof Date && right instanceof Date
    ? +left === +right
    : Object.is(left, right)
}

/* The value a point stands for: a stacked segment reports its own size. */
function pointValue(point: ChartPoint, axis: "x" | "y", format: Format) {
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

/* The category as the title and a row per series, formatted by the tooltip's
   `x`/`y` items, else the axis tick formats. */
function houseContent(
  items: readonly unknown[] = [],
  formats: Partial<Record<"x" | "y", Format>>,
) {
  const itemText = (axis: "x" | "y") =>
    (
      items.find(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          (item as { channel?: string }).channel === axis,
      ) as { text?: ItemText } | undefined
    )?.text
  return (
    points: readonly ChartPoint[],
    context: ChartTooltipContentContext,
  ): ChartTooltipContent => {
    const first = points[0]
    if (first === undefined) return { rows: [] }
    const text = (point: ChartPoint, axis: "x" | "y") =>
      itemText(axis)?.(point, context) ??
      pointValue(
        point,
        axis,
        formats[axis] ?? (axis === "x" ? context.formatX : context.formatY),
      )
    // Horizontal bars share y: their category is the y value.
    const byY =
      points.length > 1
        ? points.every((point) => sameValue(point.yValue, first.yValue)) &&
          !points.every((point) => sameValue(point.xValue, first.xValue))
        : typeof first.xValue === "number" && typeof first.yValue !== "number"
    const [category, value] = byY
      ? (["y", "x"] as const)
      : (["x", "y"] as const)
    return {
      title: text(first, category),
      rows: points.map((point) => ({
        label: point.groupLabel,
        value: text(point, value),
        color: point.color,
        active: points.length > 1 && point === context.primaryPoint,
      })),
    }
  }
}

function styleTooltip(
  input: ChartTooltipInput<never, never, never, "dom">,
  scales: Record<string, unknown>,
) {
  const options = (
    typeof input === "object" && "use" in input ? input : { use: input }
  ) as TooltipOptions
  const custom = options.content ?? options.format ?? options.formatGroup
  return {
    anchor: "group-center",
    sort: "color-domain",
    portal,
    ...options,
    className: cn(TOOLTIP_CLASS, options.className),
    content:
      custom === undefined
        ? houseContent(options.items, {
            x: tickFormat(scales.x),
            y: tickFormat(scales.y),
          })
        : options.content,
  }
}

/**
 * Fills what a definition leaves unset — the theme, the axis and grid look,
 * focus, keyboard, the tooltip and motion. `Chart` applies it; call it to
 * render a definition through another host.
 */
export function withChartLook<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(
  definition: DomChartDefinition<TDatum, TXValue, TYValue>,
  look: ChartLook = chartLook,
): DomChartDefinition<TDatum, TXValue, TYValue> {
  const input = definition.tooltip as
    | ChartTooltipInput<never, never, never, "dom">
    | false
    | undefined
  const behavior = {
    focus: definition.focus ?? "group-x",
    keyboard: definition.keyboard ?? true,
    tooltip:
      input === false
        ? false
        : styleTooltip(
            input ?? tooltip,
            isResponsiveChartDefinition(definition) ? {} : definition.scales,
          ),
    motion:
      definition.motion ??
      (look.motion && { transition: look.motion, ...STAGGER }),
  }
  if (isResponsiveChartDefinition(definition)) {
    const build = definition.chart
    return {
      ...definition,
      ...behavior,
      chart: (context) => styleSpec(build(context), look),
    } as DomChartDefinition<TDatum, TXValue, TYValue>
  }
  return {
    ...styleSpec(definition, look),
    ...behavior,
  } as DomChartDefinition<TDatum, TXValue, TYValue>
}

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
  /** The look the chart fills its axes, grid, legend and motion from. */
  look?: ChartLook
  /** HTML laid over the chart — a donut's total, a badge. */
  children?: ReactNode
}

export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  definition,
  look = chartLook,
  children,
  className,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) {
  const styled = useMemo(
    () => withChartLook(definition, look),
    [definition, look],
  )
  // Without x and y scales — a pie, a radar, radial bars — the chart is round.
  const round =
    !isResponsiveChartDefinition(definition) &&
    definition.scales.x === null &&
    definition.scales.y === null
  return (
    <div className={cn("relative", className)}>
      <RendererChart
        renderer={RENDERER}
        aspectRatio={
          props.height === undefined ? (round ? 1 : 16 / 9) : undefined
        }
        definition={styled}
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  )
}
