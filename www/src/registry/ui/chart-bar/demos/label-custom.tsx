"use client"

import { defineChart } from "@tanstack/charts"
import { barX } from "@tanstack/charts/bar"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { text } from "@tanstack/charts/text"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

/* Both labels ride inside the bar: the category anchors to the value
   baseline, the value to the bar's end. */
const chart = defineChart({
  scales: {
    x: { scale: scaleLinear, nice: true, axis: false },
    y: { scale: chartBand, axis: false },
  },
  marks: [
    barX(data, {
      x: "desktop",
      y: "month",
      z: () => "Desktop",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
    decorative(
      text(data, {
        x: () => 0,
        y: "month",
        text: "month",
        fill: "var(--color-bg)",
        fontSize: 12,
        fontWeight: 500,
        anchor: "start",
        dx: 10,
      }),
    ),
    decorative(
      text(data, {
        x: "desktop",
        y: "month",
        text: "desktop",
        fill: "var(--color-bg)",
        fontSize: 12,
        anchor: "end",
        dx: -10,
      }),
    ),
  ],
  focus: "group-y",
})

export default function ChartBarLabelCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, labelled inside each bar"
    />
  )
}
