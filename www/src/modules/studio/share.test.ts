import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"
import { getPreset } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"
import main from "@/modules/studio/axes/__fixtures__/main-states.json"
import { STATE_VERSION } from "@/modules/studio/axes/version"

const linear = getPreset("linear")!

beforeEach(() => {
  installFakeWindow()
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const respond = (id: string) =>
  vi.fn(async () => Response.json({ id }, { status: 200 }))

describe("snapshotOf", () => {
  it("posts each content once", async () => {
    const fetch = respond("abcdefghij")
    vi.stubGlobal("fetch", fetch)
    const { snapshotOf } = await import("./share")
    const content = { name: "Acme", state: linear.state }
    const [a, b] = await Promise.all([
      snapshotOf(content),
      snapshotOf({ ...content }),
    ])
    expect(await snapshotOf(content)).toBe("abcdefghij")
    expect([a, b]).toEqual(["abcdefghij", "abcdefghij"])
    expect(fetch).toHaveBeenCalledTimes(1)
    await snapshotOf({ ...content, name: "Acme 2" })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("posts again after a failure", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(Response.json({ id: "abcdefghij" }))
    vi.stubGlobal("fetch", fetch)
    const { snapshotOf } = await import("./share")
    const content = { name: "Acme", state: linear.state }
    await expect(snapshotOf(content)).rejects.toThrow("500")
    expect(await snapshotOf(content)).toBe("abcdefghij")
  })

  it("posts the state stamped with its version", async () => {
    const fetch = vi.fn(async (_url: string, _init: RequestInit) =>
      Response.json({ id: "abcdefghij" }),
    )
    vi.stubGlobal("fetch", fetch)
    const { snapshotOf } = await import("./share")
    await snapshotOf({ name: "Acme", state: linear.state })
    const body = JSON.parse(String(fetch.mock.calls[0]![1].body))
    expect(body.state).toEqual({ version: STATE_VERSION, ...linear.state })
  })
})

describe("fetchSnapshot", () => {
  it("migrates a snapshot main stored", async () => {
    const state = {
      ...Object.fromEntries(
        Object.entries(main.schema).map(([key, { default: v }]) => [key, v]),
      ),
      sliderThumb: "bar",
    }
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ schema: 1, name: "Acme", state })),
    )
    const { fetchSnapshot } = await import("./share")
    expect((await fetchSnapshot("abcdefghij"))?.state).toEqual(
      parseState({ sliderThumb: "handle", sliderTrack: "thin" }),
    )
  })
})
