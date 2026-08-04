import type * as React from 'react'

import type { PolarMarkLayer } from './base'

/**
 * Pie and donut chart. One row per slice: `value` names the field holding the
 * magnitude, `name` the field holding the slice key. Radii are ratios of the
 * chart's resolved radius, not pixels, so a pie keeps its proportions at every
 * size. Interaction and animation props are shared by every family — see
 * `ChartBehaviorProps` — and the host props (`height`, `className`, callbacks)
 * live on `Chart`.
 */
export interface PieChartProps {
  /** The rows to plot, one per slice. Compared by identity — define it outside render. */
  data: readonly unknown[]

  /** Field holding the slice magnitude. */
  value: string

  /** Field holding the slice key. */
  name: string

  /** Display names for slice keys, used by the legend, labels, and tooltip. */
  labels?: Readonly<Record<string, string>>

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /**
   * Inner radius, as a ratio of the outer edge. Above 0 it is a donut.
   * @default 0
   */
  innerRadius?: number

  /**
   * Outer radius, as a ratio of the available radius.
   * @default 1
   */
  outerRadius?: number

  /**
   * Share of the available radius the ring may use — leave room for labels.
   * @default 0.9
   */
  radiusRatio?: number

  /** Pixel inset applied before `radiusRatio`. */
  inset?: number

  /**
   * Angle the first slice starts at, in radians, clockwise from twelve o'clock.
   * @default 0
   */
  startAngle?: number

  /**
   * Angle the last slice ends at, in radians. A half turn draws a semicircle.
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

  /** Stroke painted between slices — set it to the page background to separate them. */
  stroke?: string

  /** Width of that stroke, in pixels. */
  strokeWidth?: number

  /** Index of a slice pushed out of the ring, to call it out. */
  activeIndex?: number

  /**
   * How far that slice is pushed out, as a ratio of the radius.
   * @default 0.08
   */
  activeOffset?: number

  /**
   * Text drawn on each slice: its key, its value, or nothing.
   * @default "none"
   */
  sliceLabel?: 'none' | 'name' | 'value'

  /** Radius the labels sit at, as a ratio. Defaults to the middle of the ring. */
  sliceLabelRadius?: number

  /** Label color. @default "var(--color-fg)" */
  sliceLabelFill?: string

  /** Label size in pixels. @default 12 */
  sliceLabelFontSize?: number

  /**
   * Show the color legend. Off by default: a pie usually names its slices with
   * labels or the tooltip.
   * @default false
   */
  legend?: boolean

  /** Slice order. Drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[]

  /**
   * Extra polar mark layers, spliced inside the polar container — a second
   * `pieRing`, an annotation arc. Define them outside render.
   */
  polarMarks?: readonly PolarMarkLayer[]

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
