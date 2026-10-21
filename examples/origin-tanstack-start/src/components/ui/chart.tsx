"use client";

import * as React from "react";
import type {
  ChannelField,
  ChartAxisOptions,
  ChartBuildContext,
  ChartColorOptions,
  ChartDefinitionOptions,
  ChartKey,
  ChartLinearGradient,
  ChartMark,
  ChartMotionSpringTransition,
  ChartMotionTweenTransition,
  ChartPoint,
  ChartTheme,
  ChartTooltipContent,
  ChartTooltipContentContext,
  ChartValue,
  DomChartDefinition,
} from "@tanstack/charts";
import { defineChart } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend";
import { motion, stagger } from "@tanstack/charts/motion";
import type { PolarMark } from "@tanstack/charts/polar";
import type { RendererChartCommonProps } from "@tanstack/charts/react/tooltip";
import { RendererChart } from "@tanstack/charts/react/tooltip";
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip";
import { portal as tooltipPortal } from "@tanstack/charts/tooltip/portal";
import { scaleBand, scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, curveNatural, curveStepAfter } from "d3-shape";
import { tv } from "tailwind-variants";

const chartVariants = tv({
  slots: {
    container: "relative",
  },
});

const { container } = chartVariants();

export const chartDefaults = {
  aspectRatio: 16 / 9,
  curve: "natural",
  strokeWidth: 2,
  fill: 0.4,
  points: false,
  dotRadius: 4,
  barRadius: 4,
  cellRadius: 2,
  cellInset: 1,
  bandPadding: 0.2,
  bandOuterPadding: 0.1,
  groupPadding: 0.15,
  grid: true,
  axes: "x",
  legend: false,
  focus: "group-x",
  tooltipAnchor: "group-center",
  animateMaxPoints: 800,
  enterStagger: 25,
  narrowWidth: 420,
  narrowTickCount: 4,
} as const;

export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const;

export const CHART_THEME: Partial<ChartTheme> = {
  palette: CHART_PALETTE,
  foreground: "var(--color-fg-muted)",
  muted: "var(--color-fg-muted)",
  grid: "var(--color-border)",
};

export function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_PALETTE[0];
}

export type ChartCurve = "linear" | "natural" | "monotone" | "step";
export type ChartFocus =
  | "nearest"
  | "nearest-x"
  | "nearest-y"
  | "group-x"
  | "group-y";
export type ChartTooltipAnchor = "point" | "pointer" | "group-center";
export type ChartFormat = (value: ChartValue) => string;

export const CURVES = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
} as const satisfies Record<ChartCurve, unknown>;

export type ChartMarkLayer = ChartMark<unknown, any, any>;
/** Mark layers spliced inside a polar container — cartesian marks would land outside it. */
export type PolarMarkLayer = PolarMark<any, any, any, any, any>;

export type ChartXField<TDatum> = ChannelField<
  TDatum,
  ChartValue | null | undefined
>;
export type ChartYField<TDatum> = ChannelField<
  TDatum,
  number | null | undefined
>;
export type ChartSeriesField<TDatum> = ChannelField<
  TDatum,
  ChartKey | null | undefined
>;

/** The value when it is a finite number, `null` otherwise — a gap, not a zero. */
export function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export const TAU = Math.PI * 2;

export function rowLabel(
  name: string,
  labels: Readonly<Record<string, string>> | undefined,
) {
  return (row: unknown) => {
    const key = String((row as Record<string, unknown>)[name]);
    return labels?.[key] ?? key;
  };
}

export interface ChartSpec<TDatum> extends ChartFrame {
  marks: readonly ChartMarkLayer[];
  gradients?: readonly ChartLinearGradient[];
  readonly __datum?: TDatum;
}

export interface ChartFrameOptions {
  grid?: boolean;
  /** Both axes, neither, or just one. */
  axes?: boolean | "x" | "y";
  legend?: boolean;
  formatX?: ChartFormat;
  formatY?: ChartFormat;
}

export interface ChartBaseSpecOptions<TDatum> extends ChartFrameOptions {
  data: readonly TDatum[];
  /** Stable row identity, so sorted or filtered data is retained, not respawned. */
  rowKey?: ChannelField<TDatum, ChartKey>;
  /** Mark layers painted under the built-ins. */
  marksBefore?: readonly ChartMarkLayer[];
  /** Mark layers painted over the built-ins. */
  marks?: readonly ChartMarkLayer[];
}

export interface XYChartSpecOptions<
  TDatum,
> extends ChartBaseSpecOptions<TDatum> {
  /** Field holding the category / time value. */
  x: ChartXField<TDatum>;
  /** One field per series (wide rows), or a single field with `series`. */
  y: ChartYField<TDatum> | readonly ChartYField<TDatum>[];
  /** Field splitting rows into series — the long-format alternative to `y`. */
  series?: ChartSeriesField<TDatum>;
  /** Leading series order — drives color-slot assignment and the legend. */
  seriesOrder?: readonly string[];
  /** Display names for series keys. */
  labels?: Readonly<Record<string, string>>;
}

export interface ChartPlan<TDatum> {
  /** Series labels, in color-slot and legend order. */
  order: readonly string[];
  /** The rows the mark reads: the input, or one row per series when `y` lists several fields. */
  rows: readonly TDatum[];
  x: ChartXField<TDatum>;
  y: ChartYField<TDatum>;
  /** Reads a row's series label — the `z` and color channel. */
  z: (row: TDatum) => string;
  key?: (row: TDatum) => string;
  /** Several `y` fields were folded into one series per field. */
  wide: boolean;
}

export function orderSeries(
  leading: readonly string[],
  found: readonly string[],
): string[] {
  const listed = new Set(leading);
  return [...leading, ...new Set(found.filter((label) => !listed.has(label)))];
}

export function planChart<TDatum>(
  options: XYChartSpecOptions<TDatum>,
): ChartPlan<TDatum> {
  const labelOf = (key: string) => options.labels?.[key] ?? key;
  const fields = (
    Array.isArray(options.y) ? options.y : [options.y]
  ) as readonly ChartYField<TDatum>[];
  const first = fields[0];
  if (first === undefined) throw new Error("charts: `y` needs a field");
  const rowKey = options.rowKey as keyof TDatum | undefined;
  const idOf = (row: TDatum) => String(rowKey === undefined ? "" : row[rowKey]);

  if (options.series !== undefined) {
    const series = options.series as keyof TDatum;
    const z = (row: TDatum) => labelOf(String(row[series]));
    return {
      order: orderSeries(
        options.seriesOrder?.map(labelOf) ?? [],
        options.data.map(z),
      ),
      rows: options.data,
      x: options.x,
      y: first,
      z,
      key: rowKey && ((row) => `${idOf(row)}:${z(row)}`),
      wide: false,
    };
  }

  if (fields.length === 1) {
    const label = labelOf(String(first));
    return {
      order: [label],
      rows: options.data,
      x: options.x,
      y: first,
      z: () => label,
      key: rowKey && idOf,
      wide: false,
    };
  }

  const rank = (field: string) => {
    const index = options.seriesOrder?.indexOf(field) ?? -1;
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const ordered = [...fields].sort(
    (a, b) => rank(String(a)) - rank(String(b)),
  ) as readonly (keyof TDatum & string)[];
  const rows = options.data.flatMap((row) =>
    ordered.map((field) => ({
      ...row,
      series: field,
      value: finiteOrNull(row[field]),
    })),
  ) as readonly TDatum[];
  const z = (row: TDatum) => labelOf((row as { series: string }).series);
  return {
    order: ordered.map(labelOf),
    rows,
    x: options.x,
    y: "value" as ChartYField<TDatum>,
    z,
    key: rowKey && ((row) => `${idOf(row)}:${z(row)}`),
    wide: true,
  };
}

export type ChartScaleKind = "band" | "point" | "linear";

const SCALES: Record<ChartScaleKind, () => ChartAxisOptions["scale"]> = {
  band: () =>
    scaleBand()
      .paddingInner(chartDefaults.bandPadding)
      .paddingOuter(chartDefaults.bandOuterPadding),
  point: () => scalePoint(),
  linear: () => scaleLinear(),
};

/** Axis options merged over the computed axis; `label` is the axis title. */
export interface ChartAxisOverrides extends Partial<
  Omit<ChartAxisOptions, "axis">
> {
  label?: string;
}

export interface ChartFrameSpec {
  /** Color-scale domain and legend order — usually `planChart().order`. */
  order?: readonly string[];
  x?: ChartScaleKind | ChartAxisOverrides;
  y?: ChartScaleKind | ChartAxisOverrides;
  /** Axis carrying the grid. */
  grid?: "x" | "y" | "none";
  /** Merged over the categorical default — a sequential scale goes here. */
  color?: ChartColorOptions;
}

export interface ChartFrame {
  scales: {
    x: ChartAxisOptions | null;
    y: ChartAxisOptions | null;
  };
  color?: ChartColorOptions;
  theme?: Partial<ChartTheme>;
}

interface AxisTicks {
  format?: ChartFormat;
  count?: number;
}

function frameAxis(
  spec: ChartScaleKind | ChartAxisOverrides | undefined,
  fallback: ChartScaleKind,
  grid: boolean,
  ticks: false | AxisTicks,
): ChartAxisOptions {
  const kind = typeof spec === "string" ? spec : fallback;
  const { label, ...overrides }: ChartAxisOverrides =
    typeof spec === "object" ? spec : {};
  return {
    scale: SCALES[kind],
    nice: kind === "linear",
    // The library paints the grid at 11% opacity; the border token is already
    // a hairline.
    grid: grid && { strokeOpacity: 1 },
    axis: ticks && {
      line: false,
      ticks: { size: 0, padding: 10, ...ticks },
      label,
    },
    ...overrides,
  };
}

export function chartLegend() {
  return colorLegend({
    placement: "bottom",
    items: colorLegendItems({
      justify: "center",
      gap: 16,
      indicator: { shape: "square", width: 8, height: 8, gap: 6 },
    }),
  });
}

export function chartFrame(
  options: ChartFrameOptions,
  ctx: ChartBuildContext,
  spec: ChartFrameSpec = {},
): ChartFrame {
  const axes = options.axes ?? chartDefaults.axes;
  const grid = options.grid ?? chartDefaults.grid;
  const gridOn = spec.grid ?? "y";
  const legend =
    (options.legend ?? chartDefaults.legend)
      ? (spec.color?.legend ?? chartLegend())
      : undefined;
  const order = spec.order ?? [];
  return {
    scales: {
      x: frameAxis(
        spec.x,
        "point",
        grid && gridOn === "x",
        (axes === true || axes === "x") && {
          format: options.formatX,
          count:
            ctx.width < chartDefaults.narrowWidth
              ? chartDefaults.narrowTickCount
              : undefined,
        },
      ),
      y: frameAxis(
        spec.y,
        "linear",
        grid && gridOn === "y",
        (axes === true || axes === "y") && { format: options.formatY },
      ),
    },
    color: {
      ...(order.length > 0 ? { domain: order } : null),
      ...spec.color,
      legend,
    },
    theme: CHART_THEME,
  };
}

interface DecorativeMark {
  initialize: (context: never) => {
    render: (context: never) => { nodes: readonly unknown[] };
  };
}

/* The library's own `decorative` works through `postDomain`, which the polar
   container never calls. */
export function decorative<TMark extends DecorativeMark>(mark: TMark): TMark {
  const initialize = (context: never) => {
    const initialized = mark.initialize(context);
    return {
      ...initialized,
      render: (renderContext: never) => ({
        nodes: initialized.render(renderContext).nodes.map(stripInteraction),
      }),
    };
  };
  return { ...mark, initialize } as TMark;
}

interface SceneNodeLike {
  kind?: string;
  children?: readonly unknown[];
  focus?: { retarget?: boolean; candidates?: readonly unknown[] };
  [key: string]: unknown;
}

// The scene compiler re-collects points by walking the nodes, so the metadata
// has to go at every depth.
function stripInteraction(node: unknown): unknown {
  if (node === null || typeof node !== "object") return node;
  const source = node as SceneNodeLike;
  if (source.kind === "group") {
    const {
      focus,
      states: _states,
      pointOwner: _groupOwner,
      focusCandidateIndex: _focusCandidateIndex,
      ...rest
    } = source;
    const children =
      focus?.retarget && focus.candidates ? focus.candidates : source.children;
    return { ...rest, children: (children ?? []).map(stripInteraction) };
  }
  if (source.kind === "label") {
    const { pointOwner: _labelOwner, ...rest } = source;
    return rest;
  }
  const {
    interaction: _interaction,
    pointOwner: _pointOwner,
    ...rest
  } = source;
  return rest;
}

/* A configured polar scale that no mark binds is rejected at runtime. */
export function polarMarksBindScales(
  marks: readonly PolarMarkLayer[] | undefined,
): boolean {
  return (marks ?? []).some((mark) => {
    const probed = mark.initialize({ markIndex: 0, parentId: "probe" });
    return Boolean(
      probed.angleScale ??
      probed.radiusScale ??
      (probed.requiresAngleScale || probed.requiresRadiusScale),
    );
  });
}

/* Function easing is excluded: an inline easing would defeat the definition
   memo. */
export type ChartAnimate =
  | boolean
  | (Omit<ChartMotionTweenTransition, "easing"> & {
      easing?: Extract<ChartMotionTweenTransition["easing"], string>;
    })
  | ChartMotionSpringTransition;

export interface ChartBehaviorProps {
  focus?: ChartFocus;
  /** Pixel radius beyond which a pointer stops matching a point. */
  maxFocusDistance?: number;
  tooltipAnchor?: ChartTooltipAnchor;
  tooltip?: boolean;
  animate?: ChartAnimate;
}

export type ChartHostProps<TDatum> = Omit<
  RendererChartCommonProps<TDatum, ChartValue, number>,
  "renderer" | "measureText"
>;

export type ChartProps<TDatum> = ChartHostProps<TDatum> & {
  definition: DomChartDefinition<TDatum, ChartValue, number>;
  children?: React.ReactNode;
};

/** The full prop surface of a family component, from its spec options. */
export type ChartComponentProps<TOptions, TDatum> = TOptions &
  ChartBehaviorProps &
  ChartHostProps<TDatum> & { children?: React.ReactNode };

/* The vars sit on the tooltip element itself because the portal detaches it
   from the chart container. */
const TOOLTIP_SURFACE_CLASS = [
  "[--ts-chart-tooltip-background:color-mix(in_oklab,var(--color-popover)_var(--popover-alpha),transparent)]",
  "[backdrop-filter:var(--popover-backdrop-filter)]",
  "[--ts-chart-tooltip-color:var(--color-fg)]",
  "[--ts-chart-tooltip-border:1px_solid_var(--overlay-border)]",
  "[--ts-chart-tooltip-border-radius:var(--radius-lg)]",
  "[--ts-chart-tooltip-shadow:var(--shadow-popover,var(--shadow-md))]",
  "[--ts-chart-tooltip-font:500_0.75rem/1.3_var(--font-sans)]",
].join(" ");

/* A renderer identity change remounts the surface. `initial: "always"`
   because the React adapter adopts its prerendered markup on every mount,
   which would otherwise suppress the entrance. */
const MOTION_RENDERER = motion({ initial: "always" });

/* -------------------------------------------------------------------------- */

export const Chart = <TDatum,>({
  children,
  className,
  ...props
}: ChartProps<TDatum>) => {
  return (
    <div className={container({ className })}>
      <RendererChart
        renderer={MOTION_RENDERER}
        aspectRatio={
          props.height === undefined ? chartDefaults.aspectRatio : undefined
        }
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  );
};

/* Tracks `RendererChartCommonProps` minus `renderer`/`measureText`. */
const HOST_PROP_NAMES = new Set([
  "ariaLabel",
  "ariaDescription",
  "height",
  "aspectRatio",
  "width",
  "initialWidth",
  "className",
  "style",
  "tabIndex",
  "idPrefix",
  "onFocusChange",
  "onFocusGroupChange",
  "onSelect",
  "onRender",
  "renderTooltipBody",
]);

const BEHAVIOR_PROP_NAMES = new Set([
  "focus",
  "maxFocusDistance",
  "tooltip",
  "tooltipAnchor",
  "animate",
]);

export function splitChartProps(props: object): {
  host: Record<string, unknown>;
  behavior: ChartBehaviorProps;
  spec: Record<string, unknown>;
} {
  const source = props as Record<string, unknown>;
  const host: Record<string, unknown> = {};
  const behavior: Record<string, unknown> = {};
  const spec: Record<string, unknown> = {};
  for (const name of Object.keys(source)) {
    const value = source[name];
    if (value === undefined || name === "children") continue;
    if (HOST_PROP_NAMES.has(name)) host[name] = value;
    else if (BEHAVIOR_PROP_NAMES.has(name)) behavior[name] = value;
    else spec[name] = value;
  }
  return { host, behavior: behavior as ChartBehaviorProps, spec };
}

const isFlat = (value: unknown) =>
  typeof value !== "object" && typeof value !== "function";

export function sameOption(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => isFlat(value) && value === right[index])
    );
  }
  if (
    left !== null &&
    right !== null &&
    typeof left === "object" &&
    typeof right === "object" &&
    Object.getPrototypeOf(left) === Object.prototype &&
    Object.getPrototypeOf(right) === Object.prototype
  ) {
    const a = left as Record<string, unknown>;
    const b = right as Record<string, unknown>;
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => isFlat(a[key]) && a[key] === b[key])
    );
  }
  return false;
}

export function sameOptions(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): boolean {
  const keys = Object.keys(left);
  return (
    keys.length === Object.keys(right).length &&
    keys.every((key) => key in right && sameOption(left[key], right[key]))
  );
}

function useOptionsMemo<T>(
  compute: () => T,
  options: Record<string, unknown>,
): T {
  const cache = React.useRef<{
    options: Record<string, unknown>;
    value: T;
  } | null>(null);
  if (cache.current !== null && sameOptions(cache.current.options, options)) {
    return cache.current.value;
  }
  const value = compute();
  cache.current = { options, value };
  return value;
}

const ENTER_STAGGER = stagger({
  each: chartDefaults.enterStagger,
  roles: ["arc", "bar"],
});
export type ChartTooltipContentOf<TOptions> = (
  points: readonly ChartPoint[],
  context: ChartTooltipContentContext,
  options: TOptions,
) => ChartTooltipContent;

export interface ChartFamilyConfig<TOptions> {
  focus?: ChartDefinitionOptions<any, any, any>["focus"];
  tooltipAnchor?: ChartTooltipAnchor;
  /** Replaces the library's tooltip rows — polar families, whose scale values are angles. */
  tooltipContent?: ChartTooltipContentOf<TOptions>;
}

/**
 * Rebuilds the definition only when a spec or behavior option changes.
 * `build` is compared by identity — declare it at module scope.
 */
export function useChartDefinition<TDatum, TOptions>(
  props: object,
  build: (options: TOptions, ctx: ChartBuildContext) => ChartSpec<TDatum>,
  family: ChartFamilyConfig<TOptions> = {},
): {
  definition: DomChartDefinition<TDatum, ChartValue, number>;
  host: ChartHostProps<TDatum>;
  children: React.ReactNode;
} {
  const { host, behavior, spec } = splitChartProps(props);
  const options = spec as TOptions;
  const rows = Array.isArray(spec.data) ? spec.data.length : 0;
  const series = Array.isArray(spec.y) ? spec.y.length : 1;
  const degrade = rows * series > chartDefaults.animateMaxPoints;
  const systemMotion: Exclude<ChartAnimate, true> = {
    type: "spring",
    stiffness: 170,
    damping: 26,
  };
  const animate = behavior.animate ?? true;
  const transition = animate === true ? systemMotion : animate;
  const { tooltipContent } = family;
  const definition = useOptionsMemo(
    () =>
      defineChart({
        chart: (ctx) => build(options, ctx),
        focus: behavior.focus ?? family.focus ?? chartDefaults.focus,
        maxFocusDistance: behavior.maxFocusDistance,
        keyboard: true,
        tooltip:
          behavior.tooltip === false
            ? false
            : {
                use: tooltipExtension,
                anchor:
                  behavior.tooltipAnchor ??
                  family.tooltipAnchor ??
                  chartDefaults.tooltipAnchor,
                sort: "color-domain",
                portal: tooltipPortal,
                className: TOOLTIP_SURFACE_CLASS,
                ...(tooltipContent && {
                  content: (points, context) =>
                    tooltipContent(points, context, options),
                }),
              },
        motion:
          degrade || transition === false
            ? false
            : { transition, ...ENTER_STAGGER },
      }),
    { ...spec, ...behavior, build, degrade, transition },
  );
  return {
    definition: definition as DomChartDefinition<TDatum, ChartValue, number>,
    host: host as ChartHostProps<TDatum>,
    children: (props as { children?: React.ReactNode }).children,
  };
}
