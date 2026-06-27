import type * as React from 'react'

import type { ChartConfig } from './base'

export type { ChartConfig }

/**
 * Wraps a Recharts chart with theming and a responsive container. Pass your
 * `config` (series → label / color / icon) and a single Recharts chart child.
 */
export interface ChartContainerProps extends React.ComponentProps<'div'> {
  /**
   * Series metadata keyed by `dataKey`: a `label`, a `color` (or a per-theme
   * `theme` map), and an optional `icon`. Drives tooltips, legends, and the
   * `--color-<key>` CSS variables.
   */
  config: ChartConfig

  /**
   * Fallback dimensions used for the first server render (the responsive
   * container has no measured size yet). Keep this set or the chart can
   * collapse in SSR / production builds.
   * @default { width: 320, height: 200 }
   */
  initialDimension?: { width: number; height: number }
}

/**
 * Styled content for a chart tooltip. Use inside `<ChartTooltip content={...} />`.
 */
export interface ChartTooltipContentProps extends React.ComponentProps<'div'> {
  /**
   * Shape of the color indicator shown next to each series.
   * @default "dot"
   */
  indicator?: 'line' | 'dot' | 'dashed'

  /**
   * Hide the tooltip label (the row header).
   * @default false
   */
  hideLabel?: boolean

  /**
   * Hide the colored indicator next to each value.
   * @default false
   */
  hideIndicator?: boolean

  /** Key used to resolve the series name against `config`. */
  nameKey?: string

  /** Key used to resolve the label against `config`. */
  labelKey?: string
}

/**
 * Styled content for a chart legend. Use inside `<ChartLegend content={...} />`.
 */
export interface ChartLegendContentProps extends React.ComponentProps<'div'> {
  /**
   * Hide the per-series icon/swatch.
   * @default false
   */
  hideIcon?: boolean

  /** Key used to resolve the series name against `config`. */
  nameKey?: string

  /**
   * Legend position relative to the chart, used for spacing.
   * @default "bottom"
   */
  verticalAlign?: 'top' | 'bottom'
}

/**
 * A visually-hidden table that mirrors a chart's series for assistive tech
 * (dotUI accessibility layer; not part of shadcn). Render it alongside any chart
 * with the same props you already pass. It adapts to the data shape: wide-format
 * (bar/line/area/radar) gets one column per series; long-format (pie/radial) gets
 * a two-column category/value table.
 */
export interface ChartDataTableProps extends React.ComponentProps<'table'> {
  /** The same data array passed to the chart. */
  data: Record<string, unknown>[]

  /** The same `config` passed to `ChartContainer`. */
  config: ChartConfig

  /**
   * Key in each datum used as the row header — the x-axis category for cartesian
   * charts, or the slice/segment name for pie and radial charts.
   */
  labelKey?: string

  /** Header for the `labelKey` column. Defaults to a capitalized `labelKey`. */
  labelName?: string

  /** Optional caption announced to assistive tech. */
  caption?: string
}
