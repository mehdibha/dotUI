"use client"

import { useMemo } from "react"
import type { ChartValue } from "@tanstack/charts"

import { useComponentParams } from "@/lib/styles"

import type { ChartLook, ChartProps } from "./base"
import { Chart as BaseChart, chartCurves, chartLook } from "./base"
import { chartLooks } from "./meta"

export * from "./base"

/** The design system's chart look, live: the shipped file carries it as the `chartLook` literal. */
export function useChartLook(): ChartLook {
  const params = useComponentParams("chart")
  const key = JSON.stringify(params)
  return useMemo(() => {
    const fields = Object.entries(chartLooks).map(
      ([param, options]) =>
        (options as Record<string, object>)[params[param] ?? ""] ?? {},
    )
    const look = Object.assign({}, chartLook, ...fields) as Omit<
      ChartLook,
      "curve"
    > & { curve: ChartLook["curve"] | keyof typeof chartCurves }
    return {
      ...look,
      curve:
        typeof look.curve === "string" ? chartCurves[look.curve] : look.curve,
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>(props: ChartProps<TDatum, TXValue, TYValue>) {
  return <BaseChart look={useChartLook()} {...props} />
}
