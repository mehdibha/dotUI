import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { PRESETS } from "@/modules/presets/catalog"

import { DEFAULTS } from "./axes"
import {
  arrive,
  docQuery,
  docSearch,
  handOver,
  isDirty,
  ownerOf,
  parseStored,
  readDoc,
  resetSearch,
  storedDesign,
} from "./doc"
import { decode, encodeDesign } from "./preset/codec"

function encodeRaw(payload: unknown): string {
  const binary = String.fromCharCode(
    ...deflateRaw(JSON.stringify(payload), { level: 9 }),
  )
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** A v4 blob of `diff` and the state it decodes to. */
function legacy(diff: object) {
  const blob = encodeRaw({ v: 4, s: diff })
  const decoded = decode({ preset: blob })
  if (!decoded.ok) throw new Error(decoded.reason)
  return { blob, ...decoded }
}

const ORIGIN_1 = { id: "origin", rev: 1 }
const LINEAR = PRESETS.find((p) => p.id === "linear") as (typeof PRESETS)[0]
const LINEAR_1 = { id: "linear", rev: 1 }
const edited = docSearch({ ...LINEAR.state, radiusPx: 4 }, LINEAR_1)

describe("studio document", () => {
  it("writes a pristine built-in by its id and pins edits to its revision", () => {
    expect(docSearch(LINEAR.state, LINEAR_1)).toEqual({ preset: "linear" })
    expect(edited).toEqual({
      preset: "linear@1",
      d: `v5.${encodeRaw({ radiusPx: 4 })}`,
    })
    const doc = readDoc(edited)
    expect(doc).toMatchObject({
      base: LINEAR_1,
      baseName: "Linear",
      baseState: LINEAR.state,
      modified: true,
    })
    expect(readDoc({ preset: "linear" }).modified).toBe(false)
  })

  it("stores params as one query and reads blobs back as legacy", () => {
    const search = { ...edited, name: "Acme Co", system: "k3f9" }
    const query = docQuery(search)
    expect(query).toBe(`preset=linear@1&d=${edited.d}&name=Acme+Co&system=k3f9`)
    expect(parseStored(query)).toEqual(search)
    expect(parseStored("q1YqUbI")).toEqual({ preset: "q1YqUbI" })
  })

  it("resets to the base revision, keeping the saved system", () => {
    const doc = readDoc({ ...edited, name: "Acme", system: "k3f9" })
    expect(resetSearch(doc)).toEqual({ preset: "linear", system: "k3f9" })
  })

  it("is dirty past its saved record, else past its base", () => {
    const doc = readDoc(edited)
    expect(isDirty(doc)).toBe(true)
    expect(isDirty(readDoc({ preset: "linear" }))).toBe(false)
    expect(isDirty(doc, storedDesign(docQuery(edited)))).toBe(false)
    expect(isDirty(doc, storedDesign("preset=linear"))).toBe(true)
  })

  it("reads a saved record's design canonically, blobs included", () => {
    const { blob, state } = legacy({ brand: "#ef4444" })
    expect(storedDesign(blob)).toEqual(docSearch(state, ORIGIN_1))
    expect(storedDesign("preset=linear@1")).toEqual({ preset: "linear" })
    expect(storedDesign("preset=nope")).toBeUndefined()
  })
})

describe("arriving at /studio", () => {
  it("renders a canonical document as is", () => {
    expect(arrive({ preset: "linear" })).toEqual({})
    expect(arrive({ ...edited, name: "Acme" })).toEqual({})
  })

  it("opens Origin on a bare /studio with nothing stored", () => {
    expect(arrive({})).toEqual({ redirect: { preset: "origin" } })
  })

  it("reopens the working document on a bare /studio", () => {
    const working = docQuery({ ...edited, system: "k3f9" })
    expect(arrive({}, working)).toEqual({
      redirect: { ...edited, system: "k3f9" },
    })
    // A name or system alone is still a bare /studio.
    expect(arrive({ name: "Acme" }, working).redirect).toEqual({
      ...edited,
      system: "k3f9",
    })
  })

  it("canonicalizes a legacy working document", () => {
    const { blob, state } = legacy({ brand: "#ef4444" })
    expect(arrive({}, blob).redirect).toEqual(docSearch(state, ORIGIN_1))
  })

  it("rewrites a legacy link and names what it dropped", () => {
    const { blob, state, dropped } = legacy({ brand: "#ef4444", nope: 1 })
    expect(dropped).toContain("nope")
    expect(arrive({ preset: blob })).toEqual({
      redirect: docSearch(state, ORIGIN_1),
      notice: { kind: "dropped", settings: dropped },
    })
  })

  it("doesn't count a legacy blob's code options as dropped", () => {
    const blob = encodeRaw({ v: 4, s: {}, o: { classArrays: "yes" } })
    expect(decode({ preset: blob })).toMatchObject({
      dropped: ["o.classArrays"],
    })
    expect(arrive({ preset: blob }).notice).toBeUndefined()
  })

  it("drops a pinned revision that is the latest and a no-op diff", () => {
    expect(arrive({ preset: "linear@1" })).toEqual({
      redirect: { preset: "linear" },
    })
    const d = `v5.${encodeRaw({ radiusPx: 4, brand: LINEAR.state.brand })}`
    expect(arrive({ preset: "linear@1", d })).toEqual({ redirect: edited })
  })

  it("opens the base preset when a code is broken", () => {
    expect(arrive({ preset: "linear@1", d: "v5.q1Yq" })).toEqual({
      redirect: { preset: "linear" },
      notice: { kind: "failed", reason: "corrupt" },
    })
    expect(arrive({ preset: "linear@1", d: `v9.${encodeRaw({})}` })).toEqual({
      redirect: { preset: "linear" },
      notice: { kind: "failed", reason: "newer-version" },
    })
    expect(arrive({ preset: "nope" })).toEqual({
      redirect: { preset: "origin" },
      notice: { kind: "failed", reason: "unknown-preset" },
    })
  })

  it("cleans the name and system params", () => {
    expect(
      arrive({ preset: "linear", name: "  Acme   Co ", system: "bad id!" }),
    ).toEqual({ redirect: { preset: "linear", name: "Acme Co" } })
    const long = "x".repeat(80)
    expect(arrive({ preset: "linear", name: long }).redirect?.name).toBe(
      "x".repeat(64),
    )
  })
})

describe("ownership", () => {
  it("opens a shared link unowned and keeps that call", () => {
    const shared = { ...edited, name: "Shared" }
    expect(ownerOf(shared, { saved: false })).toBe(false)
    // The working store changing later doesn't adopt it.
    expect(ownerOf(shared, { working: docQuery(shared), saved: false })).toBe(
      false,
    )
  })

  it("owns the working document, a saved system and a plain built-in", () => {
    const working = { ...edited, d: `v5.${encodeRaw({ radiusPx: 6 })}` }
    expect(ownerOf(working, { working: docQuery(working), saved: false })).toBe(
      true,
    )
    const saved = { ...edited, system: "mine" }
    expect(ownerOf(saved, { saved: true })).toBe(true)
    expect(ownerOf({ preset: "vercel" }, { saved: false })).toBe(true)
  })

  it("carries ownership across edits unless a document is adopted", () => {
    const from = { preset: "stripe@1", d: `v5.${encodeRaw({ radiusPx: 2 })}` }
    const next = { ...encodeDesign({ ...DEFAULTS, radiusPx: 3 }, LINEAR_1) }
    expect(handOver(from, false, next, false)).toBe(false)
    expect(ownerOf(next, { working: docQuery(next), saved: false })).toBe(false)
    const adopted = { preset: "airbnb" }
    expect(handOver(next, false, adopted, true)).toBe(true)
    expect(ownerOf(adopted, { saved: false })).toBe(true)
    // The document it left keeps its call while the URL catches up.
    expect(ownerOf(next, { saved: false })).toBe(false)
    const edit = { preset: "airbnb@1", d: `v5.${encodeRaw({ radiusPx: 5 })}` }
    expect(handOver(adopted, true, edit, false)).toBe(true)
  })
})
