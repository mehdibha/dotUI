import type * as React from 'react'

import type { ChartFormat, ChartMarkLayer } from '@/registry/ui/chart'

/**
 * A scatter plot: one dot per row, positioned by two quantitative fields, with
 * optional color grouping and an optional radius channel for bubbles.
 *
 * It also accepts every prop of `Chart` (`ariaLabel`, `height`, `className`, …)
 * and every interaction prop of `ChartBehaviorProps`.
 */
export interface ScatterChartProps {
  /** Rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field on the horizontal axis. Must be numeric. */
  x: string

  /** Field on the vertical axis. Must be numeric. */
  y: string

  /**
   * Field sizing each dot. Values map to `radiusRange` through an
   * area-preserving square-root scale, so area — not radius — reads as
   * magnitude. Omit it for a plain scatter.
   */
  r?: string

  /**
   * Dot radius in pixels, used when `r` is absent.
   * @default 4
   */
  radius?: number

  /**
   * Smallest and largest dot radius in pixels, used when `r` is set.
   * @default [3, 18]
   */
  radiusRange?: readonly [number, number]

  /** Field splitting rows into colored groups. */
  series?: string

  /** Group order. Drives color-slot assignment and legend order. */
  seriesOrder?: readonly string[]

  /** Display names for group keys, used by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Dot opacity. Lower it when points overlap. */
  fillOpacity?: number

  /** Stable row identity, so filtered or re-sorted data animates instead of respawning. */
  rowKey?: string

  /**
   * Show the axis lines and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show grid lines. Scatter draws them on both axes.
   * @default true
   */
  grid?: boolean

  /**
   * Show the color legend. Defaults to `true` once `series` is set, and to
   * `false` for an ungrouped scatter, where a one-entry legend is noise.
   */
  legend?: boolean

  /** Formats x tick labels: a function, or `Intl` options with a locale. */
  formatX?: ChartFormat

  /** Formats y tick labels: a function, or `Intl` options with a locale. */
  formatY?: ChartFormat

  /** Extra mark layers painted under the dots — a regression line, a rule. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the dots — labels, annotations. */
  marks?: readonly ChartMarkLayer[]

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
