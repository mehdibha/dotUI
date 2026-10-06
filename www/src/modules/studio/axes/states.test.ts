import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import { FIELD_SHELLS } from "@/registry/ui/input/styles"

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
      "--focus-invalid-color": "var(--color-border-danger)",
    })
    expect(
      resolve({ focusInputStyle: "border", focusInputWeight: "thick" }).tokens[
        "--focus-input-edge"
      ],
    ).toBe("1px")
  })
})

describe("invalid", () => {
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
  for (const block of css.matchAll(/@theme \{([^}]*)\}/g))
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

  for (const [style, shell] of Object.entries(FIELD_SHELLS))
    test(style, () => {
      const classes = [shell.slots.input].flat(Infinity).join(" ")
      expect(classes).toContain("focus:not-invalid:border-border-focus")
      const utility = /(?:^|\s)focus:(focus-input[\w-]*)/.exec(classes)?.[1]
      expect(utility, `${style} wears a focus layer`).toBeDefined()
      const drawn = VALUES.map((value) =>
        substitute(layer(utility!), {
          ...theme,
          ...resolve(value).tokens,
        }),
      )
      expect(new Set(drawn).size, style).toBe(VALUES.length)
    })
})
