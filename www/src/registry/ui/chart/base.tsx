"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import type {
  Channel,
  ChannelField,
  ChannelOutput,
  ChartAxisOptions,
  ChartAxisPresentationOptions,
  ChartBuildContext,
  ChartColorOptions,
  ChartKey,
  ChartLinearGradient,
  ChartMargin,
  ChartMark,
  ChartMotionDefinition,
  ChartMotionSpringTransition,
  ChartMotionTweenTransition,
  ChartTheme,
  ChartValue,
  DomChartDefinition,
  VisualChannel,
} from "@tanstack/charts"
import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { motion, stagger } from "@tanstack/charts/motion"
import type { RendererChartCommonProps } from "@tanstack/charts/react/tooltip"
import { RendererChart } from "@tanstack/charts/react/tooltip"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"
import { portal as tooltipPortal } from "@tanstack/charts/tooltip/portal"
import { scaleBand, scaleLinear, scalePoint } from "d3-scale"

import { cn } from "@/registry/lib/utils"

/* Chart core: the host, the house defaults, and the frame every chart family
   composes. No mark is imported here — families own theirs, so a bar chart
   never pulls d3-shape. */

/* Every design-system decision the charts make, in one object: the single
   codegen baseline and the single auditable list of candidate builder axes.
   Never scatter a literal into a `??` fallback — read it from here. */
export const chartDefaults = {
  // 16/9 like shadcn's `aspect-video` container; height follows measured width.
  aspectRatio: 16 / 9,
  curve: "natural",
  strokeWidth: 2.25,
  fill: 0.2,
  points: false,
  dotRadius: 4,
  bubbleRadius: [3, 18],
  barRadius: 4,
  cellRadius: 2,
  cellInset: 1,
  bandPadding: 0.3,
  bandOuterPadding: 0,
  // Zero outer padding: lines and areas span the plot edge to edge.
  pointPadding: 0,
  groupPadding: 0.15,
  grid: true,
  axes: true,
  legend: true,
  focus: "group-x",
  tooltipAnchor: "group-center",
  tooltipSticky: true,
  animate: { type: "spring", stiffness: 170, damping: 26 },
  animateMaxPoints: 800,
  enterStagger: 25,
  draw: { duration: 900, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
  axisTickMinWidth: 420,
  axisTickCountNarrow: 4,
  gradientStops: [0.02, 0.5],
} as const

/* Module scope: identity is fixed forever, so recoloring is a CSS repaint
   rather than a scene rebuild. Eight entries because the color engine
   generates --chart-1..8; the library's own default theme has only six, so
   never rely on --ts-chart-* remapping to carry them. */
export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const

export const CHART_THEME: Partial<ChartTheme> = { palette: CHART_PALETTE }

export function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_PALETTE[0]
}

/* ------------------------------------------------------------------ */
/* Shared types                                                        */
/* ------------------------------------------------------------------ */

export type ChartCurve = "linear" | "natural" | "monotone" | "step"
export type ChartFocus =
  | "nearest"
  | "nearest-x"
  | "nearest-y"
  | "group-x"
  | "group-y"
export type ChartTooltipAnchor = "point" | "pointer" | "group-center"

/* The library's own public mark constraint: annotation layers rarely share
   the series row type. */
// oxlint-disable-next-line no-explicit-any
export type ChartMarkLayer = ChartMark<unknown, any, any>

interface DecorativeMark {
  initialize: (context: never) => {
    render: (context: never) => { nodes: readonly unknown[] }
  }
}

/* Strips a mark's focus points: it still paints, but never becomes a keyboard
   stop or tooltip target. For tracks, labels, and other decoration whose datum
   an interactive mark already carries. The library ships its own `decorative`,
   but it works through `postDomain`, which the polar container never calls —
   this one accepts cartesian and polar marks alike. Limitation: a mark that
   implements `resolveLayout` (dot, difference, the hierarchy marks) renders
   through it, bypassing this wrap — use the library `decorative` for those. */
export function decorative<TMark extends DecorativeMark>(mark: TMark): TMark {
  const initialize = (context: never) => {
    const initialized = mark.initialize(context)
    return {
      ...initialized,
      render: (renderContext: never) => ({
        nodes: initialized.render(renderContext).nodes.map(stripInteraction),
      }),
    }
  }
  return { ...mark, initialize } as TMark
}

interface SceneNodeLike {
  kind?: string
  children?: readonly unknown[]
  focus?: { retarget?: boolean; candidates?: readonly unknown[] }
  [key: string]: unknown
}

/* Dropping the emitted points is not enough: the scene compiler re-collects
   focus and tooltip points by walking the nodes, so the metadata has to go from
   every node, at every depth. Mirrors the library's own scene filter. */
function stripInteraction(node: unknown): unknown {
  if (node === null || typeof node !== "object") return node
  const source = node as SceneNodeLike
  if (source.kind === "group") {
    const {
      focus,
      states: _states,
      pointOwner: _groupOwner,
      focusCandidateIndex: _focusCandidateIndex,
      ...rest
    } = source
    // A retargeting group paints through its candidates, not its children.
    const children =
      focus?.retarget && focus.candidates ? focus.candidates : source.children
    return { ...rest, children: (children ?? []).map(stripInteraction) }
  }
  if (source.kind === "label") {
    const { pointOwner: _labelOwner, ...rest } = source
    return rest
  }
  const { interaction: _interaction, pointOwner: _pointOwner, ...rest } = source
  return rest
}

/* Option-object formatters serialize into the memo key, so the most common
   inline-arrow prop stops rebuilding the scene on every render. `locale` is
   required — an ambient locale differs between Node and the browser and
   breaks hydration. */
export type ChartFormat =
  | ((value: ChartValue) => string)
  | { locale: string; number: Intl.NumberFormatOptions }
  | { locale: string; date: Intl.DateTimeFormatOptions }

export type ChartXField<TDatum> = ChannelField<
  TDatum,
  ChartValue | null | undefined
>
export type ChartYField<TDatum> = ChannelField<
  TDatum,
  number | null | undefined
>
export type ChartSeriesField<TDatum> = ChannelField<
  TDatum,
  ChartKey | null | undefined
>
export type ChartXValueOf<TDatum, TXField> = ChannelOutput<
  TDatum,
  TXField,
  ChartValue
>

/* `ChartSpecDatum` branches on `__datum` before falling back to mark-tuple
   inference, so these phantoms are what preserve TDatum through defineChart.
   `scales.x`/`scales.y` must be required: optional ones fail the
   CheckedChartSpec constraint outright. */
export interface ChartSpecOf<TDatum, TXValue extends ChartValue> {
  marks: readonly ChartMarkLayer[]
  scales: {
    x: ChartAxisOptions | null
    y: ChartAxisOptions | null
  }
  color?: ChartColorOptions
  gradients?: readonly ChartLinearGradient[]
  theme?: Partial<ChartTheme>
  guides?: boolean
  margin?: number | Partial<ChartMargin>
  readonly __datum?: TDatum
  readonly __xValue?: TXValue
  readonly __yValue?: number
}

/** The frame-shaping props every family exposes verbatim. */
export interface ChartFrameOptions {
  grid?: boolean
  /** Both axes, neither, or just one — `"x"` is the minimal dashboard look. */
  axes?: boolean | "x" | "y"
  legend?: boolean
  formatX?: ChartFormat
  formatY?: ChartFormat
}

/** What every family's spec options carry, series or not. */
export interface ChartBaseSpecOptions<TDatum> extends ChartFrameOptions {
  data: readonly TDatum[]
  /** Stable row identity, so sorted or filtered data is retained, not respawned. */
  rowKey?: ChannelField<TDatum, ChartKey>
  /** Mark layers painted under the built-ins. */
  marksBefore?: readonly ChartMarkLayer[]
  /** Mark layers painted over the built-ins. */
  marks?: readonly ChartMarkLayer[]
}

export interface XYChartSpecOptions<
  TDatum,
  TXField extends ChartXField<TDatum>,
> extends ChartBaseSpecOptions<TDatum> {
  /** Field holding the category / time value. */
  x: TXField
  /** One field per series (wide rows), or a single field with `series`. */
  y: ChartYField<TDatum> | readonly ChartYField<TDatum>[]
  /** Lower baseline field — pair with `stackY` for stacked charts. */
  y1?: ChartYField<TDatum>
  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: ChartSeriesField<TDatum>
  /** Leading series order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]
  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>
}

/* ------------------------------------------------------------------ */
/* Format                                                              */
/* ------------------------------------------------------------------ */

export function resolveFormat(
  format: ChartFormat | undefined,
): ((value: ChartValue) => string) | undefined {
  if (format === undefined) return undefined
  if (typeof format === "function") return format
  if ("number" in format) {
    const formatter = new Intl.NumberFormat(format.locale, format.number)
    return (value) => formatter.format(Number(value))
  }
  const formatter = new Intl.DateTimeFormat(format.locale, format.date)
  return (value) => {
    const date = value instanceof Date ? value : new Date(value)
    // `Intl` throws on an invalid date; an unparseable value prints as itself.
    return Number.isNaN(date.getTime()) ? String(value) : formatter.format(date)
  }
}

/* ------------------------------------------------------------------ */
/* Series plan                                                         */
/* ------------------------------------------------------------------ */

export interface ChartSeriesOptions<TDatum> {
  data: readonly TDatum[]
  /** Field splitting rows into series. */
  series: ChartSeriesField<TDatum>
  /** Leading series order; series the data adds follow it. */
  seriesOrder?: readonly string[]
  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>
}

export interface ChartSeriesPlan<TDatum> {
  /** Series labels, in color-slot and legend order. */
  order: readonly string[]
  /** Reads a row's series label — the color and `z` channel. */
  seriesOf: (row: TDatum) => string
}

/* `seriesOrder` leads, then any series only the data carries, so the color
   domain covers every row and the legend never hides one. Order is derived
   once, from the data as given, so SSR and the client agree. */
export function planSeries<TDatum>(
  options: ChartSeriesOptions<TDatum>,
): ChartSeriesPlan<TDatum> {
  const field = options.series as keyof TDatum
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const seriesOf = (row: TDatum) => labelOf(String(row[field]))
  const leading = options.seriesOrder?.map(labelOf) ?? []
  const listed = new Set(leading)
  const found = [...new Set(options.data.map(seriesOf))]
  return {
    order: [...leading, ...found.filter((label) => !listed.has(label))],
    seriesOf,
  }
}

export interface ChartLayer<TDatum, TXField extends ChartXField<TDatum>> {
  /** Spread straight into a mark's options. */
  channels: {
    x: TXField
    y: ChartYField<TDatum>
    y1?: ChartYField<TDatum>
    z: Channel<TDatum, ChartKey | null | undefined>
    color: Channel<TDatum, ChartKey | null | undefined>
    key?: ChannelField<TDatum, ChartKey>
  }
  /** Paints this layer with its palette-slot gradient — see `paletteGradients`. */
  gradientFill: VisualChannel<TDatum, string>
}

export interface ChartPlan<TDatum, TXField extends ChartXField<TDatum>> {
  /** Series labels, in color-slot and legend order. */
  order: readonly string[]
  layers: readonly ChartLayer<TDatum, TXField>[]
}

function toFields<T>(value: T | readonly T[]): readonly [T, ...T[]] {
  const fields = Array.isArray(value) ? value : [value]
  if (fields.length === 0)
    throw new Error("charts: `y` needs at least one field")
  return fields as readonly [T, ...T[]]
}

/* Wide rows become one mark layer per `y` field; long rows become a single
   layer split by the `series` channel. Either way every series is in `order`,
   so a color slot and a gradient slot always exist for it. */
export function planChart<TDatum, TXField extends ChartXField<TDatum>>(
  options: XYChartSpecOptions<TDatum, TXField>,
): ChartPlan<TDatum, TXField> {
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const fields = toFields(options.y)
  const series = options.series

  if (series !== undefined) {
    const { order, seriesOf } = planSeries({ ...options, series })
    const fills = new Map(
      order.map((label, slot) => [label, gradientUrl(slot)]),
    )
    return {
      order,
      layers: [
        {
          channels: {
            x: options.x,
            y: fields[0],
            y1: options.y1,
            z: seriesOf,
            color: seriesOf,
            key: options.rowKey,
          },
          // `order` covers every series in the data; a row outside it would get
          // a flat palette fill rather than another slot's gradient.
          gradientFill: (row: TDatum) =>
            fills.get(seriesOf(row)) ?? paletteColor(0),
        },
      ],
    }
  }

  const rank = (key: string) => {
    const index = options.seriesOrder?.indexOf(key) ?? -1
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }
  const ordered = options.seriesOrder
    ? [...fields].sort((a, b) => rank(String(a)) - rank(String(b)))
    : [...fields]
  const order = ordered.map(labelOf)
  return {
    order,
    layers: ordered.map((field, index) => {
      const label = order[index] ?? String(field)
      return {
        channels: {
          x: options.x,
          y: field,
          y1: options.y1,
          z: () => label,
          color: () => label,
          key: options.rowKey,
        },
        gradientFill: gradientUrl(index),
      }
    }),
  }
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

export type ChartScaleKind = "band" | "point" | "linear"
type ChartScaleOption = ChartAxisOptions["scale"]

const SCALES: Record<ChartScaleKind, () => ChartScaleOption> = {
  // Outer padding stays 0: gaps belong between bars, not at the plot edges.
  band: () =>
    scaleBand()
      .paddingInner(chartDefaults.bandPadding)
      .paddingOuter(chartDefaults.bandOuterPadding),
  point: () => scalePoint().padding(chartDefaults.pointPadding),
  linear: () => scaleLinear(),
}

/** Axis options merged over the computed axis; `label` is the axis title. */
export interface ChartAxisOverrides extends Partial<
  Omit<ChartAxisOptions, "axis">
> {
  label?: string
}

export interface ChartFrameSpec {
  /** Color-scale domain and legend order — usually `planChart().order`. */
  order?: readonly string[]
  /** Scale kind, or axis overrides merged over the computed axis. */
  x?: ChartScaleKind | ChartAxisOverrides
  y?: ChartScaleKind | ChartAxisOverrides
  /** Axis carrying the grid. */
  grid?: "x" | "y" | "both" | "none"
  /** Merged over the categorical default — a sequential scale goes here. */
  color?: ChartColorOptions
}

export interface ChartFrame {
  scales: {
    x: ChartAxisOptions | null
    y: ChartAxisOptions | null
  }
  color?: ChartColorOptions
  theme?: Partial<ChartTheme>
}

function frameAxis(
  spec: ChartScaleKind | ChartAxisOverrides | undefined,
  fallback: ChartScaleKind,
  grid: boolean,
  presentation: false | ChartAxisPresentationOptions,
): ChartAxisOptions {
  const kind = typeof spec === "string" ? spec : fallback
  const { label, ...overrides }: ChartAxisOverrides =
    typeof spec === "object" ? spec : {}
  return {
    scale: SCALES[kind],
    nice: kind === "linear",
    grid,
    axis: presentation && { ...presentation, label },
    ...overrides,
  }
}

/* The axes, color scale and theme every family shares. `ctx` is the library's
   zero-cost responsiveness lever — the builder re-runs inside every scene
   build with no identity change, so tick density can track width for free. */
export function chartFrame(
  options: ChartFrameOptions,
  ctx: ChartBuildContext,
  spec: ChartFrameSpec = {},
): ChartFrame {
  const axes = options.axes ?? chartDefaults.axes
  const xAxis = axes === true || axes === "x"
  const yAxis = axes === true || axes === "y"
  const grid = options.grid ?? chartDefaults.grid
  const where = spec.grid ?? "y"
  const legend =
    (options.legend ?? chartDefaults.legend) ? colorLegend() : undefined
  const order = spec.order ?? []
  return {
    scales: {
      x: frameAxis(
        spec.x,
        "point",
        grid && (where === "x" || where === "both"),
        xAxis && {
          ticks: {
            format: resolveFormat(options.formatX),
            count:
              ctx.width < chartDefaults.axisTickMinWidth
                ? chartDefaults.axisTickCountNarrow
                : undefined,
          },
        },
      ),
      y: frameAxis(
        spec.y,
        "linear",
        grid && (where === "y" || where === "both"),
        yAxis && { ticks: { format: resolveFormat(options.formatY) } },
      ),
    },
    color: {
      ...(order.length > 0 ? { domain: order } : null),
      legend,
      ...spec.color,
      // A family legend must still obey `legend={false}`.
      ...(legend === undefined ? { legend: undefined } : null),
    },
    theme: CHART_THEME,
  }
}

/* ------------------------------------------------------------------ */
/* Gradients                                                           */
/* ------------------------------------------------------------------ */

/* One prefix for the whole design system: the host scopes every declared id
   with its own instance prefix, so two charts on a page cannot collide. */
const GRADIENT_ID = "dotui-fill"

function gradientUrl(slot: number): string {
  return `url(#${GRADIENT_ID}-${slot})`
}

/** A vertical fade from `color` down to near-transparent. */
export function fadeGradient(id: string, color: string): ChartLinearGradient {
  const [from, to] = chartDefaults.gradientStops
  return {
    id,
    y1: 1,
    y2: 0,
    stops: [
      { offset: 0, color, opacity: from },
      { offset: 1, color, opacity: to },
    ],
  }
}

/** The gradients `ChartLayer.gradientFill` paints with, one per palette slot. */
export function paletteGradients(
  count: number,
): readonly ChartLinearGradient[] {
  return Array.from({ length: count }, (_, index) =>
    fadeGradient(`${GRADIENT_ID}-${index}`, paletteColor(index)),
  )
}

/* ------------------------------------------------------------------ */
/* Stacking                                                            */
/* ------------------------------------------------------------------ */

interface StackFields {
  x: ChartValue
  series: string
  /** The row's own contribution — what tooltips and labels should read. */
  value: number | null
  base: number
  top: number | null
}

export type StackedDatum<TDatum> = Omit<TDatum, keyof StackFields> & StackFields

export interface StackYOptions<TDatum, TXField extends ChartXField<TDatum>> {
  x: TXField
  /** Wide-format value fields, bottom layer first. */
  y: readonly ChartYField<TDatum>[]
  /** Divide each x group by its own total, for a 100% stack. All-positive
      data only — a mixed-sign group divides by its signed total. */
  normalize?: boolean
}

/** The value when it is a finite number, `null` otherwise — a gap, not a zero. */
export function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

/* Wide rows in, long rows out: `top`/`base` carry the interval the mark draws,
   `value` keeps the original contribution. Positives grow up from zero and
   negatives down from it, so a mixed-sign group never overlaps itself. Null
   contributions leave a gap instead of a zero-height band. Call it at module
   scope — the result is identity-compared.
   Not `@tanstack/charts/transform/stack`: it takes long-format rows and drops
   non-finite ones, which would erase our null gaps for wide rows. */
export function stackY<TDatum, TXField extends ChartXField<TDatum>>(
  data: readonly TDatum[],
  options: StackYOptions<TDatum, TXField>,
): StackedDatum<TDatum>[] {
  const rows: StackedDatum<TDatum>[] = []
  for (const row of data) {
    const source = row as Record<string, unknown>
    const total = options.y.reduce(
      (sum, field) => sum + (finiteOrNull(source[field]) ?? 0),
      0,
    )
    let up = 0
    let down = 0
    for (const field of options.y) {
      const raw = finiteOrNull(source[field])
      const value =
        raw === null ? null : options.normalize ? safeShare(raw, total) : raw
      const negative = value !== null && value < 0
      const base = negative ? down : up
      const top = value === null ? null : base + value
      if (top !== null) {
        if (negative) down = top
        else up = top
      }
      rows.push({
        ...row,
        x: source[options.x] as ChartValue,
        series: field,
        value,
        base,
        top,
      } as StackedDatum<TDatum>)
    }
  }
  return rows
}

/* An all-zero group normalizes to zero-height bands, not a gap. */
function safeShare(value: number, total: number): number {
  return total === 0 ? 0 : value / total
}

/* ------------------------------------------------------------------ */
/* Host                                                                */
/* ------------------------------------------------------------------ */

/* Function easing is excluded: an inline easing would rebuild the scene every
   render for no gain — the named easings cover the design space. */
export type ChartAnimate =
  | boolean
  | (Omit<ChartMotionTweenTransition, "easing"> & {
      easing?: Extract<ChartMotionTweenTransition["easing"], string>
    })
  | ChartMotionSpringTransition

export interface ChartBehaviorProps {
  focus?: ChartFocus
  /** Pixel radius beyond which a pointer stops matching a point. */
  maxFocusDistance?: number
  /** Flat scalars, not a nested object — see `chartKey` below. */
  tooltipAnchor?: ChartTooltipAnchor
  tooltipSticky?: boolean
  tooltip?: boolean
  animate?: ChartAnimate
}

/* `renderer` and `measureText` are deliberately absent: a renderer identity
   change tears the whole surface down and remounts it on every render, which
   is strictly worse than a scene rebuild. The host owns them. */
export type ChartHostProps<TDatum, TXValue extends ChartValue> = Omit<
  RendererChartCommonProps<TDatum, TXValue, number>,
  "renderer" | "measureText"
>

export type ChartProps<TDatum, TXValue extends ChartValue> = ChartHostProps<
  TDatum,
  TXValue
> & {
  definition: DomChartDefinition<TDatum, TXValue, number>
  /** `"draw"` wipes lines and areas in left to right on first render. */
  entrance?: "draw"
  children?: ReactNode
}

/** The full prop surface of a family component, from its spec options. */
export type ChartComponentProps<
  TOptions,
  TDatum,
  TXValue extends ChartValue,
> = TOptions &
  ChartBehaviorProps &
  ChartHostProps<TDatum, TXValue> & { children?: ReactNode }

/* The library tooltip surface defaults to UA `Canvas` colors and `system-ui`.
   These vars restyle it as the house popover surface; they sit on the tooltip
   element itself, so the portal cannot detach them from the chart container. */
const TOOLTIP_SURFACE_CLASS = [
  "[--ts-chart-tooltip-background:var(--color-popover)]",
  "[--ts-chart-tooltip-color:var(--color-fg)]",
  "[--ts-chart-tooltip-border:1px_solid_var(--color-border-elevated)]",
  "[--ts-chart-tooltip-border-radius:var(--popover-radius)]",
  "[--ts-chart-tooltip-shadow:var(--shadow-overlay,var(--shadow-md))]",
  "[--ts-chart-tooltip-font:500_0.75rem/1.3_var(--font-sans)]",
].join(" ")

/* One motion renderer for the whole design system, at module scope: a renderer
   identity change tears down and remounts the surface, so it must never be
   created in render. `initial: "always"` because the React adapter prerenders
   and adopts its own markup on every mount — the default "adopted SVG skips
   entrance" rule would otherwise suppress entrance everywhere, hydrated and
   client-only alike. Timing comes from the definition-level `motion` below. */
const MOTION_RENDERER = motion({ initial: "always" })

/* ------------------------------------------------------------------ */
/* Draw entrance                                                       */
/* ------------------------------------------------------------------ */

/* The renderer's own entrance grows lines and areas from the baseline. The
   path families replace that with a left-to-right draw, in two halves: the
   mark opts out of the built-in enter with this definition, and the host
   wipes a clip across the plot on first render. Updates and exits still
   inherit the chart's motion. */
export const drawEnterMotion: ChartMotionDefinition = (context) =>
  context.phase === "enter" ? false : undefined

let drawClipSequence = 0

const PATH_GROUPS =
  "g.ts-chart__line:not(.ts-chart__radial-line), g.ts-chart__area:not(.ts-chart__radial-area)"

/* An injected SVG clipPath, not a CSS `clip-path` on the groups: CSS basic
   shapes resolve against each group's own fill-box, which is degenerate for a
   flat line. The rect covers the viewBox plus a margin for strokes and edge
   dots. The renderer owns the SVG and strips foreign nodes on every
   reconciliation, so `ensure` runs after each render, re-attaching the clip
   to the current groups until the wipe lands — then everything is removed. */
function createDrawEntrance(): (container: HTMLElement) => void {
  const id = `dotui-draw-${drawClipSequence++}`
  let clip: SVGClipPathElement | null = null
  let done = false
  return function ensure(container) {
    if (done) return
    const svg = container.querySelector("svg")
    if (!svg || svg.querySelector(PATH_GROUPS) === null) return
    if (
      typeof svg.animate !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      done = true
      return
    }
    if (clip === null) {
      const box = svg.viewBox.baseVal
      const margin = 8
      const namespace = "http://www.w3.org/2000/svg"
      clip = document.createElementNS(namespace, "clipPath")
      clip.id = id
      const rect = document.createElementNS(namespace, "rect")
      rect.setAttribute("x", String(box.x - margin))
      rect.setAttribute("y", String(box.y - margin))
      rect.setAttribute("width", String(box.width + margin * 2))
      rect.setAttribute("height", String(box.height + margin * 2))
      rect.style.transformOrigin = `${box.x - margin}px 0px`
      clip.appendChild(rect)
      const cleanup = () => {
        done = true
        for (const group of container.querySelectorAll(`[clip-path*="${id}"]`))
          group.removeAttribute("clip-path")
        clip?.remove()
      }
      const animation = rect.animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        chartDefaults.draw,
      )
      animation.finished.then(cleanup, cleanup)
    }
    if (clip.parentNode !== svg) svg.appendChild(clip)
    for (const group of svg.querySelectorAll(PATH_GROUPS)) {
      group.setAttribute("clip-path", `url(#${id})`)
    }
  }
}

/* House chart host: the tooltip-capable surface from the library's `tooltip`
   entry driving the motion renderer, with the default aspect ratio built in, and
   `children` rendered as an HTML overlay above it so hover readouts repaint at
   pointer speed without touching the definition. The tooltip is portaled, so
   it always paints above the overlay. `className` lands on the outer box —
   the one the overlay is positioned against. */
export function Chart<TDatum, TXValue extends ChartValue>({
  children,
  className,
  entrance,
  onRender,
  ...props
}: ChartProps<TDatum, TXValue>) {
  const draw = useRef<ReturnType<typeof createDrawEntrance> | null>(null)
  return (
    <div className={cn("relative", className)}>
      <RendererChart
        renderer={MOTION_RENDERER}
        aspectRatio={
          props.height === undefined ? chartDefaults.aspectRatio : undefined
        }
        onRender={
          entrance === undefined
            ? onRender
            : (context) => {
                onRender?.(context)
                draw.current ??= createDrawEntrance()
                draw.current(context.container)
              }
        }
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The memo — one shared path, structurally total                      */
/* ------------------------------------------------------------------ */

/* Tracks the library's `RendererChartCommonProps` (the
   `@tanstack/charts/react/tooltip` entry) minus `renderer`/`measureText`,
   which `ChartHostProps` omits. */
const HOST_PROP_NAMES = new Set([
  "ariaLabel",
  "ariaDescription",
  "height",
  "aspectRatio",
  "width",
  "initialWidth",
  "className",
  "style",
  "tabIndex",
  "idPrefix",
  "onFocusChange",
  "onFocusGroupChange",
  "onSelect",
  "onRender",
  "renderTooltipBody",
])

const BEHAVIOR_PROP_NAMES = new Set([
  "focus",
  "maxFocusDistance",
  "tooltip",
  "tooltipAnchor",
  "tooltipSticky",
  "animate",
])

/* Props that stay identity-compared — the React list contract everyone
   already knows. Everything else is serialized. */
const REFERENCE_PROP_NAMES = new Set(["data", "marks", "marksBefore"])

function splitChartProps(props: object): {
  host: Record<string, unknown>
  behavior: ChartBehaviorProps
  spec: Record<string, unknown>
} {
  const source = props as Record<string, unknown>
  const host: Record<string, unknown> = {}
  const behavior: Record<string, unknown> = {}
  const spec: Record<string, unknown> = {}
  for (const name of Object.keys(source)) {
    const value = source[name]
    if (value === undefined || name === "children") continue
    if (HOST_PROP_NAMES.has(name)) host[name] = value
    else if (BEHAVIOR_PROP_NAMES.has(name)) behavior[name] = value
    else spec[name] = value
  }
  return { host, behavior: behavior as ChartBehaviorProps, spec }
}

/* Functions are keyed by identity, so any function-valued prop — a family's
   `formatValue`, `axisDetail` — rebuilds when its reference changes. Inline
   arrows therefore rebuild every render: the loud failure, never the stale one. */
const identities = new WeakMap<object, number>()
let nextIdentity = 0

function identityOf(value: object): string {
  let id = identities.get(value)
  if (id === undefined) {
    id = nextIdentity++
    identities.set(value, id)
  }
  return String(id)
}

function serialize(value: unknown): string {
  if (value === null) return "null"
  if (typeof value === "function") return `fn#${identityOf(value)}`
  if (typeof value !== "object")
    return typeof value === "string" ? JSON.stringify(value) : String(value)
  if (value instanceof Date) return `date#${value.getTime()}`
  if (value instanceof RegExp)
    return `re#${JSON.stringify(value.source)}#${value.flags}`
  if (Array.isArray(value)) return `[${value.map(serialize).join(",")}]`
  if (value instanceof Map)
    return `map{${[...value]
      .map(([key, entry]) => `${serialize(key)}:${serialize(entry)}`)
      .join(",")}}`
  if (value instanceof Set) return `set[${[...value].map(serialize).join(",")}]`
  const prototype: unknown = Object.getPrototypeOf(value)
  // A class instance or a configured d3 scale keeps its identity: walking its
  // enumerable keys would collide two values that behave differently.
  if (prototype !== null && prototype !== Object.prototype)
    return `obj#${identityOf(value)}`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record)
    .sort()
    .map((name) => `${JSON.stringify(name)}:${serialize(record[name])}`)
    .join(",")}}`
}

/* The contract: every prop either serializes structurally or is keyed by its
   identity — nothing is silently collapsed. Keep the props flat, so a value
   that cannot serialize is a loud over-render rather than a silent stale one. */
function chartKey(source: object): string {
  const record = source as Record<string, unknown>
  let key = ""
  for (const name of Object.keys(record).sort()) {
    if (REFERENCE_PROP_NAMES.has(name)) continue
    key += `${JSON.stringify(name)}=${serialize(record[name])};`
  }
  return key
}

function sameReferences(
  left: readonly unknown[],
  right: readonly unknown[],
): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

/* A memo with a custom comparator: a serialized key for everything flat, plus
   reference identity for the handful of props that are genuinely lists. */
export function useStructuralMemo<T>(
  compute: () => T,
  key: string,
  references: readonly unknown[],
): T {
  const cache = useRef<{
    key: string
    references: readonly unknown[]
    value: T
  } | null>(null)
  const current = cache.current
  if (
    current !== null &&
    current.key === key &&
    sameReferences(current.references, references)
  ) {
    return current.value
  }
  const value = compute()
  cache.current = { key, references, value }
  return value
}

function countPoints(spec: Record<string, unknown>): number {
  const rows = Array.isArray(spec.data) ? spec.data.length : 0
  const series = Array.isArray(spec.y) ? spec.y.length : 1
  return rows * series
}

/* Entrance choreography: bars and arcs enter in sequence, 25 ms apart. Lines
   and areas are single paths, dots and cells can number in the hundreds — for
   those, per-datum delay is either meaningless or a multi-second tail. */
const ENTER_STAGGER = stagger({
  each: chartDefaults.enterStagger,
  roles: ["arc", "bar"],
})

function resolveBehavior(behavior: ChartBehaviorProps, degrade: boolean) {
  const requested = behavior.animate ?? true
  return {
    focus: behavior.focus ?? chartDefaults.focus,
    maxFocusDistance: behavior.maxFocusDistance,
    tooltip:
      behavior.tooltip === false
        ? (false as const)
        : {
            use: tooltipExtension,
            anchor: behavior.tooltipAnchor ?? chartDefaults.tooltipAnchor,
            sticky: behavior.tooltipSticky ?? chartDefaults.tooltipSticky,
            portal: tooltipPortal,
            className: TOOLTIP_SURFACE_CLASS,
          },
    motion:
      degrade || requested === false
        ? (false as const)
        : {
            transition: requested === true ? chartDefaults.animate : requested,
            ...ENTER_STAGGER,
          },
    keyboard: true,
  }
}

/**
 * The one hook every family component calls: it splits props and memoizes the
 * definition.
 *
 * `build` is compared by identity along with `data` and the mark arrays, so
 * declare it at module scope — an inline builder rebuilds the scene on every
 * render.
 */
export function useChartDefinition<
  TDatum,
  TXValue extends ChartValue,
  TOptions,
>(
  props: object,
  build: (
    options: TOptions,
    ctx: ChartBuildContext,
  ) => ChartSpecOf<TDatum, TXValue>,
  family?: { entrance?: "draw" },
): {
  definition: DomChartDefinition<TDatum, TXValue, number>
  host: ChartHostProps<TDatum, TXValue>
  children: ReactNode
  entrance?: "draw"
} {
  const { host, behavior, spec } = splitChartProps(props)
  const options = spec as TOptions
  const degrade = countPoints(spec) > chartDefaults.animateMaxPoints
  const definition = useStructuralMemo(
    () =>
      defineChart({
        chart: (ctx) => build(options, ctx),
        ...resolveBehavior(behavior, degrade),
      }),
    `${chartKey(spec)}|${chartKey(behavior)}|${degrade}`,
    [build, spec.data, spec.marks, spec.marksBefore],
  )
  return {
    definition,
    host: host as ChartHostProps<TDatum, TXValue>,
    children: (props as { children?: ReactNode }).children,
    // The draw follows the same switch as every other entrance motion.
    entrance:
      degrade || behavior.animate === false ? undefined : family?.entrance,
  }
}

/* Internal, exported so the memo can be tested without a renderer. */
export { chartKey, sameReferences, serialize, splitChartProps }
