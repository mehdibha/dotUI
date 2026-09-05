import { describe, expect, it } from "vitest"

import {
  chartKey,
  decorative,
  planChart,
  resolveFormat,
  sameReferences,
  serialize,
  splitChartProps,
  stackY,
} from "./base"

interface Row {
  month: string
  desktop?: number | null
  mobile?: number | null
}

describe("stackY", () => {
  const rows: Row[] = [
    { month: "Jan", desktop: 10, mobile: 30 },
    { month: "Feb", desktop: null, mobile: 5 },
    { month: "Mar", desktop: 0, mobile: 0 },
  ]
  const options = { x: "month", y: ["desktop", "mobile"] } as const

  it("accumulates base and top, keeping the raw contribution in value", () => {
    const [janDesktop, janMobile] = stackY(rows.slice(0, 1), options)
    expect(janDesktop).toMatchObject({ value: 10, base: 0, top: 10 })
    expect(janMobile).toMatchObject({ value: 30, base: 10, top: 40 })
  })

  it("leaves a gap for a null contribution and preserves the base", () => {
    const feb = stackY(rows.slice(1, 2), options)
    expect(feb[0]).toMatchObject({ value: null, top: null, base: 0 })
    expect(feb[1]).toMatchObject({ value: 5, base: 0, top: 5 })
  })

  it("normalizes each x group to shares of its own total", () => {
    const jan = stackY(rows.slice(0, 1), { ...options, normalize: true })
    expect(jan[0]?.value).toBeCloseTo(0.25)
    expect(jan[1]?.value).toBeCloseTo(0.75)
    expect(jan[1]?.top).toBeCloseTo(1)
  })

  it("stacks negatives down from zero instead of over the band below", () => {
    const mixed = stackY([{ month: "Jan", desktop: 10, mobile: -4 }], options)
    expect(mixed[0]).toMatchObject({ value: 10, base: 0, top: 10 })
    expect(mixed[1]).toMatchObject({ value: -4, base: 0, top: -4 })
  })

  it("normalizes an all-zero group to zero-height bands, not a gap", () => {
    const mar = stackY(rows.slice(2, 3), { ...options, normalize: true })
    expect(mar[0]).toMatchObject({ value: 0, base: 0, top: 0 })
    expect(mar[1]).toMatchObject({ value: 0, base: 0, top: 0 })
  })

  it("runs two independent accumulators, so no band overlaps another", () => {
    const mixed = stackY([{ month: "Jan", a: 10, b: -4, c: -6, d: 5 }], {
      x: "month",
      y: ["a", "b", "c", "d"],
    })
    expect(mixed.map((row) => [row.base, row.top])).toEqual([
      [0, 10],
      [0, -4],
      [-4, -10],
      [10, 15],
    ])
  })
})

describe("resolveFormat", () => {
  it("passes a function through untouched", () => {
    const format = (value: unknown) => `#${String(value)}`
    expect(resolveFormat(format)).toBe(format)
  })

  it("builds a locale-pinned number formatter from options", () => {
    const format = resolveFormat({
      locale: "en-US",
      number: { style: "percent", maximumFractionDigits: 0 },
    })
    expect(format?.(0.42)).toBe("42%")
  })

  it("builds a date formatter accepting timestamps and Dates", () => {
    const format = resolveFormat({
      locale: "en-US",
      date: { month: "short", timeZone: "UTC" },
    })
    expect(format?.(Date.UTC(2026, 0, 15))).toBe("Jan")
    expect(format?.(new Date(Date.UTC(2026, 0, 15)))).toBe("Jan")
  })

  it("returns undefined for undefined", () => {
    expect(resolveFormat(undefined)).toBeUndefined()
  })
})

describe("planChart", () => {
  const rows: Row[] = [
    { month: "Jan", desktop: 1, mobile: 2 },
    { month: "Feb", desktop: 3, mobile: 4 },
  ]

  it("keeps the declared y order when no seriesOrder is given", () => {
    const plan = planChart({
      data: rows,
      x: "month",
      y: ["desktop", "mobile"],
      labels: { desktop: "Desktop" },
    })
    expect(plan.order).toEqual(["Desktop", "mobile"])
    expect(plan.layers.map((layer) => layer.channels.y)).toEqual([
      "desktop",
      "mobile",
    ])
  })

  it("gives wide rows one layer per y field, in seriesOrder", () => {
    const plan = planChart({
      data: rows,
      x: "month",
      y: ["desktop", "mobile"],
      seriesOrder: ["mobile", "desktop"],
      labels: { desktop: "Desktop", mobile: "Mobile" },
    })
    expect(plan.order).toEqual(["Mobile", "Desktop"])
    expect(plan.layers).toHaveLength(2)
    expect(plan.layers[0]?.channels.y).toBe("mobile")
  })

  const long = [
    { month: "Jan", kind: "b", value: 1 },
    { month: "Jan", kind: "a", value: 2 },
    { month: "Feb", kind: "c", value: 3 },
  ]

  it("derives series order from data insertion order in long mode", () => {
    const plan = planChart({
      data: long,
      x: "month",
      y: "value",
      series: "kind",
    })
    expect(plan.order).toEqual(["b", "a", "c"])
    expect(plan.layers).toHaveLength(1)
  })

  it("appends series the data adds after the listed ones", () => {
    const plan = planChart({
      data: long,
      x: "month",
      y: "value",
      series: "kind",
      seriesOrder: ["a"],
    })
    expect(plan.order).toEqual(["a", "b", "c"])
  })
})

describe("serialize", () => {
  it("separates the collection types a key-walk would collapse", () => {
    const keys = [
      serialize({ a: 1 }),
      serialize(new Map([["a", 1]])),
      serialize(new Set(["a"])),
      serialize(["a"]),
    ]
    expect(new Set(keys).size).toBe(4)
  })

  it("keys Map and Set by contents, not identity", () => {
    expect(serialize(new Map([["a", 1]]))).toBe(serialize(new Map([["a", 1]])))
    expect(serialize(new Map([["a", 1]]))).not.toBe(
      serialize(new Map([["a", 2]])),
    )
    expect(serialize(new Set([1, 2]))).not.toBe(serialize(new Set([2, 1])))
  })

  it("keys a Date by its time and a RegExp by source and flags", () => {
    expect(serialize(new Date(0))).toBe(serialize(new Date(0)))
    expect(serialize(new Date(0))).not.toBe(serialize(new Date(1)))
    expect(serialize(/a/g)).not.toBe(serialize(/a/i))
    expect(serialize(/a/g)).not.toBe(serialize(/b/g))
  })

  it("escapes object keys, so a key holding a delimiter cannot forge one", () => {
    expect(serialize({ "a:1,b": 2 })).not.toBe(serialize({ a: 1, b: 2 }))
  })

  it("keys a class instance by identity rather than its enumerable keys", () => {
    class Scale {
      constructor(public domain: number[]) {}
    }
    const left = new Scale([0, 1])
    const right = new Scale([0, 1])
    expect(serialize(left)).toBe(serialize(left))
    expect(serialize(left)).not.toBe(serialize(right))
  })

  it("keys functions by identity", () => {
    const format = () => ""
    expect(serialize(format)).toBe(serialize(format))
    expect(serialize(format)).not.toBe(serialize(() => ""))
  })

  it("distinguishes null, undefined and their string spellings", () => {
    const keys = [
      serialize(null),
      serialize(undefined),
      serialize("null"),
      serialize(1),
      serialize("1"),
    ]
    expect(new Set(keys).size).toBe(5)
  })
})

describe("chartKey", () => {
  it("ignores key order and skips the identity-compared props", () => {
    const marks = [{}]
    expect(chartKey({ x: "month", y: "value", data: [1], marks })).toBe(
      chartKey({ marks, data: [2], y: "value", x: "month" }),
    )
  })

  it("changes when any serialized prop changes", () => {
    expect(chartKey({ curve: "linear" })).not.toBe(
      chartKey({ curve: "natural" }),
    )
  })

  it("escapes prop names, so a name holding a delimiter cannot forge one", () => {
    expect(chartKey({ "a=1;b": 2 })).not.toBe(chartKey({ a: 1, b: 2 }))
  })
})

describe("useChartDefinition memo inputs", () => {
  /* The hook keys the definition on `chartKey(spec)|chartKey(behavior)|degrade`
     plus the reference array [build, data, marks, marksBefore]. */
  it("leaves build and the list props to the reference array, not the key", () => {
    const buildA = () => ({})
    const buildB = () => ({})
    const data = [{ month: "Jan" }]
    expect(chartKey({ x: "month", data })).toBe(
      chartKey({ x: "month", data: [{ month: "Feb" }] }),
    )
    expect(sameReferences([buildA, data], [buildA, data])).toBe(true)
    expect(sameReferences([buildA, data], [buildB, data])).toBe(false)
    expect(sameReferences([buildA, data], [buildA, [...data]])).toBe(false)
  })
})

describe("splitChartProps", () => {
  it("routes each prop to the host, behavior or spec bucket", () => {
    const onSelect = () => {}
    const { host, behavior, spec } = splitChartProps({
      ariaLabel: "Visitors",
      onSelect,
      focus: "nearest",
      tooltipAnchor: "point",
      x: "month",
      data: [{ month: "Jan" }],
    })
    expect(host).toEqual({ ariaLabel: "Visitors", onSelect })
    expect(behavior).toEqual({ focus: "nearest", tooltipAnchor: "point" })
    expect(spec).toEqual({ x: "month", data: [{ month: "Jan" }] })
  })

  it("drops undefined values and children so they never reach the key", () => {
    const { host, behavior, spec } = splitChartProps({
      ariaLabel: undefined,
      animate: undefined,
      curve: undefined,
      children: "overlay",
    })
    expect(host).toEqual({})
    expect(behavior).toEqual({})
    expect(spec).toEqual({})
  })
})

describe("decorative", () => {
  it("strips focus points but keeps nodes and the rest of the mark", () => {
    const mark = {
      initialize: () => ({
        id: "label",
        render: () => ({
          nodes: [{ kind: "text" }],
          points: [{ key: "p0" }],
        }),
      }),
    }
    const initialized = decorative(mark).initialize()
    expect(initialized.id).toBe("label")
    const scene = initialized.render()
    expect(scene.nodes).toEqual([{ kind: "text" }])
    expect("points" in scene).toBe(false)
  })

  it("strips interaction metadata from nested nodes at every depth", () => {
    const point = { key: "p0" }
    const mark = {
      initialize: () => ({
        render: () => ({
          nodes: [
            {
              kind: "group",
              pointOwner: point,
              focus: { points: [point] },
              states: { points: [point] },
              focusCandidateIndex: 0,
              children: [
                { kind: "area", interaction: { point }, pointOwner: point },
                {
                  kind: "group",
                  children: [
                    { kind: "arc", interaction: { points: [point] } },
                    { kind: "label", pointOwner: point, text: "Track" },
                  ],
                },
              ],
            },
          ],
        }),
      }),
    }
    const scene = decorative(mark).initialize().render()
    const found: string[] = []
    const visit = (nodes: readonly unknown[]) => {
      for (const node of nodes) {
        const record = node as Record<string, unknown>
        for (const name of ["interaction", "pointOwner", "focus", "states"]) {
          if (name in record) found.push(name)
        }
        if (Array.isArray(record.children)) visit(record.children)
      }
    }
    visit(scene.nodes)
    expect(found).toEqual([])
    // The geometry itself survives the strip.
    expect(scene.nodes).toEqual([
      {
        kind: "group",
        children: [
          { kind: "area" },
          {
            kind: "group",
            children: [{ kind: "arc" }, { kind: "label", text: "Track" }],
          },
        ],
      },
    ])
  })

  it("keeps a retargeting group's candidates as its children", () => {
    const point = { key: "p0" }
    const mark = {
      initialize: () => ({
        render: () => ({
          nodes: [
            {
              kind: "group",
              focus: {
                retarget: true,
                points: [point],
                candidates: [{ kind: "arc", interaction: { point } }],
              },
              children: [{ kind: "area", interaction: { point } }],
            },
          ],
        }),
      }),
    }
    const scene = decorative(mark).initialize().render()
    expect(scene.nodes).toEqual([
      { kind: "group", children: [{ kind: "arc" }] },
    ])
  })
})
