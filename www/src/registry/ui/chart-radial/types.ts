import type * as React from "react"

import type { PolarMarkLayer } from "./base"

export type { PolarMarkLayer }

/**
 * Radial bar chart. Give it rows, the field holding each value, and the field
 * naming it. Angles are radians and radii are ratios of the circle the chart
 * resolves for its box. Interaction and animation props are shared by every
 * family — see `ChartBehaviorProps` — and the host props (`height`, `width`,
 * `className`, callbacks) live on `Chart`.
 */
export interface RadialBarChartProps {
  /** The rows to plot. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /**
   * Field holding the value. One field draws a ring per row; an array of
   * fields stacks the first row's values into a single ring.
   */
  value: string | readonly string[]

  /** Field naming each ring. */
  name: string

  /** Display names for ring keys, used by the legend and the tooltip. */
  labels?: Readonly<Record<string, string>>

  /**
   * Start of the angular sweep, in radians, clockwise from twelve o'clock.
   * @default 0
   */
  startAngle?: number

  /**
   * End of the angular sweep, in radians.
   * @default Math.PI * 2
   */
  endAngle?: number

  /**
   * Inner edge of the innermost ring, as a ratio of the radius.
   * @default 0.35
   */
  innerRadius?: number

  /**
   * Outer edge of the outermost ring, as a ratio of the radius.
   * @default 1
   */
  outerRadius?: number

  /**
   * Shrinks the circle inside its box.
   * @default 1
   */
  radiusRatio?: number

  /** Pixel inset applied before `radiusRatio`. */
  inset?: number

  /**
   * Gap between rings, as a share of a ring's thickness. In stacked mode
   * (array `value`) it becomes a per-segment radial inset instead.
   * @default 0.2 — 0.04 in stacked mode
   */
  barPadding?: number

  /**
   * Corner radius of each arc, in pixels. A large value gives pill ends.
   * @default 4
   */
  cornerRadius?: number

  /**
   * Draw an unfilled arc behind every ring, spanning the whole sweep.
   * Has no effect in stacked mode (array `value`).
   * @default false
   */
  track?: boolean

  /**
   * Fill of the background track.
   * @default "var(--color-muted)"
   */
  trackFill?: string

  /** Value that fills the whole sweep. Defaults to the largest value. */
  max?: number

  /**
   * Print each ring's name at the start of its arc.
   * @default false
   */
  barLabels?: boolean

  /** Fill of the ring labels. */
  barLabelFill?: string

  /**
   * Font size of the ring labels.
   * @default 11
   */
  barLabelFontSize?: number

  /**
   * Show the grid lines — concentric rings behind the bars.
   * @default false
   */
  grid?: boolean

  /**
   * Approximate number of grid rings.
   * @default 4
   */
  gridTicks?: number

  /**
   * Show the color legend. Turn it on when several rings share the chart.
   * @default false
   */
  legend?: boolean

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Extra polar mark layers painted under the bars. */
  polarMarksBefore?: readonly PolarMarkLayer[]

  /** Extra polar mark layers painted over the bars — annotations, rules, labels. */
  polarMarks?: readonly PolarMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
