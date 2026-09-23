import { describe, expect, test } from "vitest"

import { DEFAULTS } from "../modules/studio/axes"
import { encodeState } from "../modules/studio/preset/codec"
import { resolveRequestPreset } from "./registry-preset"

describe("resolveRequestPreset", () => {
  test("never echoes a hostile param", async () => {
    for (const raw of [
      `abc"; } body { color: red } /*`,
      "x\ny",
      "'--preset=1';rm -rf /",
    ]) {
      const { encodedPreset } = await resolveRequestPreset(raw)
      expect(encodedPreset).toBeUndefined()
    }
  })

  test("re-encodes a valid preset to the same canonical string", async () => {
    const encoded = encodeState({ ...DEFAULTS, bodyFont: "Inter" })
    const { encodedPreset } = await resolveRequestPreset(encoded)
    expect(encodedPreset).toBe(encoded)
  })
})
