"use client";

import type {
  ChannelField,
  ChartKey,
  ChartPoint,
  ChartTooltipContentContext,
} from "@tanstack/charts";
import type { PolarGuide, PolarMark } from "@tanstack/charts/polar";
import {
  polar,
  radialBarAngle,
  radialGrid,
  radialText,
} from "@tanstack/charts/polar";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";

import type {
  ChartDataLabels,
  ChartField,
  ChartFormat,
} from "@/components/ui/chart";
import { chartLegend, polarDecorative } from "@/components/ui/chart";

const TAU = Math.PI * 2;

// oxlint-disable-next-line no-explicit-any
type AnyPolarMark = PolarMark<any, any, any, any, any>;

export interface RadialChartOptions<TDatum> {
  /** One field draws a ring per row; several stack the first row's fields around one ring. */
  value:
    | ChannelField<TDatum, number | null | undefined>
    | readonly ChannelField<TDatum, number | null | undefined>[];
  /** Field naming each ring. */
  name: ChartField<TDatum, ChartKey>;
  /** Display names for ring keys and stacked fields. */
  labels?: Readonly<Record<string, string>>;
  /** Radians, clockwise from twelve o'clock. @default 0 */
  startAngle?: number;
  /** @default 2π */
  endAngle?: number;
  /** Hole radius, as a share of the chart radius. @default 0.35 */
  innerRadius?: number;
  /** @default 1 */
  outerRadius?: number;
  /** Share of the available radius the chart fills. @default 1 */
  radiusRatio?: number;
  /** Pixels kept clear around the chart. */
  inset?: number;
  /** Gap between rings, as a share of a ring's thickness. @default 0.2 */
  barPadding?: number;
  /** @default 4 */
  cornerRadius?: number;
  /** An unfilled arc behind every ring. */
  track?: boolean;
  /** @default the muted surface */
  trackFill?: string;
  /** The value that fills the whole sweep. @default the largest value */
  max?: number;
  /** Text at the start of each ring: its name, or its value with `{ text: "value" }`. */
  dataLabels?: boolean | ChartDataLabels;
  /** Concentric rings behind the bars. */
  grid?: boolean;
  /** @default 4 */
  gridTicks?: number;
  /** A color legend below the chart. */
  legend?: boolean;
  /** Formats values in the tooltip. */
  formatValue?: ChartFormat;
  /** More polar layers drawn over the bars. */
  marks?: readonly AnyPolarMark[];
}

/** A stacked segment: what the arcs and focus points carry when `value` lists several fields. */
export interface RadialSegment {
  name: string;
  value: number;
  start: number;
  end: number;
}

function finite(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** A complete radial bar chart — pass it to `defineChart`, or spread it and extend. */
export function radialChart<TDatum>(
  data: readonly TDatum[],
  options: RadialChartOptions<TDatum>,
) {
  const label = (key: string) => options.labels?.[key] ?? key;
  const nameOf = (row: TDatum) =>
    label(
      String(
        typeof options.name === "function"
          ? options.name(row)
          : row[options.name as keyof TDatum],
      ),
    );
  const inner = options.innerRadius ?? 0.35;
  const outer = options.outerRadius ?? 1;
  const padding = options.barPadding ?? 0.2;
  const cornerRadius = options.cornerRadius ?? 4;
  const range = [
    ({ radius }: { radius: number }) => radius * inner,
    ({ radius }: { radius: number }) => radius * outer,
  ] as const;

  let names: readonly string[];
  let max: number;
  let radiusScale: ReturnType<typeof scaleBand<string>>;
  const marks: AnyPolarMark[] = [];

  if (Array.isArray(options.value)) {
    // One ring, cumulative angles: segments stack around the sweep.
    const row = data[0];
    let cursor = 0;
    const segments: RadialSegment[] = options.value.map((field) => {
      const value = row == null ? 0 : finite(row[field as keyof TDatum]);
      const segment = {
        name: label(String(field)),
        value,
        start: cursor,
        end: cursor + value,
      };
      cursor += value;
      return segment;
    });
    names = segments.map((segment) => segment.name);
    max = options.max ?? (cursor || 1);
    radiusScale = scaleBand<string>().domain(["stack"]);
    marks.push(
      radialBarAngle(segments, {
        id: "radial-bar",
        angle1: "start",
        angle2: "end",
        angle: "end",
        radius: () => "stack",
        key: "name",
        color: "name",
        cornerRadius,
      }),
    );
  } else {
    const field = options.value as keyof TDatum;
    names = data.map(nameOf);
    max =
      options.max ??
      (Math.max(...data.map((row) => finite(row[field])), 0) || 1);
    radiusScale = scaleBand<string>().domain(names).paddingInner(padding);
    if (options.track) {
      marks.push(
        polarDecorative(
          radialBarAngle(data, {
            id: "radial-track",
            angle: () => max,
            radius: nameOf,
            key: nameOf,
            fill: options.trackFill ?? "var(--color-muted)",
            motion: false,
          }),
        ),
      );
    }
    marks.push(
      radialBarAngle(data, {
        id: "radial-bar",
        angle: (row) => finite(row[field]),
        radius: nameOf,
        key: nameOf,
        color: nameOf,
        cornerRadius,
      }),
    );
    const labels = options.dataLabels === true ? {} : options.dataLabels;
    if (labels) {
      const format = options.formatValue ?? ((value) => value.toLocaleString());
      // Band centers as radius ratios, for the linear `label` scale below.
      const step = (outer - inner) / Math.max(1, names.length - padding);
      const bandwidth = step * (1 - padding);
      marks.push(
        polarDecorative(
          radialText(data, {
            id: "radial-bar-label",
            angle: 0,
            radius: (_row, { index }) => inner + index * step + bandwidth / 2,
            radiusScale: "label",
            text: (row) =>
              labels.text === "value"
                ? format(finite(row[field]))
                : nameOf(row),
            anchor: "start",
            dx: 8,
            fill: labels.fill ?? "var(--color-fg)",
            fontSize: labels.fontSize ?? 11,
          }),
        ),
      );
    }
  }

  const guides: PolarGuide[] = options.grid
    ? [
        radialGrid({
          scale: "grid",
          ticks: options.gridTicks ?? 4,
          shape: "circle",
          labels: false,
        }),
      ]
    : [];
  // A named radius scale gets no default pixel range.
  const unit = {
    channel: "radius" as const,
    scale: scaleLinear().domain([0, 1]),
    range: [0, ({ radius }: { radius: number }) => radius] as const,
  };

  return {
    scales: { x: null, y: null },
    color: {
      domain: names,
      legend: options.legend ? chartLegend() : undefined,
    },
    marks: [
      polar({
        scales: {
          angle: { scale: scaleLinear().domain([0, max]) },
          radius: { scale: radiusScale, range },
          ...(options.grid && { grid: unit }),
          ...(options.dataLabels && { label: unit }),
        },
        startAngle: options.startAngle ?? 0,
        endAngle: options.endAngle ?? TAU,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? 1,
        guides,
        marks: [...marks, ...(options.marks ?? [])],
      }),
    ],
    // An arc's x value is an angle: only nearest focus reads right.
    focus: "nearest" as const,
    tooltip: {
      use: tooltip,
      anchor: "point" as const,
      content: (
        points: readonly ChartPoint[],
        context: ChartTooltipContentContext,
      ) => ({
        // Points from layers added through `marks` aren't rings.
        rows: points.map((point) => {
          if (point.markId !== "radial-bar") {
            return {
              label: point.groupLabel,
              value: context.formatY(point.yValue),
              color: point.color,
            };
          }
          const [name, value] = Array.isArray(options.value)
            ? [
                (point.datum as RadialSegment).name,
                (point.datum as RadialSegment).value,
              ]
            : [
                nameOf(point.datum as TDatum),
                finite((point.datum as TDatum)[options.value as keyof TDatum]),
              ];
          return {
            label: name,
            value: (options.formatValue ?? context.formatY)(value),
            color: point.color,
          };
        }),
      }),
    },
  };
}
