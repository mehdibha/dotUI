/**
 * The createTheme memo: output is byte-identical with the memo on (cold,
 * warm across configs, warm on a repeat) and off, and a drag on one input
 * re-solves only the palettes that input feeds.
 */

import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  categoricalPalettes,
  divergingArms,
  sequentialPalette,
  tonalCategoricalPalette,
} from "./charts"
import { memoize, setMemoEnabled } from "./memo"
import { buildScale } from "./scale"
import type { ThemeOptions } from "./schema"
import { createTheme } from "./theme"

vi.mock("./scale", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./scale")>()
  return {
    ...actual,
    buildScale: vi.fn<typeof actual.buildScale>(actual.buildScale),
  }
})
vi.mock("./charts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./charts")>()
  return {
    ...actual,
    categoricalPalettes: vi.fn<typeof actual.categoricalPalettes>(
      actual.categoricalPalettes,
    ),
    tonalCategoricalPalette: vi.fn<typeof actual.tonalCategoricalPalette>(
      actual.tonalCategoricalPalette,
    ),
    sequentialPalette: vi.fn<typeof actual.sequentialPalette>(
      actual.sequentialPalette,
    ),
    divergingArms: vi.fn<typeof actual.divergingArms>(actual.divergingArms),
  }
})

type Input = string | ThemeOptions

/** The studio presets' color recipes, as `resolveColorConfig` feeds them. */
const PRESETS: ThemeOptions[] = [
  { seeds: { accent: "#0070f1" }, background: { dark: 2 } },
  {
    seeds: {
      accent: "#d97757",
      warning: "#fab219",
      danger: "#d03b3b",
      selection: "#2a78d6",
    },
    neutralHue: 96,
    background: { dark: 7 },
  },
  {
    seeds: { accent: "#3ecf8e" },
    neutralHue: 160,
    neutralTint: 0.3,
    preserveSeed: true,
    background: { dark: 6 },
  },
  {
    seeds: { accent: "#533afd", success: "#228403", danger: "#df1b41" },
    neutralHue: 260,
    neutralTint: 2,
    background: { light: 100, dark: 2 },
  },
  {
    seeds: { accent: "#5e6ad2", success: "#27a644", danger: "#eb5757" },
    neutralHue: 262,
    background: { dark: 2 },
  },
  {
    seeds: {
      accent: "#0072f5",
      success: "#45a557",
      warning: "#ffb224",
      danger: "#e5484d",
    },
    neutralTint: 0,
    background: { light: 100, dark: "oled" },
  },
  {
    seeds: {
      accent: "#ff385c",
      success: "#038026",
      warning: "#eb6100",
      danger: "#d7251c",
    },
    neutralTint: 0,
    preserveSeed: true,
    background: { light: 100, dark: 5 },
  },
  {
    seeds: {
      accent: "#1f883d",
      success: "#1f883d",
      warning: "#9a6700",
      danger: "#cf222e",
      selection: "#0969da",
    },
    neutralHue: 251,
    neutralTint: 1.4,
    preserveSeed: true,
    background: { light: 100, dark: 5 },
  },
  {
    seeds: { accent: "#2783de" },
    neutralHue: 81,
    neutralTint: 0.5,
    background: { light: 100, dark: 8.8 },
  },
  {
    seeds: {
      accent: "#1ed760",
      success: "#1ed760",
      warning: "#ffa42b",
      danger: "#e91429",
    },
    neutralTint: 0,
    preserveSeed: true,
    background: { light: 100, dark: 5.5 },
  },
  { seeds: { accent: "#438cd6" }, background: { dark: 2 } },
]

const EDGES: Input[] = [
  "#438cd6",
  "#ffd1dc",
  "#ffe600",
  { seeds: { accent: "#facc15" }, preserveSeed: true },
  { seeds: { accent: "#808285" } },
  { seeds: { accent: "#7f7f80" }, neutralHue: 30 },
  { seeds: { accent: "#000000" } },
  { seeds: { accent: "#ffffff" }, background: { light: 90, dark: 20 } },
  { seeds: { accent: "#ff00ff" }, vividness: 2, hueShift: 3 },
  { seeds: { accent: "#1a0033" }, vividness: 0 },
  { seeds: { accent: "oklch(0.7 0.15 30)" }, hueShift: 0 },
  { seeds: { accent: "#0070f1", neutral: "#5c6370" } },
  { seeds: { accent: "#0070f1", neutral: "#777777" }, neutralTint: 4 },
  { seeds: { accent: "#0070f1", brand2: "#e11d48", zz: "#a3a3a3" } },
  { seeds: { accent: "#0070f1", selection: "#0070f1" }, preserveSeed: true },
  { seeds: { accent: "#0070f1", success: "#0070f1", info: "#ffd1dc" } },
  { seeds: { accent: "#0070f1" }, neutralHue: 359.5, neutralTint: 2 },
  { seeds: { accent: "#0070f1" }, background: { light: 95, dark: 0 } },
  { seeds: { accent: "#0070f1" }, vividness: 1.33, hueShift: 1.6 },
]

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomConfigs(n: number, seed: number): ThemeOptions[] {
  const rand = mulberry32(seed)
  const hex = () => {
    const rgb = Math.floor(rand() * 0x1000000)
    return `#${rgb.toString(16).padStart(6, "0")}`
  }
  const step = (max: number, steps: number) =>
    Math.round(rand() * steps) * (max / steps)
  return Array.from({ length: n }, () => {
    const options: ThemeOptions = { seeds: { accent: hex() } }
    for (const name of ["success", "warning", "danger", "info", "selection"])
      if (rand() < 0.25) options.seeds[name] = hex()
    if (rand() < 0.1) options.seeds.neutral = hex()
    if (rand() < 0.3) options.vividness = step(2, 40)
    if (rand() < 0.2) options.hueShift = step(3, 30)
    if (rand() < 0.3) options.neutralTint = step(2, 40)
    if (rand() < 0.3) options.neutralHue = step(360, 360)
    if (rand() < 0.2) options.preserveSeed = rand() < 0.5
    if (rand() < 0.4)
      options.background = {
        light: rand() < 0.5 ? 90 + step(10, 20) : undefined,
        dark: rand() < 0.15 ? "oled" : step(20, 40),
      }
    if (rand() < 0.15) options.chartPalette = rand() < 0.5 ? "vivid" : "muted"
    return options
  })
}

/** One input moving per sequence, everything else held (the warm path). */
function drags(): ThemeOptions[] {
  const base = PRESETS[1]!
  const steps = (n: number, at: (t: number) => ThemeOptions) =>
    Array.from({ length: n }, (_, i) => at(i / n))
  const seeds = (patch: Record<string, string>) => ({ ...base.seeds, ...patch })
  const hue = (h: number) => seeds({ accent: `oklch(0.62 0.17 ${h})` })
  // Chroma- and lightness-only moves at a fixed hue: a ColorArea drag.
  const chroma = (c: number) => seeds({ accent: `oklch(0.62 ${c} 250)` })
  const lightness = (l: number) => seeds({ accent: `oklch(${l} 0.12 250)` })
  return [
    ...steps(8, (t) => ({ ...base, seeds: hue(t * 360) })),
    ...steps(6, (t) => ({ ...base, seeds: chroma(0.04 + t * 0.18) })),
    ...steps(6, (t) => ({ ...base, seeds: lightness(0.4 + t * 0.4) })),
    ...steps(6, (t) => ({
      ...base,
      seeds: seeds({ danger: `oklch(0.58 ${0.06 + t * 0.16} 25)` }),
    })),
    ...steps(8, (t) => ({ ...base, neutralTint: t * 2 })),
    ...steps(8, (t) => ({ ...base, neutralHue: t * 360 })),
    ...steps(4, (t) => ({ ...base, background: { dark: t * 20 } })),
    ...steps(3, (t) => ({
      ...base,
      chartPalette: "vivid",
      seeds: hue(t * 360),
    })),
    ...steps(3, (t) => ({
      ...base,
      chartPalette: "vivid",
      seeds: lightness(0.4 + t * 0.4),
    })),
    ...steps(3, (t) => ({ ...base, chartPalette: "muted", neutralTint: t })),
  ]
}

const render = (input: Input) => JSON.stringify(createTheme(input))

/**
 * Inputs whose output differs from memo off once the memo is on: cold, warm
 * across the list, and on an immediate repeat.
 */
function mismatches(inputs: Input[]): string[] {
  setMemoEnabled(false)
  const reference = inputs.map(render)
  setMemoEnabled(true)
  const out: string[] = []
  inputs.forEach((input, i) => {
    for (const pass of ["first", "repeat"])
      if (render(input) !== reference[i])
        out.push(`${pass}: ${JSON.stringify(input)}`)
  })
  return out
}

describe("memo on = memo off, byte for byte", () => {
  test("studio presets, every chart strategy", { timeout: 60_000 }, () => {
    const spread = PRESETS.slice(0, 5).map(
      (p, i): ThemeOptions => ({
        ...p,
        chartPalette: i % 2 ? "muted" : "vivid",
      }),
    )
    expect(mismatches([...PRESETS, ...spread])).toEqual([])
  })

  test("edge seeds and axes", { timeout: 60_000 }, () => {
    expect(mismatches(EDGES)).toEqual([])
  })

  test("seeded random sweep", { timeout: 60_000 }, () => {
    expect(mismatches(randomConfigs(24, 7))).toEqual([])
  })

  test("drag sequences", { timeout: 60_000 }, () => {
    expect(mismatches(drags())).toEqual([])
  })

  test("output never shares a cached (frozen) object", () => {
    const frozen: string[] = []
    const walk = (node: unknown, path: string) => {
      if (typeof node !== "object" || node === null) return
      if (Object.isFrozen(node)) frozen.push(path)
      for (const [key, child] of Object.entries(node))
        walk(child, `${path}.${key}`)
    }
    createTheme(PRESETS[1]!)
    walk(createTheme(PRESETS[1]!), "theme")
    expect(frozen).toEqual([])
  })
})

describe("a drag re-solves only what it moves", () => {
  const base = PRESETS[1]!
  const solves = (options: ThemeOptions) => {
    vi.clearAllMocks()
    createTheme(options)
    const charts = [
      categoricalPalettes,
      tonalCategoricalPalette,
      sequentialPalette,
      divergingArms,
    ]
    return {
      scales: vi.mocked(buildScale).mock.calls.length,
      charts: charts.reduce((n, fn) => n + vi.mocked(fn).mock.calls.length, 0),
    }
  }

  beforeEach(() => {
    setMemoEnabled(true)
    createTheme(base)
  })

  test("a repeat solves nothing", () => {
    expect(solves(base)).toEqual({ scales: 0, charts: 0 })
  })

  test("brand: the accent's light + dark scales and its charts", () => {
    const seeds = { ...base.seeds, accent: "#c2410c" }
    expect(solves({ ...base, seeds })).toEqual({ scales: 2, charts: 6 })
  })

  test("neutral tint or hue: the neutral's two scales, no charts", () => {
    expect(solves({ ...base, neutralTint: 1.5 })).toEqual({
      scales: 2,
      charts: 0,
    })
    expect(solves({ ...base, neutralHue: 120 })).toEqual({
      scales: 2,
      charts: 0,
    })
  })
})

test("memoize keys on argument values, evicts the oldest, freezes", () => {
  let computed = 0
  const memo = memoize(2, (_: { a: number; b: number[] }) => ({
    n: [computed++],
  }))
  const get = (a: number, b: number[]) => memo({ a, b })
  get(1, [1])
  get(1, [2])
  get(1, [1])
  get(2, [1])
  expect(computed).toBe(3)
  memo({ b: [1], a: 1 })
  expect(computed).toBe(3)
  get(1, [2])
  expect(computed).toBe(4)
  expect(Object.isFrozen(get(1, [2]).n)).toBe(true)
  setMemoEnabled(true)
  get(1, [2])
  expect(computed).toBe(5)
})

test("memoize keys never collide across types or separators", () => {
  const memo = memoize(64, (value: unknown) => ({ value }))
  const distinct: unknown[] = [
    1,
    "1",
    null,
    "null",
    undefined,
    "undefined",
    true,
    "true",
    0,
    -0,
    { a: "1,b:2" },
    { a: "1", b: "2" },
    { "a:1,b": 2 },
    { a: 1, b: 2 },
    ["1,2"],
    ["1", "2"],
  ]
  for (const value of distinct) expect(memo(value).value).toBe(value)
})
