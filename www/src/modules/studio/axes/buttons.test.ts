import { describe, expect, test } from "vitest"

import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

describe("buttons", () => {
  test("secondary writes button and toggle-button together", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, buttonSecondary: "filled" })
    expect(ds.componentParams.button).toMatchObject({ secondary: "filled" })
    expect(ds.componentParams["toggle-button"]).toMatchObject({
      secondary: "filled",
    })
  })

  test("an unknown secondary falls back to outline", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, buttonSecondary: "ghost" })
    expect(ds.componentParams.button).toMatchObject({ secondary: "outline" })
  })
})
