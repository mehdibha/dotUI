import type { ChartValue } from "@tanstack/charts"
import type { PolarMark } from "@tanstack/charts/polar"

/**
 * Builds a complete radar chart for `defineChart`. Give it one row per
 * category plus the fields to read: one `y` field per series for wide rows,
 * or a single `y` with `series` for long rows.
 */
export interface RadarChartOptions {
  /** Field holding the category laid around the circle. */
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
   * Series fill opacity — `0` draws outlines only.
   * @default 0.6
   */
  fill?: number

  /**
   * Width of the outline.
   * @default 1.5
   */
  strokeWidth?: number

  /**
   * A dot at every point.
   * @default false
   */
  points?: boolean

  /**
   * Share of the available radius the radar fills.
   * @default 0.78, or 0.68 with a legend
   */
  radiusRatio?: number

  /** The value at the outer ring. Defaults to the largest value, nicened. */
  max?: number

  /**
   * Ring shape.
   * @default "polygon"
   */
  gridShape?: "circle" | "polygon"

  /**
   * Number of rings.
   * @default 4
   */
  gridTicks?: number

  /**
   * Rings behind the series.
   * @default true
   */
  grid?: boolean

  /** Spokes out to each category. Defaults to `grid`. */
  spokes?: boolean

  /** Fill opacity of the area inside the outer ring. Unset leaves it unfilled. */
  gridFill?: number

  /**
   * Color of the grid fill.
   * @default "var(--chart-1)"
   */
  gridFillColor?: string

  /**
   * The category labels around the circle.
   * @default true
   */
  axes?: boolean

  /** A second, muted label line above each category — a value, a share, a delta. */
  axisDetail?: (value: ChartValue) => string

  /**
   * A color legend below the radar.
   * @default false
   */
  legend?: boolean

  /** Formats the category labels and tooltip titles. */
  formatX?: (value: ChartValue) => string

  /** Formats tooltip values. */
  formatY?: (value: ChartValue) => string

  /** More polar layers drawn over the series, on the same angle and radius scales. */
  marks?: readonly PolarMark[]
}
