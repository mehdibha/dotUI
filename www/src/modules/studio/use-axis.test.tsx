import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { installFakeWindow } from "@/lib/test-fake-window"

import type { Axis, AxisKey } from "./use-axis"

beforeEach(() => {
  installFakeWindow()
  vi.resetModules()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function render(...keys: AxisKey[]): Promise<Axis[]> {
  const { useAxis } = await import("./use-axis")
  const axes: Axis[] = []
  function Probe() {
    for (const key of keys) axes.push(useAxis(key))
    return null
  }
  renderToString(<Probe />)
  return axes
}

it("keeps both of two sets made in one tick", async () => {
  const { getCurrent } = await import("./selection")
  const [radius, cursor] = await render("radiusPx", "cursorControls")
  radius?.set(3)
  cursor?.set("default")
  expect(getCurrent().state).toMatchObject({
    radiusPx: 3,
    cursorControls: "default",
  })
})
