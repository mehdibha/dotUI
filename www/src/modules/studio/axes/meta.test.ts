import { describe, expect, it } from "vitest"

import { SCHEMA } from "./index"
import { OPTIONS } from "./meta"

// Enum keys the panel names by their raw value.
const UNLABELLED = [
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

  it("keeps credits in `credits`, never in a description", () => {
    const options = Object.values(OPTIONS).flatMap((list) => list ?? [])
    const systems = new Set(
      options.flatMap((o) => o.credits ?? []).map((c) => c.split(" ")[0]),
    )
    for (const { value, description } of options)
      if (description)
        expect(
          description
            .split(", ")
            .every((part) => systems.has(part.split(" ")[0])),
          `${value}: ${description}`,
        ).toBe(false)
  })

  it("labels only schema keys", () => {
    for (const key of Object.keys(OPTIONS))
      expect(SCHEMA[key as keyof typeof SCHEMA]?.value.type, key).toBe("enum")
  })
})
