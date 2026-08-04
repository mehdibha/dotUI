import type * as React from 'react'

import type { ChartFormat } from '@/registry/ui/chart'

import type { PolarMarkLayer } from './base'

export type { ChartFormat }

/**
 * Radar chart. Give it one row per category plus the fields to read: one `y`
 * field per series for wide rows, or a single `y` with `series` for long rows.
 * Interaction and animation props are shared by every family — see
 * `ChartBehaviorProps` — and the host props (`height`, `width`, `className`,
 * callbacks) live on `Chart`.
 */
export interface RadarChartProps {
  /** The rows to plot, one per category. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the category laid around the circumference. */
  x: string

  /**
   * One field per series (wide rows), or a single field paired with `series`
   * (long rows).
   */
  y: string | readonly string[]

  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: string

  /** Series order. Drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]

  /** Display names for series keys, used by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /**
   * Series fill opacity. `0` draws outlines only.
   * @default 0.6
   */
  fill?: number

  /**
   * Stroke width of the outline.
   * @default 2.25
   */
  strokeWidth?: number

  /**
   * Draw a dot at every point.
   * @default false
   */
  points?: boolean

  /**
   * Show the rings.
   * @default true
   */
  grid?: boolean

  /**
   * Ring shape.
   * @default "polygon"
   */
  gridShape?: 'circle' | 'polygon'

  /**
   * Number of rings.
   * @default 4
   */
  gridTicks?: number

  /** Fill opacity of the area inside the outer ring. Omitted leaves it unfilled. */
  gridFill?: number

  /**
   * Color of that fill.
   * @default "var(--chart-1)"
   */
  gridFillColor?: string

  /**
   * Draw the spokes running out to each category.
   * @default matches `grid`
   */
  spokes?: boolean

  /**
   * Show the circumference labels.
   * @default true
   */
  axes?: boolean

  /** A second, muted label line above each category label — a function, or serializable `Intl` options. */
  axisDetail?: ChartFormat

  /**
   * Show the color legend. Turn it off for a single series.
   * @default true
   */
  legend?: boolean

  /** Formats the circumference labels and the tooltip title. */
  formatX?: ChartFormat

  /** Formats the tooltip values. */
  formatY?: ChartFormat

  /**
   * Fraction of the available radius the chart fills.
   * @default 0.78
   */
  radiusRatio?: number

  /** Outer value of the radius scale. Defaults to the largest value, rounded up. */
  max?: number

  /** Stable row identity, so filtered rows animate instead of respawning. */
  rowKey?: string

  /** Extra mark layers spliced into the polar container — cartesian marks would land outside it. */
  polarMarks?: readonly PolarMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
