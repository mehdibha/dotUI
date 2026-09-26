import { describe, expect, test } from "vitest"

import { DEFAULTS } from "./axes"
import { MOTION_KEYS } from "./axes/motion-presets"
import { MOTION, MOTION_DEFAULTS } from "./motion-controls"
import { COMPONENTS_DEFAULTS } from "./sections/components"

describe("motion registry", () => {
  test("every motion key has an entry, and only one", () => {
    const keys = MOTION.flatMap((entry) => entry.keys)
    expect(new Set(keys).size).toBe(keys.length)
    expect([...keys].sort()).toEqual([...MOTION_KEYS].sort())
    expect(Object.keys(MOTION_DEFAULTS).sort()).toEqual([...keys].sort())
    for (const key of keys) {
      expect(DEFAULTS).toHaveProperty(key)
      expect(COMPONENTS_DEFAULTS).toHaveProperty(key)
    }
  })
})
