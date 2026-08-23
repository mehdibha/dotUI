import type { ChartFormat, ChartMarkLayer } from "@/registry/ui/chart"
import type {
  ChartFamilyProps,
  ChartFocus,
  ChartTooltipAnchor,
} from "@/registry/ui/chart/types"

export type { ChartFormat, ChartMarkLayer }

/**
 * Scatter plot. Give it rows plus the two quantitative fields that position
 * them: `series` colors the dots, `r` sizes them.
 */
export interface ScatterChartProps extends ChartFamilyProps {
  /** The rows to plot. Compared by identity — define it outside render. */
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

  /** Field splitting rows into colored groups. */
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
   * Dot radius in pixels, used when `r` is absent.
   * @default 4
   */
  radius?: number

  /**
   * Smallest and largest dot radius in pixels, used when `r` is set.
   * @default [3, 18]
   */
  radiusRange?: readonly [number, number]

  /** Dot opacity. Lower it when points overlap. */
  fillOpacity?: number

  /**
   * Show the axes and their tick labels.
   * @default true
   */
  axes?: boolean

  /**
   * Show the grid lines. Scatter draws them on both axes.
   * @default true
   */
  grid?: boolean

  /**
   * Show the color legend. Defaults to `true` once `series` is set, and to
   * `false` for an ungrouped scatter, where a one-entry legend is noise.
   */
  legend?: boolean

  /** Formats x tick labels — a function, or serializable `Intl` options. */
  formatX?: ChartFormat

  /** Formats y tick labels — a function, or serializable `Intl` options. */
  formatY?: ChartFormat

  /** Extra mark layers painted under the dots. */
  marksBefore?: readonly ChartMarkLayer[]

  /** Extra mark layers painted over the dots — annotations, rules, labels. */
  marks?: readonly ChartMarkLayer[]

  /**
   * How pointer and keyboard resolve to points. Dots are matched one at a
   * time — positions rarely align on either axis.
   * @default "nearest"
   */
  focus?: ChartFocus

  /**
   * Where the tooltip attaches.
   * @default "point"
   */
  tooltipAnchor?: ChartTooltipAnchor
}
