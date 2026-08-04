"use client"

import { ScatterChart } from "@/registry/ui/chart-scatter"

const countries = [
  { country: "Japan", income: 42_400, lifespan: 84.6, population: 124 },
  { country: "Germany", income: 55_200, lifespan: 81.2, population: 84 },
  { country: "Brazil", income: 17_800, lifespan: 75.9, population: 216 },
  { country: "India", income: 8_400, lifespan: 70.2, population: 1428 },
  { country: "Nigeria", income: 5_200, lifespan: 63.4, population: 223 },
  { country: "Mexico", income: 21_100, lifespan: 75.1, population: 128 },
  { country: "France", income: 51_600, lifespan: 82.9, population: 68 },
  { country: "Indonesia", income: 14_200, lifespan: 71.3, population: 277 },
  { country: "Egypt", income: 15_100, lifespan: 70.9, population: 113 },
  { country: "Canada", income: 54_300, lifespan: 82.6, population: 39 },
]

export default function ChartScatterBubble() {
  return (
    <ScatterChart
      data={countries}
      x="income"
      y="lifespan"
      r="population"
      rowKey="country"
      radiusRange={[4, 26]}
      fillOpacity={0.55}
      ariaLabel="Life expectancy by income per person, sized by population"
      formatX={{
        locale: "en-US",
        number: { style: "currency", currency: "USD", notation: "compact" },
      }}
      formatY={{
        locale: "en-US",
        number: { style: "unit", unit: "year", maximumFractionDigits: 0 },
      }}
    />
  )
}
