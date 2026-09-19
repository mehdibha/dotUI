import type {
  ChartCurve,
  ChartFormat,
  ChartMarkLayer,
} from "@/registry/ui/chart"
import type { ChartFamilyProps } from "@/registry/ui/chart/types"

export type { ChartCurve, ChartFormat, ChartMarkLayer }

/**
 * Area chart. Give it rows plus the fields to read: one `y` field per series
 * for wide rows, or a single `y` with `series` for long rows.
 */
export interface AreaChartProps extends ChartFamilyProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the category or time value. */
  x: string

  /**
   * One field per series (wide rows), or a single field paired with `series`
   * (long rows).
   */
  y: string | readonly string[]

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
   * Series stacked on one another, in `seriesOrder`. `"normalize"` divides
   * each band by its own total for a 100% stack.
   * @default false
   */
  stacked?: boolean | "normalize"

  /**
   * Path interpolation between points.
   * @default "natural"
   */
  curve?: ChartCurve

  /**
   * Fill opacity, or `'gradient'` to fade the fill out toward the baseline.
   * @default 0.4
   */
  fill?: number | "gradient"

  /**
   * Stroke width of the upper edge.
   * @default 2
   */
  strokeWidth?: number

  /**
   * Draw a dot at every point.
   * @default false
   */
  points?: boolean

  /**
   * Show the axes and their tick labels: both, neither, or one.
   * @default "x"
   */
  axes?: boolean | "x" | "y"

  /**
   * Show the value-axis grid lines.
   * @default true
   */
  grid?: boolean

  /**
   * Show the color legend below the plot.
   * @default false
   */
  legend?: boolean

  /** Formats x tick labels. Define it outside render. */
  formatX?: ChartFormat

  /** Formats y tick labels. Define it outside render. */
  formatY?: ChartFormat

  /** Extra mark layers painted under the areas. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the areas — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]
}
