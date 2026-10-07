import { describe, expect, it } from "vitest"

import { SCHEMA } from "./index"
import { OPTIONS } from "./meta"

// Enum keys the panel names by their raw value.
const UNLABELLED = [
  "density",
  "roleControl",
  "roleItem",
  "roleSurface",
  "rolePanel",
  "roleCard",
]

describe("option metadata", () => {
  it("labels exactly the values each enum key accepts", () => {
    for (const [key, { value }] of Object.entries(SCHEMA)) {
      if (value.type !== "enum" || UNLABELLED.includes(key)) continue
      expect(
        OPTIONS[key]?.map((option) => option.value),
        key,
      ).toEqual(value.values)
    }
  })

  it("labels only schema keys", () => {
    for (const key of Object.keys(OPTIONS))
      expect(SCHEMA[key as keyof typeof SCHEMA]?.value.type, key).toBe("enum")
  })
})
