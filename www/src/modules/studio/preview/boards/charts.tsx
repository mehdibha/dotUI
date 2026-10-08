"use client"

import { useEffect, useState } from "react"

import { createParamValue } from "@/lib/styles"
import { AreaChart } from "@/registry/ui/chart-area"
import { BarChart } from "@/registry/ui/chart-bar"
import { LineChart } from "@/registry/ui/chart-line"
import { PieChart } from "@/registry/ui/chart-pie"
import { RadialBarChart } from "@/registry/ui/chart-radial"

import { Board, BoardSection, useBoardFocus } from "./board"

// Every chart on the board shows these; grid only where the chart draws one.
const SHARED = ["chartPalette", "brand", "chartMotion", "motion"]
const GRIDDED = [...SHARED.slice(0, 2), "chartGrid", ...SHARED.slice(2)]

// The legend keeps ~20px below itself: trim the card's bottom to match its top.
const CARD = "flex-col flex-nowrap items-stretch justify-start pb-3 max-sm:pb-0"
const HEIGHT = 240

const useChartMotion = createParamValue({
  componentName: "chart",
  paramName: "motion",
  defaultValue: "spring",
  values: { spring: "spring", ease: "ease", none: "none" },
})

/** Swaps between two data sets while the panel edits motion, so transitions play. */
function usePhase() {
  const { axis } = useBoardFocus()
  const playing = axis === "chartMotion" || axis === "motion"
  const [phase, setPhase] = useState<0 | 1>(0)
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setPhase((p) => (p ? 0 : 1)), 1600)
    return () => {
      clearInterval(timer)
      setPhase(0)
    }
  }, [playing])
  return phase
}

/* ---------------------------------- Data ---------------------------------- */

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
    { month: "Jan", free: 186, pro: 80, team: 32 },
    { month: "Feb", free: 305, pro: 120, team: 48 },
    { month: "Mar", free: 237, pro: 140, team: 41 },
    { month: "Apr", free: 173, pro: 110, team: 56 },
    { month: "May", free: 209, pro: 130, team: 62 },
    { month: "Jun", free: 264, pro: 152, team: 70 },
  ],
  [
    { month: "Jan", free: 142, pro: 104, team: 44 },
    { month: "Feb", free: 228, pro: 96, team: 38 },
    { month: "Mar", free: 291, pro: 158, team: 52 },
    { month: "Apr", free: 214, pro: 132, team: 61 },
    { month: "May", free: 256, pro: 118, team: 49 },
    { month: "Jun", free: 198, pro: 170, team: 78 },
  ],
)

const PERCENTILES = { p50: "p50", p95: "p95", p99: "p99" }

const LATENCY = phases(
  [
    { day: "Mon", p50: 82, p95: 164, p99: 248 },
    { day: "Tue", p50: 78, p95: 158, p99: 231 },
    { day: "Wed", p50: 91, p95: 187, p99: 296 },
    { day: "Thu", p50: 86, p95: 171, p99: 262 },
    { day: "Fri", p50: 74, p95: 149, p99: 220 },
    { day: "Sat", p50: 68, p95: 132, p99: 198 },
    { day: "Sun", p50: 71, p95: 138, p99: 205 },
  ],
  [
    { day: "Mon", p50: 88, p95: 192, p99: 284 },
    { day: "Tue", p50: 95, p95: 204, p99: 318 },
    { day: "Wed", p50: 80, p95: 166, p99: 244 },
    { day: "Thu", p50: 76, p95: 152, p99: 226 },
    { day: "Fri", p50: 84, p95: 178, p99: 270 },
    { day: "Sat", p50: 72, p95: 141, p99: 212 },
    { day: "Sun", p50: 66, p95: 128, p99: 190 },
  ],
)

const BROWSERS = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  other: "Other",
}

const SHARE = phases(
  [
    { browser: "chrome", visitors: 2750 },
    { browser: "safari", visitors: 2000 },
    { browser: "firefox", visitors: 1870 },
    { browser: "edge", visitors: 1730 },
    { browser: "other", visitors: 900 },
  ],
  [
    { browser: "chrome", visitors: 3420 },
    { browser: "safari", visitors: 1640 },
    { browser: "firefox", visitors: 1380 },
    { browser: "edge", visitors: 2210 },
    { browser: "other", visitors: 1100 },
  ],
)

const RESOURCES = {
  storage: "Storage",
  bandwidth: "Bandwidth",
  builds: "Builds",
  seats: "Seats",
}

const USAGE = phases(
  [
    { resource: "storage", used: 72 },
    { resource: "bandwidth", used: 58 },
    { resource: "builds", used: 41 },
    { resource: "seats", used: 86 },
  ],
  [
    { resource: "storage", used: 64 },
    { resource: "bandwidth", used: 83 },
    { resource: "builds", used: 67 },
    { resource: "seats", used: 52 },
  ],
)

const thousands = (value: unknown) =>
  typeof value === "number" && value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : String(value)

/* ---------------------------------- Board ---------------------------------- */

export default function ChartsBoard() {
  const phase = usePhase()
  // A new transition replays every chart's entrance.
  const motion = useChartMotion()
  const total = SHARE[phase].reduce((sum, row) => sum + row.visitors, 0)

  return (
    <Board id="charts">
      <div key={motion} className="grid gap-10 md:grid-cols-2">
        <div className="min-w-0 md:col-span-2">
          <BoardSection
            member="area"
            title="Area chart"
            axes={GRIDDED}
            className={CARD}
          >
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
        <BoardSection
          member="bar"
          title="Bar chart"
          axes={GRIDDED}
          className={CARD}
        >
          <BarChart
            data={SIGNUPS[phase]}
            x="month"
            y={["free", "pro", "team"]}
            labels={PLANS}
            legend
            height={HEIGHT}
            ariaLabel="Signups by plan, January through June"
          />
        </BoardSection>
        <BoardSection
          member="line"
          title="Line chart"
          axes={GRIDDED}
          className={CARD}
        >
          <LineChart
            data={LATENCY[phase]}
            x="day"
            y={["p50", "p95", "p99"]}
            labels={PERCENTILES}
            curve="monotone"
            points
            legend
            height={HEIGHT}
            ariaLabel="API response time percentiles this week, in milliseconds"
          />
        </BoardSection>
        <BoardSection
          member="pie"
          title="Donut chart"
          axes={SHARED}
          className={CARD}
        >
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
                {thousands(total)}
              </span>
              <span className="text-xs text-fg-muted">Visitors</span>
            </div>
          </PieChart>
        </BoardSection>
        <BoardSection
          member="radial"
          title="Radial chart"
          axes={GRIDDED}
          className={CARD}
        >
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
    </Board>
  )
}
