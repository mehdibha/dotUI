import type { ChartValue } from "@tanstack/charts"

/**
 * Builds a complete heatmap for `defineChart`. Give it long rows — one row
 * per cell, with the column field, the row field, and the numeric value
 * color carries.
 */
export interface HeatmapChartOptions {
  /** Field holding the column category. */
  x: string

  /** Field holding the row category. */
  y: string

  /** Numeric field the color reads. */
  value: string

  /** Stable cell identity, so filtered rows move instead of respawning. */
  key?: string

  /**
   * The color ramp, low to high. Its length is the number of bins.
   * @default heatmapColors()
   */
  colors?: readonly string[]

  /**
   * Explicit cuts between bins — one fewer than `colors`. Without them the
   * observed extent is split into equal bins.
   */
  thresholds?: readonly number[]

  /**
   * Each value printed inside its cell. Only legible on large cells.
   * @default false
   */
  values?: boolean

  /** Formats values in the cells, the legend, and the tooltip. */
  formatValue?: (value: ChartValue) => string

  /** What the value means — the legend title and the tooltip label. */
  label?: string

  /** Column-axis title. */
  labelX?: string

  /** Row-axis title. */
  labelY?: string

  /** Formats column labels and the tooltip title. */
  formatX?: (value: ChartValue) => string

  /** Formats row labels and the tooltip title. */
  formatY?: (value: ChartValue) => string

  /**
   * The axes to show.
   * @default true
   */
  axes?: boolean | "x" | "y"

  /**
   * The color legend — the ramp and its bin boundaries.
   * @default true
   */
  legend?: boolean
}
