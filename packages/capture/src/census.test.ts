import { describe, expect, it } from "vitest"

import {
  type CensusElement,
  type CensusPage,
  censusSnippet,
  changed,
  cluster,
  groupOf,
  namesOf,
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

  it("keeps a look plain when its first element is selected", () => {
    const { looks } = cluster(
      [
        page("a", "light", [
          { ...button(1, 0, blue), is: "selected" },
          button(2, 100, blue),
          button(3, 200, blue),
        ]),
      ],
      "test",
    )
    expect(looks).toEqual([
      expect.not.objectContaining({ is: expect.anything() }),
    ])
    expect(looks[0]?.count).toBe(3)
  })

  it("keeps a state set on the sample unless one was found in it", () => {
    const sample = {
      ...button(1, 0, blue),
      states: {
        hover: { backgroundColor: "rgb(29, 78, 216)" },
        disabled: { opacity: "0.4" },
        invalid: { edge: "1px rgb(220, 38, 38)" },
      },
      forced: ["disabled", "invalid"] as ("disabled" | "invalid")[],
    }
    const { looks } = cluster(
      [
        page("a", "light", [
          sample,
          button(2, 100, blue),
          // Found disabled: its reading wins over the one set.
          { ...button(3, 200, { ...blue, opacity: "0.5" }), is: "disabled" },
        ]),
      ],
      "test",
    )
    expect(looks[0]).toMatchObject({
      states: {
        light: {
          hover: { backgroundColor: "rgb(29, 78, 216)" },
          disabled: { opacity: "0.5" },
          invalid: { edge: "1px rgb(220, 38, 38)" },
        },
      },
      forced: ["invalid"],
    })
  })

  it("folds found invalid elements into their rest look", () => {
    const { looks } = cluster(
      [
        page("a", "light", [
          button(1, 0, blue),
          {
            ...button(2, 100, { ...blue, edge: "1px rgb(220, 38, 38)" }),
            is: "invalid",
          },
        ]),
      ],
      "test",
    )
    expect(looks).toEqual([
      expect.objectContaining({
        count: 1,
        states: { light: { invalid: { edge: "1px rgb(220, 38, 38)" } } },
      }),
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

  it("tallies each look's names, a story's args only on what it renders", () => {
    const label: CensusElement = {
      id: 9,
      role: "text",
      by: "shape",
      tag: "span",
      in: "button",
      box: [0, 0, 10, 10],
      chars: 4,
      values: { color: "white" },
    }
    const named = (id: number, x: number, variant: string) => ({
      ...button(id, x, blue),
      names: { "data-variant": variant, "data-size": "medium" },
    })
    const { looks } = cluster(
      [
        page("/a", "light", [
          named(1, 0, "primary"),
          named(2, 100, "primary"),
          named(3, 200, "brand"),
        ]),
        {
          ...page("/story", "light", [button(1, 0, blue), label]),
          args: { variant: "primary", size: "medium" },
        },
        {
          ...page("/story", "light", [button(1, 0, navy)]),
          pass: "variant=secondary",
          args: { variant: "secondary", size: "medium" },
        },
      ],
      "test",
    )
    const [look, other] = looks.filter((one) => one.group === "button")
    // size is drawn the same under every value it took: not a name.
    expect(look?.names).toEqual({
      "args.variant": ["primary"],
      "data-size": ["medium"],
      "data-variant": ["primary", "brand"],
    })
    expect(other?.names).toEqual({ "args.variant": ["secondary"] })
    expect(looks.find((one) => one.group === "text@button")?.names).toBe(
      undefined,
    )
  })

  it("names a component's look by an attribute only most of it carries", () => {
    const item = (id: number, x: number, variant?: string) => ({
      ...button(id, x, blue),
      names: {
        "data-component": "ActionList.Item",
        ...(variant ? { "data-variant": variant } : {}),
      },
    })
    const namesOf = (elements: CensusElement[]) =>
      cluster([page("/a", "light", elements)], "test").looks.find(
        (one) => one.group === "button",
      )?.names
    // One danger item drawn like three plain ones: the plain look.
    expect(
      namesOf([item(1, 0, "danger"), item(2, 100), item(3, 200), item(4, 300)]),
    ).toEqual({ "data-component": ["ActionList.Item"] })
    expect(
      namesOf([item(1, 0, "danger"), item(2, 100, "danger"), item(3, 200)]),
    ).toEqual({
      "data-component": ["ActionList.Item"],
      "data-variant": ["danger"],
    })
  })

  it("names by a story's args only what their passes redrew", () => {
    const black = { backgroundColor: "rgb(0, 0, 0)" }
    const wrapper: CensusElement = {
      ...button(2, 0, {}),
      role: "card",
      by: "shape",
      tag: "div",
      box: [0, 100, 300, 200],
    }
    const { looks } = cluster(
      [
        // Rendered once: nothing to tell its args apart.
        {
          ...page("/once", "light", [button(1, 0, black)]),
          args: { variant: "error" },
        },
        // The wrapper no variant redraws is furniture.
        {
          ...page("/story", "light", [button(1, 0, blue), wrapper]),
          args: { variant: "primary" },
        },
        // The pass redraws the wrapper too, unchanged: still furniture.
        {
          ...page("/story", "light", [
            button(3, 0, navy),
            { ...wrapper, id: 4 },
          ]),
          pass: "args variant:secondary",
          args: { variant: "secondary" },
        },
      ],
      "test",
    )
    const of = (values: { backgroundColor: string }) =>
      looks.find(
        (one) =>
          one.group === "button" &&
          one.light?.backgroundColor === values.backgroundColor,
      )?.names
    expect(of(black)).toBeUndefined()
    expect(of(blue)).toEqual({ "args.variant": ["primary"] })
    expect(of(navy)).toEqual({ "args.variant": ["secondary"] })
    expect(looks.find((one) => one.group === "card")?.names).toBeUndefined()
  })
})

describe("cluster: wrappers", () => {
  const part = (
    id: number,
    role: string,
    box: CensusElement["box"],
    chars = 0,
  ): CensusElement => ({
    id,
    role,
    by: "shape",
    tag: "span",
    box,
    chars,
    values: { backgroundColor: "rgb(221, 244, 255)", borderRadius: "9999px" },
  })
  const bare = (id: number, box: CensusElement["box"]) => ({
    ...button(id, 0, { backgroundColor: "rgba(0, 0, 0, 0)" }),
    box,
    chars: 0,
  })

  it("counts a button around an avatar, a label or nothing as nothing", () => {
    const { looks } = cluster(
      [
        page("/", "light", [
          // An avatar button.
          bare(1, [0, 0, 20, 20]),
          { ...part(2, "avatar", [0, 0, 20, 20]), tag: "img" },
          // An issue label: the pill holds the text.
          bare(3, [100, 0, 99, 22]),
          part(4, "box", [102, 1, 95, 20]),
          part(5, "text", [110, 3, 77, 15], 14),
          // A chart's hit area.
          bare(6, [300, 0, 181, 27]),
          // A real button, its label in a span.
          bare(7, [600, 0, 80, 32]),
          part(8, "text", [612, 8, 56, 16], 4),
        ]),
      ],
      "test",
    )
    expect(looks.filter((one) => one.group === "button")).toEqual([
      expect.objectContaining({ count: 1 }),
    ])
    expect(looks.map((one) => one.group).sort()).toEqual([
      "avatar",
      "badge",
      "button",
      "text",
    ])
  })

  it("counts pills drawn over a field as its value", () => {
    const { looks } = cluster(
      [
        page("/", "light", [
          part(1, "badge", [8, 8, 35, 17], 5),
          { ...button(2, 0, {}), role: "combobox", box: [0, 0, 400, 32] },
          part(3, "badge", [500, 8, 35, 17], 5),
        ]),
      ],
      "test",
    )
    expect(looks.find((one) => one.group === "badge")?.count).toBe(1)
  })
})

describe("namesOf", () => {
  const of = (attributes: Record<string, string>) => {
    const asked: string[] = []
    const names = namesOf((name) => {
      asked.push(name)
      return attributes[name] ?? null
    })
    return { names, asked }
  }

  it("reads the allowed data attributes, never text, labels or links", () => {
    const { names, asked } = of({
      "data-variant": "primary",
      "data-size": "medium",
      "data-component": "SegmentedControl.Button",
      "data-tone": "Click to save",
      "aria-label": "Save",
      title: "Save",
      href: "/account",
    })
    expect(names).toEqual({
      "data-variant": "primary",
      "data-size": "medium",
      "data-component": "SegmentedControl.Button",
    })
    for (const name of ["aria-label", "title", "alt", "href"])
      expect(asked).not.toContain(name)
  })

  it.each([
    [
      "Primer_Brand__Button-module__Button___h1Yx2 Primer_Brand__Button-module__Button--size-small___zQrEw Primer_Brand__Button-module__Button--subtle___F7pEE",
      { "class.size": "small", "class.variant": "subtle" },
    ],
    [
      "btn btn-sm btn-primary",
      { "class.size": "sm", "class.variant": "primary" },
    ],
    ["Link--secondary", { "class.variant": "secondary" }],
    [
      "cds--btn cds--btn--primary cds--btn--md",
      { "class.variant": "primary", "class.size": "md" },
    ],
    [
      "rt-Button rt-variant-soft rt-r-size-2",
      { "class.variant": "soft", "class.size": "2" },
    ],
    ["spectrum-Button spectrum-Button--sizeM", { "class.size": "M" }],
    ["Button_variant_ghost__1a2b3c4", { "class.variant": "ghost" }],
  ])("reads names from %s", (classes, expected) => {
    expect(of({ class: classes }).names).toEqual(expected)
  })

  it.each([
    "size-4 flex rounded-lg shadow-sm appearance-none hover:bg-red-500",
    "Popover-message Popover-message--bottom-left",
    "Text--200____P1wy card__title",
    "cds--btn",
    "sc-a1b2c3 kJhGfD c1x2y3z",
    "Button--fullWidth btn btn-block",
  ])("finds no names in %s", (classes) => {
    expect(of({ class: classes }).names).toEqual({})
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

  it("reads a percentage radius as a pill, never a px rung", () => {
    const round = (id: number, borderRadius: string) => ({
      ...button(id, id * 100, blue),
      values: { ...blue, borderRadius },
    })
    const { radius, pills } = buildModel(
      cluster(
        [page("/a", "light", [button(1, 0, blue), round(2, "50%")])],
        "test",
      ),
    )
    expect(radius.map((rung) => rung.px)).toEqual([6])
    expect(pills).toEqual(["button"])
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
