import type { ChartValue } from "@tanstack/charts"
import type { PolarMark } from "@tanstack/charts/polar"

/**
 * Builds a complete radial bar chart for `defineChart`. Give it rows, the
 * field holding each value, and the field naming each ring. Angles are
 * radians; radii are shares of the chart radius.
 */
export interface RadialChartOptions {
  /**
   * The value field: one ring per row, innermost first. Several fields stack
   * the first row's values around one ring.
   */
  value: string | readonly string[]

  /** Field naming each ring. */
  name: string

  /** Display names for ring keys and stacked fields, read by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /**
   * Start of the sweep, in radians clockwise from twelve o'clock.
   * @default 0
   */
  startAngle?: number

  /**
   * End of the sweep, in radians.
   * @default Math.PI * 2
   */
  endAngle?: number

  /**
   * Inner edge of the innermost ring, as a share of the chart radius.
   * @default 0.35
   */
  innerRadius?: number

  /**
   * Outer edge of the outermost ring, as a share of the chart radius.
   * @default 1
   */
  outerRadius?: number

  /**
   * Share of the available radius the chart fills.
   * @default 1
   */
  radiusRatio?: number

  /**
   * Pixels kept clear around the chart.
   * @default 0
   */
  inset?: number

  /**
   * Gap between rings, as a share of a ring's thickness.
   * @default 0.2
   */
  barPadding?: number

  /**
   * Corner radius of each arc, in pixels. A large value gives pill ends.
   * @default 4
   */
  cornerRadius?: number

  /**
   * An unfilled arc behind every ring, spanning the whole sweep. Not drawn
   * when `value` lists several fields.
   * @default false
   */
  track?: boolean

  /**
   * Fill of the track.
   * @default "var(--color-muted)"
   */
  trackFill?: string

  /** The value that fills the whole sweep. Defaults to the largest value, or the stack's total. */
  max?: number

  /**
   * Text at the start of each ring. `true` prints the ring names; the object
   * form picks the text (`"name"` or `"value"`), its `fill` and `fontSize`
   * (11). Not drawn when `value` lists several fields.
   * @default false
   */
  dataLabels?:
    | boolean
    | { text?: "name" | "value"; fill?: string; fontSize?: number }

  /**
   * Concentric gridlines behind the rings.
   * @default false
   */
  grid?: boolean

  /**
   * Approximate number of gridlines.
   * @default 4
   */
  gridTicks?: number

  /**
   * A color legend below the chart.
   * @default false
   */
  legend?: boolean

  /** Formats values in the tooltip. */
  formatValue?: (value: ChartValue) => string

  /**
   * More polar layers drawn over the rings. They share the chart's scales:
   * angles are values, radii are ring names.
   */
  marks?: readonly PolarMark[]
}
