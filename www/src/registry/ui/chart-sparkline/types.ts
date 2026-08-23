import type { ChartCurve, ChartMarkLayer } from "@/registry/ui/chart"
import type { ChartFamilyProps } from "@/registry/ui/chart/types"

export type { ChartCurve, ChartMarkLayer }

/**
 * Sparkline. A chrome-free single series for stat cards and table cells: give
 * it rows plus the `x` and `y` fields to read — there are no axes, no grid and
 * no legend to configure.
 */
export interface SparklineProps extends ChartFamilyProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the category or time value. */
  x: string

  /** Field holding the value. */
  y: string

  /** Stable row identity, so filtered rows animate instead of respawning. */
  rowKey?: string

  /**
   * Draw the series as a line, or as a filled area under the line.
   * @default "line"
   */
  mode?: "line" | "area"

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
  fill?: number | "gradient"

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
   * Show the tooltip on hover and keyboard focus. Off by default, so the focus
   * stops have no live region until you turn it on.
   * @default false
   */
  tooltip?: boolean

  /** Extra mark layers painted under the line. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the line — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]
}
