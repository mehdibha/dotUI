"use client"

import { useMemo } from "react"
import type { ChartValue } from "@tanstack/charts"
import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { barY } from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import {
  pie,
  polar,
  radialArc,
  radialBarAngle,
  radialGrid,
} from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"
import { stackRowsY } from "@tanstack/charts/transform/stack"

import {
  Chart,
  chartBand,
  chartFades,
  chartLegend,
  chartSliceTooltip,
  useChartLook,
} from "@/registry/ui/chart"
import type { ChartLook } from "@/registry/ui/chart"

import { Board, BoardSection, useLoop, useReplay } from "./board"

// The legend keeps ~20px below itself: trim the card's bottom to match its top.
const CARD =
  "flex-col flex-nowrap items-stretch justify-start p-6 pb-1 max-sm:p-4 max-sm:pb-0"
const HEIGHT = 200

const phases = <T,>(first: T[], second: T[]) => [first, second] as const

const DEVICES = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" }

const VISITORS = phases(
  [
    { month: "Jan", desktop: 1860, mobile: 1240, tablet: 420 },
    { month: "Feb", desktop: 2050, mobile: 1520, tablet: 460 },
    { month: "Mar", desktop: 2370, mobile: 1610, tablet: 510 },
    { month: "Apr", desktop: 1730, mobile: 1890, tablet: 480 },
    { month: "May", desktop: 2090, mobile: 2130, tablet: 560 },
    { month: "Jun", desktop: 2440, mobile: 2380, tablet: 610 },
  ],
  [
    { month: "Jan", desktop: 1420, mobile: 1680, tablet: 380 },
    { month: "Feb", desktop: 1890, mobile: 1410, tablet: 520 },
    { month: "Mar", desktop: 1650, mobile: 2010, tablet: 440 },
    { month: "Apr", desktop: 2280, mobile: 1560, tablet: 590 },
    { month: "May", desktop: 1940, mobile: 2410, tablet: 500 },
    { month: "Jun", desktop: 2610, mobile: 1980, tablet: 660 },
  ],
)

const PLANS = { free: "Free", pro: "Pro", team: "Team" }

const SIGNUPS = phases(
  [
    { month: "Jan", free: 232, pro: 100, team: 40 },
    { month: "Feb", free: 381, pro: 150, team: 60 },
    { month: "Mar", free: 296, pro: 175, team: 51 },
    { month: "Apr", free: 216, pro: 138, team: 70 },
    { month: "May", free: 261, pro: 163, team: 78 },
    { month: "Jun", free: 330, pro: 190, team: 88 },
  ],
  [
    { month: "Jan", free: 178, pro: 130, team: 55 },
    { month: "Feb", free: 285, pro: 120, team: 48 },
    { month: "Mar", free: 364, pro: 198, team: 65 },
    { month: "Apr", free: 268, pro: 165, team: 76 },
    { month: "May", free: 320, pro: 148, team: 61 },
    { month: "Jun", free: 248, pro: 213, team: 98 },
  ],
)

const PERCENTILES = { p50: "p50", p95: "p95", p99: "p99" }

const LATENCY = phases(
  [
    { day: "Mon", p50: 105, p95: 210, p99: 317 },
    { day: "Tue", p50: 100, p95: 202, p99: 296 },
    { day: "Wed", p50: 116, p95: 239, p99: 379 },
    { day: "Thu", p50: 110, p95: 219, p99: 335 },
    { day: "Fri", p50: 95, p95: 191, p99: 282 },
    { day: "Sat", p50: 87, p95: 169, p99: 253 },
    { day: "Sun", p50: 91, p95: 177, p99: 262 },
  ],
  [
    { day: "Mon", p50: 106, p95: 230, p99: 341 },
    { day: "Tue", p50: 114, p95: 245, p99: 382 },
    { day: "Wed", p50: 96, p95: 199, p99: 293 },
    { day: "Thu", p50: 91, p95: 182, p99: 271 },
    { day: "Fri", p50: 101, p95: 214, p99: 324 },
    { day: "Sat", p50: 86, p95: 169, p99: 254 },
    { day: "Sun", p50: 79, p95: 154, p99: 228 },
  ],
)

// Same total in both phases, so the centre label holds while the arcs move.
const SHARE = phases(
  [
    { browser: "Chrome", visitors: 3400 },
    { browser: "Safari", visitors: 2600 },
    { browser: "Firefox", visitors: 1900 },
    { browser: "Edge", visitors: 1300 },
  ],
  [
    { browser: "Chrome", visitors: 2900 },
    { browser: "Safari", visitors: 3100 },
    { browser: "Firefox", visitors: 1500 },
    { browser: "Edge", visitors: 1700 },
  ],
)

const USAGE = phases(
  [
    { resource: "Storage", used: 72 },
    { resource: "Builds", used: 41 },
    { resource: "Seats", used: 86 },
  ],
  [
    { resource: "Storage", used: 64 },
    { resource: "Builds", used: 83 },
    { resource: "Seats", used: 52 },
  ],
)

const TOTAL = SHARE[0].reduce((sum, row) => sum + row.visitors, 0)

const thousands = (value: ChartValue) =>
  typeof value === "number" && value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : String(value)

const DEVICE_KEYS = ["desktop", "mobile", "tablet"] as const

function charts(look: ChartLook, phase: 0 | 1) {
  const valueAxis = (format: (value: ChartValue) => string) =>
    look.valueAxis && { ...look.valueAxis, ticks: { format } }

  const visitors = stackRowsY(
    fold(VISITORS[phase], {
      fields: DEVICE_KEYS,
      as: { key: "device", value: "visitors" },
    }),
    { x: "month", y: "visitors", z: "device" },
  )
  const device = {
    x: "month",
    color: (row: (typeof visitors)[number]) => DEVICES[row.device],
    curve: look.curve,
  } as const

  const signups = fold(SIGNUPS[phase], {
    fields: ["free", "pro", "team"],
    as: { key: "plan", value: "signups" },
  })

  const latency = fold(LATENCY[phase], {
    fields: ["p50", "p95", "p99"],
    as: { key: "percentile", value: "ms" },
  })

  return {
    area: defineChart({
      scales: {
        x: { scale: scalePoint },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: valueAxis(thousands),
        },
      },
      color: { legend: chartLegend },
      gradients: chartFades,
      marks: [
        // The fade is a decorative copy: the tooltip swatch reads the
        // interactive area's fill, which must stay the series color.
        decorative(
          areaY(visitors, {
            ...device,
            y1: "y1",
            y2: "y2",
            fill: (row) =>
              `url(#chart-fade-${DEVICE_KEYS.indexOf(row.device)})`,
          }),
        ),
        areaY(visitors, { ...device, y1: "y1", y2: "y2", fillOpacity: 0 }),
        decorative(
          lineY(visitors, {
            ...device,
            y: "y2",
            strokeWidth: look.strokeWidth,
          }),
        ),
      ],
    }),
    donut: defineChart({
      scales: { x: null, y: null },
      color: { legend: chartLegend },
      marks: [
        polar({
          scales: { angle: null, radius: null },
          radiusRatio: 0.9,
          marks: [
            radialArc(pie(SHARE[phase], { value: "visitors" }), {
              color: "browser",
              innerRadius: ({ radius }) => radius * 0.62,
              stroke: "var(--surface-bg,var(--color-bg))",
              strokeWidth: 2,
            }),
          ],
        }),
      ],
      focus: "nearest",
      tooltip: chartSliceTooltip("browser", "visitors"),
    }),
    bar: defineChart({
      scales: {
        x: { scale: chartBand },
        y: { scale: scaleLinear, nice: true, grid: true, axis: look.valueAxis },
      },
      color: { legend: chartLegend },
      marks: [
        barY(signups, {
          x: "month",
          y: "signups",
          color: (row) => PLANS[row.plan],
          layout: group({ padding: 0.15 }),
          radius: look.barRadius,
          maxThickness: look.barMaxThickness,
        }),
      ],
    }),
    line: defineChart({
      scales: {
        x: { scale: scalePoint },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: valueAxis((value) => `${String(value)}ms`),
        },
      },
      color: { legend: chartLegend },
      marks: [
        lineY(latency, {
          x: "day",
          y: "ms",
          color: (row) => PERCENTILES[row.percentile],
          curve: look.curve,
          strokeWidth: look.strokeWidth,
          points: true,
        }),
      ],
    }),
    radial: defineChart({
      scales: { x: null, y: null },
      color: { legend: chartLegend },
      marks: [
        polar({
          scales: {
            angle: { scale: scaleLinear().domain([0, 100]) },
            radius: {
              scale: () => scaleBand().paddingInner(0.2),
              range: [({ radius }) => radius * 0.3, ({ radius }) => radius],
            },
            // The gridlines step through the whole radius, not the rings.
            grid: {
              channel: "radius",
              scale: scaleLinear().domain([0, 1]),
              range: [0, ({ radius }) => radius],
            },
          },
          radiusRatio: 0.95,
          guides: [
            radialGrid({
              scale: "grid",
              strokeDasharray: look.grid.strokeDasharray,
            }),
          ],
          marks: [
            radialBarAngle(USAGE[phase], {
              angle: "used",
              radius: "resource",
              color: "resource",
              cornerRadius: look.barRadius,
            }),
          ],
        }),
      ],
      focus: "nearest",
      tooltip: chartSliceTooltip("resource", "used", (value) => `${value}%`),
    }),
  }
}

export default function ChartBoard() {
  const phase = useLoop(useReplay("chartMotion").running, 1600) ? 1 : 0
  const look = useChartLook()
  const { area, donut, bar, line, radial } = useMemo(
    () => charts(look, phase),
    [look, phase],
  )

  return (
    <Board id="chart">
      {/* A new transition replays every chart's entrance. */}
      <div
        key={JSON.stringify(look.motion)}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12"
      >
        <div className="min-w-0 sm:col-span-2 lg:col-span-8">
          <BoardSection title="Area" className={CARD}>
            <Chart
              definition={area}
              height={HEIGHT}
              ariaLabel="Visitors by device, January through June"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Donut" className={CARD}>
            <Chart
              definition={donut}
              height={HEIGHT}
              ariaLabel="Visitors by browser"
            >
              <div className="flex h-full flex-col items-center justify-center pb-8">
                <span className="text-2xl font-semibold tabular-nums">
                  {thousands(TOTAL)}
                </span>
                <span className="text-xs text-fg-muted">Visitors</span>
              </div>
            </Chart>
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Bar" className={CARD}>
            <Chart
              definition={bar}
              height={HEIGHT}
              ariaLabel="Signups by plan, January through June"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Line" className={CARD}>
            <Chart
              definition={line}
              height={HEIGHT}
              ariaLabel="API response time percentiles this week, in milliseconds"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Radial" className={CARD}>
            <Chart
              definition={radial}
              height={HEIGHT}
              ariaLabel="Plan usage by resource, as a share of the quota"
            />
          </BoardSection>
        </div>
      </div>
    </Board>
  )
}
