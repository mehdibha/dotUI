import { describe, expect, test, vi } from "vitest"

import { Lru, render, renderCacheKey, renderPlan } from "./render"
import type { Screenshotter, Shot } from "./render"
import { setAxes, ToolError } from "./tools"

const ORIGIN = "https://dotui.org"

const shot = (height = 900): Shot => ({
  jpeg: new Uint8Array([0xff, 0xd8, 0xff, height % 256]),
  top: 0,
  height,
  pageHeight: height,
})

describe("renderPlan", () => {
  test("defaults to the overview in both modes", () => {
    const { page, shots } = renderPlan(ORIGIN, {})
    expect(page).toBe("overview")
    expect(shots.map((s) => [s.mode, s.url])).toEqual([
      ["light", `${ORIGIN}/preview/overview?mode=light`],
      ["dark", `${ORIGIN}/preview/overview?mode=dark`],
    ])
  })

  test("carries the preset into the URL, one mode when asked", () => {
    const { preset } = setAxes({ set: { radiusPx: 6 } })
    const { shots } = renderPlan(ORIGIN, {
      preset,
      page: "dashboard",
      mode: "dark",
    })
    expect(shots).toHaveLength(1)
    expect(shots[0]?.url).toBe(
      `${ORIGIN}/preview/dashboard?preset=${preset}&mode=dark`,
    )
  })

  test("rejects unknown pages with the list, and bad presets", () => {
    expect(() => renderPlan(ORIGIN, { page: "kanban" })).toThrow(ToolError)
    expect(() => renderPlan(ORIGIN, { page: "kanban" })).toThrow(
      /Unknown page: kanban\. Pages: overview, dashboard/,
    )
    expect(() => renderPlan(ORIGIN, { preset: "not-a-preset" })).toThrow(
      /could not be decoded/,
    )
  })

  test("sections are the overview's only", () => {
    expect(renderPlan(ORIGIN, { section: "components" }).section).toBe(
      "components",
    )
    expect(() =>
      renderPlan(ORIGIN, { page: "settings", section: "components" }),
    ).toThrow(/overview page only/)
    expect(() => renderPlan(ORIGIN, { section: "footer" })).toThrow(
      /Unknown section: footer\. Sections: color/,
    )
    expect(() => renderPlan(ORIGIN, { section: "constructor" })).toThrow(
      /Unknown section/,
    )
  })
})

test("cache keys tell modes and sections apart", () => {
  const keys = new Set([
    renderCacheKey("", "overview", "light"),
    renderCacheKey("", "overview", "dark"),
    renderCacheKey("", "overview", "light", "shape"),
    renderCacheKey("x", "overview", "light"),
  ])
  expect(keys.size).toBe(4)
  // One system, one key: the preset is re-encoded before keying.
  const a = renderPlan(ORIGIN, {}).shots[0]?.key
  const { preset } = setAxes({ set: {} })
  expect(renderPlan(ORIGIN, { preset }).shots[0]?.key).toBe(a)
})

test("the LRU evicts the least recently used", () => {
  const lru = new Lru<number>(2)
  lru.set("a", 1)
  lru.set("b", 2)
  lru.get("a")
  lru.set("c", 3)
  expect(lru.get("b")).toBeUndefined()
  expect(lru.get("a")).toBe(1)
  expect(lru.get("c")).toBe(3)
})

describe("render", () => {
  test("a text item, then one JPEG per mode in its order", async () => {
    const shoot = vi.fn<Screenshotter>(async ({ url }) =>
      shot(url.includes("dark") ? 700 : 600),
    )
    const content = await render(ORIGIN, {}, shoot, new Lru(10))
    expect(content.map((c) => c.type)).toEqual(["text", "image", "image"])
    const [text, light, dark] = content
    const meta = JSON.parse(text?.type === "text" ? text.text : "")
    expect(meta.images.map((i: { mode: string }) => i.mode)).toEqual([
      "light",
      "dark",
    ])
    expect(meta.images[1].url).toBe(`${ORIGIN}/preview/overview?mode=dark`)
    expect(meta.lookFor).toMatch(/Look for/)
    expect(light).toEqual({
      type: "image",
      mimeType: "image/jpeg",
      data: Buffer.from([0xff, 0xd8, 0xff, 600 % 256]).toString("base64"),
    })
    expect(dark?.type === "image" && dark.data).not.toBe(
      light?.type === "image" && light.data,
    )
  })

  test("says when the overview is cropped and passes the section title", async () => {
    const shoot = vi.fn<Screenshotter>(async () => ({
      ...shot(2000),
      top: 1200,
      pageHeight: 6000,
    }))
    const content = await render(
      ORIGIN,
      { section: "components", mode: "light" },
      shoot,
      new Lru(10),
    )
    expect(shoot).toHaveBeenCalledWith({
      url: `${ORIGIN}/preview/overview?mode=light`,
      section: "Components",
    })
    const meta = JSON.parse(content[0]?.type === "text" ? content[0].text : "")
    expect(meta.images[0].capturedPx).toEqual([1200, 3200])
    expect(meta.more).toMatch(/Pass section/)
  })

  test("repeat calls hit the cache; failures are not cached", async () => {
    const cache = new Lru<Promise<Shot>>(10)
    const shoot = vi.fn<Screenshotter>(async () => shot())
    await render(ORIGIN, { page: "mail" }, shoot, cache)
    await render(ORIGIN, { page: "mail", mode: "dark" }, shoot, cache)
    expect(shoot).toHaveBeenCalledTimes(2)

    const failing = vi.fn<Screenshotter>(async () => {
      throw new ToolError("Rendering timed out after 25s.")
    })
    await expect(
      render(ORIGIN, { page: "logs", mode: "light" }, failing, cache),
    ).rejects.toThrow(/timed out/)
    await render(ORIGIN, { page: "logs", mode: "light" }, shoot, cache)
    expect(shoot).toHaveBeenCalledTimes(3)
  })
})
