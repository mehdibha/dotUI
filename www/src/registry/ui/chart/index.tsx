"use client"

import type { ChartValue } from "@tanstack/charts"

import { useComponentParams } from "@/lib/styles"

import type { ChartDefaults, ChartProps } from "./base"
import { Chart as BaseChart, chartDefaults } from "./base"

export * from "./base"

// The shipped file carries the chosen looks in its `chartDefaults` literal
// (meta.ts `source`); here they ride the design-system context.
export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>(props: ChartProps<TDatum, TXValue, TYValue>) {
  const params = useComponentParams("chart")
  const defaults = Object.fromEntries(
    (Object.keys(chartDefaults) as (keyof ChartDefaults)[]).map((key) => [
      key,
      params[key] ?? chartDefaults[key],
    ]),
  ) as unknown as ChartDefaults
  return <BaseChart defaults={defaults} {...props} />
}
