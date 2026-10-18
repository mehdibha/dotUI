"use client"

import { createParamValue } from "@/lib/styles"
import { AreaChart } from "@/registry/ui/chart-area"
import { BarChart } from "@/registry/ui/chart-bar"
import { LineChart } from "@/registry/ui/chart-line"
import { PieChart } from "@/registry/ui/chart-pie"
import { RadialBarChart } from "@/registry/ui/chart-radial"

import { Board, BoardSection, useLoop, useReplay } from "./board"

// The legend keeps ~20px below itself: trim the card's bottom to match its top.
const CARD =
  "flex-col flex-nowrap items-stretch justify-start p-6 pb-1 max-sm:p-4 max-sm:pb-0"
const HEIGHT = 200

const useChartMotion = createParamValue({
  componentName: "chart",
  paramName: "motion",
  defaultValue: "spring",
  values: { spring: "spring", ease: "ease", none: "none" },
})

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

const BROWSERS = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
}

// Same total in both phases, so the centre label holds while the arcs move.
const SHARE = phases(
  [
    { browser: "chrome", visitors: 3400 },
    { browser: "safari", visitors: 2600 },
    { browser: "firefox", visitors: 1900 },
    { browser: "edge", visitors: 1300 },
  ],
  [
    { browser: "chrome", visitors: 2900 },
    { browser: "safari", visitors: 3100 },
    { browser: "firefox", visitors: 1500 },
    { browser: "edge", visitors: 1700 },
  ],
)

const RESOURCES = { storage: "Storage", builds: "Builds", seats: "Seats" }

const USAGE = phases(
  [
    { resource: "storage", used: 72 },
    { resource: "builds", used: 41 },
    { resource: "seats", used: 86 },
  ],
  [
    { resource: "storage", used: 64 },
    { resource: "builds", used: 83 },
    { resource: "seats", used: 52 },
  ],
)

const TOTAL = SHARE[0].reduce((sum, row) => sum + row.visitors, 0)

const thousands = (value: unknown) =>
  typeof value === "number" && value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : String(value)

export default function ChartBoard() {
  const phase = useLoop(useReplay("chartMotion").running, 1600) ? 1 : 0
  // A new transition replays every chart's entrance.
  const motion = useChartMotion()

  return (
    <Board id="chart">
      <div key={motion} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
        <div className="min-w-0 sm:col-span-2 lg:col-span-8">
          <BoardSection title="Area" className={CARD}>
            <AreaChart
              data={VISITORS[phase]}
              x="month"
              y={["desktop", "mobile", "tablet"]}
              labels={DEVICES}
              stacked
              fill="gradient"
              axes
              formatY={thousands}
              legend
              height={HEIGHT}
              ariaLabel="Visitors by device, January through June"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Donut" className={CARD}>
            <PieChart
              data={SHARE[phase]}
              value="visitors"
              name="browser"
              labels={BROWSERS}
              innerRadius={0.62}
              legend
              height={HEIGHT}
              ariaLabel="Visitors by browser"
            >
              <div className="flex h-full flex-col items-center justify-center pb-8">
                <span className="text-2xl font-semibold tabular-nums">
                  {thousands(TOTAL)}
                </span>
                <span className="text-xs text-fg-muted">Visitors</span>
              </div>
            </PieChart>
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Bar" className={CARD}>
            <BarChart
              data={SIGNUPS[phase]}
              x="month"
              y={["free", "pro", "team"]}
              labels={PLANS}
              axes
              legend
              height={HEIGHT}
              ariaLabel="Signups by plan, January through June"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Line" className={CARD}>
            <LineChart
              data={LATENCY[phase]}
              x="day"
              y={["p50", "p95", "p99"]}
              labels={PERCENTILES}
              curve="monotone"
              points
              axes
              formatY={(value) => `${String(value)}ms`}
              legend
              height={HEIGHT}
              ariaLabel="API response time percentiles this week, in milliseconds"
            />
          </BoardSection>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <BoardSection title="Radial" className={CARD}>
            <RadialBarChart
              data={USAGE[phase]}
              value="used"
              name="resource"
              labels={RESOURCES}
              innerRadius={0.3}
              radiusRatio={0.95}
              max={100}
              grid
              legend
              height={HEIGHT}
              ariaLabel="Plan usage by resource, as a share of the quota"
            />
          </BoardSection>
        </div>
      </div>
    </Board>
  )
}
