import type * as React from "react"
import type {
  ChartDefinition,
  ChartPoint,
  ChartRenderContext,
  ChartValue,
} from "@tanstack/charts"
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip"

import type { ChartAnimate, ChartFocus, ChartTooltipAnchor } from "./base"

export type { ChartAnimate, ChartFocus, ChartTooltipAnchor }

/**
 * The chart host: it renders a chart definition, owns the SVG renderer and the
 * default height, and layers `children` over the surface as a
 * pointer-events-none HTML overlay. Every family component (`AreaChart`,
 * `BarChart`, …) renders one.
 */
export interface ChartProps {
  /**
   * The definition to render — built for you by a family component, or by
   * `defineChart` for a fully custom chart.
   */
  definition: ChartDefinition<unknown, ChartValue, number>

  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Longer description, announced after the name. */
  ariaDescription?: string

  /**
   * Chart height in pixels.
   * @default 256
   */
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
  onFocusChange?: (
    point: ChartPoint<unknown, ChartValue, number> | null,
  ) => void

  /** Called when the focused group changes, in the group focus modes. */
  onFocusGroupChange?: (
    points: readonly ChartPoint<unknown, ChartValue, number>[],
  ) => void

  /** Called when a point is activated with Enter, Space, or a click. */
  onSelect?: (point: ChartPoint<unknown, ChartValue, number> | null) => void

  /** Called after every paint, with the container, SVG, and scene. */
  onRender?: (context: ChartRenderContext<unknown, ChartValue, number>) => void

  /** Replaces the tooltip body. Receives the default body to wrap or discard. */
  renderTooltipBody?: (
    context: ChartTooltipBodyRenderContext<unknown, ChartValue, number>,
  ) => React.ReactNode

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}

/**
 * Interaction and animation props shared by every chart family component.
 * They are flat scalars on purpose: the chart definition is memoized on a
 * serialized key, and a nested option object would silently go stale.
 */
export interface ChartBehaviorProps {
  /**
   * How pointer and keyboard resolve to points. Group modes highlight every
   * series at the same position; `nearest` matches a single point.
   * @default "group-x"
   */
  focus?: ChartFocus

  /** Pixel radius beyond which the pointer stops matching a point. */
  maxFocusDistance?: number

  /**
   * Where the tooltip attaches: to the focused point, to the pointer, or to
   * the center of the focused group.
   * @default "group-center"
   */
  tooltipAnchor?: ChartTooltipAnchor

  /**
   * Keep the tooltip pinned to the focused position instead of letting it
   * follow the pointer between points.
   * @default true
   */
  tooltipSticky?: boolean

  /**
   * Pass `false` to remove the tooltip entirely. Keyboard focus stops remain
   * but lose their live region, so screen readers get silent stops — keep the
   * tooltip unless the chart is decorative.
   */
  tooltip?: false

  /**
   * Animation on data and size changes: `false` to disable, or duration and
   * easing options. Charts above ~800 points animate off automatically.
   * @default { duration: 240, respectReducedMotion: true }
   */
  animate?: ChartAnimate
}
