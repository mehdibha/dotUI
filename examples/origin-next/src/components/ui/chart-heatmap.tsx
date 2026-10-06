"use client";

import type {
  ChartKey,
  ChartPoint,
  ChartTooltipContentContext,
  ChartValue,
} from "@tanstack/charts";
import { colorLegend } from "@tanstack/charts/legend";
import { decorative } from "@tanstack/charts/mark/decorative";
import { cell } from "@tanstack/charts/rect";
import { scaleBand } from "@tanstack/charts/scales/band";
import { text } from "@tanstack/charts/text";
import { tooltip } from "@tanstack/charts/tooltip";
import { scaleQuantize, scaleThreshold } from "d3-scale";

import type {
  ChartDataLabels,
  ChartField,
  ChartFormat,
} from "@/components/ui/chart";
import { chartColor, chartScales } from "@/components/ui/chart";

/* A sequential ramp mixed from one series color: the low half fades into the
   surface, the high half toward the foreground, so lightness stays monotone
   in light and dark. */
export function heatmapColors(
  color: string = chartColor(0),
  steps: number = 5,
): readonly string[] {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 0.5 : index / (steps - 1);
    const [weight, target] =
      t <= 0.5
        ? [20 + t * 160, "var(--surface-bg,var(--color-bg))"]
        : [100 - (t - 0.5) * 136, "var(--color-fg)"];
    return `color-mix(in oklab, ${color} ${Math.round(weight)}%, ${target})`;
  });
}

// Black or white ink from the cell's own lightness; the 0.58 crossover
// measures ≥ 4.9:1 across the default ramp.
function contrastInk(color: string): string {
  return `oklch(from ${color} calc((0.58 - l) * 100) 0 0)`;
}

export interface HeatmapChartOptions<TDatum> {
  /** Field holding the column category. */
  x: ChartField<TDatum, ChartValue>;
  /** Field holding the row category. */
  y: ChartField<TDatum, ChartValue>;
  /** Numeric field the color reads. */
  value: ChartField<TDatum, number | null | undefined>;
  /** Stable cell identity. */
  key?: ChartField<TDatum, ChartKey>;
  /** The ramp from low to high; one bin per color. @default heatmapColors() */
  colors?: readonly string[];
  /** Explicit cuts between bins — one fewer than `colors`. */
  thresholds?: readonly number[];
  /** Each value printed inside its cell, in ink that contrasts with it. */
  dataLabels?: boolean | Omit<ChartDataLabels, "text">;
  /** Formats values in cells, the legend and the tooltip. */
  formatValue?: ChartFormat;
  /** What the value means — the legend title and the tooltip label. */
  label?: string;
  /** Axis titles. */
  labelX?: string;
  labelY?: string;
  /** Formats column labels and the tooltip title. */
  formatX?: ChartFormat;
  /** Formats row labels and the tooltip title. */
  formatY?: ChartFormat;
  /** The axes to show. @default true */
  axes?: boolean | "x" | "y";
  /** The color legend. @default true */
  legend?: boolean;
}

function read<TDatum, TValue>(row: TDatum, field: ChartField<TDatum, TValue>) {
  return typeof field === "function"
    ? field(row)
    : (row[field as keyof TDatum] as TValue);
}

/* Which ramp step a value lands on: the chart's own color scale rebuilt over
   step indices, nicened domain included, so a label never disagrees with the
   cell under it. */
function binner(
  values: readonly (number | null)[],
  thresholds: readonly number[] | undefined,
  steps: number,
): (value: number | null) => number {
  const range = Array.from({ length: steps }, (_, index) => index);
  if (thresholds) {
    const scale = scaleThreshold<number, number>()
      .domain(thresholds)
      .range(range);
    return (value) => scale(value ?? -Infinity);
  }
  const finite = values.filter((value) => value !== null);
  if (finite.length === 0) return () => 0;
  const minimum = Math.min(...finite);
  const scale = scaleQuantize<number>()
    .range(range)
    .domain([minimum, Math.max(...finite)])
    .nice(5);
  return (value) => scale(value ?? minimum);
}

/** A complete heatmap — pass it to `defineChart`, or spread it and extend. */
export function heatmapChart<TDatum>(
  data: readonly TDatum[],
  options: HeatmapChartOptions<TDatum>,
) {
  const colors = options.colors ?? heatmapColors();
  const format = options.formatValue ?? String;
  const valueOf = (row: TDatum) => {
    const value = read(row, options.value);
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  };
  const print = (row: TDatum) => {
    const value = valueOf(row);
    return value === null ? null : format(value);
  };
  const labels = options.dataLabels === true ? {} : options.dataLabels;
  const bin = binner(data.map(valueOf), options.thresholds, colors.length);
  const { key } = options;
  const position = {
    x: (row: TDatum) => read(row, options.x),
    y: (row: TDatum) => read(row, options.y),
    key: key && ((row: TDatum) => read(row, key)),
  };
  const marks = [
    cell(data, {
      ...position,
      color: valueOf,
      radius: 2,
      inset: 1,
    }),
    ...(labels
      ? [
          decorative(
            text(data, {
              ...position,
              text: print,
              fill:
                labels.fill ??
                ((row) =>
                  contrastInk(colors[bin(valueOf(row))] ?? chartColor(0))),
              fontSize: labels.fontSize ?? 11,
            }),
          ),
        ]
      : []),
  ];
  const scales = chartScales({
    x: {
      scale: scaleBand,
      nice: false,
      label: options.labelX,
      format: options.formatX,
    },
    y: {
      scale: scaleBand,
      nice: false,
      label: options.labelY,
      format: options.formatY,
    },
    // The labels are the cells' identity.
    axes: options.axes ?? true,
    // The cell edges are the grid.
    grid: false,
  });
  return {
    scales,
    color: {
      scale: options.thresholds
        ? scaleThreshold<number, string>
        : scaleQuantize<string>,
      domain: options.thresholds,
      range: colors,
      nice: options.thresholds ? undefined : true,
      // The ramp is the only key to the color.
      legend:
        options.legend === false
          ? undefined
          : colorLegend({ label: options.label, format: options.formatValue }),
    },
    marks,
    // A cell is read on its own, not against its column.
    focus: "nearest" as const,
    tooltip: {
      use: tooltip,
      anchor: "point" as const,
      content: (
        points: readonly ChartPoint[],
        context: ChartTooltipContentContext,
      ) => {
        const point = points[0];
        if (point === undefined) return { rows: [] };
        const row = point.datum as TDatum;
        return {
          title: `${context.formatX(point.xValue)} · ${context.formatY(point.yValue)}`,
          rows: [
            {
              label: options.label ?? "Value",
              value: print(row) ?? "–",
              color: point.color,
            },
          ],
        };
      },
    },
  };
}
