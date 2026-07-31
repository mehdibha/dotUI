/* The proposed dotUI chart primitive for the TanStack path — two layers, like
   tanstack-query's useQuery over queryOptions.

   Layer 1 (`AreaChart`, `LineChart`, `BarChart`) is the primary API: props in,
   memoization internalized, wide-format rows first, shadcn-familiar.

   Layer 2 (`areaChartSpec`…) returns a spec *fragment*, not a finished
   definition, so the advanced path can splice marks at any index, merge two
   families into a combo chart, or swap in a configured scale — while the
   phantom `__datum`/`__xValue`/`__yValue` properties carry the row type
   through `defineChart` into the host callbacks.

   Every house decision lives in `chartDefaults`. Lab-only; graduating into
   `registry/ui/chart` is a product decision. */

'use client'

import type { ReactNode } from 'react'
import { useId, useRef } from 'react'
import type {
  Channel,
  ChannelField,
  ChannelOutput,
  ChartAnimationOptions,
  ChartAxisOptions,
  ChartBuildContext,
  ChartColorOptions,
  ChartDefinition,
  ChartKey,
  ChartLinearGradient,
  ChartMark,
  ChartTheme,
  ChartValue,
  VisualChannel,
} from '@tanstack/charts'
import { areaY, barY, defineChart, lineY } from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { colorLegend } from '@tanstack/charts/legend'
import { renderChartSvgWithResources } from '@tanstack/charts/svg/resources'
import type { ChartCommonProps } from '@tanstack/react-charts'
import { Chart as TanChart } from '@tanstack/react-charts'
import { scaleBand, scaleLinear, scalePoint } from 'd3-scale'
import { curveMonotoneX, curveNatural, curveStepAfter } from 'd3-shape'

/* Every design-system decision the charts make, in one object: the single
   codegen baseline, the single publisher splice target, and the single
   auditable list of candidate builder axes. Never scatter a literal into a
   `??` fallback — read it from here. */
export const chartDefaults = {
  height: 256,
  curve: 'natural',
  strokeWidth: 2.25,
  fill: 0.2,
  points: false,
  barRadius: 4,
  bandPadding: 0.3,
  pointPadding: 0.5,
  groupPadding: 0.15,
  grid: true,
  axes: true,
  legend: true,
  focus: 'group-x',
  tooltipAnchor: 'group-center',
  tooltipSticky: true,
  animate: { duration: 240, respectReducedMotion: true },
  animateMaxPoints: 800,
  axisTickMinWidth: 420,
  axisTickCountNarrow: 4,
  gradientStops: [0.02, 0.5],
} as const

/* Module scope: identity is fixed forever, so recoloring is a CSS repaint
   rather than a scene rebuild. Eight entries because the color engine
   generates --chart-1..8; the library's own default theme has only six, so
   never rely on --ts-chart-* remapping to carry them. */
const CHART_PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
] as const

const CHART_THEME: Partial<ChartTheme> = { palette: CHART_PALETTE }

/* The PURE annotations are load-bearing: bundlers cannot prove module-scope
   calls pure, so without them all three d3-shape curves survive into a
   bar-only bundle. */
const CURVES = /* @__PURE__ */ {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
} as const

export type ChartCurve = keyof typeof CURVES
export type ChartFocus = 'nearest' | 'nearest-x' | 'group-x'
export type ChartTooltipAnchor = 'point' | 'pointer' | 'group-center'

/* The library's own public mark constraint: annotation layers rarely share
   the series row type. */
// oxlint-disable-next-line no-explicit-any
export type ChartMarkLayer = ChartMark<unknown, any, any>

/* Option-object formatters serialize into the memo key, so the most common
   inline-arrow prop stops rebuilding the scene on every render. `locale` is
   required — an ambient locale differs between Node and the browser and
   breaks hydration. */
export type ChartFormat =
  | ((value: ChartValue) => string)
  | { locale: string; number: Intl.NumberFormatOptions }
  | { locale: string; date: Intl.DateTimeFormatOptions }

type XField<TDatum> = ChannelField<TDatum, ChartValue | null | undefined>
type YField<TDatum> = ChannelField<TDatum, number | null | undefined>
type SeriesField<TDatum> = ChannelField<TDatum, ChartKey | null | undefined>
type XValueOf<TDatum, TXField> = ChannelOutput<TDatum, TXField, ChartValue>

/* ------------------------------------------------------------------ */
/* Layer 2 — spec fragments                                            */
/* ------------------------------------------------------------------ */

/* `ChartSpecDatum` branches on `__datum` before falling back to mark-tuple
   inference, so these phantoms are what preserve TDatum through defineChart.
   `x`/`y` must be required: optional ones fail the CheckedChartSpec
   constraint outright. */
export interface ChartSpecOf<TDatum, TXValue extends ChartValue> {
  marks: readonly ChartMarkLayer[]
  x: ChartAxisOptions | null
  y: ChartAxisOptions | null
  color?: ChartColorOptions
  gradients?: readonly ChartLinearGradient[]
  theme?: Partial<ChartTheme>
  readonly __datum?: TDatum
  readonly __xValue?: TXValue
  readonly __yValue?: number
}

export interface XYChartSpecOptions<TDatum, TXField extends XField<TDatum>> {
  data: readonly TDatum[]
  /** Field holding the category / time value. */
  x: TXField
  /** One field per series (wide rows), or a single field with `series`. */
  y: YField<TDatum> | readonly YField<TDatum>[]
  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: SeriesField<TDatum>
  /** Series order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]
  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>
  /** Stable row identity, so sorted or filtered data is retained, not respawned. */
  rowKey?: ChannelField<TDatum, ChartKey>
  grid?: boolean
  axes?: boolean
  legend?: boolean
  formatX?: ChartFormat
  formatY?: ChartFormat
  /** Mark layers painted under the built-ins. */
  marksBefore?: readonly ChartMarkLayer[]
  /** Mark layers painted over the built-ins. */
  marks?: readonly ChartMarkLayer[]
}

export interface AreaChartSpecOptions<
  TDatum,
  TXField extends XField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  curve?: ChartCurve
  /** Fill opacity 0–1, or 'gradient' for a fade-to-transparent fill. */
  fill?: number | 'gradient'
  strokeWidth?: number
  points?: boolean
  /** Scopes the declared gradient resources; the components pass `useId()`. */
  gradientIdPrefix?: string
}

export interface LineChartSpecOptions<
  TDatum,
  TXField extends XField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  curve?: ChartCurve
  strokeWidth?: number
  points?: boolean
}

export interface BarChartSpecOptions<
  TDatum,
  TXField extends XField<TDatum>,
> extends XYChartSpecOptions<TDatum, TXField> {
  radius?: number
}

interface ChartLayer<TDatum, TXField extends XField<TDatum>> {
  channels: {
    x: TXField
    y: YField<TDatum>
    z: Channel<TDatum, ChartKey | null | undefined>
    color: Channel<TDatum, ChartKey | null | undefined>
    key?: ChannelField<TDatum, ChartKey>
  }
  gradientFill: (prefix: string) => VisualChannel<TDatum, string>
}

function toFields<T>(value: T | readonly T[]): readonly [T, ...T[]] {
  return (Array.isArray(value) ? value : [value]) as readonly [T, ...T[]]
}

function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_PALETTE[0]
}

function resolveFormat(
  format: ChartFormat | undefined,
): ((value: ChartValue) => string) | undefined {
  if (format === undefined) return undefined
  if (typeof format === 'function') return format
  if ('number' in format) {
    const formatter = new Intl.NumberFormat(format.locale, format.number)
    return (value) => formatter.format(Number(value))
  }
  const formatter = new Intl.DateTimeFormat(format.locale, format.date)
  return (value) =>
    formatter.format(value instanceof Date ? value : new Date(value))
}

/* Wide rows become one mark layer per `y` field; long rows become a single
   layer split by the `series` channel. Order is always explicit, never
   derived from a Set over the data, so SSR and the client agree. */
function planChart<TDatum, TXField extends XField<TDatum>>(
  options: XYChartSpecOptions<TDatum, TXField>,
): {
  order: readonly string[]
  layers: readonly ChartLayer<TDatum, TXField>[]
} {
  const labelOf = (key: string) => options.labels?.[key] ?? key
  const fields = toFields(options.y)

  if (options.series !== undefined) {
    const field = options.series as keyof TDatum
    const seriesOf = (row: TDatum) => labelOf(String(row[field]))
    const order = options.seriesOrder
      ? options.seriesOrder.map(labelOf)
      : [...new Set(options.data.map(seriesOf))]
    return {
      order,
      layers: [
        {
          channels: {
            x: options.x,
            y: fields[0],
            z: seriesOf,
            color: seriesOf,
            key: options.rowKey,
          },
          gradientFill: (prefix) => (row: TDatum) =>
            `url(#${prefix}-${Math.max(0, order.indexOf(seriesOf(row)))})`,
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
      const label = order[index] ?? field
      return {
        channels: {
          x: options.x,
          y: field,
          z: () => label,
          color: () => label,
          key: options.rowKey,
        },
        gradientFill: (prefix) => `url(#${prefix}-${index})`,
      }
    }),
  }
}

/* The axes, color scale and theme every family shares. `ctx` is the library's
   zero-cost responsiveness lever — the builder re-runs inside every scene
   build with no identity change, so tick density can track width for free. */
function chartFrame<TDatum, TXField extends XField<TDatum>>(
  options: XYChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
  order: readonly string[],
  band: boolean,
): Pick<ChartSpecOf<TDatum, ChartValue>, 'x' | 'y' | 'color' | 'theme'> {
  const axes = options.axes ?? chartDefaults.axes
  const formatX = resolveFormat(options.formatX)
  const formatY = resolveFormat(options.formatY)
  return {
    x: {
      scale: band
        ? () => scaleBand().padding(chartDefaults.bandPadding)
        : () => scalePoint().padding(chartDefaults.pointPadding),
      guide: axes,
      format: formatX,
      ticks:
        ctx.width < chartDefaults.axisTickMinWidth
          ? chartDefaults.axisTickCountNarrow
          : undefined,
    },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: options.grid ?? chartDefaults.grid,
      guide: axes,
      format: formatY,
    },
    color: {
      domain: order,
      legend:
        (options.legend ?? chartDefaults.legend) ? colorLegend() : undefined,
    },
    theme: CHART_THEME,
  }
}

export function areaChartSpec<TDatum, TXField extends XField<TDatum>>(
  options: AreaChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, XValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  const strokeWidth = options.strokeWidth ?? chartDefaults.strokeWidth
  const points = options.points ?? chartDefaults.points
  const fill = options.fill ?? chartDefaults.fill
  const gradient = fill === 'gradient'
  const prefix = `${options.gradientIdPrefix ?? 'dotui'}-area`
  const [from, to] = chartDefaults.gradientStops
  return {
    ...chartFrame(options, ctx, order, false),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.flatMap((layer) => [
        areaY(options.data, {
          ...layer.channels,
          fillOpacity: gradient ? 1 : fill,
          fill: gradient ? layer.gradientFill(prefix) : undefined,
          curve,
        }),
        lineY(options.data, {
          ...layer.channels,
          strokeWidth,
          points,
          curve,
        }),
      ]),
      ...(options.marks ?? []),
    ],
    gradients: gradient
      ? order.map((_, index) => ({
          id: `${prefix}-${index}`,
          y1: 1,
          y2: 0,
          stops: [
            { offset: 0, color: paletteColor(index), opacity: from },
            { offset: 1, color: paletteColor(index), opacity: to },
          ],
        }))
      : undefined,
  }
}

export function lineChartSpec<TDatum, TXField extends XField<TDatum>>(
  options: LineChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, XValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const curve = CURVES[options.curve ?? chartDefaults.curve]
  const strokeWidth = options.strokeWidth ?? chartDefaults.strokeWidth
  const points = options.points ?? chartDefaults.points
  return {
    ...chartFrame(options, ctx, order, false),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.map((layer) =>
        lineY(options.data, { ...layer.channels, strokeWidth, points, curve }),
      ),
      ...(options.marks ?? []),
    ],
  }
}

export function barChartSpec<TDatum, TXField extends XField<TDatum>>(
  options: BarChartSpecOptions<TDatum, TXField>,
  ctx: ChartBuildContext,
): ChartSpecOf<TDatum, XValueOf<TDatum, TXField>> {
  const { order, layers } = planChart(options)
  const radius = options.radius ?? chartDefaults.barRadius
  const groupScale =
    order.length > 1
      ? scaleBand().domain(order).padding(chartDefaults.groupPadding)
      : undefined
  return {
    ...chartFrame(options, ctx, order, true),
    marks: [
      ...(options.marksBefore ?? []),
      ...layers.map((layer) =>
        barY(options.data, { ...layer.channels, groupScale, radius }),
      ),
      ...(options.marks ?? []),
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Layer 1 — components                                                */
/* ------------------------------------------------------------------ */

/* Function easing is excluded: `animate` enters the serialized memo key, and
   a closure cannot be keyed — a changed easing function would never rebuild. */
export type ChartAnimate =
  | boolean
  | (Omit<ChartAnimationOptions, 'easing'> & {
      easing?: Extract<ChartAnimationOptions['easing'], string>
    })

export interface ChartBehaviorProps {
  focus?: ChartFocus
  /** Flat scalars, not a nested object — see `chartKey` below. */
  tooltipAnchor?: ChartTooltipAnchor
  tooltipSticky?: boolean
  tooltip?: false
  animate?: ChartAnimate
}

/* `renderSvg` and `measureText` are deliberately absent: a renderer identity
   change tears the whole surface down and remounts it on every render, which
   is strictly worse than a scene rebuild. The host owns them. */
export type ChartHostProps<TDatum, TXValue extends ChartValue> = Omit<
  ChartCommonProps<TDatum, TXValue, number>,
  'renderSvg' | 'measureText'
>

export type ChartProps<TDatum, TXValue extends ChartValue> = ChartHostProps<
  TDatum,
  TXValue
> & {
  definition: ChartDefinition<TDatum, TXValue, number>
  children?: ReactNode
}

/* House chart host: the resource-aware renderer and default height are built
   in, and `children` renders as an HTML overlay above the surface so hover
   readouts repaint at pointer speed without touching the definition. The
   tooltip is portaled, so it always paints above the overlay. */
export function Chart<TDatum, TXValue extends ChartValue>({
  children,
  ...props
}: ChartProps<TDatum, TXValue>) {
  return (
    <div className="relative">
      <TanChart
        height={chartDefaults.height}
        {...props}
        renderSvg={renderChartSvgWithResources}
      />
      {children === undefined ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  )
}

export type AreaChartProps<TDatum, TXField extends XField<TDatum>> = Omit<
  AreaChartSpecOptions<TDatum, TXField>,
  'gradientIdPrefix'
> &
  ChartBehaviorProps &
  ChartHostProps<TDatum, XValueOf<TDatum, TXField>> & { children?: ReactNode }

export type LineChartProps<
  TDatum,
  TXField extends XField<TDatum>,
> = LineChartSpecOptions<TDatum, TXField> &
  ChartBehaviorProps &
  ChartHostProps<TDatum, XValueOf<TDatum, TXField>> & { children?: ReactNode }

export type BarChartProps<
  TDatum,
  TXField extends XField<TDatum>,
> = BarChartSpecOptions<TDatum, TXField> &
  ChartBehaviorProps &
  ChartHostProps<TDatum, XValueOf<TDatum, TXField>> & { children?: ReactNode }

export function AreaChart<TDatum, TXField extends XField<TDatum>>(
  props: AreaChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useXYChart<
    TDatum,
    XValueOf<TDatum, TXField>,
    AreaChartSpecOptions<TDatum, TXField>
  >(props, areaChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}

export function LineChart<TDatum, TXField extends XField<TDatum>>(
  props: LineChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useXYChart<
    TDatum,
    XValueOf<TDatum, TXField>,
    LineChartSpecOptions<TDatum, TXField>
  >(props, lineChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}

export function BarChart<TDatum, TXField extends XField<TDatum>>(
  props: BarChartProps<TDatum, TXField>,
) {
  const { definition, host, children } = useXYChart<
    TDatum,
    XValueOf<TDatum, TXField>,
    BarChartSpecOptions<TDatum, TXField>
  >(props, barChartSpec)
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  )
}

/* ------------------------------------------------------------------ */
/* The memo — one shared path, structurally total                      */
/* ------------------------------------------------------------------ */

const HOST_PROP_NAMES = new Set([
  'ariaLabel',
  'ariaDescription',
  'height',
  'aspectRatio',
  'width',
  'initialWidth',
  'className',
  'style',
  'tabIndex',
  'idPrefix',
  'onFocusChange',
  'onFocusGroupChange',
  'onSelect',
  'onRender',
  'renderTooltipBody',
])

const BEHAVIOR_PROP_NAMES = new Set([
  'focus',
  'tooltip',
  'tooltipAnchor',
  'tooltipSticky',
  'animate',
])

/* Props that stay identity-compared — the React list contract everyone
   already knows. Everything else is serialized. */
const REFERENCE_PROP_NAMES = new Set(['data', 'marks', 'marksBefore'])

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
    if (value === undefined || name === 'children') continue
    if (HOST_PROP_NAMES.has(name)) host[name] = value
    else if (BEHAVIOR_PROP_NAMES.has(name)) behavior[name] = value
    else spec[name] = value
  }
  return { host, behavior: behavior as ChartBehaviorProps, spec }
}

function serialize(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'function') return 'fn'
  if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record)
      .sort()
      .map((name) => `${name}:${serialize(record[name])}`)
      .join(',')}}`
  }
  return String(value)
}

/* Total by construction: the prop types are structurally flat, so nothing can
   hide behind a nested option object. Keep them flat — a nested option would
   turn a loud over-render into a silent stale-render. */
function chartKey(source: object): string {
  const record = source as Record<string, unknown>
  let key = ''
  for (const name of Object.keys(record).sort()) {
    if (REFERENCE_PROP_NAMES.has(name)) continue
    key += `${name}=${serialize(record[name])};`
  }
  return key
}

function chartReferences(spec: Record<string, unknown>): readonly unknown[] {
  return [
    spec.data,
    spec.marks,
    spec.marksBefore,
    typeof spec.formatX === 'function' ? spec.formatX : null,
    typeof spec.formatY === 'function' ? spec.formatY : null,
  ]
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
function useStructuralMemo<T>(
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

function resolveBehavior(behavior: ChartBehaviorProps, degrade: boolean) {
  const requested = behavior.animate ?? true
  return {
    focus: behavior.focus ?? chartDefaults.focus,
    tooltip:
      behavior.tooltip === false
        ? (false as const)
        : {
            anchor: behavior.tooltipAnchor ?? chartDefaults.tooltipAnchor,
            sticky: behavior.tooltipSticky ?? chartDefaults.tooltipSticky,
            portal: true,
          },
    animate: degrade
      ? false
      : requested === true
        ? chartDefaults.animate
        : requested,
    keyboard: true,
  }
}

function useXYChart<TDatum, TXValue extends ChartValue, TOptions>(
  props: object,
  build: (
    options: TOptions,
    ctx: ChartBuildContext,
  ) => ChartSpecOf<TDatum, TXValue>,
): {
  definition: ChartDefinition<TDatum, TXValue, number>
  host: ChartHostProps<TDatum, TXValue>
  children: ReactNode
} {
  /* Scopes gradient resources so two charts on one page cannot collide. */
  const gradientIdPrefix = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { host, behavior, spec } = splitChartProps(props)
  const options = { ...spec, gradientIdPrefix } as TOptions
  const degrade = countPoints(spec) > chartDefaults.animateMaxPoints
  const definition = useStructuralMemo(
    () =>
      defineChart({
        chart: (ctx) => build(options, ctx),
        ...resolveBehavior(behavior, degrade),
      }),
    `${chartKey(spec)}|${chartKey(behavior)}|${degrade}`,
    chartReferences(spec),
  )
  return {
    definition,
    host: host as ChartHostProps<TDatum, TXValue>,
    children: (props as { children?: ReactNode }).children,
  }
}
