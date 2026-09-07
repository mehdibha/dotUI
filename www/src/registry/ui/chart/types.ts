import type * as React from "react"
import type {
  ChartPoint,
  ChartRendererRenderContext,
  ChartValue,
} from "@tanstack/charts"
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip"

import type { ChartAnimate, ChartFocus, ChartTooltipAnchor } from "./base"

export type { ChartAnimate, ChartFocus, ChartTooltipAnchor }

/**
 * Props every chart family component shares: the interaction and animation
 * behavior, and the host surface — sizing, callbacks, and the HTML overlay.
 * Family props interfaces extend this, so each family's API reference lists
 * them alongside its own options.
 * @ignore no page of its own — it renders inlined into every family reference
 */
export interface ChartFamilyProps {
  /** Accessible name. Required: a chart is a figure, not decoration. */
  ariaLabel: string

  /** Longer description, announced after the name. */
  ariaDescription?: string

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
   * @default true
   */
  tooltip?: boolean

  /**
   * Animation between data states, and the entrance on first client paint:
   * `false` to disable, a `{ type: "tween" }` with duration and easing, or a
   * `{ type: "spring" }` with stiffness, damping, and mass. Charts above ~800
   * points animate off automatically, and reduced motion is always respected.
   * @default { type: "spring", stiffness: 170, damping: 26 }
   */
  animate?: ChartAnimate

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
  onRender?: (
    context: ChartRendererRenderContext<unknown, ChartValue, number>,
  ) => void

  /** Replaces the tooltip body. Receives the default body to wrap or discard. */
  renderTooltipBody?: (
    context: ChartTooltipBodyRenderContext<unknown, ChartValue, number>,
  ) => React.ReactNode

  /** Overlay rendered above the chart surface, ignoring pointer events. */
  children?: React.ReactNode
}
