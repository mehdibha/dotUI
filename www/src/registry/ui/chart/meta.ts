import type { EnumParamDef, RegistryItem } from "@/registry/types"

import type { ChartLook, chartCurves } from "./base"

type LookFields = Partial<
  Omit<ChartLook, "curve"> & { curve: keyof typeof chartCurves }
>

/* Each option is the `chartLook` fields it sets. The first option is the
   shipped literal; the others swap its lines on export. */
export const chartLooks = {
  axes: {
    minimal: { valueAxis: false },
    labeled: { valueAxis: {} },
  },
  grid: {
    lines: { grid: { strokeOpacity: 1 } },
    dashed: { grid: { strokeOpacity: 1, strokeDasharray: "3 3" } },
  },
  lines: {
    smooth: { curve: "natural", strokeWidth: 2 },
    straight: { curve: "linear", strokeWidth: 2 },
    fine: { curve: "linear", strokeWidth: 1.5 },
  },
  area: {
    tint: { areaOpacity: 0.4 },
    solid: { areaOpacity: 0.7 },
  },
  bars: {
    rounded: { barRadius: 4, barMaxThickness: undefined },
    square: { barRadius: 0, barMaxThickness: undefined },
    slim: { barRadius: 0, barMaxThickness: 16 },
  },
  legend: {
    bottom: { legend: "bottom" },
    top: { legend: "top" },
  },
  motion: {
    spring: { motion: { type: "spring", stiffness: 170, damping: 26 } },
    off: { motion: false },
    quick: { motion: { type: "tween", duration: 300, easing: "ease-out" } },
    bouncy: { motion: { type: "spring", stiffness: 180, damping: 12 } },
  },
} satisfies Record<string, Record<string, LookFields>>

function source(key: string, value: unknown): string {
  if (key === "curve") return `chartCurves.${String(value)}`
  if (value === null || typeof value !== "object") {
    return typeof value === "string" ? `"${value}"` : String(value)
  }
  const entries = Object.entries(value)
  if (entries.length === 0) return "{}"
  return `{ ${entries.map(([k, v]) => `${k}: ${source(k, v)}`).join(", ")} }`
}

/** The literal line a look field ships as. */
export function lookLine(key: string, value: unknown): string {
  return `  ${key}: ${source(key, value)},`
}

function look(
  options: Record<string, LookFields>,
  description: string,
): EnumParamDef {
  const [[fallback, base], ...rest] = Object.entries(options) as [
    [string, LookFields],
    ...[string, LookFields][],
  ]
  return {
    kind: "enum",
    default: fallback,
    values: [fallback, ...rest.map(([value]) => value)],
    source: Object.fromEntries(
      rest.map(([value, fields]) => [
        value,
        Object.fromEntries(
          Object.entries(fields)
            .filter(
              ([key, v]) =>
                source(key, v) !== source(key, base[key as keyof LookFields]),
            )
            .map(([key, v]) => [
              lookLine(key, base[key as keyof LookFields]),
              lookLine(key, v),
            ]),
        ),
      ]),
    ),
    description,
  }
}

const chartMeta = {
  name: "chart",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart/base.tsx",
      target: "ui/chart.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@1.0.0", "d3-scale", "d3-shape"],
  devDependencies: ["@types/d3-scale", "@types/d3-shape"],
  params: {
    axes: look(
      chartLooks.axes,
      "Whether value labels sit beside the gridlines.",
    ),
    grid: look(chartLooks.grid, "Solid or dashed gridlines."),
    lines: look(
      chartLooks.lines,
      "The curve and width of lines and area edges.",
    ),
    area: look(chartLooks.area, "How strongly areas are filled."),
    bars: look(
      chartLooks.bars,
      "The corners and width of bars, radial bars and heatmap cells.",
    ),
    legend: look(chartLooks.legend, "Where the color legend sits."),
    motion: look(chartLooks.motion, "How marks move between data states."),
  },
} satisfies RegistryItem

export default chartMeta
