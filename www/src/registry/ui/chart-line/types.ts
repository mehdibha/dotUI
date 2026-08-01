import type * as React from 'react'

import type {
  ChartCurve,
  ChartFormat,
  ChartMarkLayer,
} from '@/registry/ui/chart'

export type { ChartCurve, ChartFormat }

/**
 * Line chart. Give it rows plus the fields to read: one `y` field per series
 * for wide rows, or a single `y` with `series` for long rows. Interaction and
 * animation props are shared by every family — see `ChartBehaviorProps` — and
 * the host props (`height`, `width`, `className`, callbacks) live on `Chart`.
 */
export interface LineChartProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the category or time value. */
  x: string

  /**
   * One field per series (wide rows), or a single field paired with `series`
   * (long rows).
   */
  y: string | readonly string[]

  /** Lower baseline field. Pair it with the `stackY` helper for stacked lines. */
  y1?: string

  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: string

  /** Series order. Drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]

  /** Display names for series keys, used by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /**
   * Path interpolation between points.
   * @default "natural"
   */
  curve?: ChartCurve

  /**
   * Stroke width of each line.
   * @default 2.25
   */
  strokeWidth?: number

  /**
   * Draw a dot at every point.
   * @default false
   */
  points?: boolean

  /**
   * Show the value-axis grid lines.
   * @default true
   */
  grid?: boolean

  /**
   * Show the axes and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show the color legend. Turn it off for a single series.
   * @default true
   */
  legend?: boolean

  /** Formats x tick labels — a function, or serializable `Intl` options. */
  formatX?: ChartFormat

  /** Formats y tick labels — a function, or serializable `Intl` options. */
  formatY?: ChartFormat

  /** Stable row identity, so filtered rows animate instead of respawning. */
  rowKey?: string

  /** Extra mark layers painted under the lines. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the lines — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
