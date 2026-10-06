import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import type { Density } from "@/registry/types"
import dialogMeta from "@/registry/ui/dialog/meta"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { ClassValue, PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import {
  ACTIONS_OPTIONS,
  BACKDROP_OPTIONS,
  SECTIONS_OPTIONS,
  STRENGTH_OPTIONS,
} from "./dialogs"
import { DEFAULT_STATE, effective, parseState } from "./index"

const DENSITIES: Density[] = ["compact", "default", "comfortable"]

async function shipped(
  name: string,
  tokens: Record<string, string> = {},
  componentParams: PublishPreset["componentParams"] = {},
) {
  const preset: PublishPreset = { density: "default", componentParams, tokens }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  return publish({ publishable: selectPublishable(mod, preset), preset }).item
}

const content = async (...args: Parameters<typeof shipped>) =>
  (await shipped(...args)).files?.[0]?.content ?? ""

const classes = (value: ClassValue | undefined): string =>
  [value]
    .flat(Infinity as 1)
    .filter(Boolean)
    .join(" ")

describe("dialogs axes", () => {
  it("Origin ships no scrim token", () => {
    expect(designSystemOf(DEFAULT_STATE).tokens).toEqual({})
  })

  it("one scrim token pair: the tint, the strength's alpha, the frost", () => {
    const tokens = (raw: Record<string, unknown>) =>
      designSystemOf(parseState(raw)).tokens
    expect(tokens({ dialogBackdrop: "scrim" })).toEqual({
      "--studio-scrim-blur": "0",
    })
    expect(
      tokens({ dialogBackdrop: "wash", dialogBackdropStrength: "heavy" }),
    ).toEqual({
      "--color-scrim": "color-mix(in oklab, var(--color-bg) 80%, transparent)",
      "--studio-scrim-blur": "0",
    })
    expect(
      tokens({ dialogFrost: "subtle", dialogBackdropStrength: "light" }),
    ).toEqual({
      "--color-scrim":
        "color-mix(in oklab, var(--color-overlay) 10%, transparent)",
      "--studio-scrim-blur": "var(--blur-xs)",
    })
  })

  it("modal and drawer ship the same scrim", async () => {
    const cases: [Record<string, string>, string[]][] = [
      [{}, ["bg-scrim", "backdrop-blur-sm"]],
      [
        { "--studio-scrim-blur": "var(--blur-xs)" },
        ["bg-scrim", "backdrop-blur-xs"],
      ],
      [{ "--studio-scrim-blur": "0" }, ["bg-scrim"]],
    ]
    for (const [tokens, scrim] of cases)
      for (const name of ["modal", "drawer"]) {
        const code = await content(name, tokens)
        const backdrop = /backdrop: "([^"]+)"/.exec(code)?.[1]?.split(" ") ?? []
        expect(
          backdrop.filter((c) => /^(bg-scrim|backdrop-blur)/.test(c)).sort(),
          `${name} ${scrim}`,
        ).toEqual([...scrim].sort())
        expect(code).not.toContain("--studio-")
      }
  })

  it("every Sections × Actions pair lands on a footer the dialog ships", () => {
    const footers = new Set<string>(dialogMeta.params.footer.values)
    for (const { value: dialogSections } of SECTIONS_OPTIONS)
      for (const { value: dialogActions } of ACTIONS_OPTIONS) {
        const ds = designSystemOf(parseState({ dialogSections, dialogActions }))
        const footer = ds.componentParams.dialog?.footer ?? ""
        expect(footers.has(footer), `${dialogSections}/${dialogActions}`).toBe(
          true,
        )
        expect(footer).not.toMatch(/^bleed-/)
      }
  })

  it("no reachable selection ships a conflicting pair in a slot", async () => {
    const reachable: Record<string, Set<string>> = {}
    for (const { value: dialogSections } of SECTIONS_OPTIONS)
      for (const { value: dialogActions } of ACTIONS_OPTIONS)
        for (const { value: dialogBackdrop } of BACKDROP_OPTIONS)
          for (const { value: dialogBackdropStrength } of STRENGTH_OPTIONS)
            for (const raw of [
              { mobileDialogs: "fullscreen", dialogPosition: "top" },
              { mobileDialogs: "sheet", drawerEdge: "detached" },
              { dialogClose: "faint", dialogEntrance: "rise" },
              { dialogClose: "filled", dialogEntrance: "drop" },
            ]) {
              const ds = designSystemOf(
                parseState({
                  dialogSections,
                  dialogActions,
                  dialogBackdrop,
                  dialogBackdropStrength,
                  ...raw,
                }),
              )
              for (const name of ["dialog", "modal", "drawer"])
                (reachable[name] ??= new Set()).add(
                  JSON.stringify(ds.componentParams[name]),
                )
            }
    for (const [name, selections] of Object.entries(reachable)) {
      const mod = await publishables[name]?.()
      if (!mod) throw new Error(`${name} is not publishable`)
      const { stylesConfig, meta } = mod.publishable
      for (const selection of selections)
        for (const density of DENSITIES) {
          const layer = flatten({
            stylesConfig,
            meta,
            density,
            paramSelections: JSON.parse(selection),
          })
          for (const [slot, value] of Object.entries(layer.slots ?? {})) {
            const list = classes(value).split(" ").filter(Boolean)
            expect(
              cn(list.join(" "))?.split(" ").sort(),
              `${name}.${slot} ${selection} ${density}`,
            ).toEqual([...list].sort())
          }
        }
    }
  })

  it("Sheet swaps the modal for a drawer below md; Center and Fullscreen don't", async () => {
    const params = (mobile: string, position = "center") => ({
      modal: { mobile, position },
    })
    const sheet = await shipped("modal", {}, params("sheet", "top"))
    expect(sheet.files?.[0]?.content).toContain("<Drawer")
    expect(JSON.stringify(sheet.registryDependencies)).toContain("drawer")
    for (const mobile of ["center", "fullscreen"]) {
      const item = await shipped("modal", {}, params(mobile))
      expect(item.files?.[0]?.content, mobile).not.toContain("<Drawer")
      expect(
        JSON.stringify(item.registryDependencies ?? []),
        mobile,
      ).not.toContain("drawer")
    }
  })

  it("Frost hides under Scrim and Wash; Bleed falls back to End under a footer edge", () => {
    const frost = effective(
      parseState({ dialogBackdrop: "wash", dialogFrost: "subtle" }),
    )
    expect(frost.values.dialogFrost).toBe("strong")
    expect(frost.explain.dialogFrost?.lock?.kind).toBe("hide")
    for (const dialogSections of ["divided", "footer-band", "header-band"])
      expect(
        effective(parseState({ dialogSections, dialogActions: "bleed" })).values
          .dialogActions,
        dialogSections,
      ).toBe("end")
    expect(
      effective(parseState({ dialogActions: "bleed" })).values.dialogActions,
    ).toBe("bleed")
  })
})
