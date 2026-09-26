import { describe, expect, test } from "vitest"

import { CHAPTERS, DEFAULTS } from "./state"

describe("panel groups", () => {
  test("every axis belongs to exactly one group", () => {
    for (const key of Object.keys(DEFAULTS)) {
      const owners = CHAPTERS.filter((c) => key in c.defaults).map((c) => c.id)
      expect(owners, key).toHaveLength(1)
    }
  })

  test("groups own only real axes", () => {
    for (const chapter of CHAPTERS)
      for (const key of Object.keys(chapter.defaults))
        expect(DEFAULTS, `${chapter.id}.${key}`).toHaveProperty(key)
  })
})
