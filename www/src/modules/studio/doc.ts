/* The studio document: the design system a tab edits, read from its URL —

     preset=<id>[@<rev>]  the built-in it builds on (see preset/codec.ts)
     d=v5.<payload>       its edits on that revision
     name=<text>          a display name, carried by shared links
     system=<id>          the saved system this tab edits, if this browser has it

   The studio only renders canonical URLs: an arrival that isn't one (a bare
   /studio, a legacy blob, a stale or broken code) redirects first. */

import { BUILT_INS } from "@/modules/presets/built-ins"

import type { StudioState } from "./axes"
import {
  decode,
  encodeDesign,
  isRef,
  ORIGIN_ID,
  pinRef,
  stateOf,
} from "./preset/codec"
import type { DecodeResult, PresetRef } from "./preset/codec"

export interface DocSearch {
  preset?: string
  d?: string
  name?: string
  system?: string
}

export interface StudioDoc {
  base: PresetRef
  /** The base preset's name. */
  baseName: string
  /** The base revision's state: what Reset returns to. */
  baseState: StudioState
  state: StudioState
  /** Edited past the base. */
  modified: boolean
  name?: string
  system?: string
}

/** What an arrival lost on its way to a canonical URL. */
export type Notice =
  | { kind: "dropped"; settings: string[] }
  | {
      kind: "failed"
      reason: Extract<DecodeResult, { ok: false }>["reason"]
    }

const KEYS = ["preset", "d", "name", "system"] as const
const SYSTEM_ID = /^[\w-]{1,64}$/

export const cleanName = (name?: string) =>
  name?.replace(/\s+/g, " ").trim().slice(0, 64) || undefined
export const cleanSystem = (id?: string) =>
  id && SYSTEM_ID.test(id) ? id : undefined

/** The document params as one string, in a fixed order, spelled like the
 *  address bar (see router.tsx). */
export function docQuery(search: DocSearch): string {
  const params = new URLSearchParams()
  for (const key of KEYS) {
    const value = search[key]
    if (value) params.set(key, value)
  }
  return params.toString().replaceAll("%40", "@")
}

/** Just the design: what dirty checks compare. */
export const designQuery = ({ preset, d }: DocSearch) => docQuery({ preset, d })

/** `search` as this browser stores it: rev-pinned, so a stored document never
 *  follows a newer revision. Only the URL names the latest by its bare id. */
export const storedQuery = (search: DocSearch) =>
  docQuery(
    search.preset ? { ...search, preset: pinRef(search.preset) } : search,
  )

/** A stored string back into params; anything but a query is a legacy blob.
 *  A bare id was stored before rev 2 existed, so it reads as rev 1. */
export function parseStored(value: string): DocSearch {
  if (!value.startsWith("preset=")) return { preset: value }
  const params = new URLSearchParams(value)
  const search: DocSearch = {}
  for (const key of KEYS) search[key] = params.get(key) || undefined
  if (search.preset) search.preset = pinRef(search.preset, 1)
  return search
}

/** The canonical params for `state` on `base`. */
export function docSearch(
  state: StudioState,
  base: PresetRef,
  { name, system }: Pick<DocSearch, "name" | "system"> = {},
): DocSearch {
  const search: DocSearch = encodeDesign(state, base)
  if (name) search.name = name
  if (system) search.system = system
  return search
}

const nameOf = (id: string) =>
  BUILT_INS.find((preset) => preset.id === id)?.name ?? id

/** A legacy state that is exactly a built-in revision reads as that one. */
function rebase(state: StudioState, base: PresetRef): PresetRef {
  for (const { id, revisions } of BUILT_INS)
    for (const { rev } of [...revisions].reverse()) {
      const ref = { id, rev }
      if (!encodeDesign(state, ref).d) return ref
    }
  return base
}

type Read =
  | { ok: true; doc: StudioDoc; canonical: DocSearch; dropped: string[] }
  | Extract<DecodeResult, { ok: false }>

const reads = new Map<string, Read>()

/** Decodes `search` into a document, and says what its canonical URL is. */
export function readSearch(search: DocSearch): Read {
  const key = docQuery(search)
  let read = reads.get(key)
  if (read) return read
  const decoded = decode({ preset: search.preset, d: search.d })
  if (!decoded.ok) read = decoded
  else {
    const legacy = search.preset !== undefined && !isRef(search.preset)
    const base = legacy ? rebase(decoded.state, decoded.base) : decoded.base
    const name = cleanName(search.name)
    const system = cleanSystem(search.system)
    const canonical = docSearch(decoded.state, base, { name, system })
    read = {
      ok: true,
      doc: {
        base,
        baseName: nameOf(base.id),
        baseState: stateOf(base),
        state: decoded.state,
        modified: canonical.d !== undefined,
        name,
        system,
      },
      canonical,
      // A legacy blob's code options aren't design: this browser keeps its own.
      dropped: decoded.dropped.filter((key) => !/^o(\.|$)/.test(key)),
    }
  }
  if (reads.size >= 200) reads.delete(reads.keys().next().value as string)
  reads.set(key, read)
  return read
}

const ORIGIN_SEARCH: DocSearch = { preset: ORIGIN_ID }

/** The document at a canonical `search`; Origin if it isn't readable. */
export function readDoc(search: DocSearch): StudioDoc {
  const read = readSearch(search)
  if (read.ok) return read.doc
  return (readSearch(ORIGIN_SEARCH) as Extract<Read, { ok: true }>).doc
}

/** Where an arrival at `search` lands: nowhere else when it is canonical.
 *  A bare /studio reopens `working`, the stored working document. */
export function arrive(
  search: DocSearch,
  working?: string,
): { redirect?: DocSearch; notice?: Notice } {
  const bare = !search.preset && !search.d
  const target = bare
    ? working
      ? parseStored(working)
      : ORIGIN_SEARCH
    : search
  const read = readSearch(target)
  if (!read.ok) {
    const fallback = target.preset?.split("@")[0]
    const base =
      fallback && isRef(fallback) && read.reason !== "unknown-preset"
        ? readSearch({ preset: fallback })
        : undefined
    return {
      redirect: base?.ok ? base.canonical : ORIGIN_SEARCH,
      notice: { kind: "failed", reason: read.reason },
    }
  }
  const notice: Notice | undefined =
    read.dropped.length > 0
      ? { kind: "dropped", settings: read.dropped }
      : undefined
  if (!bare && docQuery(read.canonical) === docQuery(search)) return {}
  return { redirect: read.canonical, notice }
}

/** Where Reset goes: the base revision, still on the same saved system. */
export const resetSearch = (doc: StudioDoc): DocSearch =>
  docSearch(doc.baseState, doc.base, { system: doc.system })

/** A stored string's design, canonical; `undefined` once it no longer reads. */
export function storedDesign(value: string): DocSearch | undefined {
  const read = readSearch(parseStored(value))
  if (!read.ok) return undefined
  const { preset, d } = read.canonical
  return d ? { preset, d } : { preset }
}

/** Unsaved work: edits past the saved record's design, else past the base. */
export const isDirty = (doc: StudioDoc, saved?: DocSearch) =>
  saved === undefined
    ? doc.modified
    : designQuery(docSearch(doc.state, doc.base)) !== designQuery(saved)

/* Ownership: a tab edits its own document (a saved system of this browser,
   the working document, or a plain built-in) or views a shared link, which
   never autosaves. Calls are per tab and frozen on first read, so a write to
   the working store (here or in another tab) can't flip them. */
const owners = new Map<string, boolean>()

function remember(key: string, owned: boolean) {
  owners.delete(key)
  owners.set(key, owned)
  if (owners.size > 100) owners.delete(owners.keys().next().value as string)
}

/** Whether this tab owns the document at `search`. */
export function ownerOf(
  search: DocSearch,
  { working, saved }: { working?: string; saved: boolean },
): boolean {
  const key = docQuery(search)
  let owned = owners.get(key)
  if (owned === undefined) {
    owned =
      saved ||
      working === storedQuery(search) ||
      (search.d === undefined && search.name === undefined)
    remember(key, owned)
  }
  return owned
}

/** Records a move from `from` to `next`; says whether the tab owns `next`.
 *  An adopted document becomes the tab's own; otherwise ownership carries. */
export function handOver(
  from: DocSearch,
  fromOwned: boolean,
  next: DocSearch,
  adopt: boolean,
): boolean {
  const owned = adopt || fromOwned
  remember(docQuery(from), fromOwned)
  remember(docQuery(next), owned)
  return owned
}
