import { describe, expect, test } from "vitest"

import { DEFAULT_STATE } from "./axes"
import { MOTION_KEYS } from "./axes/motion-presets"
import { MOTION } from "./motion-controls"

describe("motion registry", () => {
  test("every motion key has an entry, and only one", () => {
    const keys = MOTION.flatMap((entry) => entry.keys)
    expect(new Set(keys).size).toBe(keys.length)
    expect([...keys].sort()).toEqual([...MOTION_KEYS].sort())
    for (const key of keys) expect(DEFAULT_STATE).toHaveProperty(key)
  })
})
