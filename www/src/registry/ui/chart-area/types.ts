import type { ChartMarkState, ChartValue } from "@tanstack/charts"

/**
 * Builds a complete area chart for `defineChart`. Give it rows plus the
 * fields to read: one `y` field per series for wide rows, or a single `y`
 * with `series` for long rows.
 */
export interface AreaChartOptions extends AreaSeriesOptions {
  /**
   * The axes to show.
   * @default the category axis, and the value axis as the defaults' `axes` says
   */
  axes?: boolean | "x" | "y"

  /**
   * Gridlines — `false` drops them.
   * @default the defaults' `grid`
   */
  grid?: boolean

  /**
   * A color legend, where the defaults place it. `"toggle"` lets readers
   * click a series to hide it and hover one to dim the rest.
   * @default the defaults' `legend` — shown for several series unless it's `"off"`
   */
  legend?: boolean | "toggle"

  /**
   * A guide at the hovered position.
   * @default the defaults' `guide`
   */
  crosshair?: boolean

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
   * @default the defaults' `lines`
   */
  curve?: "linear" | "natural" | "monotone" | "step"

  /**
   * Fill opacity, or `"gradient"` to fade toward the baseline.
   * @default the defaults' `area`
   */
  fill?: number | "gradient"

  /**
   * Width of the upper edge.
   * @default the defaults' `lines`
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
