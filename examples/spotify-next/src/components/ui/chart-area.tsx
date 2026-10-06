"use client";

import type { AreaYOptions, ChartLinearGradient } from "@tanstack/charts";
import { areaY } from "@tanstack/charts/area";
import { lineY } from "@tanstack/charts/line";
import { decorative } from "@tanstack/charts/mark/decorative";
import { stackRowsY } from "@tanstack/charts/transform/stack";

import type {
  ChartCurveName,
  ChartFormat,
  ChartSeries,
  ChartSeriesOptions,
  ChartSeriesRow,
} from "@/components/ui/chart";
import {
  chartColor,
  chartCurves,
  chartLegend,
  chartScales,
  chartSeries,
} from "@/components/ui/chart";

export interface AreaSeriesOptions<TDatum> extends ChartSeriesOptions<TDatum> {
  /** Series stacked on one another; `"normalize"` for a 100% stack. */
  stacked?: boolean | "normalize";
  /** @default "natural" */
  curve?: ChartCurveName;
  /**
   * Fill opacity, or `"gradient"` to fade toward the baseline — the chart
   * then needs `areaGradients()`.
   * @default 0.4
   */
  fill?: number | "gradient";
  /** Width of the upper edge. @default 2 */
  strokeWidth?: number;
  /** A dot at every point. */
  points?: boolean;
  /** Focus-driven restyling of the fill — dim the series that aren't focused. */
  states?: AreaYOptions<ChartSeriesRow<TDatum>>["states"];
}

const FADE_ID = "chart-area-fade";

/** One fade per series slot, for `fill: "gradient"`. */
export function areaGradients(count: number): ChartLinearGradient[] {
  return Array.from({ length: count }, (_, slot) => {
    const color = chartColor(slot);
    return {
      id: `${FADE_ID}-${slot}`,
      y1: 1,
      y2: 0,
      stops: [
        { offset: 0, color, opacity: 0.02 },
        { offset: 1, color, opacity: 0.5 },
      ],
    };
  });
}

/* The fill and its upper edge are two marks — an area's own stroke would
   outline the whole polygon. The edge is decorative, so the area's points,
   which report each band's own value, are the only focus stops. A gradient
   paints from a decorative copy: the focus ring and the tooltip swatch take
   the interactive area's fill, which must stay the series color. */
function areaMarks<TDatum>(
  { rows, names }: ChartSeries<TDatum>,
  options: AreaSeriesOptions<TDatum>,
) {
  const curve = chartCurves[options.curve ?? "natural"];
  const fill = options.fill ?? 0.4;
  const gradient = fill === "gradient";
  const series = { curve, color: "series", key: "key" } as const;
  const states = options.states as AreaYOptions<object>["states"];
  const area = { ...series, fillOpacity: gradient ? 0 : fill, states };
  const fade = {
    ...series,
    states,
    fill: (row: { series: string }) =>
      `url(#${FADE_ID}-${names.indexOf(row.series)})`,
  };
  const edge = {
    ...series,
    strokeWidth: options.strokeWidth ?? 2,
    points: options.points ?? false,
  };

  if (!options.stacked) {
    // An explicit baseline opts out of the library's implicit stacking.
    const position = { x: "x", y: "y", y1: 0 } as const;
    return [
      ...(gradient ? [decorative(areaY(rows, { ...fade, ...position }))] : []),
      areaY(rows, { ...area, ...position }),
      decorative(lineY(rows, { ...edge, x: "x", y: "y" })),
    ];
  }
  const stacked = stackRowsY(rows as readonly ChartSeriesRow<TDatum>[], {
    x: "x",
    y: "y",
    z: "series",
    order: names,
    offset: options.stacked === "normalize" ? "normalize" : undefined,
  });
  const position = { x: "x", y1: "y1", y2: "y2" } as const;
  return [
    ...(gradient ? [decorative(areaY(stacked, { ...fade, ...position }))] : []),
    areaY(stacked, { ...area, ...position }),
    decorative(lineY(stacked, { ...edge, x: "x", y: "y2" })),
  ];
}

/** The fill and edge marks of one or more area series. */
export function areaSeries<TDatum>(
  data: readonly TDatum[],
  options: AreaSeriesOptions<TDatum>,
) {
  return areaMarks(chartSeries(data, options), options);
}

export interface AreaChartOptions<TDatum> extends AreaSeriesOptions<TDatum> {
  /** The axes to show. @default "x" */
  axes?: boolean | "x" | "y";
  /** Horizontal gridlines. @default true */
  grid?: boolean;
  /** A color legend below the plot. */
  legend?: boolean;
  /** Formats x ticks and tooltip titles. */
  formatX?: ChartFormat;
  /** Formats y ticks and tooltip values. */
  formatY?: ChartFormat;
}

/** A complete area chart — pass it to `defineChart`, or spread it and extend. */
export function areaChart<TDatum>(
  data: readonly TDatum[],
  options: AreaChartOptions<TDatum>,
) {
  const series = chartSeries(data, options);
  return {
    scales: chartScales({
      x: {
        kind: series.rows[0]?.x instanceof Date ? "time" : "point",
        format: options.formatX,
      },
      y: { format: options.formatY },
      axes: options.axes,
      grid: options.grid === false ? false : "y",
    }),
    color: {
      domain: series.names,
      legend: options.legend ? chartLegend() : undefined,
    },
    marks: areaMarks(series, options),
    gradients:
      options.fill === "gradient"
        ? areaGradients(series.names.length)
        : undefined,
  };
}
