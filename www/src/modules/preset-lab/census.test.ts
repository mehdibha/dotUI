import { describe, expect, it } from "vitest"

import {
  type CensusElement,
  type CensusPage,
  censusSnippet,
  changed,
  cluster,
  groupOf,
  trim,
} from "./census"
import { buildModel, diffModels } from "./model"

const button = (
  id: number,
  x: number,
  values: CensusElement["values"],
): CensusElement => ({
  id,
  role: "button",
  by: "tag",
  tag: "button",
  box: [x, 0, 80, 32],
  chars: 4,
  focusable: true,
  values: {
    height: "32px",
    paddingInline: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter",
    color: "rgb(255, 255, 255)",
    edge: "none",
    boxShadow: "none",
    ...values,
  },
})

const page = (
  key: string,
  mode: "light" | "dark",
  elements: CensusElement[],
): CensusPage => ({
  key,
  mode,
  probe: "test",
  pass: "rest",
  viewport: { width: 1440, height: 900 },
  elements,
})

const blue = { backgroundColor: "rgb(37, 99, 235)" }
const navy = { backgroundColor: "rgb(30, 64, 175)" }

describe("census", () => {
  it("binds the probe into a snippet the page can run", () => {
    const snippet = censusSnippet({ kind: "seen" })
    expect(snippet).toContain('"kind":"seen"')
    expect(() => new Function(`return ${snippet}`)).not.toThrow()
  })

  it("keeps only what differs from the defaults", () => {
    expect(
      trim({ opacity: "1", cursor: "pointer", textTransform: "none", gap: "" }),
    ).toEqual({ cursor: "pointer" })
    expect(
      changed(
        { backgroundColor: "red", color: "white" },
        { backgroundColor: "blue", color: "white" },
      ),
    ).toEqual({ backgroundColor: "blue" })
  })

  it("groups text by the control it sits in", () => {
    const label: CensusElement = {
      id: 1,
      role: "text",
      by: "shape",
      tag: "span",
      in: "button",
      box: [0, 0, 10, 10],
      chars: 3,
      values: {},
    }
    expect(groupOf(label)).toBe("text@button")
    expect(
      groupOf({ ...label, role: "heading", level: 2, in: undefined }),
    ).toBe("heading.h2")
    expect(groupOf({ ...label, role: "button" })).toBe("button")
  })

  it("clusters looks across pages and pairs each with its dark twin", () => {
    const inventory = cluster(
      [
        page("/a", "light", [
          button(1, 0, blue),
          button(2, 100, blue),
          button(3, 200, navy),
        ]),
        page("/a", "dark", [
          button(1, 0, navy),
          button(2, 100, navy),
          button(3, 200, blue),
        ]),
        page("/b", "light", [button(1, 0, { ...blue, height: "32.4px" })]),
      ],
      "test",
    )
    const buttons = inventory.looks.filter((look) => look.group === "button")
    expect(buttons.map((look) => look.count)).toEqual([3, 1])
    expect(buttons[0]?.pages).toEqual(["/a", "/b"])
    expect(buttons[0]?.light?.backgroundColor).toBe(blue.backgroundColor)
    expect(buttons[0]?.dark?.backgroundColor).toBe(navy.backgroundColor)
    expect(buttons[1]?.dark?.backgroundColor).toBe(blue.backgroundColor)
    expect(inventory.pages).toEqual([
      { key: "/a", modes: ["light", "dark"], passes: ["rest"] },
      { key: "/b", modes: ["light"], passes: ["rest"] },
    ])
  })

  it("folds disabled and selected elements into the rest look of their shape", () => {
    const faded = { ...blue, opacity: "0.5" }
    const { looks } = cluster(
      [
        page("a", "light", [
          button(1, 0, blue),
          button(2, 100, blue),
          { ...button(3, 200, faded), is: "disabled" },
          // Selected but drawn the same: it joins the rest look.
          { ...button(4, 300, blue), is: "selected" },
          // Open with no rest look of its height: a look of its own.
          { ...button(5, 400, { ...navy, height: "40px" }), is: "open" },
        ]),
      ],
      "test",
    )
    expect(looks).toEqual([
      expect.objectContaining({
        id: "button.1",
        count: 3,
        states: { light: { disabled: { opacity: "0.5" } } },
      }),
      expect.objectContaining({ id: "button.2", count: 1, is: "open" }),
    ])
  })

  it("keeps a page read only in dark as dark-only looks", () => {
    const inventory = cluster(
      [
        page("/a", "light", [button(1, 0, blue)]),
        page("/app", "dark", [button(1, 0, navy)]),
      ],
      "test",
    )
    const [light, dark] = inventory.looks
    expect(light?.light?.backgroundColor).toBe(blue.backgroundColor)
    expect(light?.dark).toBeUndefined()
    expect(dark?.dark?.backgroundColor).toBe(navy.backgroundColor)
    expect(dark?.light).toBeUndefined()
  })
})

describe("model", () => {
  const inventory = cluster(
    [
      page("/a", "light", [
        button(1, 0, blue),
        button(2, 100, blue),
        button(3, 200, { ...blue, borderRadius: "999px", height: "24px" }),
      ]),
      page("/a", "dark", [button(1, 0, navy), button(2, 100, navy)]),
    ],
    "test",
  )
  const model = buildModel(inventory)

  it("reads rungs, pills, heights and type", () => {
    expect(model.radius[0]).toMatchObject({ px: 6, count: 2 })
    expect(model.pills).toEqual(["button"])
    expect(model.heights.button?.[0]).toEqual({ px: 32, count: 2 })
    expect(model.type[0]).toMatchObject({
      fontSize: "14px",
      fontWeight: "500",
      fontFamily: "Inter",
    })
    expect(model.spacing.steps).toContainEqual({ px: 12, count: 3 })
  })

  it("splits colors into neutrals and accent hues per mode", () => {
    expect(model.colors.light?.neutrals[0]?.l).toBe(1)
    expect(model.colors.light?.accents[0]?.hue).toBeGreaterThan(250)
    expect(model.colors.dark?.accents[0]?.steps[0]?.l).toBeLessThan(0.5)
  })

  it("reports drift on shared pages only", () => {
    expect(diffModels(model, model)).toEqual([])
    const moved = buildModel(
      cluster(
        [
          page("/a", "light", [
            button(1, 0, { ...blue, borderRadius: "10px" }),
          ]),
          page("/new", "light", [button(1, 0, navy)]),
        ],
        "test",
      ),
    )
    const changes = diffModels(model, moved)
    expect(
      changes.some(
        (c) => c.startsWith("light button: new") && c.includes("10px"),
      ),
    ).toBe(true)
    expect(changes.some((c) => c.includes("light button: gone"))).toBe(true)
    expect(
      changes.some((c) => c.includes("rgb(30, 64, 175)") && c.includes("new")),
    ).toBe(false)
  })
})
