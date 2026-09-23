import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"
import type { ChartFamilyProps, ChartFocus } from "@/registry/ui/chart/types"

export type { ChartFormat, ChartMarkLayer }

/**
 * Bar chart. Give it rows plus the fields to read: one `y` field per series
 * for wide rows, or a single `y` with `series` for long rows.
 */
export interface BarChartProps extends ChartFamilyProps {
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
   * Categories down the y axis and values along x. `formatX` still formats
   * the value axis, and focus groups along the categories.
   * @default false
   */
  horizontal?: boolean

  /**
   * Side-by-side series inside each category band.
   * @default true for multi-series wide data, false otherwise
   */
  grouped?: boolean

  /**
   * Series stacked inside each band, in `seriesOrder`. `"normalize"` divides
   * each band by its own total for a 100% stack.
   * @default false
   */
  stacked?: boolean | "normalize"

  /**
   * Corner radius in pixels. Stacked bars round only the outer end.
   * @default 4
   */
  radius?: number

  /** Pixels trimmed from both categorical edges of every bar. */
  inset?: number

  /** Bar fill opacity. Dim every bar to highlight one with an extra layer. */
  fillOpacity?: number

  /**
   * Show the axes and their tick labels: both, neither, or one.
   * @default "x", or "y" when `horizontal` — the category axis
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

  /** Extra mark layers painted under the bars. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the bars — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]

  /**
   * How pointer and keyboard resolve to points.
   * @default "group-x", or "group-y" when `horizontal`
   */
  focus?: ChartFocus
}
