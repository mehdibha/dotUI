import { describe, expect, it } from "vitest"

import { emitInitItem } from "@/publisher/emit-theme"
import fixtures from "@/modules/studio/preset/historical-presets.json"

import { resolveRequestPreset } from "./registry-preset"

const encoded = (id: string) => {
  const fixture = fixtures.find((f) => f.id === id)
  if (!fixture) throw new Error(`no fixture ${id}`)
  return fixture.encoded
}

/* The /r/init handler's path: resolve the param, emit the init item. */
async function init(encodedPreset: string) {
  return emitInitItem({
    baseRegistryCss: { css: {} },
    preset: await resolveRequestPreset(encodedPreset),
    encodedPreset,
    registryRoot: "https://dotui.org",
  })
}

describe("/r/init with crafted presets", () => {
  it("emits for an unparseable color seed", async () => {
    await expect(init(encoded("crafted-bad-seed"))).resolves.toMatchObject({
      type: "registry:base",
    })
  })

  it("keeps raw CSS out of the exported theme", async () => {
    const item = JSON.stringify(await init(encoded("crafted-css-injection")))
    expect(item).not.toContain("display")
    expect(item).not.toContain("pointer;")
  })
})
