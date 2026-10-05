import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"
import {
  activeCharacter,
  SHAPE_CHARACTERS,
  SHAPE_RUNGS,
  SHAPE_SCHEMA,
  shapeVars,
} from "./shape"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem(parseState({ ...overrides }))

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
    expect(declared).toEqual(shapeVars(DEFAULT_STATE))
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
        return axis.type === "enum" ? axis.options.map((o) => o.value) : []
      }
      const pill = "var(--radius-full)"
      for (const roleControl of values("roleControl"))
        for (const roleSurface of values("roleSurface"))
          for (const rolePanel of values("rolePanel"))
            for (const roleItem of values("roleItem"))
              for (const roleCard of values("roleCard")) {
                const vars = shapeVars({
                  ...DEFAULT_STATE,
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
  test.each(SHAPE_CHARACTERS.map((c) => c.id))(
    "%s ships whole radius classes and no studio vars",
    async (id) => {
      const ds = resolveDesignSystem(parseState(vector(id)))
      const preset: PublishPreset = {
        density: ds.density,
        componentParams: ds.componentParams,
        tokens: ds.tokens,
        color: ds.color,
        icons: ds.icons,
      }
      const broken: string[] = []
      for (const [name, load] of Object.entries(publishables)) {
        const { item } = publish({
          publishable: selectPublishable(await load(), preset),
          preset,
        })
        const code = (item.files ?? []).map((f) => f.content).join("\n")
        for (const [, literal] of code.matchAll(/"([^"\n]*)"/g))
          for (const token of literal!.split(/\s+/))
            if (!balanced(token)) broken.push(`${name}: ${token}`)
        if (code.includes("--studio-")) broken.push(`${name}: --studio- var`)
      }
      expect(broken).toEqual([])
    },
  )
})
