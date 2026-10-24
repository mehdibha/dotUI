import { describe, expect, it } from "vitest"

import { changedRows, optionsOf, residualGaps, score } from "./fit"

const reference = {
  light: {
    "button.primary": { borderRadius: "6px", height: "32px" },
    "switch.off": { height: "32px" },
  },
}

describe("fit", () => {
  it("scores off rows by how far, ok and missing rows at zero", () => {
    const near = score(reference, {
      light: {
        "button.primary": { borderRadius: "8px", height: "32px" },
        "switch.off": { height: "24px" },
      },
    })
    const far = score(reference, {
      light: {
        "button.primary": { borderRadius: "16px", height: "32px" },
        "switch.off": { height: "24px" },
      },
    })
    expect(near.off).toBe(2)
    expect(far.score).toBeGreaterThan(near.score)
    expect(
      score(reference, {
        light: { "button.primary": { borderRadius: "6px", height: "32px" } },
      }),
    ).toMatchObject({ off: 0, score: 0 })
  })

  it("lists the other values a key can take", () => {
    expect(
      optionsOf({ value: { type: "enum", values: ["a", "b"] } }, "a", ["same"]),
    ).toEqual(["b", "same"])
    expect(optionsOf({ value: { type: "boolean" } }, false)).toEqual([true])
    expect(
      optionsOf({ value: { type: "number", min: 2, max: 4, step: 0.5 } }, 3),
    ).toEqual([2, 2.5, 3.5, 4])
    expect(
      optionsOf(
        { value: { type: "number", min: 2, max: 20, step: 0.5 } },
        6,
        [],
        1,
      ),
    ).toEqual([5.5, 6.5])
    expect(optionsOf({ value: { type: "color" } }, "#000")).toEqual([])
  })

  it("names the rows a change moved", () => {
    expect(
      changedRows(
        { light: { tab: { height: "32px", color: "red" } } },
        { light: { tab: { height: "36px", color: "red" } } },
      ),
    ).toEqual(["light tab height"])
  })

  it("files residual rows under their look", () => {
    const { rows } = score(reference, {
      light: {
        "button.primary": { borderRadius: "6px", height: "32px" },
        "switch.off": { height: "24px" },
      },
    })
    const { gaps, unfiled } = residualGaps(rows, "abc1234")
    expect(unfiled).toEqual([])
    expect(gaps).toEqual([
      expect.objectContaining({
        look: "size.switch",
        source: "fit abc1234",
        rows: [
          {
            mode: "light",
            part: "switch.off",
            prop: "height",
            reference: "32px",
            preset: "24px",
          },
        ],
      }),
    ])
  })
})
