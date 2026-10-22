"use client";

import * as React from "react";
import type {
  ChartAxisPresentationOptions,
  ChartGuideLineStyle,
  ChartLinearGradient,
  ChartMotionTransition,
  ChartPoint,
  ChartTheme,
  ChartTooltipContent,
  ChartTooltipContentContext,
  ChartTooltipInput,
  ChartValue,
  DomChartDefinition,
  MarkScene,
} from "@tanstack/charts";
import { isResponsiveChartDefinition } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend";
import { decorative } from "@tanstack/charts/mark/decorative";
import { motion, stagger } from "@tanstack/charts/motion";
import type { PolarGuideLabelContext, PolarMark } from "@tanstack/charts/polar";
import type { RendererChartCommonProps } from "@tanstack/charts/react/tooltip";
import { RendererChart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { curveMonotoneX, curveNatural, curveStepAfter } from "d3-shape";

import { cn } from "@/lib/utils";

export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const;

export const chartCurves = {
  linear: undefined,
  natural: /* @__PURE__ */ d3Curve(curveNatural),
  monotone: /* @__PURE__ */ d3Curve(curveMonotoneX),
  step: /* @__PURE__ */ d3Curve(curveStepAfter),
};

export interface ChartLook {
  curve: (typeof chartCurves)[keyof typeof chartCurves];
  strokeWidth: number;
  areaOpacity: number;
  barRadius: number;
  barMaxThickness: number | undefined;
  valueAxis: false | ChartAxisPresentationOptions;
  grid: ChartGuideLineStyle;
  legend: "top" | "bottom";
  motion: ChartMotionTransition | false;
}

export const chartLook: ChartLook = {
  curve: chartCurves.natural,
  strokeWidth: 2,
  areaOpacity: 0.4,
  barRadius: 4,
  barMaxThickness: undefined,
  valueAxis: false,
  grid: { strokeOpacity: 1 },
  legend: "bottom",
  motion: { type: "spring", stiffness: 170, damping: 26 },
};

export const chartBand = () => scaleBand().paddingInner(0.2).paddingOuter(0.1);

function legendAt(placement: ChartLook["legend"]) {
  return colorLegend({
    placement,
    items: colorLegendItems({
      justify: "center",
      gap: 16,
      indicator: { shape: "square", width: 8, height: 8, gap: 6 },
    }),
  });
}

export const chartLegend = legendAt(chartLook.legend);

export const chartFades: ChartLinearGradient[] = chartColors.map(
  (color, slot) => ({
    id: `chart-fade-${slot}`,
    y1: 1,
    y2: 0,
    stops: [
      { offset: 0, color, opacity: 0.02 },
      { offset: 1, color, opacity: 0.5 },
    ],
  }),
);

/* -------------------------------------------------------------------------- */

export function chartSliceTooltip(
  label: string,
  value: string,
  format: (value: number) => string = (value) => value.toLocaleString(),
) {
  return {
    use: tooltip,
    anchor: "point" as const,
    content: (points: readonly ChartPoint[]) => ({
      rows: points.map((point) => {
        const datum = point.datum as Record<string, unknown>;
        return {
          label: String(datum[label]),
          value: format(Number(datum[value])),
          color: point.color,
        };
      }),
    }),
  };
}

export const chartAngleLabels = {
  labelDx: ({ x }: PolarGuideLabelContext) => (x < -1 ? -3 : x > 1 ? 3 : 0),
  labelDy: ({ y }: PolarGuideLabelContext) => (y < -1 ? -2 : y > 1 ? 2 : 0),
};

type AnyPolarMark = PolarMark<any, any, any, any, any>;

export function polarDecorative<TMark extends AnyPolarMark>(
  mark: TMark,
): TMark {
  const wrapped = decorative(mark as never) as unknown as TMark;
  return {
    ...wrapped,
    initialize: (context) => {
      const initialized = wrapped.initialize(context);
      const { postDomain } = initialized as {
        postDomain?: (scene: MarkScene) => MarkScene;
      };
      return {
        ...initialized,
        render: (renderContext) => {
          const scene = initialized.render(renderContext);
          return postDomain ? postDomain(scene) : scene;
        },
      };
    },
  };
}

/* -------------------------------------------------------------------------- */

const theme = {
  palette: chartColors,
  foreground: "var(--color-fg-muted)",
  muted: "var(--color-fg-muted)",
  grid: "var(--color-border)",
} satisfies Partial<ChartTheme>;

const TOOLTIP_CLASS = [
  "[--ts-chart-tooltip-background:color-mix(in_oklab,var(--color-popover)_var(--popover-alpha),transparent)]",
  "[backdrop-filter:var(--popover-backdrop-filter)]",
  "[--ts-chart-tooltip-color:var(--color-fg)]",
  "[--ts-chart-tooltip-border:1px_solid_var(--overlay-border)]",
  "[--ts-chart-tooltip-border-radius:var(--radius-lg)]",
  "[--ts-chart-tooltip-shadow:var(--shadow-popover,var(--shadow-md))]",
  "[--ts-chart-tooltip-font:500_0.75rem/1.3_var(--font-sans)]",
].join(" ");

const STAGGER = stagger({ each: 25, roles: ["arc", "bar"] });

type Spec = {
  scales?: Record<string, unknown>;
  color?: { legend?: unknown };
  theme?: Partial<ChartTheme>;
};

type Scale = {
  grid?: boolean | ChartGuideLineStyle;
  axis?: false | ChartAxisPresentationOptions;
};

function styleScale(scale: Scale, look: ChartLook): Scale {
  const { grid, axis } = scale;
  return {
    ...scale,
    grid: grid === true ? look.grid : grid && { ...look.grid, ...grid },
    axis: axis !== false && {
      line: false,
      ...axis,
      ticks: axis?.ticks !== false && { size: 0, padding: 10, ...axis?.ticks },
    },
  };
}

function styleSpec<TSpec extends Spec>(spec: TSpec, look: ChartLook): TSpec {
  const scales = Object.fromEntries(
    Object.entries(spec.scales ?? {}).map(([id, scale]) => [
      id,
      scale && typeof scale === "object" ? styleScale(scale, look) : scale,
    ]),
  );
  const legend =
    spec.color?.legend === chartLegend && look.legend !== chartLook.legend
      ? legendAt(look.legend)
      : spec.color?.legend;
  return {
    ...spec,
    scales,
    ...(spec.color && { color: { ...spec.color, legend } }),
    theme: { ...theme, ...spec.theme },
  };
}

type Format = (value: ChartValue) => string;

type TooltipOptions = {
  className?: string;
  items?: readonly unknown[];
  content?: unknown;
  format?: unknown;
  formatGroup?: unknown;
};

type ItemText = (
  point: ChartPoint,
  context: ChartTooltipContentContext,
) => string | null | undefined;

function tickFormat(scale: unknown): Format | undefined {
  const { axis } = (scale ?? {}) as Scale;
  return axis && axis.ticks ? axis.ticks.format : undefined;
}

function sameValue(left: ChartValue, right: ChartValue) {
  return left instanceof Date && right instanceof Date
    ? +left === +right
    : Object.is(left, right);
}

function pointValue(point: ChartPoint, axis: "x" | "y", format: Format) {
  const interval = axis === "x" ? point.xInterval : point.yInterval;
  const start = axis === "x" ? point.x1Value : point.y1Value;
  const end = axis === "x" ? point.x2Value : point.y2Value;
  if (
    interval === "difference" &&
    typeof start === "number" &&
    typeof end === "number"
  ) {
    return format(end - start);
  }
  if (interval === "range" && start !== undefined && end !== undefined) {
    return `${format(start)}–${format(end)}`;
  }
  return format(axis === "x" ? point.xValue : point.yValue);
}

function houseContent(
  items: readonly unknown[] = [],
  formats: Partial<Record<"x" | "y", Format>>,
) {
  const itemText = (axis: "x" | "y") =>
    (
      items.find(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          (item as { channel?: string }).channel === axis,
      ) as { text?: ItemText } | undefined
    )?.text;
  return (
    points: readonly ChartPoint[],
    context: ChartTooltipContentContext,
  ): ChartTooltipContent => {
    const first = points[0];
    if (first === undefined) return { rows: [] };
    const text = (point: ChartPoint, axis: "x" | "y") =>
      itemText(axis)?.(point, context) ??
      pointValue(
        point,
        axis,
        formats[axis] ?? (axis === "x" ? context.formatX : context.formatY),
      );
    const byY =
      points.length > 1
        ? points.every((point) => sameValue(point.yValue, first.yValue)) &&
          !points.every((point) => sameValue(point.xValue, first.xValue))
        : typeof first.xValue === "number" && typeof first.yValue !== "number";
    const [category, value] = byY
      ? (["y", "x"] as const)
      : (["x", "y"] as const);
    return {
      title: text(first, category),
      rows: points.map((point) => ({
        label: point.groupLabel,
        value: text(point, value),
        color: point.color,
        active: points.length > 1 && point === context.primaryPoint,
      })),
    };
  };
}

function styleTooltip(
  input: ChartTooltipInput<never, never, never, "dom">,
  scales: Record<string, unknown>,
) {
  const options = (
    typeof input === "object" && "use" in input ? input : { use: input }
  ) as TooltipOptions;
  const custom = options.content ?? options.format ?? options.formatGroup;
  return {
    anchor: "group-center",
    sort: "color-domain",
    portal,
    ...options,
    className: cn(TOOLTIP_CLASS, options.className),
    content:
      custom === undefined
        ? houseContent(options.items, {
            x: tickFormat(scales.x),
            y: tickFormat(scales.y),
          })
        : options.content,
  };
}

export function withChartLook<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(
  definition: DomChartDefinition<TDatum, TXValue, TYValue>,
  look: ChartLook = chartLook,
): DomChartDefinition<TDatum, TXValue, TYValue> {
  const input = definition.tooltip as
    | ChartTooltipInput<never, never, never, "dom">
    | false
    | undefined;
  const behavior = {
    focus: definition.focus ?? "group-x",
    keyboard: definition.keyboard ?? true,
    tooltip:
      input === false
        ? false
        : styleTooltip(
            input ?? tooltip,
            isResponsiveChartDefinition(definition) ? {} : definition.scales,
          ),
    motion:
      definition.motion ??
      (look.motion && { transition: look.motion, ...STAGGER }),
  };
  if (isResponsiveChartDefinition(definition)) {
    const build = definition.chart;
    return {
      ...definition,
      ...behavior,
      chart: (context) => styleSpec(build(context), look),
    } as DomChartDefinition<TDatum, TXValue, TYValue>;
  }
  return {
    ...styleSpec(definition, look),
    ...behavior,
  } as DomChartDefinition<TDatum, TXValue, TYValue>;
}

const RENDERER = motion({ initial: "always" });

export type ChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = Omit<
  RendererChartCommonProps<TDatum, TXValue, TYValue>,
  "renderer" | "measureText"
> & {
  definition: DomChartDefinition<TDatum, TXValue, TYValue>;
  look?: ChartLook;
  children?: React.ReactNode;
};

export const Chart = <
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  definition,
  look = chartLook,
  children,
  className,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) => {
  const styled = React.useMemo(
    () => withChartLook(definition, look),
    [definition, look],
  );
  const round =
    !isResponsiveChartDefinition(definition) &&
    definition.scales.x === null &&
    definition.scales.y === null;
  return (
    <div className={cn("relative", className)}>
      <RendererChart
        renderer={RENDERER}
        aspectRatio={
          props.height === undefined ? (round ? 1 : 16 / 9) : undefined
        }
        definition={styled}
        {...props}
      />
      {children == null || typeof children === "boolean" ? null : (
        <div className="pointer-events-none absolute inset-0">{children}</div>
      )}
    </div>
  );
};
