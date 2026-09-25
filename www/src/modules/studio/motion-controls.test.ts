import { describe, expect, test } from "vitest"

import { DEFAULTS } from "./axes"
import {
  familyRows,
  MOTION,
  MOTION_DEFAULTS,
  timingOf,
} from "./motion-controls"
import { COMPONENTS_DEFAULTS, FAMILY_LABELS } from "./sections/components"

describe("motion registry", () => {
  test("every motion key has an entry, and only one", () => {
    const keys = MOTION.flatMap((entry) => entry.keys)
    expect(new Set(keys).size).toBe(keys.length)
    expect(keys.sort()).toEqual(
      Object.keys(DEFAULTS)
        .filter((key) => key.endsWith("Motion"))
        .sort(),
    )
    expect(Object.keys(MOTION_DEFAULTS).sort()).toEqual(keys.sort())
    // Components shows every one too, so its Reset reaches them all.
    for (const key of keys) expect(COMPONENTS_DEFAULTS).toHaveProperty(key)
  })

  test("every entry and follower lands in a Components family", () => {
    const families = new Set(FAMILY_LABELS)
    for (const entry of MOTION) {
      expect(families).toContain(entry.family)
      for (const follower of entry.followers ?? [])
        expect(families).toContain(follower.family)
    }
    // Each entry and each follower surfaces exactly once across the families.
    const rows = FAMILY_LABELS.flatMap(familyRows)
    const followers = MOTION.flatMap((e) =>
      (e.followers ?? []).filter((f) => f.family !== e.family),
    )
    expect(rows).toHaveLength(MOTION.length + followers.length)
  })

  test("the defaults time every entry", () => {
    for (const entry of MOTION) {
      const timing = timingOf(entry, DEFAULTS)
      expect(Number.isFinite(timing.enter), entry.id).toBe(true)
      expect(timing.ease, entry.id).toBeTruthy()
    }
  })
})
