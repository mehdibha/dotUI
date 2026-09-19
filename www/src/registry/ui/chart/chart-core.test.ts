import { describe, expect, it } from "vitest"

import {
  decorative,
  orderSeries,
  planChart,
  sameOption,
  sameOptions,
  splitChartProps,
} from "./base"

interface Row {
  month: string
  desktop: number
  mobile: number
}

const rows: Row[] = [
  { month: "Jan", desktop: 10, mobile: 30 },
  { month: "Feb", desktop: 20, mobile: 5 },
]

describe("planChart", () => {
  it("keeps a single field's rows and labels its series", () => {
    const plan = planChart({
      data: rows,
      x: "month",
      y: "desktop",
      labels: { desktop: "Desktop" },
    })
    expect(plan.rows).toBe(rows)
    expect(plan.order).toEqual(["Desktop"])
    expect(rows.map(plan.z)).toEqual(["Desktop", "Desktop"])
    expect(plan.wide).toBe(false)
  })

  it("folds several fields into one row per series, in seriesOrder", () => {
    const plan = planChart({
      data: rows,
      x: "month",
      y: ["desktop", "mobile"],
      seriesOrder: ["mobile"],
    })
    expect(plan.order).toEqual(["mobile", "desktop"])
    expect(plan.y).toBe("value")
    expect(plan.rows).toHaveLength(4)
    expect(plan.rows[0]).toMatchObject({
      month: "Jan",
      series: "mobile",
      value: 30,
    })
    expect(plan.rows.map(plan.z)).toEqual([
      "mobile",
      "desktop",
      "mobile",
      "desktop",
    ])
    expect(plan.wide).toBe(true)
  })

  it("derives series order from data order in long mode, after seriesOrder", () => {
    const long = [
      { month: "Jan", series: "b", value: 1 },
      { month: "Jan", series: "a", value: 2 },
      { month: "Jan", series: "c", value: 3 },
    ]
    const plan = planChart({
      data: long,
      x: "month",
      y: "value",
      series: "series",
      seriesOrder: ["a"],
    })
    expect(plan.rows).toBe(long)
    expect(plan.order).toEqual(["a", "b", "c"])
  })

  it("keys rows by rowKey and series", () => {
    const plan = planChart({
      data: rows,
      x: "month",
      y: ["desktop", "mobile"],
      rowKey: "month",
    })
    expect(plan.rows.map(plan.key ?? String)).toEqual([
      "Jan:desktop",
      "Jan:mobile",
      "Feb:desktop",
      "Feb:mobile",
    ])
  })
})

describe("orderSeries", () => {
  it("leads with the listed series and appends the rest once", () => {
    expect(orderSeries(["b"], ["a", "b", "c", "a"])).toEqual(["b", "a", "c"])
  })
})

describe("sameOption", () => {
  it("compares arrays of scalars and flat records by value", () => {
    expect(sameOption(["a", "b"], ["a", "b"])).toBe(true)
    expect(sameOption(["a", "b"], ["a", "c"])).toBe(false)
    expect(sameOption({ a: "A" }, { a: "A" })).toBe(true)
    expect(sameOption({ a: "A" }, { a: "A", b: "B" })).toBe(false)
  })

  it("compares anything nested, functions and class instances by identity", () => {
    const fn = () => 1
    const data = [{ a: 1 }]
    expect(sameOption(fn, fn)).toBe(true)
    expect(sameOption(fn, () => 1)).toBe(false)
    expect(sameOption(data, data)).toBe(true)
    expect(sameOption(data, [{ a: 1 }])).toBe(false)
    expect(sameOption({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false)
    expect(sameOption(new Date(1), new Date(1))).toBe(false)
  })
})

describe("sameOptions", () => {
  it("is true only when every key matches", () => {
    const build = () => null
    expect(sameOptions({ build, y: ["a"] }, { build, y: ["a"] })).toBe(true)
    expect(sameOptions({ build, y: ["a"] }, { build, y: ["b"] })).toBe(false)
    expect(sameOptions({ build }, { build, y: ["a"] })).toBe(false)
  })
})

describe("splitChartProps", () => {
  it("routes each prop to the host, behavior or spec bucket", () => {
    const onSelect = () => {}
    const { host, behavior, spec } = splitChartProps({
      data: rows,
      x: "month",
      ariaLabel: "Visitors",
      onSelect,
      focus: "nearest",
      animate: false,
      tooltip: undefined,
      children: null,
    })
    expect(host).toEqual({ ariaLabel: "Visitors", onSelect })
    expect(behavior).toEqual({ focus: "nearest", animate: false })
    expect(spec).toEqual({ data: rows, x: "month" })
  })
})

describe("decorative", () => {
  const mark = {
    initialize: (_context: unknown) => ({
      id: "mark",
      render: (_context: unknown) => ({
        nodes: [
          {
            kind: "group",
            focus: {
              retarget: true,
              candidates: [{ kind: "rect", interaction: {} }],
            },
            states: [],
            children: [],
          },
          { kind: "label", pointOwner: {} },
          { kind: "rect", interaction: {}, pointOwner: {} },
        ],
      }),
    }),
  }

  it("strips interaction metadata at every depth and keeps the rest", () => {
    const nodes = decorative(mark)
      .initialize(undefined as never)
      .render(undefined as never).nodes
    expect(nodes).toEqual([
      { kind: "group", children: [{ kind: "rect" }] },
      { kind: "label" },
      { kind: "rect" },
    ])
  })
})
