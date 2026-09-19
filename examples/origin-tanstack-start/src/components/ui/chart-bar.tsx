"use client";

import type { ChartBuildContext } from "@tanstack/charts";
import { barX, barY } from "@tanstack/charts/bar";
import { group } from "@tanstack/charts/group";
import { stack } from "@tanstack/charts/stack";

import type {
  ChartComponentProps,
  ChartSpec,
  XYChartSpecOptions,
} from "@/components/ui/chart";
import {
  Chart,
  chartDefaults,
  chartFrame,
  planChart,
  useChartDefinition,
} from "@/components/ui/chart";

export interface BarChartSpecOptions<
  TDatum,
> extends XYChartSpecOptions<TDatum> {
  /** Categories down the y axis, values along x. */
  horizontal?: boolean;
  /** Side-by-side series inside each category band. */
  grouped?: boolean;
  /** Series stacked in each band; `"normalize"` for a 100% stack. */
  stacked?: boolean | "normalize";
  /** Corner radius in pixels. */
  radius?: number;
  /** Pixels trimmed from both categorical edges of every bar. */
  inset?: number;
  /** Bar fill opacity. */
  fillOpacity?: number;
}

export function barChartSpec<TDatum>(
  options: BarChartSpecOptions<TDatum>,
  ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const plan = planChart(options);
  const horizontal = options.horizontal ?? false;
  const stacked = options.stacked ?? false;
  const grouped =
    !stacked && (options.grouped ?? plan.wide) && plan.order.length > 1;
  const radius = options.radius ?? chartDefaults.barRadius;
  const bar = {
    z: plan.z,
    color: plan.z,
    key: plan.key,
    inset: options.inset,
    fillOpacity: options.fillOpacity,
    radius: stacked ? { end: radius } : radius,
    layout: stacked
      ? stack({
          order: plan.order,
          ...(stacked === "normalize" && { offset: "normalize" as const }),
        })
      : grouped
        ? group({ padding: chartDefaults.groupPadding })
        : undefined,
  };
  return {
    ...chartFrame(
      // The category axis is the one to show.
      {
        ...options,
        axes: options.axes ?? (horizontal ? "y" : chartDefaults.axes),
      },
      ctx,
      horizontal
        ? { order: plan.order, x: "linear", y: "band", grid: "x" }
        : { order: plan.order, x: "band", grid: "y" },
    ),
    marks: [
      ...(options.marksBefore ?? []),
      horizontal
        ? barX(plan.rows, { x: plan.y, y: plan.x, ...bar })
        : barY(plan.rows, { x: plan.x, y: plan.y, ...bar }),
      ...(options.marks ?? []),
    ],
  };
}

export type BarChartProps<TDatum> = ChartComponentProps<
  BarChartSpecOptions<TDatum>,
  TDatum
>;

export function BarChart<TDatum>(props: BarChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    BarChartSpecOptions<TDatum>
  >(props, barChartSpec, {
    // `group-x` groups points sharing a scene x — the value axis when the
    // bars run horizontally.
    focus: props.horizontal ? "group-y" : undefined,
  });
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  );
}
