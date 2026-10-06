"use client"

import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import type {
  ChannelField,
  ChartAxisOptions,
  ChartColorLegend,
  ChartHostControlExtension,
  ChartColorOptions,
  ChartKey,
  ChartLinearGradient,
  ChartMotionTransition,
  ChartPoint,
  ChartScene,
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
import { crosshair } from "@tanstack/charts/crosshair"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { controlledSignal } from "@tanstack/charts/interaction/signal"
import {
  colorLegend,
  colorLegendItems,
  interactiveColorLegend,
} from "@tanstack/charts/legend"
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

/** Text drawn on each slice, ring or cell. */
export interface ChartDataLabels {
  /** What each label prints. */
  text?: "value" | "name"
  fill?: string
  fontSize?: number
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

/** The design system's chart look. */
export interface ChartDefaults {
  /** `minimal`: category labels only. `labeled`: value labels too. `baseline`: and a line along the category axis. `right`: value labels on the right, with the baseline. */
  axes: "minimal" | "labeled" | "baseline" | "right"
  /** Gridlines along the value axis, dashed, or on both axes. */
  grid: "lines" | "dashed" | "full"
  /** Smooth 2px curves, straight 2px segments, or straight 1.5px ones. */
  lines: "smooth" | "straight" | "fine"
  /** A 40% tint, a fade toward the baseline, or a 70% fill. */
  area: "tint" | "gradient" | "solid"
  /** Rounded, rounded at the value end, square, or square and at most 16px thick. */
  bars: "rounded" | "tip" | "square" | "slim"
  /** Where a chart with several series shows its legend. */
  legend: "off" | "bottom" | "top"
  /** The guide drawn at the hovered position. */
  guide: "none" | "line" | "dashed"
  /** How marks move between data states. */
  motion: "off" | "quick" | "spring" | "bouncy"
}

/**
 * Every chart fills what it leaves unset from these; anything a chart sets
 * wins. `Chart` takes others through its `defaults` prop.
 */
export const chartDefaults: ChartDefaults = {
  axes: "minimal",
  grid: "lines",
  lines: "smooth",
  area: "tint",
  bars: "rounded",
  legend: "off",
  guide: "none",
  motion: "spring",
}

const LINES = {
  smooth: { curve: "natural", strokeWidth: 2 },
  straight: { curve: "linear", strokeWidth: 2 },
  fine: { curve: "linear", strokeWidth: 1.5 },
} as const satisfies Record<
  ChartDefaults["lines"],
  { curve: ChartCurveName; strokeWidth: number }
>

const BARS = {
  rounded: { radius: 4, end: false, maxThickness: undefined },
  tip: { radius: 4, end: true, maxThickness: undefined },
  square: { radius: 0, end: false, maxThickness: undefined },
  slim: { radius: 0, end: false, maxThickness: 16 },
} as const

const MOTION: Record<ChartDefaults["motion"], ChartMotionTransition | false> = {
  off: false,
  quick: { type: "tween", duration: 300, easing: "ease-out" },
  spring: { type: "spring", stiffness: 170, damping: 26 },
  bouncy: { type: "spring", stiffness: 180, damping: 12 },
}

/** What builders draw marks with, resolved from the defaults. */
export function chartLook(defaults: ChartDefaults = chartDefaults) {
  const bars = BARS[defaults.bars]
  return {
    ...LINES[defaults.lines],
    areaFill: (defaults.area === "tint"
      ? 0.4
      : defaults.area === "solid"
        ? 0.7
        : "gradient") as number | "gradient",
    barRadius: bars.radius,
    /** Round only the value end of a bar. */
    barEnd: bars.end,
    barMaxThickness: bars.maxThickness as number | undefined,
    cellRadius: bars.radius === 0 ? 0 : 2,
    gridDash: defaults.grid === "dashed" ? "3 3" : undefined,
  }
}

const REBUILDS = new WeakMap<object, (defaults: ChartDefaults) => object>()

/* A builder's marks remember how to rebuild themselves, so `Chart`'s
   `defaults` restyles them too — even inside a spread spec. */
export function chartMarks<TMarks extends readonly object[]>(
  build: (defaults: ChartDefaults) => TMarks,
): TMarks {
  const marks = build(chartDefaults)
  const built = new Map<string, TMarks>()
  marks.forEach((mark, index) =>
    REBUILDS.set(mark, (defaults) => {
      const key = JSON.stringify(defaults)
      const next = built.get(key) ?? build(defaults)
      built.set(key, next)
      return next[index] ?? mark
    }),
  )
  return marks
}

const FADE_ID = "chart-fade"

/** The `fill` of a series fading toward the baseline; the chart needs `chartFades`. */
export function chartFade(slot: number): string {
  return `url(#${FADE_ID}-${slot})`
}

/** One fade per series color, for `chartFade`. */
export function chartFades(
  count: number = chartColors.length,
): ChartLinearGradient[] {
  return Array.from({ length: count }, (_, slot) => {
    const color = chartColor(slot)
    return {
      id: `${FADE_ID}-${slot}`,
      y1: 1,
      y2: 0,
      stops: [
        { offset: 0, color, opacity: 0.02 },
        { offset: 1, color, opacity: 0.5 },
      ],
    }
  })
}

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
  /** The axis carrying the values. @default "y" */
  value?: "x" | "y"
  /** The axes to show. @default the category axis, and the value axis as the defaults' `axes` says */
  axes?: boolean | "x" | "y"
  /** The axes drawing gridlines. @default the value axis, or both with the defaults' `grid: "full"` */
  grid?: "x" | "y" | "both" | false
}

/* What `chartScales` left to the defaults, read again by `Chart`. */
const AUTO = Symbol("chart-auto")

type AxisPresentation = Exclude<ChartScale["axis"], false | undefined>

interface AutoScale {
  role: "category" | "value"
  kind: ChartScaleKind
  /** The axis presentation, kept while the axis is hidden. */
  presentation: AxisPresentation
  axis: boolean
  grid: boolean
}

function chartAxis(
  input: ChartScaleKind | ChartAxis,
  fallback: ChartScaleKind,
  grid: boolean,
  visible: boolean,
  auto: Omit<AutoScale, "kind" | "presentation">,
): ChartScale {
  const {
    kind = fallback,
    format,
    label,
    ...rest
  } = typeof input === "string" ? { kind: input } : input
  const presentation: AxisPresentation = {
    ...(format && { ticks: { format } }),
    ...(label && { label }),
  }
  return {
    scale: SCALES[kind],
    nice: kind === "linear" || kind === "time",
    grid,
    axis: visible && presentation,
    ...rest,
    ...(format && { [FORMAT]: format }),
    ...{ [AUTO]: { ...auto, kind, presentation } },
  }
}

function autoAxis(role: AutoScale["role"], defaults: ChartDefaults) {
  return role === "category" || defaults.axes !== "minimal"
}

function autoGrid(
  role: AutoScale["role"],
  kind: ChartScaleKind,
  defaults: ChartDefaults,
) {
  return role === "value" || (defaults.grid === "full" && kind !== "band")
}

/** The x and y scales, with the axes and gridlines the defaults call for. */
export function chartScales({
  x = "point",
  y = "linear",
  value = "y",
  axes,
  grid,
}: ChartScalesOptions = {}): { x: ChartScale; y: ChartScale } {
  const scale = (
    id: "x" | "y",
    input: ChartScaleKind | ChartAxis,
    fallback: ChartScaleKind,
  ) => {
    const role = id === value ? "value" : "category"
    const kind = (typeof input === "string" ? input : input.kind) ?? fallback
    return chartAxis(
      input,
      fallback,
      grid === undefined
        ? autoGrid(role, kind, chartDefaults)
        : grid === id || grid === "both",
      axes === undefined
        ? autoAxis(role, chartDefaults)
        : axes === true || axes === id,
      { role, axis: axes === undefined, grid: grid === undefined },
    )
  }
  return { x: scale("x", x, "point"), y: scale("y", y, "linear") }
}

/* ------------------------------------------------------------------ */
/* Legend                                                              */
/* ------------------------------------------------------------------ */

const LEGEND = Symbol("chart-legend")
const AUTO_LEGEND = Symbol("chart-auto-legend")

export interface ChartLegendOptions {
  /**
   * Readers click a series to hide or show it, and hovering one dims the
   * rest. `Chart` keeps which series are hidden; the chart needs a
   * `color.domain`.
   */
  toggle?: boolean
  /** @default where the defaults put legends, or the bottom */
  placement?: "top" | "bottom"
}

/** The color legend. */
export function chartLegend({
  toggle = false,
  placement,
}: ChartLegendOptions = {}): ChartColorLegend {
  const legend = colorLegend({
    placement: placement ?? "bottom",
    items: colorLegendItems({
      justify: "center",
      gap: 16,
      indicator: { shape: "square", width: 8, height: 8, gap: 6 },
    }),
  })
  return Object.assign(legend, { [LEGEND]: { toggle, placement } })
}

/**
 * The categorical color scale over `names`. Without `legend`, the chart
 * shows one when it has several series and the defaults call for it.
 */
export function chartColorScale(
  names: readonly ChartKey[],
  legend?: boolean | "toggle",
): ChartColorOptions {
  const color: ChartColorOptions = { domain: names }
  if (legend) color.legend = chartLegend({ toggle: legend === "toggle" })
  return legend === undefined
    ? Object.assign(color, { [AUTO_LEGEND]: true })
    : color
}

/* Dims every series but the one under the legend pointer. Builders add it to
   their marks; it only matches legend hover. */
export const legendEmphasis = [
  { when: { focus: "unmatched", source: "legend" }, style: { opacity: 0.25 } },
] as const

export interface ChartHiddenSeries {
  hidden: readonly ChartKey[]
  onHiddenChange: (hidden: readonly ChartKey[]) => void
}

interface LegendItem {
  key: string
  value: ChartKey
  label: string
  color: string
  visible: boolean
  ariaLabel: string
}

/* The library's interactive legend control, read by the renderer below. A
   test pins this shape. */
interface LegendControl {
  bounds: { x: number; y: number; width: number; height: number }
  ariaLabel: string
  emptyLabel: string
  hover: boolean
  items: readonly LegendItem[]
  toggle: (value: ChartKey) => void
}

const LEGEND_ITEM_HEIGHT = 24
const LEGEND_GAP = 4
// Room per item before the row wraps; labels are short series names.
const LEGEND_ITEM_WIDTH = 104

const LEGEND_ITEM_CLASS = [
  "inline-flex h-6 cursor-interactive items-center gap-1.5 rounded-sm px-2 text-xs text-fg select-ui",
  "transition-[background-color,opacity] hover:bg-inverse/10 focus-reset focus-visible:focus-ring",
  "aria-[pressed=false]:text-fg-muted aria-[pressed=false]:opacity-60",
].join(" ")

/* The library's legend logic — visibility, filtering, hover emphasis — drawn
   as design-system buttons instead of its inline-styled pills. */
const legendControl: ChartHostControlExtension = {
  id: "dotui-chart-legend",
  create: ({ container, setStateFocus }) => {
    const document = container.ownerDocument
    const root = document.createElement("div")
    root.setAttribute("role", "group")
    root.className =
      "absolute flex flex-wrap content-center items-center justify-center gap-1"
    const status = document.createElement("span")
    status.setAttribute("role", "status")
    status.className = "sr-only"
    root.append(status)
    const buttons = new Map<string, HTMLButtonElement>()
    let hovered: ChartKey | null = null
    let focused: ChartKey | null = null
    let painted: ChartKey | null = null
    let scene: ChartScene | undefined

    const paint = (force = false) => {
      const value = hovered ?? focused
      if (!force && Object.is(value, painted)) return
      const group =
        value === null
          ? []
          : (scene?.points.filter((point) => Object.is(point.group, value)) ??
            [])
      setStateFocus(
        group[0] === undefined
          ? null
          : { primary: group[0], group, source: "legend", pinned: false },
      )
      painted = value
    }

    const button = (key: string) => {
      const element = document.createElement("button")
      element.type = "button"
      element.className = LEGEND_ITEM_CLASS
      const swatch = document.createElement("span")
      swatch.className = "size-2 shrink-0 rounded-[2px] border-[1.5px]"
      element.append(swatch, document.createElement("span"))
      buttons.set(key, element)
      return element
    }

    return {
      update(next, nextScene) {
        const control = next as unknown as LegendControl
        if (root.parentElement !== container) container.append(root)
        root.setAttribute("aria-label", control.ariaLabel)
        root.style.left = `${control.bounds.x}px`
        root.style.top = `${control.bounds.y}px`
        root.style.width = `${control.bounds.width}px`
        root.style.height = `${control.bounds.height}px`

        const keys = new Set(control.items.map((item) => item.key))
        for (const [key, element] of buttons) {
          if (keys.has(key)) continue
          element.remove()
          buttons.delete(key)
        }
        for (const item of control.items) {
          const element = buttons.get(item.key) ?? button(item.key)
          root.insertBefore(element, status)
          const [swatch, label] = element.children as unknown as [
            HTMLElement,
            HTMLElement,
          ]
          element.setAttribute("aria-pressed", String(item.visible))
          element.setAttribute("aria-label", item.ariaLabel)
          element.onclick = () => control.toggle(item.value)
          swatch.style.borderColor = item.color
          swatch.style.background = item.visible ? item.color : "transparent"
          label.textContent = item.label
          const emphasize = control.hover && item.visible
          element.onpointerenter = emphasize
            ? () => {
                hovered = item.value
                paint()
              }
            : null
          element.onpointerleave = emphasize
            ? () => {
                hovered = null
                paint()
              }
            : null
          element.onfocus = emphasize
            ? () => {
                focused = item.value
                paint()
              }
            : null
          element.onblur = emphasize
            ? () => {
                focused = null
                paint()
              }
            : null
        }
        status.textContent = control.items.some((item) => item.visible)
          ? ""
          : control.emptyLabel

        const shown = (value: ChartKey | null) =>
          control.items.some((item) => item.visible && item.value === value)
        if (!shown(hovered)) hovered = null
        if (!shown(focused)) focused = null
        const changed = scene !== nextScene
        scene = nextScene
        paint(painted !== null && changed)
      },
      contains: (target) => target instanceof Node && root.contains(target),
      destroy() {
        hovered = null
        focused = null
        paint()
        root.remove()
        buttons.clear()
      },
    }
  },
}

function toggleLegend(
  legend: ChartColorLegend,
  domain: readonly ChartKey[],
  { hidden, onHiddenChange }: ChartHiddenSeries,
  placement: "top" | "bottom",
): ChartColorLegend {
  const { control, ...interactive } = interactiveColorLegend<ChartKey>({
    hover: "series",
    placement,
    visible: controlledSignal<readonly ChartKey[]>(
      domain.filter((value) => !hidden.includes(value)),
      (visible) =>
        onHiddenChange(domain.filter((value) => !visible.includes(value))),
    ),
  })
  return {
    ...interactive,
    height: (count, { chart }) => {
      const perRow = Math.max(1, Math.floor(chart.width / LEGEND_ITEM_WIDTH))
      const rows = Math.ceil(count / perRow)
      return rows * LEGEND_ITEM_HEIGHT + (rows - 1) * LEGEND_GAP + 8
    },
    // Painted until the buttons mount: on the server, and in exports.
    render: legend.render,
    control:
      control &&
      ((context) => ({ ...control(context), extension: legendControl })),
  }
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

// Lines and areas are single paths; dots and cells can number in the
// hundreds.
const STAGGER = stagger({ each: 25, roles: ["arc", "bar"] })

const GUIDE = Symbol("chart-guide")

/**
 * Spread into a spec to draw the defaults' hover guide at the focused
 * position. `false` opts out; `true` draws one even when the defaults don't.
 */
export function chartGuide(guide?: boolean) {
  return guide === false ? {} : { [GUIDE]: guide ?? ("auto" as const) }
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
  color?: ChartColorOptions
  marks?: readonly object[]
  gradients?: readonly { id: string }[]
  theme?: Partial<ChartTheme>
}

type HouseScale = ChartScale & { side?: string; [AUTO]?: AutoScale }

const BASELINE = { stroke: "var(--color-border-control)", strokeOpacity: 1 }

/* The house axis: no tick marks, labels clear of the plot, and the domain
   line, side and gridlines the defaults call for. The library paints the grid
   at 11% — the border token is already a hairline. */
function houseScale(
  entry: unknown,
  defaults: ChartDefaults,
  rightTaken: boolean,
): unknown {
  if (entry === null || typeof entry !== "object" || !("scale" in entry)) {
    return entry
  }
  const scale = entry as HouseScale
  const auto = scale[AUTO]
  const grid = auto?.grid
    ? autoGrid(auto.role, auto.kind, defaults)
    : scale.grid
  const axis = auto?.axis
    ? autoAxis(auto.role, defaults) && auto.presentation
    : scale.axis
  const dash = defaults.grid === "dashed" && { strokeDasharray: "3 3" }
  const baseline =
    auto?.role === "category" &&
    (defaults.axes === "baseline" || defaults.axes === "right")
  const right =
    auto?.axis &&
    auto.role === "value" &&
    defaults.axes === "right" &&
    !rightTaken &&
    scale.side === undefined
  return {
    ...scale,
    ...(right && { side: "right" }),
    grid:
      grid === true
        ? { strokeOpacity: 1, ...dash }
        : grid && { strokeOpacity: 1, ...dash, ...grid },
    axis: axis !== false && {
      line: baseline && BASELINE,
      ...axis,
      ticks: axis?.ticks !== false && {
        size: 0,
        padding: 10,
        ...axis?.ticks,
      },
    },
  }
}

/* A rule at the focused category — or, for `line` over bars, its band —
   behind the marks. */
function guideMark(scales: Record<string, unknown>, style: "line" | "dashed") {
  const [axis, auto] =
    (["x", "y"] as const)
      .map((id) => [id, (scales[id] as HouseScale | null)?.[AUTO]] as const)
      .find(([, scale]) => scale?.role === "category") ??
    (["x", undefined] as const)
  const guide =
    style === "line" && auto?.kind === "band"
      ? { band: { fill: "var(--color-muted)" } }
      : {
          stroke: "var(--color-border-control)",
          strokeOpacity: 1,
          strokeWidth: 1,
          ...(style === "dashed" && { strokeDasharray: "4 4" }),
        }
  return crosshair({ x: axis === "x" && guide, y: axis === "y" && guide })
}

function tickFormat(entry: unknown): ChartFormat | undefined {
  if (entry === null || typeof entry !== "object") return undefined
  const { axis, [FORMAT]: format } = entry as ChartScale & {
    [FORMAT]?: ChartFormat
  }
  return (axis ? (axis.ticks || undefined)?.format : undefined) ?? format
}

function sameDefaults(left: ChartDefaults, right: ChartDefaults) {
  return (Object.keys(left) as (keyof ChartDefaults)[]).every(
    (key) => left[key] === right[key],
  )
}

/* The legend the defaults call for: one when a chart left it to them, and
   the placement of every kit legend that didn't pick one. */
function houseLegend(
  color: ChartColorOptions | undefined,
  defaults: ChartDefaults,
  series: ChartHiddenSeries | undefined,
): ChartColorLegend | undefined {
  const domain = color?.domain ?? []
  const placement = defaults.legend === "top" ? "top" : "bottom"
  const legend =
    color?.legend ??
    (color &&
    AUTO_LEGEND in color &&
    defaults.legend !== "off" &&
    domain.length > 1
      ? chartLegend()
      : undefined)
  const kit = (legend as { [LEGEND]?: ChartLegendOptions } | undefined)?.[
    LEGEND
  ]
  if (!legend || !kit) return legend
  const at = kit.placement ?? placement
  if (kit.toggle && series) return toggleLegend(legend, domain, series, at)
  return at === "bottom" ? legend : chartLegend({ ...kit, placement: at })
}

function houseSpec<TSpec extends SpecLike>(
  spec: TSpec,
  formats: AxisFormats,
  defaults: ChartDefaults,
  series?: ChartHiddenSeries,
): TSpec {
  const entries = Object.entries(spec.scales ?? {})
  const rightTaken = entries.some(
    ([, entry]) => (entry as HouseScale | null)?.side === "right",
  )
  const scales = Object.fromEntries(
    entries.map(([id, entry]) => [id, houseScale(entry, defaults, rightTaken)]),
  )
  formats.x = tickFormat(scales.x)
  formats.y = tickFormat(scales.y)

  const restyled = !sameDefaults(defaults, chartDefaults)
  let marks = (spec.marks ?? []).map((mark) =>
    restyled ? (REBUILDS.get(mark)?.(defaults) ?? mark) : mark,
  )
  const guide = (spec as { [GUIDE]?: true | "auto" })[GUIDE]
  const style =
    defaults.guide !== "none"
      ? defaults.guide
      : guide === true
        ? "line"
        : undefined
  if (guide && style) marks = [guideMark(scales, style), ...marks]

  const legend = houseLegend(spec.color, defaults, series)
  const declared = new Set(spec.gradients?.map((gradient) => gradient.id))
  const fades =
    defaults.area === "gradient"
      ? chartFades().filter((fade) => !declared.has(fade.id))
      : []
  return {
    ...spec,
    scales,
    marks,
    ...(spec.color && { color: { ...spec.color, legend } }),
    ...(fades.length > 0 && {
      gradients: [...(spec.gradients ?? []), ...fades],
    }),
    theme: { ...chartTheme, ...spec.theme },
  }
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

export interface ChartHost extends Partial<ChartHiddenSeries> {
  /** @default chartDefaults */
  defaults?: ChartDefaults
}

/**
 * Fills in what a definition leaves unset — the theme, the axis look, focus,
 * keyboard, the tooltip and motion — from `defaults`, and keeps everything it
 * sets. Pure, so any host can apply it; `<Chart>` does. With
 * `onHiddenChange`, a toggle legend hides and shows series through it.
 */
export function withChartDefaults<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(
  definition: DomChartDefinition<TDatum, TXValue, TYValue>,
  { defaults = chartDefaults, hidden = [], onHiddenChange }: ChartHost = {},
): DomChartDefinition<TDatum, TXValue, TYValue> {
  const formats: AxisFormats = {}
  const series = onHiddenChange && { hidden, onHiddenChange }
  const transition = MOTION[defaults.motion]
  const behavior = {
    focus: definition.focus ?? "group-x",
    keyboard: definition.keyboard ?? true,
    tooltip: houseTooltip(
      definition.tooltip as ChartTooltipInput<never, never, never, "dom">,
      formats,
    ),
    motion: definition.motion ?? (transition && { transition, ...STAGGER }),
  }
  if (isResponsiveChartDefinition(definition)) {
    const build = definition.chart
    return {
      ...definition,
      ...behavior,
      chart: (context) => houseSpec(build(context), formats, defaults, series),
    } as DomChartDefinition<TDatum, TXValue, TYValue>
  }
  return {
    ...houseSpec(definition, formats, defaults, series),
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
  /** The look this chart fills its unset values from. @default chartDefaults */
  defaults?: ChartDefaults
  /** HTML laid over the chart — a donut's total, a badge. */
  children?: ReactNode
}

export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  definition,
  defaults = chartDefaults,
  children,
  className,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) {
  const [hidden, setHidden] = useState<readonly ChartKey[]>([])
  // Keyed by value, so an inline `defaults` object doesn't rebuild the chart.
  const key = JSON.stringify(defaults)
  const themed = useMemo(
    () =>
      withChartDefaults(definition, {
        defaults,
        hidden,
        onHiddenChange: setHidden,
      }),
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [definition, hidden, key],
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
        definition={themed}
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  )
}
