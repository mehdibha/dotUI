import type { ComponentType } from "react"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

const demos = import.meta.glob<{ default: ComponentType }>(
  "../chart*/demos/*.tsx",
)

describe("chart demos", () => {
  it.each(Object.keys(demos))("%s renders on the server", async (path) => {
    const demo = await demos[path]?.()
    if (!demo) throw new Error(`missing ${path}`)
    const html = renderToString(createElement(demo.default))
    expect(html).toContain("<svg")
    expect(html).not.toContain("NaN")
  })
})
