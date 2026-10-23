import { describe, expect, it } from "vitest"

import type { Inventory } from "./census"
import type { Model } from "./model"
import {
  componentOf,
  matchParts,
  stateOfPart,
  systemLooks,
} from "./system-looks"

const primary = {
  backgroundColor: "rgb(31, 136, 61)",
  color: "rgb(255, 255, 255)",
  borderRadius: "6px",
  height: "32px",
  paddingInline: "12px",
  fontSize: "14px",
}
const quiet = { ...primary, backgroundColor: "rgba(0, 0, 0, 0)" }

const model: Model = {
  probe: "abc1234",
  pages: [{ key: "https://example.com/", modes: ["light"] }],
  radius: [{ px: 6, count: 3, groups: ["button"] }],
  pills: [],
  type: [
    {
      fontSize: "14px",
      fontWeight: "500",
      fontFamily: "Inter",
      count: 3,
      groups: ["button"],
    },
  ],
  heights: { button: [{ px: 32, count: 3 }] },
  spacing: { grid: 4, steps: [{ px: 12, count: 3 }] },
  colors: { light: { neutrals: [], accents: [] } },
  tokens: [],
  // The model keeps the most used look only.
  inventory: {
    button: [{ id: "button.1", count: 2, pages: [0], light: quiet }],
  },
}

const census: Inventory = {
  probe: "abc1234",
  pages: [{ key: "https://example.com/", modes: ["light"], passes: ["rest"] }],
  tokens: {},
  looks: [
    {
      id: "button.1",
      group: "button",
      count: 2,
      pages: ["https://example.com/"],
      light: quiet,
      sample: {
        key: "https://example.com/",
        pass: "rest",
        mode: "light",
        id: 1,
      },
    },
    {
      id: "button.2",
      group: "button",
      count: 1,
      pages: ["https://example.com/"],
      light: { ...primary, boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px" },
      states: { light: { hover: { backgroundColor: "rgb(26, 127, 55)" } } },
      vars: { backgroundColor: "--button-primary-bgColor-rest" },
      sample: {
        key: "https://example.com/",
        pass: "rest",
        mode: "light",
        id: 2,
      },
    },
  ],
}

describe("system looks", () => {
  it("files census groups under registry components", () => {
    expect(componentOf("button")).toBe("button")
    expect(componentOf("text@button")).toBe("text")
    expect(componentOf("icon@button")).toBe("button")
    expect(componentOf("cell@table")).toBe("table")
    expect(componentOf("heading.h2")).toBe("text")
    expect(componentOf("contentinfo")).toBe("other")
  })

  it("reads a part's state from its name", () => {
    expect(stateOfPart("button.focus")).toBe("focus")
    expect(stateOfPart("checkbox.checked")).toBe("selected")
    expect(stateOfPart("button.primary")).toBe("rest")
  })

  it("matches a probe part to the look that agrees with it", () => {
    expect(
      matchParts(
        { light: { "button.primary": primary } },
        { button: census.looks },
      ),
    ).toEqual({ "button.primary": "button.2" })
  })

  it("keeps the model's looks and every look a part reads", () => {
    const looks = systemLooks({
      slug: "example",
      model,
      census,
      reference: {
        light: {
          "button.primary": primary,
          page: { backgroundColor: "rgb(255, 255, 255)" },
        },
      },
      residuals: [
        {
          mode: "light",
          part: "button.primary",
          prop: "height",
          reference: "32px",
          preset: "36px",
        },
      ],
      censusDir: "2026-10-23/census",
      copies: new Set(["button.2-rest-light.json"]),
      date: "2026-10-23",
    })
    const button = looks.components.button
    expect(button?.found).toBe(2)
    expect(button?.looks.map((look) => look.id)).toEqual([
      "button.1",
      "button.2",
    ])
    expect(button?.looks[1]).toMatchObject({
      part: "button.primary",
      states: {
        rest: {
          light: {
            source: "census",
            vars: { backgroundColor: "--button-primary-bgColor-rest" },
            copy: "2026-10-23/census/crops/button.2-rest-light.json",
          },
        },
        hover: { light: { values: { backgroundColor: "rgb(26, 127, 55)" } } },
      },
      off: [
        {
          prop: "height",
          mode: "light",
          state: "rest",
          theirs: "32px",
          ours: "36px",
        },
      ],
    })
    expect(looks.color.modes.light?.roles).toMatchObject({
      canvas: { color: "rgb(255, 255, 255)", source: "probe" },
      accent: { color: "rgb(31, 136, 61)", source: "probe" },
    })
    expect(looks.elevation.shadows).toEqual([
      {
        value: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
        count: 1,
        groups: ["button"],
      },
    ])
    expect(looks.type.families).toEqual([{ family: "Inter", count: 3 }])
    expect(looks.capture.pages[0]).toMatchObject({
      how: "headless",
      signedIn: false,
    })
  })
})
