import type * as React from "react"
import type {
  ChartPoint,
  ChartRendererRenderContext,
  ChartValue,
  DomChartDefinition,
} from "@tanstack/charts"
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip"

import type { ChartDefaults } from "./base"

/**
 * Renders a TanStack Charts definition with the design system's defaults:
 * the theme, the axis look, focus, keyboard navigation, the tooltip, and
 * motion. Anything the definition sets wins.
 */
export interface ChartProps {
  /**
   * What to draw, from `defineChart`. Keep its identity stable — define it at
   * module scope, or memoize it over the values it captures.
   */
  definition: DomChartDefinition<unknown, ChartValue, ChartValue>

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Longer description, announced after the name. */
  ariaDescription?: string

  /**
   * The look a definition's unset values are filled from: axes, grid, lines,
   * area, bars, legend, hover guide and motion. Anything the definition or
   * its builder sets wins.
   * @default chartDefaults
   */
  defaults?: ChartDefaults

  /** Chart height in pixels. Without it the chart is 16:9 of its width. */
  height?: number

  /** Width/height ratio, used instead of `height` when set. */
  aspectRatio?: number

  /** Fixed width. Omit to fill the container and track resizes. */
  width?: number

  /** Width assumed for the first render, before the container is measured. */
  initialWidth?: number

  /** Class applied to the chart's outer box — size and place the chart with it. */
  className?: string

  /** Style applied to the chart surface. */
  style?: React.CSSProperties

  /** Tab index of the chart surface. Charts are keyboard-focusable. */
  tabIndex?: number

  /** Prefix for generated element ids. */
  idPrefix?: string

  /** Called when the focused point changes, by pointer or keyboard. */
  onFocusChange?: (point: ChartPoint | null) => void

  /** Called when the focused group changes, in the group focus modes. */
  onFocusGroupChange?: (points: readonly ChartPoint[]) => void

  /** Called when a point is activated with Enter, Space, or a click. */
  onSelect?: (point: ChartPoint | null) => void

  /** Called after every paint, with the container, SVG, and scene. */
  onRender?: (context: ChartRendererRenderContext) => void

  /** Replaces the tooltip body. Receives the default body to wrap or discard. */
  renderTooltipBody?: (
    context: ChartTooltipBodyRenderContext,
  ) => React.ReactNode

  /** HTML laid over the chart, ignoring pointer events — a donut's total, a badge. */
  children?: React.ReactNode
}
