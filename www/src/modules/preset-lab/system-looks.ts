/* The per-system doc's data, one `looks.json` per captured system: what the
   capture found (pages, palette, type, shape, spacing, shadows, every
   component look with its states) and how deep it went. `systemLooks`
   builds it from a pack (model.json, tokens.json, gaps.json, the fit's
   residual rows) and, when one is at hand, the census it came from (fuller
   values, custom properties, frozen copies). Nothing in it is typed by
   hand: a look the capture never read is an empty slot on the page.
   `scripts/system-looks.ts` writes it. */

import type { Flag, Inventory, Look as CensusLook, Values } from "./census"
import { compareMeasures, type Row } from "./compare"
import type { Gap } from "./looks"
import type { Count, Model, Swatch, TypeStyle } from "./model"
import type { Measures, ReferenceTokens } from "./probe"

type Mode = "light" | "dark"
const MODES = ["light", "dark"] as const

/** "rest" is the look itself; the others hold only what changes from rest. */
export type State =
  | "rest"
  | "hover"
  | "pressed"
  | "focus"
  | "selected"
  | "disabled"
  | "open"

/** Where a value comes from, strongest first. "inferred" means no capture
 *  backs it. */
export type Source = "token" | "census" | "probe" | "pixel" | "inferred"

export type ColorRole =
  | "canvas"
  | "surface"
  | "raised"
  | "overlay"
  | "ink"
  | "inkMuted"
  | "border"
  | "accent"
  | "onAccent"
  | "link"
  | "focus"
  | "danger"
  | "success"
  | "warning"

export interface Reading {
  /** At rest, the full value set; in any other state, only what changes. */
  values: Values
  /** The custom property behind each value, where one was found. */
  vars?: Values
  source: Source
  /** The frozen copy, under .scratch-refs/<slug>/ (never in git). Copies
   *  from signed-in pages are redacted. */
  copy?: string
  /** The probe's crop of the matched part, under .scratch-refs/<slug>/. */
  crop?: string
}

export interface Look {
  /** The census look id: "button.1" is the most used button look. */
  id: string
  count: number
  /** Indexes into capture.pages. */
  pages: number[]
  /** The probe part that reads this look on both sides: the specimen cell
   *  the page renders as ours. */
  part?: string
  /** Found only disabled, selected or open, with no rest look of its shape:
   *  its rest values are that state's. */
  is?: Flag
  states: Partial<Record<State, Partial<Record<Mode, Reading>>>>
  /** Where the preset misses this look, from the fit's residual rows. */
  off?: {
    prop: string
    mode: Mode
    state: State
    theirs: string
    ours: string
  }[]
}

export interface ComponentLooks {
  /** The census groups mapped here: "button", "cell@table"… */
  groups: string[]
  /** Looks the census found in these groups. */
  found: number
  /** The most used and every one a probe part reads, most used first. */
  looks: Look[]
}

export interface SystemLooks {
  version: 1
  /** The preset id: "github", "linear"… */
  slug: string
  /** The preset rendered beside each look. */
  preset: string
  capture: {
    /** The preset-lab commit that read it. */
    probe: string
    /** The newest capture used, YYYY-MM-DD. */
    date: string
    /** Every page read; looks point into it by index. Signed-in keys keep
     *  their placeholders. */
    pages: {
      key: string
      modes: Mode[]
      signedIn: boolean
      how: "headless" | "local" | "harness"
    }[]
    /** What the capture can't read yet: empty slots on the page. */
    missing: ("disabled" | "motion" | "icons" | "shell")[]
  }
  color: {
    modes: Partial<
      Record<
        Mode,
        {
          neutrals: Swatch[]
          accents: { hue: number; count: number; steps: Swatch[] }[]
          neutralHue?: number
          roles?: Partial<Record<ColorRole, { color: string; source: Source }>>
        }
      >
    >
    /** Custom properties by how many elements they feed. */
    tokens: Model["tokens"]
  }
  type: {
    families: { family: string; count: number }[]
    /** Most used first. */
    styles: TypeStyle[]
  }
  shape: {
    radius: Model["radius"]
    pills: string[]
  }
  spacing: {
    grid: number
    steps: Count[]
    heights: Record<string, Count[]>
  }
  elevation: {
    /** Distinct box shadows, most used first. */
    shadows: { value: string; count: number; groups: string[] }[]
  }
  /** Keyed by registry component; census groups with none go to "other". */
  components: Record<string, ComponentLooks>
  gaps: Gap[]
}

/* The registry component each census role belongs to. A group inside a
   container (`text@button`, `cell@table`) falls back to its container's. */
const COMPONENT: Record<string, string> = {
  button: "button",
  link: "link",
  tab: "tabs",
  tablist: "tabs",
  menu: "menu",
  menuitem: "menu",
  menuitemcheckbox: "menu",
  menuitemradio: "menu",
  listbox: "list-box",
  option: "list-box",
  textbox: "input",
  searchbox: "search-field",
  search: "search-field",
  combobox: "combobox",
  switch: "switch",
  checkbox: "checkbox",
  radio: "radio-group",
  radiogroup: "radio-group",
  badge: "badge",
  kbd: "kbd",
  avatar: "avatar",
  table: "table",
  row: "table",
  cell: "table",
  columnheader: "table",
  dialog: "dialog",
  alertdialog: "dialog",
  tooltip: "tooltip",
  progressbar: "progress-bar",
  meter: "progress-bar",
  slider: "slider",
  separator: "separator",
  card: "card",
  alert: "alert",
  status: "alert",
  heading: "text",
  text: "text",
  paragraph: "text",
  label: "field",
  code: "text",
  tree: "tree",
  treeitem: "tree",
}

export function componentOf(group: string) {
  const [inner = group, container] = group.split("@")
  const role = inner.split(".")[0] ?? inner
  return (
    COMPONENT[role] ?? (container && COMPONENT[container]) ?? ("other" as const)
  )
}

/* The census groups a probe part can be, and the state it reads. */
const PART_GROUPS: Record<string, string[]> = {
  page: ["page"],
  shell: ["navigation", "banner", "complementary", "panel", "box"],
  panel: ["panel", "complementary", "navigation", "box"],
  button: ["button"],
  toggle: ["button"],
  segmented: ["button", "radio", "tab"],
  pagination: ["link", "button"],
  calendar: ["button", "cell@table", "gridcell"],
  input: ["textbox", "searchbox", "combobox"],
  select: ["combobox", "button"],
  field: ["label"],
  checkbox: ["checkbox"],
  radio: ["radio"],
  switch: ["switch"],
  tab: ["tab", "link"],
  link: ["link"],
  nav: ["link", "option", "listitem"],
  menu: ["menu", "menuitem", "option"],
  tooltip: ["tooltip"],
  command: ["dialog", "option", "listbox"],
  kbd: ["kbd"],
  dialog: ["dialog"],
  card: ["card", "box", "panel"],
  alert: ["alert", "status", "box"],
  progress: ["progressbar"],
  badge: ["badge"],
  heading: ["heading.h1", "heading.h2", "heading.h3", "heading.h4"],
  text: ["paragraph", "text"],
}

const SELECTED = /\.(selected|active|checked|on|current|today)$/

export const stateOfPart = (part: string): State =>
  part.endsWith(".focus") ? "focus" : SELECTED.test(part) ? "selected" : "rest"

const rowsOk = (rows: Row[]) => {
  const read = rows.filter((row) => !row.missing)
  return { read: read.length, ok: read.filter((row) => row.ok).length }
}

/** The look each probe part reads: in the groups the part can be, the one
 *  whose values agree on the most props, if it agrees on at least three
 *  quarters of them (and three or more). A heading part only matches its
 *  own level. */
export function matchParts(
  reference: ReferenceTokens,
  looks: Record<string, { id: string; light?: Values; dark?: Values }[]>,
): Record<string, string> {
  const out: Record<string, string> = {}
  const parts = new Set(MODES.flatMap((m) => Object.keys(reference[m] ?? {})))
  for (const part of parts) {
    const [kind = part, level] = part.split(".")
    const groups =
      kind === "heading" && level
        ? [`heading.h${level}`]
        : (PART_GROUPS[kind] ?? [])
    let best: { id: string; ok: number; read: number } | undefined
    for (const group of groups)
      for (const look of looks[group] ?? []) {
        let ok = 0
        let read = 0
        for (const mode of MODES) {
          const theirs = reference[mode]?.[part]
          const values = look[mode]
          if (!theirs || !values) continue
          const counted = rowsOk(
            compareMeasures(
              { [part]: theirs },
              { [part]: values } as Measures,
              reference.fonts,
            ).filter((row) => row.prop !== "ring"),
          )
          ok += counted.ok
          read += counted.read
        }
        if (read >= 3 && ok / read >= 0.75 && (!best || ok > best.ok))
          best = { id: look.id, ok, read }
      }
    if (best) out[part] = best.id
  }
  return out
}

const colorIn = (edge: string | undefined) =>
  edge && edge !== "none" ? edge.replace(/^[\d.]+px\s+/, "") : undefined

/** The semantic colors the probe parts name, per mode. */
function rolesOf(reference: ReferenceTokens, mode: Mode) {
  const parts = reference[mode] ?? {}
  const pick = (part: string, prop: "backgroundColor" | "color" | "edge") => {
    const value = parts[part]?.[prop]
    const color = prop === "edge" ? colorIn(value) : value
    return color && !/rgba?\(0, 0, 0, 0\)|transparent/.test(color)
      ? { color, source: "probe" as const }
      : undefined
  }
  const ring = parts["input.focus"]?.ring ?? parts["button.focus"]?.ring
  const roles: Partial<Record<ColorRole, { color: string; source: Source }>> = {
    canvas: pick("page", "backgroundColor"),
    ink: pick("text", "color") ?? pick("page", "color"),
    inkMuted: pick("text.muted", "color"),
    surface: pick("card", "backgroundColor"),
    raised: pick("dialog", "backgroundColor"),
    overlay: pick("menu", "backgroundColor"),
    border: pick("card", "edge") ?? pick("input", "edge"),
    accent: pick("button.primary", "backgroundColor"),
    onAccent: pick("button.primary", "color"),
    link: pick("link", "color"),
    ...(ring && ring !== "none"
      ? {
          focus: {
            color: ring
              .replace(/^[\d.]+px\s+/, "")
              .replace(/\s+[+-]?[\d.]+px$/, ""),
            source: "probe" as const,
          },
        }
      : {}),
  }
  return Object.fromEntries(
    Object.entries(roles).filter(([, role]) => role),
  ) as typeof roles
}

export interface SystemInput {
  slug: string
  model: Model
  /** The pack's targets.json pages, for how each page was read. */
  targets?: Record<string, { signedIn?: boolean }>
  reference?: ReferenceTokens
  gaps?: Gap[]
  /** The fit's residual rows (fit.json: gaps[].rows and unfiled). */
  residuals?: {
    mode: Mode
    part: string
    prop: string
    reference: string
    preset: string
  }[]
  /** census.json, for fuller values, custom properties and copies. */
  census?: Inventory
  /** The census folder under .scratch-refs/<slug>/ ("2026-10-23/census"),
   *  and the files in its crops/ folder. */
  censusDir?: string
  copies?: Set<string>
  /** Probe crops found under .scratch-refs/<slug>/, by "<part>-<mode>". */
  crops?: Record<string, string>
  date: string
}

interface PoolLook {
  id: string
  count: number
  pages: number[]
  light?: Values
  dark?: Values
  states?: CensusLook["states"]
  vars?: Values
  is?: Flag
}

export function systemLooks(input: SystemInput): SystemLooks {
  const { model, reference = {}, census } = input
  // Every look the census found, by group; the model's own without one.
  const pool: Record<string, PoolLook[]> = {}
  if (census) {
    const index = new Map(model.pages.map((page, i) => [page.key, i]))
    for (const look of census.looks)
      (pool[look.group] ??= []).push({
        ...look,
        pages: look.pages.flatMap((key) => index.get(key) ?? []),
      })
  } else Object.assign(pool, model.inventory)

  const parts = matchParts(reference, pool)
  const partOfLook = new Map<string, string>()
  for (const [part, id] of Object.entries(parts))
    if (stateOfPart(part) === "rest" && !partOfLook.has(id))
      partOfLook.set(id, part)

  const offOf = new Map<string, NonNullable<Look["off"]>>()
  for (const row of input.residuals ?? []) {
    const id = parts[row.part]
    if (!id) continue
    offOf.set(id, [
      ...(offOf.get(id) ?? []),
      {
        prop: row.prop,
        mode: row.mode,
        state: stateOfPart(row.part),
        theirs: row.reference,
        ours: row.preset,
      },
    ])
  }

  const copyOf = (id: string, state: State, mode: Mode) => {
    const file = `${id}-${state}-${mode}.json`
    return input.censusDir && input.copies?.has(file)
      ? `${input.censusDir}/crops/${file}`
      : undefined
  }

  const lookOf = (look: PoolLook): Look => {
    const part = partOfLook.get(look.id)
    const states: Look["states"] = {}
    for (const mode of MODES) {
      const values = look[mode]
      if (!values) continue
      const crop = part && input.crops?.[`${part}-${mode}`]
      const copy = copyOf(look.id, "rest", mode)
      ;(states.rest ??= {})[mode] = {
        values,
        ...(look.vars ? { vars: look.vars } : {}),
        source: "census",
        ...(copy ? { copy } : {}),
        ...(crop ? { crop } : {}),
      }
      for (const [state, changes] of Object.entries(
        look.states?.[mode] ?? {},
      )) {
        const copy = copyOf(look.id, state as State, mode)
        ;(states[state as State] ??= {})[mode] = {
          values: changes,
          source: "census",
          ...(copy ? { copy } : {}),
        }
      }
    }
    const off = offOf.get(look.id)
    return {
      id: look.id,
      count: look.count,
      pages: look.pages,
      ...(part ? { part } : {}),
      ...(look.is ? { is: look.is } : {}),
      states,
      ...(off ? { off } : {}),
    }
  }

  // Per group, the model's looks (the most used) and every look a probe
  // part reads.
  const matched = new Set(Object.values(parts))
  const components: Record<string, ComponentLooks> = {}
  for (const [group, list] of Object.entries(pool)) {
    const kept = new Set((model.inventory[group] ?? []).map((look) => look.id))
    const shown = list.filter(
      (look) => kept.has(look.id) || matched.has(look.id),
    )
    if (!shown.length) continue
    const entry = (components[componentOf(group)] ??= {
      groups: [],
      found: 0,
      looks: [],
    })
    entry.groups.push(group)
    entry.found += list.length
    entry.looks.push(...shown.map(lookOf))
  }
  for (const entry of Object.values(components)) {
    entry.groups.sort()
    entry.looks.sort((a, b) => b.count - a.count)
  }

  const shadows = new Map<string, { count: number; groups: Set<string> }>()
  for (const look of census?.looks ?? [])
    for (const mode of MODES) {
      const value = look[mode]?.boxShadow
      if (!value || value === "none") continue
      const entry = shadows.get(value) ?? { count: 0, groups: new Set() }
      entry.count += look.count
      entry.groups.add(look.group)
      shadows.set(value, entry)
    }

  const families = new Map<string, number>()
  for (const style of model.type)
    if (style.fontFamily)
      families.set(
        style.fontFamily,
        (families.get(style.fontFamily) ?? 0) + style.count,
      )

  return {
    version: 1,
    slug: input.slug,
    preset: input.slug,
    capture: {
      probe: model.probe,
      date: input.date,
      pages: model.pages.map(({ key, modes }) => {
        const signedIn = !!input.targets?.[key]?.signedIn
        return {
          key,
          modes,
          signedIn,
          how: signedIn
            ? "local"
            : /^https?:/.test(key)
              ? "headless"
              : "harness",
        }
      }),
      missing: [
        ...(census?.reads?.includes("flags") ? [] : (["disabled"] as const)),
        "motion",
        ...(census?.reads?.includes("icons") ? [] : (["icons"] as const)),
        "shell",
      ],
    },
    color: {
      modes: Object.fromEntries(
        MODES.flatMap((mode) => {
          const colors = model.colors[mode]
          if (!colors) return []
          const roles = rolesOf(reference, mode)
          return [
            [
              mode,
              { ...colors, ...(Object.keys(roles).length ? { roles } : {}) },
            ],
          ]
        }),
      ),
      tokens: model.tokens,
    },
    type: {
      families: [...families]
        .sort((a, b) => b[1] - a[1])
        .map(([family, count]) => ({ family, count })),
      styles: model.type,
    },
    shape: { radius: model.radius, pills: model.pills },
    spacing: { ...model.spacing, heights: model.heights },
    elevation: {
      shadows: [...shadows]
        .sort((a, b) => b[1].count - a[1].count)
        .map(([value, { count, groups }]) => ({
          value,
          count,
          groups: [...groups],
        })),
    },
    components,
    gaps: input.gaps ?? [],
  }
}
