export interface VisitRow {
  month: string
  desktop: number
  mobile: number
}

export const visits: readonly VisitRow[] = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export const desktopAverage = Math.round(
  visits.reduce((sum, row) => sum + row.desktop, 0) / visits.length,
)

export const CHART_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const
export type ChartSlot = (typeof CHART_SLOTS)[number]

export const slotVar = (slot: ChartSlot) => `var(--chart-${slot})`
