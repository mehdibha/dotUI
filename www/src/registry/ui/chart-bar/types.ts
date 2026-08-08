import type * as React from "react"

import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"

export type { ChartFormat, ChartMarkLayer }

/**
 * Bar chart. Give it rows plus the fields to read: one `y` field per series
 * for wide rows, or a single `y` with `series` for long rows. Interaction and
 * animation props are shared by every family — see `ChartBehaviorProps` — and
 * the host props (`height`, `width`, `className`, callbacks) live on `Chart`.
 */
export interface BarChartProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the category or time value. */
  x: string

  /**
   * One field per series (wide rows), or a single field paired with `series`
   * (long rows).
   */
  y: string | readonly string[]

  /** Lower baseline field. Pair it with the `stackY` helper for stacked bars. */
  y1?: string

  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: string

  /**
   * Leading series order — drives color-slot assignment and the legend. Series
   * the data carries but this omits follow it.
   */
  seriesOrder?: readonly string[]

  /** Display names for series keys, used by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Stable row identity, so filtered rows animate instead of respawning. */
  rowKey?: string

  /**
   * Categories down the y axis and values along x. `formatX` still formats the
   * value axis, and `focus="group-y"` groups along the categories.
   * @default false
   */
  horizontal?: boolean

  /**
   * Side-by-side series inside each category band. Series that share a band
   * without it stack instead.
   * @default true for multi-series wide data, false otherwise
   */
  grouped?: boolean

  /**
   * Corner radius in pixels.
   * @default 4
   */
  radius?: number

  /** Pixels trimmed from both categorical edges of every bar. */
  inset?: number

  /** Bar fill opacity. Dim every bar to highlight one with an extra layer. */
  fillOpacity?: number

  /**
   * Show the axes and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show the value-axis grid lines.
   * @default true
   */
  grid?: boolean

  /**
   * Show the color legend. Turn it off for a single series.
   * @default true
   */
  legend?: boolean

  /** Formats x tick labels — a function, or serializable `Intl` options. */
  formatX?: ChartFormat

  /** Formats y tick labels — a function, or serializable `Intl` options. */
  formatY?: ChartFormat

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Extra mark layers painted under the bars. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the bars — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
