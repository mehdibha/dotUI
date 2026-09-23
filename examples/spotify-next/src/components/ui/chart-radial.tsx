"use client";

import type { ChartBuildContext } from "@tanstack/charts";
import type { PolarGuide } from "@tanstack/charts/polar";
import {
  polar,
  radialBarAngle,
  radialGrid,
  radialText,
} from "@tanstack/charts/polar";
import { scaleBand, scaleLinear } from "d3-scale";

import type {
  ChartComponentProps,
  ChartSeriesField,
  ChartSpec,
  ChartTooltipContentOf,
  ChartYField,
  PolarMarkLayer,
} from "@/components/ui/chart";
import {
  Chart,
  CHART_THEME,
  chartDefaults,
  chartLegend,
  decorative,
  finiteOrNull,
  useChartDefinition,
} from "@/components/ui/chart";

const TAU = Math.PI * 2;

const radialDefaults = {
  innerRadius: 0.35,
  outerRadius: 1,
  barPadding: 0.2,
  gridTicks: 4,
  trackFill: "var(--color-muted)",
  labelFontSize: 11,
} as const;

export interface RadialBarChartSpecOptions<TDatum> {
  data: readonly TDatum[];
  /** One field draws a ring per row; an array stacks the first row's fields into one ring. */
  value: ChartYField<TDatum> | readonly ChartYField<TDatum>[];
  /** Field naming each ring. */
  name: ChartSeriesField<TDatum>;
  /** Display names for ring keys. */
  labels?: Readonly<Record<string, string>>;
  /** Angular sweep in radians. Defaults to a full turn. */
  startAngle?: number;
  endAngle?: number;
  /** Ratios of the resolved layout radius. */
  innerRadius?: number;
  outerRadius?: number;
  /** Shrinks the circle inside its box. */
  radiusRatio?: number;
  /** Pixel inset applied before `radiusRatio`. */
  inset?: number;
  /** Gap between rings, as a share of a ring's thickness. */
  barPadding?: number;
  cornerRadius?: number;
  /** Draw an unfilled arc behind every ring. */
  track?: boolean;
  trackFill?: string;
  /** Value that fills the whole sweep. Defaults to the largest value. */
  max?: number;
  /** Print each ring's name at the start of its arc. */
  barLabels?: boolean;
  barLabelFill?: string;
  barLabelFontSize?: number;
  /** Concentric rings behind the bars. */
  grid?: boolean;
  gridTicks?: number;
  legend?: boolean;
  /** Extra polar mark layers painted under the bars. */
  polarMarksBefore?: readonly PolarMarkLayer[];
  /** Extra polar mark layers painted over the bars. */
  polarMarks?: readonly PolarMarkLayer[];
}

/** A stacked segment: what the arcs and focus points carry in stacked mode. */
export interface RadialSegment {
  name: string;
  value: number;
  start: number;
  end: number;
}

function ringName(
  name: string,
  labels: Readonly<Record<string, string>> | undefined,
) {
  return (row: unknown) => {
    const key = String((row as Record<string, unknown>)[name]);
    return labels?.[key] ?? key;
  };
}

function read(row: unknown, field: string): number {
  return finiteOrNull((row as Record<string, unknown>)[field]) ?? 0;
}

export function radialBarChartSpec<TDatum>(
  options: RadialBarChartSpecOptions<TDatum>,
  _ctx: ChartBuildContext,
): ChartSpec<TDatum> {
  const nameOf = ringName(options.name, options.labels);
  const start = options.startAngle ?? 0;
  const end = options.endAngle ?? TAU;
  const inner = options.innerRadius ?? radialDefaults.innerRadius;
  const outer = options.outerRadius ?? radialDefaults.outerRadius;
  const padding = options.barPadding ?? radialDefaults.barPadding;
  const cornerRadius = options.cornerRadius ?? chartDefaults.barRadius;
  const range = [
    ({ radius }: { radius: number }) => radius * inner,
    ({ radius }: { radius: number }) => radius * outer,
  ] as const;

  let order: readonly string[];
  let max: number;
  let radiusScale: ReturnType<typeof scaleBand<string>>;
  const marks: PolarMarkLayer[] = [];

  if (Array.isArray(options.value)) {
    // One ring, cumulative angles — segments stack around the sweep.
    const row = options.data[0];
    let cursor = 0;
    const segments: RadialSegment[] = options.value.map((field) => {
      const value = row === undefined ? 0 : read(row, field);
      const key = String(field);
      const segment = {
        name: options.labels?.[key] ?? key,
        value,
        start: cursor,
        end: cursor + value,
      };
      cursor += value;
      return segment;
    });
    order = segments.map((segment) => segment.name);
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
        z: "name",
        color: "name",
        cornerRadius,
      }),
    );
  } else {
    const field = options.value as ChartYField<TDatum>;
    const names = options.data.map(nameOf);
    const values = options.data.map((row) => read(row, field));
    order = names;
    max = options.max ?? (Math.max(...values, 0) || 1);
    radiusScale = scaleBand<string>().domain(names).paddingInner(padding);
    if (options.track) {
      marks.push(
        decorative(
          radialBarAngle(options.data, {
            id: "radial-track",
            angle: () => max,
            radius: nameOf,
            key: nameOf,
            fill: options.trackFill ?? radialDefaults.trackFill,
            motion: false,
          }),
        ),
      );
    }
    marks.push(
      radialBarAngle(options.data, {
        id: "radial-bar",
        angle: field,
        radius: nameOf,
        key: nameOf,
        z: nameOf,
        color: nameOf,
        cornerRadius,
      }),
    );
    if (options.barLabels) {
      // Band centers as radius ratios, for the linear `label` scale below.
      const count = names.length;
      const step = (outer - inner) / Math.max(1, count - padding);
      const bandwidth = step * (1 - padding);
      marks.push(
        decorative(
          radialText(options.data, {
            id: "radial-bar-label",
            angle: 0,
            radius: (_row, { index }) => inner + index * step + bandwidth / 2,
            radiusScale: "label",
            text: nameOf,
            anchor: "start",
            dx: 8,
            fill: options.barLabelFill ?? "var(--color-fg)",
            fontSize: options.barLabelFontSize ?? radialDefaults.labelFontSize,
          }),
        ),
      );
    }
  }

  const guides: PolarGuide[] = options.grid
    ? [
        radialGrid({
          scale: "grid",
          ticks: options.gridTicks ?? radialDefaults.gridTicks,
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
      domain: order,
      legend: options.legend ? chartLegend() : undefined,
    },
    theme: CHART_THEME,
    marks: [
      polar({
        scales: {
          angle: { scale: scaleLinear().domain([0, max]) },
          radius: { scale: radiusScale, range },
          ...(options.grid && { grid: unit }),
          ...(options.barLabels && { label: unit }),
        },
        startAngle: start,
        endAngle: end,
        inset: options.inset ?? 0,
        radiusRatio: options.radiusRatio ?? 1,
        guides,
        marks: [
          ...(options.polarMarksBefore ?? []),
          ...marks,
          ...(options.polarMarks ?? []),
        ],
      }),
    ],
  };
}

// oxlint-disable-next-line no-explicit-any
const radialTooltip: ChartTooltipContentOf<RadialBarChartSpecOptions<any>> = (
  points,
  _context,
  options,
) => {
  const nameOf = ringName(options.name, options.labels);
  return {
    rows: points.map((point) => {
      const [label, value] = Array.isArray(options.value)
        ? [
            (point.datum as RadialSegment).name,
            (point.datum as RadialSegment).value,
          ]
        : [nameOf(point.datum), read(point.datum, options.value as string)];
      return { label, value: value.toLocaleString(), color: point.color };
    }),
  };
};

export type RadialBarChartProps<TDatum> = ChartComponentProps<
  RadialBarChartSpecOptions<TDatum>,
  TDatum
>;

export function RadialBarChart<TDatum>(props: RadialBarChartProps<TDatum>) {
  const { definition, host, children } = useChartDefinition<
    TDatum,
    RadialBarChartSpecOptions<TDatum>
  >(props, radialBarChartSpec, {
    // An arc's x value is an angle, so only nearest focus reads right.
    focus: "nearest",
    tooltipAnchor: "point",
    tooltipContent: radialTooltip,
  });
  return (
    <Chart definition={definition} {...host}>
      {children}
    </Chart>
  );
}
