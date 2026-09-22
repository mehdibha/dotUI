import { describe, expect, it } from "vitest"

import { uniqueName } from "./my-presets"

describe("uniqueName", () => {
  it("keeps a free name", () => {
    expect(uniqueName("Acme", ["Linear"])).toBe("Acme")
  })

  it("numbers a taken one, case-insensitively", () => {
    expect(uniqueName("Linear", ["linear"])).toBe("Linear 2")
    expect(uniqueName("Linear", ["Linear", "Linear 2"])).toBe("Linear 3")
  })
})
