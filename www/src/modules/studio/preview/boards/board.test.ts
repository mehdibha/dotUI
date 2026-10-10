import { describe, expect, it } from "vitest"

import { staysPut } from "./board"

describe("board reveal", () => {
  it("stays put only when a popover on the same member closes", () => {
    expect(
      staysPut(
        { member: "link", keys: "underline" },
        { member: "link", keys: "" },
      ),
    ).toBe(true)
    expect(
      staysPut(
        { member: "tabs", keys: "underline" },
        { member: "link", keys: "" },
      ),
    ).toBe(false)
    expect(staysPut(undefined, { member: "link", keys: "" })).toBe(false)
  })

  it("reveals again when a remount reruns the same focus", () => {
    expect(
      staysPut({ member: "link", keys: "" }, { member: "link", keys: "" }),
    ).toBe(false)
  })
})
