import type { ChartMarkState, ChartValue } from "@tanstack/charts"

/**
 * Builds a complete area chart for `defineChart`. Give it rows plus the
 * fields to read: one `y` field per series for wide rows, or a single `y`
 * with `series` for long rows.
 */
export interface AreaChartOptions extends AreaSeriesOptions {
  /**
   * The axes to show.
   * @default "x"
   */
  axes?: boolean | "x" | "y"

  /**
   * Horizontal gridlines.
   * @default true
   */
  grid?: boolean

  /**
   * A color legend below the plot.
   * @default false
   */
  legend?: boolean

  /** Formats x ticks and tooltip titles. */
  formatX?: (value: ChartValue) => string

  /** Formats y ticks and tooltip values. */
  formatY?: (value: ChartValue) => string
}

/** The fill and edge marks of one or more area series, to compose into any chart. */
export interface AreaSeriesOptions {
  /** Field holding the category or time value. Dates put the x axis on a time scale. */
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
   * Series stacked on one another; `"normalize"` for a 100% stack.
   * @default false
   */
  stacked?: boolean | "normalize"

  /**
   * Path interpolation between points.
   * @default "natural"
   */
  curve?: "linear" | "natural" | "monotone" | "step"

  /**
   * Fill opacity, or `"gradient"` to fade toward the baseline.
   * @default 0.4
   */
  fill?: number | "gradient"

  /**
   * Width of the upper edge.
   * @default 2
   */
  strokeWidth?: number

  /**
   * A dot at every point.
   * @default false
   */
  points?: boolean

  /** Focus-driven restyling of the fill, e.g. dimming the series that aren't focused. */
  states?: readonly ChartMarkState[]
}
