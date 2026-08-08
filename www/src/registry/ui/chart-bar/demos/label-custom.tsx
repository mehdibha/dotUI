"use client"

import { text } from "@tanstack/charts/text"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

/* Both labels ride inside the bar, so the chart needs no axes at all: the
   category anchors to the value baseline, the value to the bar's end. */
const labels = [
  text(data, {
    x: () => 0,
    y: "month",
    text: "month",
    z: () => "Desktop",
    fill: "var(--color-bg)",
    fontSize: 12,
    fontWeight: 500,
    anchor: "start",
    dx: 10,
  }),
  text(data, {
    x: "desktop",
    y: "month",
    text: "desktop",
    z: () => "Desktop",
    fill: "var(--color-bg)",
    fontSize: 12,
    anchor: "end",
    dx: -10,
  }),
]

export default function ChartBarLabelCustom() {
  return (
    <BarChart
      horizontal
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      axes={false}
      grid={false}
      legend={false}
      marks={labels}
      focus="group-y"
      ariaLabel="Desktop visitors per month, labelled inside each bar"
    />
  )
}
