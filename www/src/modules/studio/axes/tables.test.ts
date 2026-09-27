import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"
import type { StudioState } from "./index"

/** What the table ships under the studio state. */
async function shipped(state: StudioState = DEFAULTS) {
  const ds = resolveDesignSystem(state)
  const preset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
  }
  const mod = await publishables["table"]?.()
  if (!mod) throw new Error("table is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

describe("tables axis", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const system = resolveDesignSystem(DEFAULTS)
    expect(system.componentParams.table).toEqual({
      separation: "lines",
      header: "plain",
    })
    expect(system.tokens).toEqual({})
  })

  it("maps separation and header onto table params", () => {
    const system = resolveDesignSystem({
      ...DEFAULTS,
      tableSeparation: "striped",
      tableHeader: "filled",
    })
    expect(system.componentParams.table).toEqual({
      separation: "striped",
      header: "filled",
    })
    expect(system.tokens).toEqual({})
  })

  it("falls back to the defaults on unknown values", () => {
    const system = resolveDesignSystem({
      ...DEFAULTS,
      tableSeparation: "zebra",
      tableHeader: "loud",
    })
    expect(system.componentParams.table).toEqual({
      separation: "lines",
      header: "plain",
    })
  })
})

describe("table motion", () => {
  it("ships shadcn's bare transition-colors: no timing class", async () => {
    const content = await shipped()
    expect(content).toContain("focus-reset transition-colors [div]:h-full")
    expect(content).toContain('"size-3.5 transition-transform"')
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  it("a tweak times rows, icons, the drag handle and the drop line", async () => {
    const state: StudioState = {
      ...DEFAULTS,
      tableMotion: { duration: 250, ease: [0, 0, 0.2, 1] },
    }
    expect(resolveDesignSystem(state).tokens).toEqual({
      "--studio-table-state-duration": "250ms",
      "--studio-table-state-ease": "cubic-bezier(0, 0, 0.2, 1)",
    })
    const content = await shipped(state)
    const timing = "duration-250 ease-out"
    expect(content).toContain(
      `focus-reset transition-colors ${timing} [div]:h-full`,
    )
    expect(content).toContain(`text-fg-muted transition-transform ${timing}`)
    expect(content).toContain(`size-3.5 transition-transform ${timing}`)
    expect(content).toContain(
      `focus-reset transition-colors ${timing} focus-visible:focus-ring`,
    )
    expect(content).toContain(`opacity-0 transition-opacity ${timing}`)
  })
})
