/* The engine's data shapes: a chapter (one axis module), follows (Same as /
   Auto) and rules (pin / exclude / hide). Isomorphic and React-free — part of
   the docs closure, so keep it small. See README.md. */

import type { IconLibraryName } from "@/registry/icons/icon-map"
import type { ColorConfig } from "@/registry/theme"
import type { Density } from "@/registry/types"

import type { AxisSchema } from "../schema"

/** One chapter's contribution to the resolved design system. */
export interface Resolved {
  /** Global CSS vars written on `:root` (and into the exported theme). */
  tokens?: Record<string, string>
  /** Registry param selections: component → param → value. */
  params?: Record<string, Record<string, string>>
  density?: Density
  /** A slice of the recipe — Color contributes the full recipe; another
   *  chapter adds token overrides or a control's fill scope on top. */
  color?: Partial<ColorConfig>
  icons?: IconLibraryName
}

/** Saved sentinels a follow resolves; never reach a resolver. */
export type FollowId = "auto" | "same" | `same-${string}`

export type Follow =
  /** The source's effective value, in the same vocabulary (optionally mapped). */
  | {
      kind: "same"
      id: "same" | `same-${string}`
      from: string
      map?: Readonly<Record<string, unknown>>
      /** A family's own copy of the source: the source's row reads Custom
       *  while it differs, and editing the source resets it. */
      scoped?: true
    }
  /** Picked from the source's effective value; total over its domain. A tuple
   *  `from` keys the table by joined values ("ledge|as-style"). */
  | {
      kind: "auto"
      id: "auto"
      from: string | readonly string[]
      table: Readonly<Record<string, unknown>>
    }

/** Reads EFFECTIVE upstream values; never the rule's own target. */
export type Cond =
  | { key: string; in: readonly unknown[] }
  | { key: string; notIn: readonly unknown[] }
  | { all: readonly Cond[] }
  | { any: readonly Cond[] }

export type Effect =
  /** Row disabled; effective = value. */
  | { kind: "pin"; value: unknown }
  /** Enum options unavailable; an excluded value becomes `fallback`. */
  | { kind: "exclude"; options: readonly string[]; fallback: string }
  /** A numeric range unavailable; a value inside it clamps to the bound. */
  | { kind: "exclude"; above?: number; below?: number }
  /** Row hidden; effective = `value`, else the key's default. */
  | { kind: "hide"; value?: unknown }

export interface Rule<K extends string = string> {
  /** `<chapter>/<name>`. */
  id: string
  target: K
  when: Cond
  effect: Effect
  /** A key read by `when`: the row the chip names and links to. */
  cause: string
}

export interface Explained {
  saved: unknown
  effective: unknown
  /** The follow id that resolved the saved value. */
  via?: string
  /** A rule that changed the value. */
  rule?: string
  /** A pin/hide whose `when` holds, changed or not. */
  lock?: { rule: string; kind: "pin" | "hide"; cause: string }
  /** An exclude whose `when` holds: what is unavailable right now. */
  exclude?: {
    rule: string
    cause: string
    options?: readonly string[]
    above?: number
    below?: number
  }
}

/** One axis module: its keys' defaults and schema, the resolver over the
 *  effective state, and the follows and rules on its own keys. */
export interface Chapter<D extends object = object, R = unknown> {
  id: string
  defaults: D
  schema: { [K in keyof D]: AxisSchema }
  /** `(state: Effective) => Resolved`; index.ts checks the parameter (the
   *  state type is derived from every chapter, so it can't be named here). */
  resolve: R
  follows?: { readonly [K in keyof D]?: readonly Follow[] }
  rules?: readonly Rule<keyof D & string>[]
}

export const defineChapter = <D extends object, R>(chapter: Chapter<D, R>) =>
  chapter
