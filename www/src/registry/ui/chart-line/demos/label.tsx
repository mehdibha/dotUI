"use client"

import { text } from "@tanstack/charts/text"

import { LineChart } from "@/registry/ui/chart-line"

const SERIES = "Desktop"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const labels = text(data, {
  x: "month",
  y: "desktop",
  text: "desktop",
  z: () => SERIES,
  dy: -12,
  fontSize: 12,
  fill: "var(--color-fg-muted)",
})

export default function ChartLineLabel() {
  return (
    <LineChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: SERIES }}
      legend={false}
      points
      marks={[labels]}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
