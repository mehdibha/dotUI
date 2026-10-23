import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import { FIELD_SHELLS } from "@/registry/ui/input/styles"
import { mergePresetCssFields } from "@/publisher/emit-theme"

import { designSystemOf } from "../resolve"
import { DEFAULTS, parseState } from "./index"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  designSystemOf(parseState({ ...overrides }))

describe("focus ring", () => {
  test("Origin emits no tokens", () => {
    const system = resolve({})
    expect(system.tokens).toEqual({})
    expect(system.color).toEqual(DEFAULT_COLOR_CONFIG)
  })

  test("Halo sits flush, Auto gives it 3px at Soft", () => {
    expect(resolve({ focusStyle: "halo" }).tokens).toEqual({
      "--focus-ring-width": "3px",
      "--focus-ring-color":
        "color-mix(in oklab, var(--color-border-focus) 50%, transparent)",
      "--focus-ring-offset": "0px",
      "--focus-ring-outside-offset": "0px",
    })
  })

  test("Inset draws inside the edge over a bg line", () => {
    expect(resolve({ focusStyle: "inset" }).tokens).toEqual({
      "--focus-ring-inset": "inset",
      "--focus-ring-offset": "0px",
      "--focus-ring-inner": "calc(var(--focus-ring-width) + 1px)",
    })
  })

  test("strength and width override Auto", () => {
    expect(
      resolve({ focusStyle: "halo", focusStrength: "faint", focusWidth: 4 })
        .tokens,
    ).toMatchObject({
      "--focus-ring-width": "4px",
      "--focus-ring-color":
        "color-mix(in oklab, var(--color-border-focus) 30%, transparent)",
    })
    expect(resolve({ focusWidth: 1 }).tokens).toEqual({
      "--focus-ring-width": "1px",
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
  test("Halo: Thin is Origin, Thick a 4px halo", () => {
    expect(resolve({ focusInputWeight: "thick" }).tokens).toEqual({
      "--focus-input-width": "4px",
    })
  })

  test("Ring reuses the ring tokens, inside under Inset", () => {
    expect(resolve({ focusInputStyle: "ring" }).tokens).toEqual({
      "--focus-input-width": "var(--focus-ring-width)",
      "--focus-input-offset": "var(--focus-ring-offset)",
      "--focus-input-color": "var(--focus-ring-color)",
    })
    expect(
      resolve({ focusInputStyle: "ring", focusStyle: "inset" }).tokens,
    ).toMatchObject({ "--focus-input-inset": "inset" })
  })

  test("Border recolors the edge; Thick adds 1px inside", () => {
    const thin = resolve({ focusInputStyle: "border" }).tokens
    expect(thin).toMatchObject({
      "--focus-input-width": "0px",
      "--focus-input-edge": "0px",
      "--focus-invalid-color": "var(--color-fg-danger)",
    })
    expect(
      resolve({ focusInputStyle: "border", focusInputWeight: "thick" }).tokens[
        "--focus-input-edge"
      ],
    ).toBe("1px")
  })
})

describe("field focus ink", () => {
  test("Same as focus ink writes nothing; Neutral re-points the field pair", () => {
    expect(resolve({ focusInputColor: "same" }).tokens).toEqual({})
    expect(resolve({ focusInputColor: "neutral" }).tokens).toEqual({
      "--focus-input-border": "var(--neutral-700)",
      "--focus-input-color": "var(--neutral-300)",
    })
  })

  test("Border paints its layer with the field's edge", () => {
    expect(
      resolve({ focusInputColor: "neutral", focusInputStyle: "border" }).tokens,
    ).toMatchObject({
      "--focus-input-border": "var(--neutral-700)",
      "--focus-input-color": "var(--focus-input-border)",
    })
  })

  test("a neutral ring already paints fields neutral", () => {
    expect(
      resolve({ focusColor: "neutral", focusInputColor: "neutral" }).tokens,
    ).toEqual({})
  })

  test("on a Strong edge a neutral field focuses in the text ink", () => {
    const edge = (state: Partial<typeof DEFAULTS>) =>
      resolve(state).tokens["--focus-input-border"]
    // The neutral ink is the Strong edge's own step (Airbnb, Spotify).
    expect(
      edge({
        focusColor: "neutral",
        controlEdge: "strong",
        focusInputStyle: "border",
      }),
    ).toBe("var(--neutral-950)")
    expect(edge({ focusInputColor: "neutral", controlEdge: "strong" })).toBe(
      "var(--neutral-950)",
    )
    // An accent ink already differs from the edge.
    expect(edge({ controlEdge: "strong" })).toBeUndefined()
  })

  test("under Ring the field wears the ring's ink", () => {
    expect(
      resolve({ focusInputStyle: "ring", focusInputColor: "neutral" }).tokens,
    ).not.toHaveProperty("--focus-input-border")
  })
})

describe("per-mode inks ship as literals", () => {
  test.each([
    ["--focus-input-border", { focusInputColor: "neutral" }],
    ["--invalid-fill", { invalidStyle: "tint" }],
  ] as const)("%s", (name, state) => {
    const { css } = mergePresetCssFields({}, resolve(state))
    const light = css?.[":root"]?.[name]
    const dark = css?.[".dark"]?.[name]
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
      resolve({ invalidStyle: "halo", focusInputWeight: "thick" }).tokens[
        "--invalid-ring-width"
      ],
    ).toBe("4px")
    expect(
      resolve({ invalidStyle: "halo", focusInputStyle: "border" }).tokens[
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

/* Every Field focus value must show under every Inputs style: evaluate each
   shell's focus layer from base.css with the tokens the value writes. */
describe("field focus under every shell", () => {
  const css = readFileSync(
    path.join(__dirname, "../../../registry/base/base.css"),
    "utf8",
  )
  const theme: Record<string, string> = {}
  for (const block of css.matchAll(/(?:@theme|^:root) \{([^}]*)\}/gm))
    for (const [, name, value] of block[1]!.matchAll(/(--[\w-]+):\s*([^;]+);/g))
      theme[name!] = value!.trim()

  const layer = (utility: string) => {
    const match = new RegExp(
      `@utility ${utility} \\{\\s*--tw-ring-shadow:([^;]+);`,
    ).exec(css)
    if (!match) throw new Error(`no @utility ${utility}`)
    return match[1]!.replace(/\s+/g, " ").trim()
  }

  /** Innermost `var()` first, until none is left. */
  const substitute = (value: string, vars: Record<string, string>) => {
    const inner = /var\((--[\w-]+)(?:,([^()]*))?\)/
    let out = value
    for (let match = inner.exec(out); match; match = inner.exec(out))
      out = out.replace(match[0], vars[match[1]!] ?? match[2] ?? "")
    return out
  }

  const VALUES = [
    { focusInputStyle: "ring" },
    { focusInputStyle: "halo" },
    { focusInputStyle: "halo", focusInputWeight: "thick" },
    { focusInputStyle: "border" },
    { focusInputStyle: "border", focusInputWeight: "thick" },
  ]

  /* Each shell draws in its own shape: a box around itself, Indicator its
     bottom rule (and a box halo), Underline everything under its rule. */
  const SHAPES: Record<string, { focus: string; invalid: string }> = {
    outline: { focus: "focus-input", invalid: "invalid-ring" },
    raised: { focus: "focus-input", invalid: "invalid-ring" },
    inset: { focus: "focus-input", invalid: "invalid-ring" },
    well: { focus: "focus-input", invalid: "invalid-ring" },
    filled: { focus: "focus-input", invalid: "invalid-ring" },
    indicator: { focus: "focus-input-indicator", invalid: "invalid-ring" },
    underline: {
      focus: "focus-input-underline",
      invalid: "invalid-ring-underline",
    },
  }

  test("every shell has a shape", () => {
    expect(Object.keys(SHAPES).sort()).toEqual(Object.keys(FIELD_SHELLS).sort())
  })

  for (const [style, shell] of Object.entries(FIELD_SHELLS))
    test(style, () => {
      const { focus, invalid } = SHAPES[style]!
      for (const slot of ["input", "inputGroup", "textArea", "trigger"]) {
        const classes = [shell.slots[slot as keyof typeof shell.slots]]
          .flat(Infinity)
          .join(" ")
        const used = (pattern: RegExp) =>
          new Set([...classes.matchAll(pattern)].map((match) => match[1]))
        expect(
          used(/:(focus-input[\w-]*)(?=\s|$)/g),
          `${style} ${slot}`,
        ).toEqual(new Set([focus]))
        expect(
          used(/:(invalid-ring[\w-]*)(?=\s|$)/g),
          `${style} ${slot}`,
        ).toEqual(new Set([invalid]))
      }

      const classes = [shell.slots.input].flat(Infinity).join(" ")
      expect(classes).toContain(
        "focus:not-invalid:border-(--focus-input-border)",
      )
      expect(classes).toContain("invalid:invalid-fill")
      const drawn = VALUES.map((value) =>
        substitute(layer(focus), { ...theme, ...resolve(value).tokens }),
      )
      expect(new Set(drawn).size, style).toBe(VALUES.length)
    })
})

/* Where a control's own part covers its box (a check, a thumb, a selected
   pill, link text), the ring goes outside; rows and cells keep it inside. */
describe("ring placement parity", () => {
  const ringsOf = async (name: string) => {
    const { stylesConfig } = (await publishables[name]!()).publishable
    return new Set(
      JSON.stringify(stylesConfig).match(/[\w:-]*focus-ring[\w-]*/g),
    )
  }

  test.each(["checkbox", "radio-group", "switch"])(
    "%s: bare outside, labelled card ring",
    async (name) => {
      expect(await ringsOf(name)).toEqual(
        new Set([
          "focus-visible:not-has-data-label:focus-ring-outside",
          "focus-visible:has-data-label:focus-ring",
        ]),
      )
    },
  )

  test.each([
    "tabs",
    "segmented-control",
    "slider",
    "color-thumb",
    "color-swatch-picker",
    "link",
    "breadcrumbs",
  ])("%s: outside", async (name) => {
    for (const ring of await ringsOf(name))
      expect(ring, name).toMatch(/:focus-ring-outside$/)
  })

  test.each(["tree", "table"])("%s: inside on rows and cells", async (name) => {
    const rings = [...(await ringsOf(name))]
    expect(rings.some((ring) => ring.endsWith(":focus-ring-inside"))).toBe(true)
  })
})
