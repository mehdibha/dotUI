import type { EnumParamDef, RegistryItem } from "@/registry/types"

/* A chart look: the first value is the default, and every other one swaps
   its line of the shipped `chartDefaults` literal. */
function look(
  key: string,
  values: readonly [string, ...string[]],
  description: string,
): EnumParamDef {
  const [fallback] = values
  return {
    kind: "enum",
    default: fallback,
    values,
    source: Object.fromEntries(
      values
        .slice(1)
        .map((value) => [
          value,
          { [`  ${key}: "${fallback}",`]: `  ${key}: "${value}",` },
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
      "axes",
      ["minimal", "labeled", "baseline", "right"],
      "Which axes a chart shows: category labels only, value labels too, a baseline, or values on the right.",
    ),
    grid: look(
      "grid",
      ["lines", "dashed", "full"],
      "Gridlines along the value axis, dashed, or on both axes.",
    ),
    lines: look(
      "lines",
      ["smooth", "straight", "fine"],
      "How lines and area edges are drawn.",
    ),
    area: look("area", ["tint", "gradient", "solid"], "How areas are filled."),
    bars: look(
      "bars",
      ["rounded", "tip", "square", "slim"],
      "The shape of bars, radial bars and heatmap cells.",
    ),
    legend: look(
      "legend",
      ["off", "bottom", "top"],
      "Where a chart with several series shows its legend.",
    ),
    guide: look(
      "guide",
      ["none", "line", "dashed"],
      "The guide drawn at the hovered position.",
    ),
    motion: look(
      "motion",
      ["spring", "off", "quick", "bouncy"],
      "How marks move between data states.",
    ),
  },
} satisfies RegistryItem

export default chartMeta
