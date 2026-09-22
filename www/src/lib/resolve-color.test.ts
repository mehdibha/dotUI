import { beforeEach, expect, test, vi } from "vitest"

import { resolveColorConfig } from "@/registry/theme"
import type { ColorConfig } from "@/registry/theme"

import { resolveColorConfigCached } from "./resolve-color"

vi.mock("@/registry/theme", () => ({
  resolveColorConfig: vi.fn((config: ColorConfig) => ({ config })),
}))

beforeEach(() => vi.mocked(resolveColorConfig).mockClear())

test("a structurally-equal config hits the cache", () => {
  const config: ColorConfig = {
    v: 2,
    seeds: { accent: "#123456" },
    background: { dark: 2 },
  }
  const first = resolveColorConfigCached(config)
  expect(resolveColorConfigCached(structuredClone(config))).toBe(first)
  expect(
    resolveColorConfigCached({
      background: { dark: 2 },
      seeds: { accent: "#123456" },
      v: 2,
    }),
  ).toBe(first)
  expect(resolveColorConfig).toHaveBeenCalledTimes(1)
})

test("a different config misses", () => {
  resolveColorConfigCached({ v: 2, seeds: { accent: "#aaaaaa" } })
  resolveColorConfigCached({
    v: 2,
    seeds: { accent: "#aaaaaa" },
    vividness: 1.2,
  })
  expect(resolveColorConfig).toHaveBeenCalledTimes(2)
})

test("evicts the least recently used entry past the bound", () => {
  const config = (i: number): ColorConfig => ({
    v: 2,
    seeds: { accent: `#0000${i.toString(16).padStart(2, "0")}` },
  })
  for (let i = 0; i < 16; i++) resolveColorConfigCached(config(i))
  resolveColorConfigCached(config(0))
  resolveColorConfigCached(config(16))
  vi.mocked(resolveColorConfig).mockClear()

  resolveColorConfigCached(config(0))
  expect(resolveColorConfig).not.toHaveBeenCalled()
  resolveColorConfigCached(config(1))
  expect(resolveColorConfig).toHaveBeenCalledTimes(1)
})
