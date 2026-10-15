import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

import type { Studio } from "./use-studio"

beforeEach(() => {
  installFakeWindow()
  vi.resetModules()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function render(): Promise<Studio> {
  const { useStudio } = await import("./use-studio")
  let studio: Studio | undefined
  function Probe() {
    studio = useStudio()
    return null
  }
  renderToString(<Probe />)
  if (!studio) throw new Error("not rendered")
  return studio
}

it("keeps one setter per key across renders", async () => {
  const first = await render()
  const second = await render()
  expect(second.set("radiusPx")).toBe(first.set("radiusPx"))
  expect(second.setState).toBe(first.setState)
})

it("edits the state current at the call, not the render's", async () => {
  const { getCurrent } = await import("./selection")
  const { set } = await render()
  set("radiusPx")(3)
  set("cursorControls")("default")
  expect(getCurrent().state).toMatchObject({
    radiusPx: 3,
    cursorControls: "default",
  })
})
