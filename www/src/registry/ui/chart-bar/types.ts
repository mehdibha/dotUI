import type { ChartMarkState, ChartValue } from "@tanstack/charts"

/**
 * Builds a complete bar chart for `defineChart`. Give it rows plus the
 * fields to read: one `y` field per series for wide rows, or a single `y`
 * with `series` for long rows.
 */
export interface BarChartOptions extends BarSeriesOptions {
  /**
   * The axes to show.
   * @default "x", or "y" when `horizontal` — the category axis
   */
  axes?: boolean | "x" | "y"

  /**
   * Gridlines along the value axis.
   * @default true
   */
  grid?: boolean

  /**
   * A color legend below the plot.
   * @default false
   */
  legend?: boolean

  /** Formats x ticks and the matching tooltip values — the value axis when `horizontal`. */
  formatX?: (value: ChartValue) => string

  /** Formats y ticks and the matching tooltip values — the category axis when `horizontal`. */
  formatY?: (value: ChartValue) => string
}

/** The bars of one or more series as one mark, to compose into any chart. */
export interface BarSeriesOptions {
  /** Field holding the category value. */
  x: string

  /** The value field, or one field per series when rows are wide. */
  y: string | readonly string[]

  /** Field naming each row's series, when rows are long. */
  series?: string

  /** Display names for series keys, read by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Series keys in color and stacking order; series it leaves out follow in data order. */
  order?: readonly string[]

  /** Stable row identity, so reordered or filtered rows move instead of respawning. */
  key?: string

  /**
   * Categories down the y axis, values along x.
   * @default false
   */
  horizontal?: boolean

  /**
   * Series stacked in each band; `"normalize"` for a 100% stack. Otherwise
   * series sharing a band sit side by side.
   * @default false
   */
  stacked?: boolean | "normalize"

  /**
   * Corner radius in pixels. A stack rounds only its outer end.
   * @default 4
   */
  cornerRadius?: number

  /**
   * Pixels trimmed from both categorical edges of every bar.
   * @default 0
   */
  inset?: number

  /**
   * Fill opacity.
   * @default 1
   */
  fill?: number

  /** Focus-driven restyling, e.g. dimming the bars that aren't focused. */
  states?: readonly ChartMarkState[]
}
