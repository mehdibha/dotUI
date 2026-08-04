import type * as React from "react"

import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"

/**
 * A bar chart. Field props (`x`, `y`, `series`, …) name keys of your row type
 * and are checked against it. Every prop of `Chart` (`ariaLabel`, `height`,
 * `className`, `children`, the focus callbacks) and every prop of
 * `ChartBehaviorProps` (`focus`, `tooltip`, `animate`, …) is accepted too.
 */
export interface BarChartProps {
  /** The rows to plot. Compared by identity — keep it out of render. */
  data: readonly unknown[]

  /** Field holding the category. */
  x: string

  /** One field per series (wide rows), or a single field with `series`. */
  y: string | readonly string[]

  /** Lower baseline field — pair with `stackY` for stacked bars. */
  y1?: string

  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: string

  /** Series order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]

  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>

  /** Stable row identity, so sorted or filtered rows are retained, not respawned. */
  rowKey?: string

  /**
   * Categories down the y axis and values along x. `formatX` still formats the
   * value axis, and `focus="group-y"` groups along the categories.
   * @default false
   */
  horizontal?: boolean

  /**
   * Side-by-side series inside each category band.
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
   * Gridlines on the value axis.
   * @default true
   */
  grid?: boolean

  /**
   * Axis ticks and labels, on both axes.
   * @default true
   */
  axes?: boolean

  /**
   * Show the color legend. Turn it off for a single series.
   * @default true
   */
  legend?: boolean

  /** Formats x tick labels: a function, or Intl number/date options. */
  formatX?: ChartFormat

  /** Formats y tick labels: a function, or Intl number/date options. */
  formatY?: ChartFormat

  /** Mark layers painted under the bars — a baseline rule, a target band. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Mark layers painted over the bars — value labels, annotations. */
  marks?: readonly ChartMarkLayer[]

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
