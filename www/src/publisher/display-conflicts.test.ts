import { cn } from "tailwind-variants"
import { expect, test } from "vitest"

import {
  publishables,
  PUBLISHABLE_NAMES,
} from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import type { EnumParamDef } from "@/registry/types"
import { PRESETS, resolvePreset } from "@/modules/presets"

import { flatten } from "./flatten"
import { publish, selectPublishable } from "./publish"
import type { ClassValue, TvLayer } from "./types"

const DISPLAY = new Set([
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "grid",
  "inline-grid",
  "contents",
  "flow-root",
  "list-item",
  "table",
  "hidden",
])

function tokens(value: ClassValue | undefined): string[] {
  if (Array.isArray(value)) return value.flatMap(tokens)
  return typeof value === "string" ? value.split(/\s+/).filter(Boolean) : []
}

/** Variant stack → display utilities, for one slot's classes. */
function displayConflicts(classes: string[]): string[] {
  const byStack = new Map<string, Set<string>>()
  for (const token of classes) {
    let depth = 0
    let split = -1
    for (let i = 0; i < token.length; i++) {
      if (token[i] === "[") depth++
      else if (token[i] === "]") depth--
      else if (token[i] === ":" && depth === 0) split = i
    }
    const utility = token.slice(split + 1).replace(/^!|!$/g, "")
    if (!DISPLAY.has(utility)) continue
    const stack = token.slice(0, split + 1)
    byStack.set(stack, (byStack.get(stack) ?? new Set()).add(utility))
  }
  return [...byStack]
    .filter(([, set]) => set.size > 1)
    .map(([stack, set]) => `${stack}{${[...set].join(",")}}`)
}

function layerConflicts(layer: TvLayer): string[] {
  const slots = layer.slots ?? { base: layer.base }
  const out: string[] = []
  for (const [slot, value] of Object.entries(slots)) {
    const base = tokens(value as ClassValue)
    const combos: string[][] = [base]
    for (const values of Object.values(layer.variants ?? {})) {
      for (const slice of Object.values(values)) {
        const extra =
          typeof slice === "object" && slice !== null && !Array.isArray(slice)
            ? (slice as Record<string, ClassValue>)[slot]
            : layer.slots
              ? undefined
              : (slice as ClassValue)
        combos.push([...base, ...tokens(extra)])
      }
    }
    for (const classes of combos)
      for (const c of displayConflicts(classes)) out.push(`${slot}: ${c}`)
  }
  return [...new Set(out)]
}

test("no published selection ships two display utilities for one state", async () => {
  const failures: string[] = []
  for (const name of PUBLISHABLE_NAMES) {
    const load = publishables[name]
    if (!load) continue
    const { publishable } = await load()
    const params = Object.entries(publishable.meta.params ?? {}).filter(
      (entry): entry is [string, EnumParamDef] => entry[1].kind === "enum",
    )
    const selections: Record<string, string>[] = [{}]
    for (const [param, def] of params)
      for (const value of def.values) selections.push({ [param]: value })
    for (const density of DENSITIES) {
      for (const paramSelections of selections) {
        const layer = flatten({
          stylesConfig: publishable.stylesConfig,
          meta: publishable.meta,
          density,
          paramSelections,
        })
        for (const c of layerConflicts(layer))
          failures.push(`${name} ${JSON.stringify(paramSelections)}: ${c}`)
      }
    }
  }
  expect([...new Set(failures)]).toEqual([])
})

/** Class strings in a shipped file that tv's merge would shorten. */
function mergeConflicts(content: string): string[] {
  const out: string[] = []
  for (const [, text = ""] of content.matchAll(/"([^"\\\n]+)"/g)) {
    const classes = text.split(/\s+/).filter(Boolean)
    // SVG viewBoxes and paths.
    if (classes.length < 2 || /^[\d\s]+$|^M\d/.test(text)) continue
    const kept = new Set((cn(text) ?? "").split(" "))
    const dropped = classes.filter(
      (c, i) => !kept.has(c) || classes.indexOf(c) !== i,
    )
    if (dropped.length > 0) out.push(`${dropped.join(" ")} in "${text}"`)
  }
  return out
}

test.each(PRESETS.map((p) => p.id))(
  "%s: no shipped class string carries a class a later one overrides",
  async (id) => {
    const preset = resolvePreset(id)
    const failures: string[] = []
    for (const name of PUBLISHABLE_NAMES) {
      const mod = await publishables[name]?.()
      if (!mod) continue
      const { item } = publish({
        publishable: selectPublishable(mod, preset),
        preset,
      })
      for (const file of item.files ?? [])
        for (const c of mergeConflicts(file.content ?? ""))
          failures.push(`${name}: ${c}`)
    }
    expect(failures).toEqual([])
  },
)

test("a shared recipe ships only the slots each file reads", async () => {
  const preset = resolvePreset("origin")
  const shipped = async (name: string) => {
    const mod = await publishables[name]!()
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset,
    })
    return item.files?.[0]?.content ?? ""
  }
  expect(await shipped("list-box")).not.toContain("submenuIndicator")
  expect(await shipped("menu")).not.toContain("loadMore")
})
