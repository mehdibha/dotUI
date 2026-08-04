import type * as React from 'react'

import type { ChartCurve, ChartMarkLayer } from '@/registry/ui/chart'

export type { ChartCurve }

/**
 * A tiny, chrome-free chart for stat cards and table cells: one series, no
 * axes, no grid, no legend, and no tooltip unless you ask for one. Every
 * interaction and host prop of `Chart` also applies — see `ChartBehaviorProps`
 * and `ChartProps`.
 */
export interface SparklineProps {
  /** The rows to plot. */
  data: readonly unknown[]

  /** Field holding the category or time value. */
  x: string

  /** Field holding the value. */
  y: string

  /**
   * Draw the series as a line, or as a filled area under the line.
   * @default "line"
   */
  mode?: 'line' | 'area'

  /**
   * Line interpolation.
   * @default "natural"
   */
  curve?: ChartCurve

  /**
   * Stroke and fill color — any CSS color, so a sparkline can encode its own
   * trend (green when up, red when down).
   * @default "var(--chart-1)"
   */
  color?: string

  /**
   * Area fill opacity, or `'gradient'` to fade the fill out downward. Ignored
   * in line mode.
   * @default 0.2
   */
  fill?: number | 'gradient'

  /**
   * Line thickness in pixels.
   * @default 2.25
   */
  strokeWidth?: number

  /**
   * Chart height in pixels. Sparklines default much shorter than a full chart.
   * @default 40
   */
  height?: number

  /**
   * Show the tooltip on hover and keyboard focus.
   * @default false
   */
  tooltip?: boolean

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Stable row identity, so sorted or filtered data is retained, not respawned. */
  rowKey?: string

  /** Mark layers painted under the line. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Mark layers painted over the line — reference rules, end dots, labels. */
  marks?: readonly ChartMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
