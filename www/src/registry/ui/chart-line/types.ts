import type { ChartMarkState, ChartValue } from "@tanstack/charts"

/**
 * Builds a complete line chart for `defineChart`. Give it rows plus the
 * fields to read: one `y` field per series for wide rows, or a single `y`
 * with `series` for long rows.
 */
export interface LineChartOptions extends LineSeriesOptions {
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
   * A color legend below the plot. `"toggle"` lets readers click a series to
   * hide it and hover one to dim the rest.
   * @default false
   */
  legend?: boolean | "toggle"

  /** Formats x ticks and tooltip titles. */
  formatX?: (value: ChartValue) => string

  /** Formats y ticks and tooltip values. */
  formatY?: (value: ChartValue) => string
}

/** The lines of one or more series as one mark, to compose into any chart. */
export interface LineSeriesOptions {
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
   * Path interpolation between points.
   * @default "natural"
   */
  curve?: "linear" | "natural" | "monotone" | "step"

  /**
   * Width of each line.
   * @default 2
   */
  strokeWidth?: number

  /** SVG dash pattern for the lines, e.g. `"4 4"`. */
  strokeDasharray?: string

  /**
   * A dot at every point.
   * @default false
   */
  points?: boolean

  /** Focus-driven restyling, e.g. dimming the lines that aren't focused. */
  states?: readonly ChartMarkState[]
}
