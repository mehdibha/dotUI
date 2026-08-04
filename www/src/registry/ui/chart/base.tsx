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
  ChartMargin,
  ChartMark,
  ChartTheme,
  ChartValue,
  VisualChannel,
} from '@tanstack/charts'
import { defineChart } from '@tanstack/charts'
import { colorLegend } from '@tanstack/charts/legend'
import { renderChartSvgWithResources } from '@tanstack/charts/svg/resources'
import type { ChartCommonProps } from '@tanstack/react-charts'
import { Chart as TanChart } from '@tanstack/react-charts'
import { scaleBand, scaleLinear, scalePoint } from 'd3-scale'

import { cn } from '@/registry/lib/utils'

/* Chart core: the host, the house defaults, and the frame every chart family
   composes. No mark is imported here — families own theirs, so a bar chart
   never pulls d3-shape. */

/* Every design-system decision the charts make, in one object: the single
   codegen baseline and the single auditable list of candidate builder axes.
   Never scatter a literal into a `??` fallback — read it from here. */
export const chartDefaults = {
  height: 256,
  sparklineHeight: 40,
  curve: 'natural',
  strokeWidth: 2.25,
  fill: 0.2,
  points: false,
  dotRadius: 4,
  bubbleRadius: [3, 18],
  barRadius: 4,
  cellRadius: 2,
  cellInset: 1,
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
export const CHART_PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
] as const

export const CHART_THEME: Partial<ChartTheme> = { palette: CHART_PALETTE }

export function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_PALETTE[0]
}

/* ------------------------------------------------------------------ */
/* Shared types                                                        */
/* ------------------------------------------------------------------ */

export type ChartCurve = 'linear' | 'natural' | 'monotone' | 'step'
export type ChartFocus =
  | 'nearest'
  | 'nearest-x'
  | 'nearest-y'
  | 'group-x'
  | 'group-y'
export type ChartTooltipAnchor = 'point' | 'pointer' | 'group-center'

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
   an interactive mark already carries. Accepts cartesian and polar marks. */
export function decorative<TMark extends DecorativeMark>(mark: TMark): TMark {
  const initialize = (context: never) => {
    const initialized = mark.initialize(context)
    return {
      ...initialized,
      render: (renderContext: never) => ({
        nodes: initialized.render(renderContext).nodes,
      }),
    }
  }
  return { ...mark, initialize } as TMark
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
   `x`/`y` must be required: optional ones fail the CheckedChartSpec
   constraint outright. */
export interface ChartSpecOf<TDatum, TXValue extends ChartValue> {
  marks: readonly ChartMarkLayer[]
  x: ChartAxisOptions | null
  y: ChartAxisOptions | null
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
  axes?: boolean
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
  /** Scopes declared gradient resources; the components pass `useId()`. */
  gradientIdPrefix?: string
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
  /** Series order — drives color-slot assignment and the legend. */
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
  if (typeof format === 'function') return format
  if ('number' in format) {
    const formatter = new Intl.NumberFormat(format.locale, format.number)
    return (value) => formatter.format(Number(value))
  }
  const formatter = new Intl.DateTimeFormat(format.locale, format.date)
  return (value) =>
    formatter.format(value instanceof Date ? value : new Date(value))
}

/* ------------------------------------------------------------------ */
/* Series plan                                                         */
/* ------------------------------------------------------------------ */

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
  /** Paints this layer with its palette-slot gradient. */
  gradientFill: (prefix: string) => VisualChannel<TDatum, string>
}

export interface ChartPlan<TDatum, TXField extends ChartXField<TDatum>> {
  /** Series labels, in color-slot and legend order. */
  order: readonly string[]
  layers: readonly ChartLayer<TDatum, TXField>[]
}

function toFields<T>(value: T | readonly T[]): readonly [T, ...T[]] {
  const fields = Array.isArray(value) ? value : [value]
  if (fields.length === 0)
    throw new Error('charts: `y` needs at least one field')
  return fields as readonly [T, ...T[]]
}

/* Wide rows become one mark layer per `y` field; long rows become a single
   layer split by the `series` channel. Order is always explicit, never
   derived from a Set over the data, so SSR and the client agree. */
export function planChart<TDatum, TXField extends ChartXField<TDatum>>(
  options: XYChartSpecOptions<TDatum, TXField>,
): ChartPlan<TDatum, TXField> {
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
            y1: options.y1,
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
          y1: options.y1,
          z: () => label,
          color: () => label,
          key: options.rowKey,
        },
        gradientFill: (prefix) => `url(#${prefix}-${index})`,
      }
    }),
  }
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

export type ChartScaleKind = 'band' | 'point' | 'linear'
type ChartScaleOption = ChartAxisOptions['scale']

const SCALES: Record<ChartScaleKind, () => ChartScaleOption> = {
  band: () => scaleBand().padding(chartDefaults.bandPadding),
  point: () => scalePoint().padding(chartDefaults.pointPadding),
  linear: () => scaleLinear(),
}

export interface ChartFrameSpec {
  /** Color-scale domain and legend order — usually `planChart().order`. */
  order?: readonly string[]
  /** Scale kind, or axis overrides merged over the computed axis. */
  x?: ChartScaleKind | Partial<ChartAxisOptions>
  y?: ChartScaleKind | Partial<ChartAxisOptions>
  /** Axis carrying the grid. */
  grid?: 'x' | 'y' | 'both' | 'none'
  /** Merged over the categorical default — a sequential scale goes here. */
  color?: ChartColorOptions
}

export interface ChartFrame {
  x: ChartAxisOptions | null
  y: ChartAxisOptions | null
  color?: ChartColorOptions
  theme?: Partial<ChartTheme>
}

function frameAxis(
  spec: ChartScaleKind | Partial<ChartAxisOptions> | undefined,
  fallback: ChartScaleKind,
  base: Omit<ChartAxisOptions, 'scale'>,
): ChartAxisOptions {
  const kind = typeof spec === 'string' ? spec : fallback
  const overrides = typeof spec === 'string' || spec === undefined ? null : spec
  return {
    scale: SCALES[kind],
    nice: kind === 'linear',
    ...base,
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
  const guide = options.axes ?? chartDefaults.axes
  const grid = options.grid ?? chartDefaults.grid
  const where = spec.grid ?? 'y'
  const legend =
    (options.legend ?? chartDefaults.legend) ? colorLegend() : undefined
  const order = spec.order ?? []
  return {
    x: frameAxis(spec.x, 'point', {
      guide,
      grid: grid && (where === 'x' || where === 'both'),
      format: resolveFormat(options.formatX),
      ticks:
        ctx.width < chartDefaults.axisTickMinWidth
          ? chartDefaults.axisTickCountNarrow
          : undefined,
    }),
    y: frameAxis(spec.y, 'linear', {
      guide,
      grid: grid && (where === 'y' || where === 'both'),
      format: resolveFormat(options.formatY),
    }),
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

export function gradientPrefix(
  idPrefix: string | undefined,
  family: string,
): string {
  return `${idPrefix ?? 'dotui'}-${family}`
}

/** One fade-to-transparent gradient per palette slot, `${prefix}-${index}`. */
export function paletteGradients(
  prefix: string,
  count: number,
): readonly ChartLinearGradient[] {
  const [from, to] = chartDefaults.gradientStops
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    y1: 1,
    y2: 0,
    stops: [
      { offset: 0, color: paletteColor(index), opacity: from },
      { offset: 1, color: paletteColor(index), opacity: to },
    ],
  }))
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
  /** Divide each x group by its own total, for a 100% stack. */
  normalize?: boolean
}

function finiteOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/* Wide rows in, long rows out: `top`/`base` carry the interval the mark draws,
   `value` keeps the original contribution. Null contributions leave a gap
   instead of a zero-height band. Call it at module scope — the result is
   identity-compared. */
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
    let base = 0
    for (const field of options.y) {
      const raw = finiteOrNull(source[field])
      const value =
        raw === null ? null : options.normalize ? safeShare(raw, total) : raw
      const top = value === null ? null : base + value
      rows.push({
        ...row,
        x: source[options.x] as ChartValue,
        series: field,
        value,
        base,
        top,
      } as StackedDatum<TDatum>)
      base = top ?? base
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
  | (Omit<ChartAnimationOptions, 'easing'> & {
      easing?: Extract<ChartAnimationOptions['easing'], string>
    })

export interface ChartBehaviorProps {
  focus?: ChartFocus
  /** Pixel radius beyond which a pointer stops matching a point. */
  maxFocusDistance?: number
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

/** The full prop surface of a family component, from its spec options. */
export type ChartComponentProps<
  TOptions,
  TDatum,
  TXValue extends ChartValue,
> = Omit<TOptions, 'gradientIdPrefix'> &
  ChartBehaviorProps &
  ChartHostProps<TDatum, TXValue> & { children?: ReactNode }

/* House chart host: the resource-aware renderer and default height are built
   in, and `children` renders as an HTML overlay above the surface so hover
   readouts repaint at pointer speed without touching the definition. The
   tooltip is portaled, so it always paints above the overlay. `className`
   lands on the outer box — the one the overlay is positioned against. */
export function Chart<TDatum, TXValue extends ChartValue>({
  children,
  className,
  ...props
}: ChartProps<TDatum, TXValue>) {
  return (
    <div className={cn('relative', className)}>
      <TanChart
        height={
          props.aspectRatio === undefined ? chartDefaults.height : undefined
        }
        {...props}
        renderSvg={renderChartSvgWithResources}
      />
      {children == null || typeof children === 'boolean' ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
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
  'maxFocusDistance',
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

/* Functions are keyed by identity, so any function-valued prop — a family's
   `formatValue`, `axisDetail` — rebuilds when its reference changes. Inline
   arrows therefore rebuild every render: the loud failure, never the stale one. */
const functionIds = new WeakMap<object, number>()
let nextFunctionId = 0

function serialize(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'function') {
    let id = functionIds.get(value)
    if (id === undefined) {
      id = nextFunctionId++
      functionIds.set(value, id)
    }
    return `fn#${id}`
  }
  if (value instanceof Date) return `date#${value.getTime()}`
  if (Array.isArray(value)) return `[${value.map(serialize).join(',')}]`
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record)
      .sort()
      .map((name) => `${name}:${serialize(record[name])}`)
      .join(',')}}`
  }
  return typeof value === 'string' ? JSON.stringify(value) : String(value)
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
  return [spec.data, spec.marks, spec.marksBefore]
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

function resolveBehavior(behavior: ChartBehaviorProps, degrade: boolean) {
  const requested = behavior.animate ?? true
  return {
    focus: behavior.focus ?? chartDefaults.focus,
    maxFocusDistance: behavior.maxFocusDistance,
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

/* The one hook every family component calls: splits props, memoizes the
   definition, and scopes gradient ids so two charts on one page cannot
   collide. */
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
): {
  definition: ChartDefinition<TDatum, TXValue, number>
  host: ChartHostProps<TDatum, TXValue>
  children: ReactNode
} {
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
