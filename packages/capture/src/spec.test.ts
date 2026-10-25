import { describe, expect, it } from "vitest"

import type { Inventory, Look } from "./census"
import { hashOf, systemSpec } from "./spec"

const box = {
  borderRadius: "6px",
  edge: "none",
  boxShadow: "none",
  fontFamily: "Inter",
  fontWeight: "500",
}
const green = { ...box, backgroundColor: "rgb(31, 136, 61)", color: "white" }
const gray = { ...box, backgroundColor: "rgb(246, 248, 250)", color: "black" }
const medium = { height: "32px", paddingInline: "12px", fontSize: "14px" }
const small = { height: "28px", paddingInline: "8px", fontSize: "12px" }

const look = (
  id: string,
  count: number,
  light: Look["light"],
  names?: Look["names"],
  more: Partial<Look> = {},
): Look => ({
  id,
  group: id.split(".").slice(0, -1).join("."),
  count,
  pages: ["/"],
  light,
  ...(names ? { names } : {}),
  sample: { key: "/", pass: "rest", mode: "light", id: 1 },
  ...more,
})

const specOf = (looks: Look[]) =>
  systemSpec({
    slug: "test",
    census: {
      census: "abc",
      probe: "abc",
      pages: [{ key: "/", modes: ["light"], passes: ["rest"] }],
      looks,
      tokens: {},
    } as Inventory & { census: string },
    censusDir: "2026-10-25/census",
    copies: new Set(["button.1-rest-light.json"]),
    date: "2026-10-25",
  })

describe("systemSpec", () => {
  it("lays named looks out as variants × sizes", () => {
    const spec = specOf([
      look(
        "button.1",
        9,
        { ...green, ...medium },
        {
          "data-variant": ["primary"],
          "data-size": ["medium"],
          "data-component": ["Button"],
        },
      ),
      look(
        "button.2",
        5,
        { ...gray, ...medium },
        {
          "data-variant": ["default"],
          "data-size": ["medium"],
        },
      ),
      look(
        "button.3",
        2,
        { ...green, ...small },
        {
          "data-variant": ["primary"],
          "data-size": ["small"],
        },
      ),
      look("text@button.1", 9, { color: "white" }),
    ])
    const [grid] = spec.components.button?.grids ?? []
    expect(grid?.variants.map((v) => v.key)).toEqual(["primary", "default"])
    expect(grid?.variants[0]?.name).toEqual({
      value: "primary",
      from: "attribute",
      key: "data-variant",
    })
    expect(grid?.variants[0]?.values.light?.backgroundColor).toBe(
      green.backgroundColor,
    )
    expect(grid?.sizes.map((s) => s.key)).toEqual(["medium", "small"])
    expect(grid?.sizes[1]?.values).toEqual(small)
    expect(
      grid?.cells.map((cell) => [cell.variant, cell.size, cell.look]),
    ).toEqual([
      ["primary", "medium", "button.1"],
      ["primary", "small", "button.3"],
      ["default", "medium", "button.2"],
    ])
    expect(grid?.cells[0]?.copies).toEqual({
      rest: { light: "2026-10-25/census/crops/button.1-rest-light.json" },
    })
    expect(spec.components.button?.names).toEqual([
      { value: "Button", from: "attribute", key: "data-component" },
    ])
    expect(spec.components.text).toBeUndefined()
  })

  it("puts unnamed looks on the variant and size whose values they share", () => {
    const spec = specOf([
      look(
        "button.1",
        9,
        { ...green, ...medium },
        {
          "data-variant": ["primary"],
        },
      ),
      // Primary's colors at another size, with its own corners.
      look("button.2", 4, { ...green, ...small, borderRadius: "999px" }),
      look("button.3", 3, { ...gray, ...small }),
    ])
    const [grid] = spec.components.button?.grids ?? []
    const [, gray3] = grid?.variants ?? []
    expect(grid?.variants.map((v) => v.key)).toEqual(["primary", gray3?.key])
    expect(gray3?.key).toMatch(/^v-[0-9a-z]{6}$/)
    expect(gray3?.name).toBeUndefined()
    expect(grid?.sizes).toHaveLength(2)
    const placed = grid?.cells.find((cell) => cell.look === "button.2")
    expect(placed?.variant).toBe("primary")
    expect(placed?.size).toBe(grid?.sizes[1]?.key)
    expect(placed?.values).toEqual({ light: { borderRadius: "999px" } })
    // Keys hold across runs: a hash of the values, not a rank.
    expect(
      specOf([look("button.3", 3, { ...gray, ...small })]).components.button
        ?.grids[0]?.variants[0]?.key,
    ).toBe(gray3?.key)
  })

  it("prefers attributes over a story's args over class tokens", () => {
    const spec = specOf([
      look(
        "button.1",
        1,
        { ...green, ...medium },
        {
          "class.variant": ["btn-primary"],
          "args.variant": ["success"],
          "data-variant": ["primary"],
        },
      ),
      look(
        "button.2",
        1,
        { ...gray, ...medium },
        {
          "class.variant": ["secondary"],
          "args.variant": ["neutral"],
        },
      ),
    ])
    expect(
      spec.components.button?.grids[0]?.variants.map((v) => [
        v.key,
        v.name?.from,
      ]),
    ).toEqual([
      ["neutral", "storybook"],
      ["primary", "attribute"],
    ])
  })

  it("leaves looks found only in a state unplaced", () => {
    const spec = specOf([
      look("tab.1", 3, { ...gray, ...medium }, undefined, { is: "selected" }),
    ])
    expect(spec.components.tabs?.grids[0]).toMatchObject({
      cells: [],
      unplaced: [{ look: "tab.1", is: "selected" }],
    })
  })

  it("hashes to six base-36 characters", () => {
    expect(hashOf("a")).toMatch(/^[0-9a-z]{6}$/)
    expect(hashOf("a")).toBe(hashOf("a"))
    expect(hashOf("a")).not.toBe(hashOf("b"))
  })
})
