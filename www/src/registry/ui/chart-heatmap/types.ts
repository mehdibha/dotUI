import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"

export type { ChartFormat }

/**
 * A matrix of cells: two categorical axes, and one numeric value per cell
 * carried by color. Every interaction and host prop of `Chart` also applies —
 * see `ChartBehaviorProps` and `ChartProps`.
 */
export interface HeatmapChartProps {
  /** The rows to plot — one per cell. Compared by identity. */
  data: readonly unknown[]

  /** Field holding the column category. */
  x: string

  /** Field holding the row category. */
  y: string

  /** Numeric field the color scale reads. */
  value: string

  /**
   * The color ramp, low to high. Its length is the number of bins.
   * @default heatmapColors()
   */
  colors?: readonly string[]

  /**
   * Explicit cuts between bins — one fewer than `colors`. Without them the
   * scale splits the observed extent into equal bins.
   */
  thresholds?: readonly number[]

  /**
   * Draw each value inside its cell. Only legible on large cells.
   * @default false
   */
  values?: boolean

  /** Formats values in the legend, the tooltip, and the cells. */
  formatValue?: ChartFormat

  /** What the value means — the legend title and the tooltip label. */
  label?: string

  /** Column-axis title. It also names the coordinate in the tooltip. */
  labelX?: string

  /** Row-axis title. It also names the coordinate in the tooltip. */
  labelY?: string

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /**
   * Show the axes and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show the color legend.
   * @default true
   */
  legend?: boolean

  /** Formats the column tick labels — a function, or `Intl` options. */
  formatX?: ChartFormat

  /** Formats the row tick labels — a function, or `Intl` options. */
  formatY?: ChartFormat

  /** Stable row identity, so sorted or filtered data is retained, not respawned. */
  rowKey?: string

  /** Mark layers painted under the cells. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Mark layers painted over the cells — annotations, labels, outlines. */
  marks?: readonly ChartMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
