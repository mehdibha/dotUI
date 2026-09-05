import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"
import type {
  ChartFamilyProps,
  ChartFocus,
  ChartTooltipAnchor,
} from "@/registry/ui/chart/types"

export type { ChartFormat, ChartMarkLayer }

/**
 * Heatmap chart. Give it rows plus the fields to read: one row per cell, with
 * the column field, the row field, and the numeric value color carries.
 */
export interface HeatmapChartProps extends ChartFamilyProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the column category. */
  x: string

  /** Field holding the row category. */
  y: string

  /** Numeric field the color scale reads. */
  value: string

  /** Stable row identity, so filtered rows animate instead of respawning. */
  rowKey?: string

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

  /**
   * Show the axes and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show the color legend — the ramp and its bin boundaries.
   * @default true
   */
  legend?: boolean

  /** Formats x tick labels — a function, or serializable `Intl` options. */
  formatX?: ChartFormat

  /** Formats y tick labels — a function, or serializable `Intl` options. */
  formatY?: ChartFormat

  /** Extra mark layers painted under the cells. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the cells — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]

  /**
   * How pointer and keyboard resolve to points. Each cell is its own focus
   * stop.
   * @default "nearest"
   */
  focus?: ChartFocus

  /**
   * Where the tooltip attaches.
   * @default "point"
   */
  tooltipAnchor?: ChartTooltipAnchor
}
