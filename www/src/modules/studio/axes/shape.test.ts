import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_EFFECTIVE, DEFAULT_STATE, DEFAULTS, parseState } from "./index"
import {
  activeCharacter,
  SHAPE_CHARACTERS,
  SHAPE_RUNGS,
  SHAPE_SCHEMA,
  shapeVars,
} from "./shape"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  designSystemOf(parseState({ ...overrides }))

const vector = (id: string) =>
  SHAPE_CHARACTERS.find((character) => character.id === id)!.vector

describe("shape axis", () => {
  test("defaults emit nothing", () => {
    expect(resolve({}).tokens).toEqual({})
    expect(activeCharacter(DEFAULT_STATE)).toBe("standard")
  })

  test("roles.css declares the default rungs", () => {
    const declared = Object.fromEntries(
      Object.entries(STYLE_VAR_DEFAULTS).filter(([name]) =>
        name.startsWith("--studio-radius-"),
      ),
    )
    expect(declared).toEqual(shapeVars(DEFAULT_EFFECTIVE))
  })

  test("the base lands on --radius in rem", () => {
    expect(resolve({ radiusPx: 12 }).tokens).toEqual({ "--radius": "0.75rem" })
  })

  test("a character retargets only the roles it moves", () => {
    expect(resolve(vector("round")).tokens).toEqual({
      "--studio-radius-control": "var(--radius-3xl)",
      "--studio-radius-item": "var(--radius-xl)",
      "--studio-radius-surface": "var(--radius-2xl)",
      "--studio-radius-panel": "var(--radius-3xl)",
      "--studio-radius-card": "var(--radius-2xl)",
      "--studio-radius-control-sm": "var(--radius-2xl)",
      "--studio-radius-field": "var(--radius-2xl)",
      "--studio-radius-container": "var(--radius-2xl)",
      "--studio-radius-inline-item": "var(--radius-xl)",
    })
  })

  test("square points every role at 0 — the publisher drops the class", () => {
    expect(Object.values(resolve(vector("square")).tokens)).toEqual(
      Array(11).fill("0"),
    )
  })

  test("auto cards sit one rung below panels", () => {
    expect(activeCharacter(parseState({ rolePanel: "2xl" }))).toBeUndefined()
    expect(resolve({ rolePanel: "2xl" }).tokens).toEqual({
      "--studio-radius-panel": "var(--radius-2xl)",
      "--studio-radius-card": "var(--radius-xl)",
    })
  })

  test("smaller controls step one rung down, never to square", () => {
    expect(resolve({ roleControl: "lg" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "var(--radius-md)",
    })
    expect(resolve({ roleControl: "xs" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "var(--radius-xs)",
      "--studio-radius-detail": "var(--radius-xs)",
    })
    expect(resolve({ roleControl: "full" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "var(--radius-full)",
      "--studio-radius-field": "var(--radius-lg)",
    })
  })

  test(
    "derived rungs hold their rules for every role combination",
    { timeout: 30_000 },
    () => {
      const rank = (token: string) =>
        SHAPE_RUNGS.findIndex((rung) => rung.token === token)
      const values = (key: keyof typeof SHAPE_SCHEMA) => {
        const axis = SHAPE_SCHEMA[key].value
        return axis.type === "enum" ? axis.values : []
      }
      const pill = "var(--radius-full)"
      for (const roleControl of values("roleControl"))
        for (const roleSurface of values("roleSurface"))
          for (const rolePanel of values("rolePanel"))
            for (const roleItem of values("roleItem"))
              for (const roleCard of values("roleCard")) {
                const vars = shapeVars({
                  ...DEFAULT_EFFECTIVE,
                  ...{
                    roleControl,
                    roleSurface,
                    rolePanel,
                    roleItem,
                    roleCard,
                  },
                })
                const small = vars["--studio-radius-control-sm"]!
                if (roleControl !== "none") expect(small).not.toBe("0")
                expect(
                  rank(vars["--studio-radius-detail"]!),
                ).toBeLessThanOrEqual(rank(small))
                for (const block of ["field", "container", "inline-item"])
                  expect(vars[`--studio-radius-${block}`]).not.toBe(pill)
              }
    },
  )

  test("control stroke writes the edge width; Regular writes nothing", () => {
    expect(resolve({ controlStroke: "bold" }).tokens).toEqual({
      "--studio-control-stroke": "2px",
    })
    expect(STYLE_VAR_DEFAULTS["--studio-control-stroke"]).toBe("1px")
  })

  test("a border focus adds only what the stroke doesn't draw", () => {
    const focus = { focusInputStyle: "border", focusInputWeight: "thick" }
    expect(resolve(focus).tokens["--focus-input-edge"]).toBe("1px")
    expect(
      resolve({ ...focus, controlStroke: "bold" }).tokens["--focus-input-edge"],
    ).toBe("0px")
  })

  test("tracks stay round, or follow the detail rung", () => {
    expect(resolve({ tracks: "follow" }).tokens).toEqual({
      "--studio-radius-track": "var(--radius-sm)",
    })
    expect(resolve({ ...vector("square"), tracks: "follow" }).tokens).toEqual(
      expect.objectContaining({ "--studio-radius-track": "0" }),
    )
    expect(resolve(vector("square")).tokens).not.toHaveProperty(
      "--studio-radius-track",
    )
  })

  test("states saved before cards were a role keep their character", () => {
    expect(
      activeCharacter(
        parseState({
          roleControl: "3xl",
          roleItem: "auto",
          roleSurface: "2xl",
          rolePanel: "3xl",
        }),
      ),
    ).toBe("round")
    // Retired characters (Crisp, Soft, Pill) keep their roles and read Custom.
    const pill = parseState({ roleControl: "full", roleSurface: "lg" })
    expect(activeCharacter(pill)).toBeUndefined()
    expect(pill.roleControl).toBe("full")
  })
})

/* Every item shipped under every character: the radius classes the publisher
   rewrites (and drops at 0) must come out whole. */
describe("shipped shape", () => {
  const balanced = (token: string) => {
    let depth = 0
    for (const char of token) {
      if (char === "[" || char === "(") depth++
      if (char === "]" || char === ")") depth--
      if (depth < 0) return false
    }
    return depth === 0
  }
  const presetOf = (state: Partial<typeof DEFAULTS>): PublishPreset => {
    const ds = designSystemOf(parseState(state))
    return {
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      color: ds.color,
      icons: ds.icons,
    }
  }
  const shipped = async (name: string, preset: PublishPreset) => {
    const { item } = publish({
      publishable: selectPublishable(await publishables[name]!(), preset),
      preset,
    })
    return (item.files ?? []).map((f) => f.content).join("\n")
  }

  test.each([
    ...SHAPE_CHARACTERS.map((c) => [c.id, vector(c.id)] as const),
    ["bold stroke", { controlStroke: "bold" }] as const,
  ])("%s ships whole classes and no studio vars", async (_, state) => {
    const preset = presetOf(state)
    const broken: string[] = []
    for (const name of Object.keys(publishables)) {
      const code = await shipped(name, preset)
      for (const [, literal] of code.matchAll(/"([^"\n]*)"/g))
        for (const token of literal!.split(/\s+/))
          if (!balanced(token)) broken.push(`${name}: ${token}`)
      if (code.includes("--studio-")) broken.push(`${name}: --studio- var`)
    }
    expect(broken).toEqual([])
  })

  test("each stroke ships as Tailwind spells it", async () => {
    const at = async (controlStroke: string) => ({
      input: await shipped("input", presetOf({ controlStroke })),
      otp: await shipped("otp-field", presetOf({ controlStroke })),
    })
    const regular = await at("regular")
    expect(regular.input).toContain("border px-(--edge-to-text)")
    expect(regular.input).toContain("calc(var(--addon-button-inset)-1px)")
    expect(regular.otp).toContain("-space-x-px")
    expect(regular.input).not.toContain("length:")
    const bold = await at("bold")
    expect(bold.input).toContain("border-2 px-(--edge-to-text)")
    expect(bold.otp).toContain("-space-x-[2px]")
  })

  test("bold reaches every control edge and seam", async () => {
    const bold = (name: string, state: Partial<typeof DEFAULTS> = {}) =>
      shipped(name, presetOf({ controlStroke: "bold", ...state }))
    for (const name of ["checkbox", "radio-group", "button", "toggle-button"])
      expect(await bold(name), name).toContain("border-2 border-border-control")
    for (const name of ["group", "toggle-button-group"]) {
      const divided = await bold(name, { groupSeparator: "divider" })
      expect(divided, name).toContain("-space-x-[2px]")
      expect(divided, name).toContain("before:w-[2px]")
    }
    expect(await bold("toggle-button-group")).toContain("-space-y-[2px]")
    const outline = await bold("segmented-control", {
      segmentedTrack: "outline",
    })
    expect(outline).toContain("border-2 border-border p-[1px]")
    expect(
      await bold("segmented-control", { segmentedSelected: "raised" }),
    ).toContain("ring-2 ring-border-control")
  })
})
