"use client"

import { useState } from "react"

import { PieChart } from "@/registry/ui/chart-pie"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

const data = [
  { month: "january", desktop: 186 },
  { month: "february", desktop: 305 },
  { month: "march", desktop: 237 },
  { month: "april", desktop: 173 },
  { month: "may", desktop: 209 },
]

const labels = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
}

export default function ChartPieInteractive() {
  const [active, setActive] = useState(0)
  const row = data[active] ?? data[0]

  return (
    <div className="flex w-full flex-col gap-4">
      <Select
        aria-label="Month"
        value={row?.month ?? null}
        onChange={(key) => {
          const index = data.findIndex((entry) => entry.month === key)
          if (index !== -1) setActive(index)
        }}
        className="w-40 self-end"
      >
        <SelectTrigger />
        <SelectContent>
          {data.map((entry) => (
            <SelectItem key={entry.month} id={entry.month}>
              {labels[entry.month as keyof typeof labels]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <PieChart
        data={data}
        value="desktop"
        name="month"
        labels={labels}
        innerRadius={0.6}
        outerRadius={0.88}
        activeIndex={active}
        ariaLabel="Desktop visitors by month, with one month highlighted"
      >
        <div className="flex h-full flex-col items-center justify-center">
          <span className="text-3xl font-bold">
            {row?.desktop.toLocaleString("en-US")}
          </span>
          <span className="text-sm text-fg-muted">Visitors</span>
        </div>
      </PieChart>
    </div>
  )
}
