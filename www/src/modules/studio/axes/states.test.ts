import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import { FIELD_SHELLS } from "@/registry/ui/input/styles"
import { mergePresetCssFields } from "@/publisher/emit-theme"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULTS, effective, parseState } from "./index"

type State = Partial<typeof DEFAULTS>

const resolve = (overrides: State) => designSystemOf(parseState(overrides))

const presetOf = (state: State): PublishPreset => {
  const { density, componentParams, tokens, color, icons } = resolve(state)
  return { density, componentParams, tokens, color, icons }
}

/** The focus helpers as a consumer's globals.css gets them. */
const helpers = (state: State) => {
  const { css } = mergePresetCssFields(
    baseRegistryCss as Parameters<typeof mergePresetCssFields>[0],
    presetOf(state),
  )
  return {
    ring: css?.["@utility focus-ring"],
    input: css?.["@utility focus-input"],
  }
}

/** A component's shipped file. */
const shipped = async (name: string, state: State = {}) => {
  const preset = presetOf(state)
  const { item } = publish({
    publishable: selectPublishable(await publishables[name]!(), preset),
    preset,
  })
  return item.files?.map((file) => file.content).join("\n") ?? ""
}

describe("focus ring", () => {
  test("Origin emits no tokens", () => {
    const system = resolve({})
    expect(system.tokens).toEqual({})
    expect(system.color).toEqual(DEFAULT_COLOR_CONFIG)
  })

  test("Halo sits flush at half strength", () => {
    expect(resolve({ focusStyle: "halo" }).tokens).toEqual({
      "--studio-focus-color":
        "color-mix(in oklab, var(--color-border-focus) 50%, transparent)",
      "--studio-focus-offset": "0px",
      "--studio-focus-outside-offset": "0px",
    })
  })

  test("Inset draws inside the edge over an on-color line", () => {
    expect(resolve({ focusStyle: "inset" }).tokens).toEqual({
      "--studio-focus-offset": "-2px",
      "--studio-focus-inner": "3px",
    })
  })

  test("width sets the ring and the inside offset", () => {
    expect(resolve({ focusStyle: "inset", focusWidth: 3 }).tokens).toEqual({
      "--studio-focus-width": "3px",
      "--studio-focus-offset": "-3px",
      "--studio-focus-inner": "4px",
      "--studio-focus-inside-offset": "-3px",
    })
    expect(resolve({ focusWidth: 1 }).tokens).toEqual({
      "--studio-focus-width": "1px",
      "--studio-focus-inside-offset": "-1px",
    })
  })

  test("neutral ink re-points the focus pair", () => {
    const system = resolve({ focusColor: "neutral" })
    expect(system.tokens).toEqual({})
    expect(system.color?.overrides).toEqual({
      "color-border-focus": { palette: "neutral", job: "solid" },
      "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
    })
  })

  test("on a Strong edge a neutral ring takes the text ink", () => {
    // The 700 step is the Strong edge itself (Airbnb #222, Spotify).
    const system = resolve({ focusColor: "neutral", controlEdge: "strong" })
    expect(system.color?.overrides).toEqual({
      "color-border-focus": { palette: "neutral", job: "text" },
      "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
    })
    expect(resolve({ controlEdge: "strong" }).color?.overrides).toBeUndefined()
  })
})

describe("field focus", () => {
  test("Ring wears the control ring", () => {
    expect(resolve({ focusInputStyle: "ring" }).tokens).toEqual({
      "--studio-field-focus-width": "var(--studio-focus-width)",
      "--studio-field-focus-offset": "var(--studio-focus-offset)",
      "--studio-field-focus-color": "var(--studio-focus-color)",
    })
  })

  test("Edge recolors the edge; Thick edge draws 2px over it", () => {
    expect(resolve({ focusInputStyle: "edge" }).tokens).toEqual({
      "--studio-field-focus-width": "0px",
    })
    expect(resolve({ focusInputStyle: "thick-edge" }).tokens).toEqual({
      "--studio-field-focus-offset": "-2px",
      "--studio-field-focus-color": "var(--color-border-focus)",
      "--studio-field-invalid-color": "var(--color-fg-danger)",
    })
  })
})

/* Consumers get two helpers written from the choice, in plain values. */
describe("shipped focus", () => {
  test("Origin: a 2px ring with a gap, a muted halo around a recolored edge", () => {
    expect(helpers({})).toEqual({
      ring: {
        outline: "2px solid var(--color-border-focus)",
        "outline-offset": "2px",
      },
      input: {
        "border-color": "var(--color-border-focus)",
        outline: "2px solid var(--color-border-focus-muted)",
        "@variant invalid": {
          "border-color": "var(--color-fg-danger)",
          "outline-color": "var(--color-danger-muted)",
        },
      },
    })
  })

  test("an outline that draws nothing ships no outline", () => {
    expect(helpers({ focusInputStyle: "edge" }).input).toEqual({
      "border-color": "var(--color-border-focus)",
      "@variant invalid": { "border-color": "var(--color-fg-danger)" },
    })
    expect(helpers({ focusStyle: "halo" }).ring).toEqual({
      outline:
        "2px solid color-mix(in oklab, var(--color-border-focus) 50%, transparent)",
    })
  })

  test.each([
    {},
    { focusStyle: "inset", focusInputStyle: "ring" },
    { focusStyle: "halo", focusInputStyle: "thick-edge" },
  ] as State[])("%o ships no studio var", (state) => {
    expect(JSON.stringify(helpers(state))).not.toContain("--studio-")
  })

  /* A site whose own part covers its box sits outside; one that would clip
     sits inside. Each ships an offset only where it differs from the
     ring's. */
  test("a check sits outside the ring only under Inset", async () => {
    expect(await shipped("checkbox")).not.toContain("outline-offset")
    expect(await shipped("checkbox", { focusStyle: "inset" })).toContain(
      "focus-visible:not-has-data-label:outline-offset-2",
    )
  })

  test("a cell keeps the ring inside unless it already is", async () => {
    expect(await shipped("table")).toContain(
      "focus-visible:before:-outline-offset-2",
    )
    expect(await shipped("table", { focusStyle: "inset" })).not.toContain(
      "outline-offset",
    )
  })

  test("a filled button draws its on-color line only under Inset", async () => {
    expect(await shipped("button")).not.toContain("inset-ring-")
    expect(await shipped("button", { focusStyle: "inset" })).toContain(
      "focus-visible:inset-ring-3",
    )
  })
})

describe("per-mode inks ship as literals", () => {
  test("--invalid-fill", () => {
    const { css } = mergePresetCssFields({}, resolve({ invalidStyle: "tint" }))
    const light = css?.[":root"]?.["--invalid-fill"]
    const dark = css?.[".dark"]?.["--invalid-fill"]
    expect(light).toMatch(/oklch\(/)
    // The dark literal ships only where it differs.
    if (dark !== undefined) expect(dark).toMatch(/oklch\(/)
    expect(`${light} ${dark}`).not.toMatch(/var\(|light-dark/)
  })
})

describe("invalid", () => {
  test("Tint lays a danger wash over the fill", () => {
    expect(resolve({ invalidStyle: "tint" }).tokens).toEqual({
      "--invalid-fill":
        "light-dark(color-mix(in oklab, var(--color-danger) 6%, transparent), color-mix(in oklab, var(--color-danger) 10%, transparent))",
    })
  })

  test("a grouped field paints the wash once", async () => {
    const { stylesConfig } = (await publishables.input!()).publishable
    expect(JSON.stringify(stylesConfig.base.slots?.inputGroup)).toContain(
      "**:data-input-control:bg-none!",
    )
    for (const [style, shell] of Object.entries(FIELD_SHELLS))
      for (const slot of ["inputGroup", "input"] as const)
        expect(
          [shell.slots[slot]].flat(Infinity).join(" "),
          `${style} ${slot}`,
        ).toContain("invalid:invalid-fill")
  })

  test("Edge is Origin; Halo is as wide as the field halo", () => {
    expect(resolve({ invalidStyle: "halo" }).tokens).toEqual({
      "--invalid-ring-width": "2px",
    })
    expect(
      resolve({ invalidStyle: "halo", focusInputStyle: "edge", focusWidth: 3 })
        .tokens["--invalid-ring-width"],
    ).toBe("3px")
    expect(
      resolve({ invalidStyle: "halo", focusInputStyle: "edge" }).tokens[
        "--invalid-ring-width"
      ],
    ).toBe("2px")
  })
})

describe("disabled, cursors, control text", () => {
  test("Fade unsets every recolor token and dims", () => {
    const { tokens } = resolve({ disabledTreatment: "fade" })
    expect(tokens["--disabled-opacity"]).toBe("0.5")
    for (const name of [
      "--disabled-bg",
      "--disabled-fg",
      "--disabled-border",
      "--disabled-selected-bg",
      "--disabled-selected-fg",
      "--disabled-unselected-bg",
      "--color-primary-disabled",
    ])
      expect(tokens[name]).toBe("initial")
  })

  test("Fade skips a current crumb, which is disabled only to stop navigation", () => {
    const css = readFileSync(
      path.join(__dirname, "../../../registry/base/base.css"),
      "utf8",
    )
    const rule = /([^{}]+)\{\s*opacity: var\(--disabled-opacity, 1\)/.exec(
      css,
    )?.[1]
    expect(rule).toMatch(/:not\((\s*\[[\w-]+\],)*\s*\[data-current\],/)
  })

  test("each writes its one token", () => {
    expect(
      resolve({
        cursorControls: "default",
        cursorDisabled: "default",
        selectionUiText: "selectable",
      }).tokens,
    ).toEqual({
      "--cursor-interactive": "default",
      "--cursor-disabled": "default",
      "--user-select-ui": "auto",
    })
  })
})

/* Each shell shows focus in its own shape: a box wears the field layer, an
   indicator the layer and its doubled rule, an underline its rule alone. */
describe("field focus under every shell", () => {
  const SHAPES: Record<string, { helper: boolean; rule: boolean }> = {
    outline: { helper: true, rule: false },
    raised: { helper: true, rule: false },
    inset: { helper: true, rule: false },
    well: { helper: true, rule: false },
    filled: { helper: true, rule: false },
    indicator: { helper: true, rule: true },
    underline: { helper: false, rule: true },
  }

  test("every shell has a shape", () => {
    expect(Object.keys(SHAPES).sort()).toEqual(Object.keys(FIELD_SHELLS).sort())
  })

  for (const [style, shell] of Object.entries(FIELD_SHELLS))
    test(style, () => {
      const { helper, rule } = SHAPES[style]!
      for (const slot of ["input", "inputGroup", "textArea", "trigger"]) {
        const classes = [shell.slots[slot as keyof typeof shell.slots]]
          .flat(Infinity)
          .join(" ")
        expect(/:focus-input(\s|$)/.test(classes), `${style} ${slot}`).toBe(
          helper,
        )
        expect(
          classes.includes(":shadow-[inset_0_-1px_var(--color-border-focus)]"),
          `${style} ${slot}`,
        ).toBe(rule)
      }
      expect([shell.slots.input].flat(Infinity).join(" ")).toContain(
        "invalid:invalid-fill",
      )
    })
})

/* Where a control's own part covers its box (a check, a thumb, a selected
   pill, link text), the ring goes outside; rows and cells keep it inside. */
describe("ring placement parity", () => {
  const configOf = async (name: string) =>
    JSON.stringify((await publishables[name]!()).publishable.stylesConfig)

  test.each([
    "checkbox",
    "radio-group",
    "switch",
    "tabs",
    "segmented-control",
    "slider",
    "color-thumb",
    "color-swatch-picker",
    "link",
    "breadcrumbs",
  ])("%s: outside", async (name) => {
    expect(await configOf(name)).toContain(
      "outline-offset-(--studio-focus-outside-offset)",
    )
  })

  test.each(["tree", "table"])("%s: inside on rows and cells", async (name) => {
    expect(await configOf(name)).toContain(
      "outline-offset-(--studio-focus-inside-offset)",
    )
  })
})

describe("field focus by input look", () => {
  test("an underline is a thick edge; an indicator can't take one", () => {
    const { values } = effective(parseState({ inputStyle: "underline" }))
    expect(values.focusInputStyle).toBe("thick-edge")
    const indicator = effective(
      parseState({ inputStyle: "indicator", focusInputStyle: "thick-edge" }),
    )
    expect(indicator.values.focusInputStyle).toBe("edge")
  })
})
