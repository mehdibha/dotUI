/* The per-system component spec, one `spec.json` per captured system: each
   component's census looks laid out as a grid of variants × sizes, with
   the states read on each cell. Names come first (a look's data
   attributes, a story's args, its class tokens), values second: an
   unnamed look joins the variant whose colors it shares and the size whose
   box it shares, and otherwise makes one of its own, keyed by a hash of
   its values, for the written docs to name later. Nothing in it is typed
   by hand. `scripts/spec.ts` writes it beside looks.json. */

import {
  type Flag,
  type Forced,
  type Inventory,
  type Look,
  lookKeys,
  sameLook,
  type Values,
} from "./census"
import { componentOf, type State } from "./system-looks"

type Mode = "light" | "dark"
type Key = ReturnType<typeof lookKeys>[number]
const MODES = ["light", "dark"] as const

/** A name a capture read, and where: a data attribute, a class token or a
 *  Storybook story's args. */
export interface Name {
  value: string
  from: "attribute" | "class" | "storybook"
  /** "data-variant", "class.size", "args.variant"… */
  key: string
}

export interface Variant {
  /** The name's value as a slug ("primary"), else "v-" and a hash of its
   *  values: stable across captures, for docs.json to point at. */
  key: string
  name?: Name
  count: number
  /** What tells it apart: fill, ink, edge, shadow, weight. */
  values: Partial<Record<Mode, Values>>
}

export interface Size {
  /** The name's value as a slug ("medium"), else "s-" and a hash. */
  key: string
  name?: Name
  count: number
  /** Height, padding, font and icon size, in the mode it was read in. */
  values: Values
}

export interface Cell {
  variant: string
  size: string
  /** The census look id of the cell's most used look. */
  look: string
  count: number
  /** Other looks that fall in the same cell, most used first. */
  also?: string[]
  /** What the look adds to its variant's and size's values (radius…). */
  values?: Partial<Record<Mode, Values>>
  /** The states read, per mode: "rest" and each one the census read. */
  states: Partial<Record<Mode, State[]>>
  /** The states read by setting them on the sample. */
  forced?: Forced[]
  /** The frozen copy of each state, under .scratch-refs/<slug>/. */
  copies?: Partial<Record<State, Partial<Record<Mode, string>>>>
}

export interface Grid {
  /** The census group: "button", "segment"… */
  group: string
  /** Most used first. */
  variants: Variant[]
  sizes: Size[]
  cells: Cell[]
  /** Looks found only disabled, invalid, selected or open: no rest look
   *  to place. */
  unplaced?: { look: string; is: Flag }[]
}

export interface ComponentSpec {
  /** What the product calls its parts (data-component, data-slot), most
   *  used first. */
  names?: Name[]
  grids: Grid[]
}

export interface SystemSpec {
  version: 1
  slug: string
  capture: {
    probe: string
    /** The census version that read it. */
    census: string
    date: string
  }
  /** Keyed by registry component, as in looks.json. */
  components: Record<string, ComponentSpec>
}

/* What a look's size is made of. A variant is everything else that tells
   looks apart, but the corners and the font family: they go with
   neither (a product's app and marketing pages set different families). */
const SIZE_KEYS = [
  "height",
  "paddingInline",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "iconSize",
] as const
const IGNORED = new Set(["borderRadius", "fontFamily"])

const VARIANT_NAMES: [string, Name["from"]][] = [
  ["data-variant", "attribute"],
  ["data-appearance", "attribute"],
  ["data-kind", "attribute"],
  ["data-tone", "attribute"],
  ["data-intent", "attribute"],
  ["data-emphasis", "attribute"],
  ["data-priority", "attribute"],
  ["data-shape", "attribute"],
  ["args.variant", "storybook"],
  ["args.appearance", "storybook"],
  ["args.kind", "storybook"],
  ["args.tone", "storybook"],
  ["args.intent", "storybook"],
  ["args.emphasis", "storybook"],
  ["args.priority", "storybook"],
  ["args.color", "storybook"],
  ["args.shape", "storybook"],
  ["class.variant", "class"],
]
const SIZE_NAMES: [string, Name["from"]][] = [
  ["data-size", "attribute"],
  ["args.size", "storybook"],
  ["class.size", "class"],
]
const PART_NAMES = ["data-component", "data-slot", "data-part"]

/** The first name a look carries for an axis, strongest source first. */
const nameOf = (look: Look, keys: [string, Name["from"]][]) => {
  for (const [key, from] of keys) {
    const value = look.names?.[key]?.[0]
    if (value) return { value, from, key }
  }
  return undefined
}

const slugOf = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** FNV-1a, base 36: a short key that holds as long as the values do. */
export const hashOf = (text: string) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36).padStart(6, "0").slice(-6)
}

const pick = (values: Values | undefined, keys: readonly string[]) =>
  Object.fromEntries(
    keys.flatMap((key) => {
      const value = values?.[key as keyof Values]
      return value ? [[key, value]] : []
    }),
  ) as Values

const leadOf = (look: Look): Mode => (look.light ? "light" : "dark")

interface Entry {
  key: string
  name?: Name
  looks: Look[]
}

/** Puts each look on one axis: its name's entry, else the first entry with
 *  a member it can't be told from on `keys`, else a new one keyed by the
 *  hash of its values. Named looks go first, most used first. */
function place(
  looks: Look[],
  keys: Key[],
  names: [string, Name["from"]][],
  prefix: string,
) {
  const entries: Entry[] = []
  const of = new Map<Look, Entry>()
  const named = looks.filter((look) => nameOf(look, names))
  const unnamed = looks.filter((look) => !nameOf(look, names))
  for (const look of named) {
    const name = nameOf(look, names) as Name
    const key = slugOf(name.value) || `${prefix}${hashOf(name.value)}`
    let entry = entries.find((one) => one.key === key)
    if (!entry) entries.push((entry = { key, name, looks: [] }))
    entry.looks.push(look)
    of.set(look, entry)
  }
  for (const look of unnamed) {
    const mode = leadOf(look)
    const values = look[mode] ?? {}
    let entry = entries.find((one) =>
      one.looks.some((member) => {
        const other = member[mode] ?? {}
        // A size holds with or without an icon.
        const compared = keys.filter(
          (key) => key !== "iconSize" || (values[key] && other[key]),
        )
        return leadOf(member) === mode && sameLook(compared, other, values)
      }),
    )
    if (!entry) {
      const own = pick(values, keys)
      entries.push(
        (entry = {
          key: `${prefix}${hashOf(`${mode}|${JSON.stringify(own)}`)}`,
          looks: [],
        }),
      )
    }
    entry.looks.push(look)
    of.set(look, entry)
  }
  const count = (entry: Entry) =>
    entry.looks.reduce((sum, look) => sum + look.count, 0)
  entries.sort((a, b) => count(b) - count(a) || a.key.localeCompare(b.key))
  return { entries, of, count }
}

/** The look a size reads its values from: of the heights its looks take,
 *  the one most variants share, then the most used. Primer's small button
 *  is 28px across its variants; its inline link-style buttons, more used,
 *  are not. */
function sizeLook(entry: Entry, variantOf: (look: Look) => string) {
  const byHeight = new Map<string, Look[]>()
  for (const look of entry.looks) {
    const height = look[leadOf(look)]?.height ?? ""
    byHeight.set(height, [...(byHeight.get(height) ?? []), look])
  }
  const score = (looks: Look[]) => ({
    variants: new Set(looks.map(variantOf)).size,
    count: looks.reduce((sum, look) => sum + look.count, 0),
  })
  const [best] = [...byHeight.values()].sort((a, b) => {
    const [x, y] = [score(a), score(b)]
    return y.variants - x.variants || y.count - x.count
  })
  return best?.[0] as Look
}

export interface SpecInput {
  slug: string
  census: Inventory & { census?: string }
  /** The census folder under .scratch-refs/<slug>/ ("2026-10-25/census"),
   *  and the files in its crops/ folder. */
  censusDir?: string
  copies?: Set<string>
  date: string
}

export function systemSpec(input: SpecInput): SystemSpec {
  const { census } = input
  const byGroup = new Map<string, Look[]>()
  for (const look of census.looks) {
    // Text and icons inside a control are its parts, not a component.
    if (look.group.includes("@")) continue
    const component = componentOf(look.group)
    if (component === "other" || component === "text") continue
    byGroup.set(look.group, [...(byGroup.get(look.group) ?? []), look])
  }

  const copyOf = (id: string, state: State, mode: Mode) => {
    const file = `${id}-${state}-${mode}.json`
    return input.censusDir && input.copies?.has(file)
      ? `${input.censusDir}/crops/${file}`
      : undefined
  }

  const components: Record<string, ComponentSpec> = {}
  const partsOf = new Map<string, Look[]>()
  for (const [group, all] of [...byGroup].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const role = group.split(".")[0] ?? group
    const keys = lookKeys(role)
    const isSize = (key: Key) => (SIZE_KEYS as readonly Key[]).includes(key)
    const sizeKeys = SIZE_KEYS.filter(
      (key) => keys.includes(key) || key === "iconSize",
    )
    const variantKeys = keys.filter((key) => !IGNORED.has(key) && !isSize(key))
    const looks = all
      .filter((look) => !look.is)
      .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    const variants = place(looks, variantKeys, VARIANT_NAMES, "v-")
    const sizes = place(looks, sizeKeys, SIZE_NAMES, "s-")

    const cells = new Map<string, Look[]>()
    for (const look of looks) {
      const at = `${variants.of.get(look)?.key}|${sizes.of.get(look)?.key}`
      cells.set(at, [...(cells.get(at) ?? []), look])
    }
    const order = (entries: Entry[]) =>
      new Map(entries.map((entry, i) => [entry.key, i]))
    const vOrder = order(variants.entries)
    const sOrder = order(sizes.entries)
    const variantOf = (look: Look) => variants.of.get(look)?.key ?? ""
    const sizeTop = new Map(
      sizes.entries.map((entry) => [entry.key, sizeLook(entry, variantOf)]),
    )

    const grid: Grid = {
      group,
      variants: variants.entries.map((entry) => {
        const [top] = entry.looks as [Look]
        return {
          key: entry.key,
          ...(entry.name ? { name: entry.name } : {}),
          count: variants.count(entry),
          values: Object.fromEntries(
            MODES.flatMap((mode) =>
              top[mode] ? [[mode, pick(top[mode], variantKeys)]] : [],
            ),
          ),
        }
      }),
      sizes: sizes.entries.map((entry) => {
        const top = sizeTop.get(entry.key) as Look
        return {
          key: entry.key,
          ...(entry.name ? { name: entry.name } : {}),
          count: sizes.count(entry),
          values: pick(top[leadOf(top)], sizeKeys),
        }
      }),
      cells: [...cells.values()]
        .map((members): Cell => {
          const [look, ...also] = members as [Look, ...Look[]]
          const variant = variants.of.get(look) as Entry
          const size = sizes.of.get(look) as Entry
          const [vTop] = variant.looks as [Look]
          const sTop = sizeTop.get(size.key) as Look
          const states: Cell["states"] = {}
          const copies: NonNullable<Cell["copies"]> = {}
          const extra: NonNullable<Cell["values"]> = {}
          for (const mode of MODES) {
            if (!look[mode]) continue
            const read = [
              "rest",
              ...Object.keys(look.states?.[mode] ?? {}),
            ] as State[]
            states[mode] = read
            for (const state of read) {
              const copy = copyOf(look.id, state, mode)
              if (copy) (copies[state] ??= {})[mode] = copy
            }
            // What neither its variant's top look nor its size's says.
            const own = Object.fromEntries(
              keys.flatMap((key) => {
                const value = look[mode]?.[key]
                const said = (isSize(key) ? sTop : vTop)[mode]?.[key]
                return value && value !== said ? [[key, value]] : []
              }),
            ) as Values
            if (Object.keys(own).length) extra[mode] = own
          }
          return {
            variant: variant.key,
            size: size.key,
            look: look.id,
            count: members.reduce((sum, one) => sum + one.count, 0),
            ...(also.length ? { also: also.map((one) => one.id) } : {}),
            ...(Object.keys(extra).length ? { values: extra } : {}),
            states,
            ...(look.forced?.length ? { forced: look.forced } : {}),
            ...(Object.keys(copies).length ? { copies } : {}),
          }
        })
        .sort(
          (a, b) =>
            (vOrder.get(a.variant) ?? 0) - (vOrder.get(b.variant) ?? 0) ||
            (sOrder.get(a.size) ?? 0) - (sOrder.get(b.size) ?? 0),
        ),
    }
    const unplaced = all.flatMap((look) =>
      look.is ? [{ look: look.id, is: look.is }] : [],
    )
    if (unplaced.length) grid.unplaced = unplaced
    if (!grid.cells.length && !unplaced.length) continue

    const component = componentOf(group)
    ;(components[component] ??= { grids: [] }).grids.push(grid)
    partsOf.set(component, [...(partsOf.get(component) ?? []), ...all])
  }

  // Each component's part names over all its groups, most used first.
  for (const [component, looks] of partsOf) {
    const counts = new Map<string, Name & { count: number }>()
    for (const look of looks)
      for (const key of PART_NAMES)
        for (const value of look.names?.[key] ?? []) {
          const name = counts.get(`${key}|${value}`) ?? {
            value,
            from: "attribute" as const,
            key,
            count: 0,
          }
          name.count += look.count
          counts.set(`${key}|${value}`, name)
        }
    const entry = components[component]
    if (entry && counts.size)
      entry.names = [...counts.values()]
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
        .map(({ count: _, ...name }) => name)
  }

  return {
    version: 1,
    slug: input.slug,
    capture: {
      probe: census.probe,
      census: census.census ?? "",
      date: input.date,
    },
    components,
  }
}
