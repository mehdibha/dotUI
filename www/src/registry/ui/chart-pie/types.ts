import type { ChartValue } from "@tanstack/charts"
import type { PolarMark } from "@tanstack/charts/polar"

/**
 * Builds a complete pie or donut chart for `defineChart`. One row per slice:
 * `value` names the field holding the size, `name` the field naming the slice.
 */
export interface PieChartOptions extends PieRingOptions {
  /**
   * A color legend below the pie.
   * @default false
   */
  legend?: boolean

  /**
   * Share of the available radius the pie fills — leave room for labels.
   * @default 0.9
   */
  radiusRatio?: number

  /**
   * Pixels kept clear around the pie.
   * @default 0
   */
  inset?: number

  /** More polar layers drawn over the ring — a second `pieRing`, labels. */
  marks?: readonly PolarMark[]
}

/**
 * One ring of slices — its arcs, the active slice, and the slice labels — to
 * pass as a pie chart's `marks`. Radii are shares of the chart radius, not
 * pixels.
 */
export interface PieRingOptions {
  /** Field holding the slice size. */
  value: string

  /** Field naming each slice — its color and its legend entry. */
  name: string

  /** Display names for slice keys, read by the legend, labels, and tooltip. */
  labels?: Readonly<Record<string, string>>

  /**
   * Scopes the ring's mark ids — unique per ring when a chart draws several.
   * @default "pie"
   */
  id?: string

  /**
   * Hole radius, as a share of the chart radius. Above 0 it is a donut.
   * @default 0
   */
  innerRadius?: number

  /**
   * Outer radius, as a share of the chart radius.
   * @default 1
   */
  outerRadius?: number

  /**
   * Angle the first slice starts at, in radians clockwise from twelve o'clock.
   * @default 0
   */
  startAngle?: number

  /**
   * Angle the last slice ends at, in radians. `Math.PI` draws a semicircle.
   * @default 2 * Math.PI
   */
  endAngle?: number

  /**
   * Gap between slices, in radians.
   * @default 0
   */
  padAngle?: number

  /**
   * Corner rounding of each slice, in pixels.
   * @default 0
   */
  cornerRadius?: number

  /**
   * The line between slices.
   * @default "var(--surface-bg,var(--color-bg))"
   */
  stroke?: string

  /**
   * Width of that line, in pixels. `0` lets the slices touch.
   * @default 2
   */
  strokeWidth?: number

  /** Index of a slice pushed out of the ring, to call it out. */
  activeIndex?: number

  /**
   * How far the active slice grows, as a share of the radius.
   * @default 0.08
   */
  activeOffset?: number

  /**
   * Text on each slice. `true` prints the values; the object form picks the
   * text (`"value"` or `"name"`), its `fill` and `fontSize` (12), and the
   * `radius` it sits at, as a share of the chart radius (the ring's middle).
   * @default false
   */
  dataLabels?:
    | boolean
    | {
        text?: "value" | "name"
        fill?: string
        fontSize?: number
        radius?: number
      }

  /** Formats slice values in labels and the tooltip. */
  formatValue?: (value: ChartValue) => string
}
