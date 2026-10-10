/* The studio's design-system state, and how it becomes a design system.

   One registry: every axis module exports a `chapter` — its keys' defaults
   and schema, the follows (Same as / Auto) and rules on them, and `resolve`,
   the pure mapping from the EFFECTIVE state to what the engine consumes
   (tokens, registry params, density, the color recipe, the icon library).
   DEFAULTS, SCHEMA, resolvers, follows and rules are all built from the list
   below, so a key lives in its own module only. No React here: the same
   code runs in the panel, the preview, the docs demos and /r/*. */

import type { IconLibraryName } from "@/registry/icons/icon-map"
import type { ColorConfig } from "@/registry/theme"
import type { Density } from "@/registry/types"

import * as accordion from "./accordion"
import * as alert from "./alert"
import * as avatars from "./avatars"
import * as badges from "./badges"
import * as breadcrumbs from "./breadcrumbs"
import * as buttonGroups from "./button-groups"
import * as buttons from "./buttons"
import * as calendar from "./calendar"
import * as card from "./card"
import * as charts from "./charts"
import * as checkbox from "./checkbox"
import * as choiceCards from "./choice-cards"
import * as color from "./color"
import { createEngine, followSources } from "./core/effective"
import type { Explained, Follow, FollowId, Resolved, Rule } from "./core/types"
import * as dialogs from "./dialogs"
import * as field from "./field"
import * as icons from "./icons"
import * as inputs from "./inputs"
import * as kbd from "./kbd"
import * as links from "./links"
import * as menus from "./menus"
import * as mobile from "./mobile"
import * as motion from "./motion"
import * as navigation from "./navigation"
import * as numberField from "./number-field"
import * as otpField from "./otp-field"
import * as pagination from "./pagination"
import * as progress from "./progress"
import * as radio from "./radio"
import { checkAxisValue } from "./schema"
import type { AxisSchema } from "./schema"
import * as segmentedControl from "./segmented-control"
import * as select from "./select"
import * as selection from "./selection"
import * as shape from "./shape"
import * as skeleton from "./skeleton"
import * as sliders from "./sliders"
import * as space from "./space"
import * as spinner from "./spinner"
import * as states from "./states"
import * as style from "./style"
import type { StyleKey } from "./style"
import * as surfaces from "./surfaces"
import * as switchAxis from "./switch"
import * as tables from "./tables"
import * as toast from "./toast"
import * as toggles from "./toggles"
import * as tooltips from "./tooltips"
import * as type from "./type"

export type { Resolved }

/* Resolver order: a later chapter wins a token or param collision. */
export const CHAPTERS = [
  style.chapter,
  color.chapter,
  type.chapter,
  icons.chapter,
  shape.chapter,
  space.chapter,
  surfaces.chapter,
  states.chapter,
  selection.chapter,
  mobile.chapter,
  motion.chapter,
  charts.chapter,
  links.chapter,
  alert.chapter,
  skeleton.chapter,
  spinner.chapter,
  progress.chapter,
  toast.chapter,
  buttons.chapter,
  buttonGroups.chapter,
  toggles.chapter,
  segmentedControl.chapter,
  switchAxis.chapter,
  checkbox.chapter,
  radio.chapter,
  choiceCards.chapter,
  inputs.chapter,
  field.chapter,
  numberField.chapter,
  otpField.chapter,
  select.chapter,
  calendar.chapter,
  sliders.chapter,
  menus.chapter,
  dialogs.chapter,
  tooltips.chapter,
  navigation.chapter,
  accordion.chapter,
  breadcrumbs.chapter,
  pagination.chapter,
  badges.chapter,
  kbd.chapter,
  avatars.chapter,
  tables.chapter,
  card.chapter,
] as const

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never
type Merged = UnionToIntersection<(typeof CHAPTERS)[number]["defaults"]>

/** A Style key may also hold the "style" follow id. */
export type StudioStateInput = {
  [K in keyof Merged]: K extends StyleKey ? Merged[K] | "style" : Merged[K]
}
type Key = keyof StudioStateInput & string

/* A Style key's chapter default is its Flat column; saved, it is "style". */
export const DEFAULTS = Object.assign(
  {},
  ...CHAPTERS.map((chapter) => chapter.defaults),
  Object.fromEntries(style.STYLE_KEYS.map((key) => [key, "style"])),
) as StudioStateInput

export const SCHEMA = Object.assign(
  {},
  ...CHAPTERS.map((chapter) => chapter.schema),
) as Record<Key, AxisSchema>

const CHAPTER_FOLLOWS: Record<string, readonly Follow[]> = Object.assign(
  {},
  ...CHAPTERS.map((chapter) => chapter.follows ?? {}),
)

export const FOLLOWS: Readonly<Record<string, readonly Follow[]>> = {
  ...CHAPTER_FOLLOWS,
  ...Object.fromEntries(
    style.STYLE_KEYS.map((key) => [
      key,
      [style.FOLLOWS[key], ...(CHAPTER_FOLLOWS[key] ?? [])],
    ]),
  ),
}

export const RULES: readonly Rule[] = [
  ...CHAPTERS.flatMap((chapter): readonly Rule[] => chapter.rules ?? []),
  ...style.RULES,
]

/* A source key → [follower, follow id] for every follow reading it. */
const FOLLOWERS = new Map<string, [Key, unknown][]>()
for (const [key, list] of Object.entries(FOLLOWS))
  for (const follow of list)
    for (const from of followSources(follow))
      FOLLOWERS.set(from, [
        ...(FOLLOWERS.get(from) ?? []),
        [key as Key, follow.id],
      ])

/** Which chapter owns each key. */
export const KEY_OWNER: Readonly<Record<string, string>> = Object.fromEntries(
  CHAPTERS.flatMap((chapter) =>
    Object.keys(chapter.defaults).map((key) => [key, chapter.id]),
  ),
)

const FOLLOW_IDS = new Map(
  Object.entries(FOLLOWS).map(([key, list]) => [
    key,
    new Set<unknown>(list.map((follow) => follow.id)),
  ]),
)

declare const VALID: unique symbol
declare const EFFECTIVE: unique symbol

/** Saved axis values that passed `validate()` — the only way to mint one.
 *  A key with follows may hold a follow id ("auto", "same"). */
export type StudioState = StudioStateInput & { readonly [VALID]: true }

/** What the user's picks resolve to: follows resolved, rules applied. The
 *  only input a resolver accepts. */
export type Effective = {
  readonly [K in keyof StudioStateInput]: Exclude<StudioStateInput[K], FollowId>
} & { readonly [EFFECTIVE]: true }

export interface StateIssue {
  key: string
  problem: string
}

export type Validation =
  | { ok: true; state: StudioState }
  | { ok: false; issues: StateIssue[] }

const isObject = (raw: unknown): raw is Record<string, unknown> =>
  typeof raw === "object" && raw !== null && !Array.isArray(raw)

/** `undefined` when `value` fits the key, a follow id included. */
export const checkKey = (key: string, value: unknown) =>
  FOLLOW_IDS.get(key)?.has(value)
    ? undefined
    : checkAxisValue(SCHEMA[key as Key], value)

// Every axis, with a missing or bad value taking the default.
function checkAxes(input: Record<string, unknown>) {
  const issues: StateIssue[] = []
  const state: Record<string, unknown> = {}
  for (const key of Object.keys(SCHEMA)) {
    const fallback = DEFAULTS[key as Key]
    const value = Object.hasOwn(input, key) ? input[key] : fallback
    const problem = checkKey(key, value)
    if (problem) issues.push({ key, problem })
    state[key] = problem ? fallback : value
  }
  return { state: state as StudioState, issues }
}

/** Checks raw state against every axis schema. A missing key takes the axis
 *  default; an unknown key or a bad value is an issue — nothing is salvaged. */
export function validate(raw: unknown): Validation {
  if (!isObject(raw))
    return { ok: false, issues: [{ key: "", problem: "expected an object" }] }
  const { state, issues } = checkAxes(raw)
  for (const key of Object.keys(raw))
    if (!Object.hasOwn(SCHEMA, key))
      issues.push({ key, problem: "unknown key" })
  return issues.length > 0 ? { ok: false, issues } : { ok: true, state }
}

/** Stored state read leniently, so a schema change never loses it: unknown
 *  keys are dropped and a missing or bad value takes the axis default. */
export const salvageState = (raw: unknown): StudioState =>
  checkAxes(isObject(raw) ? raw : {}).state

export const formatIssues = (issues: StateIssue[]) =>
  issues.map(({ key, problem }) => `${key || "state"}: ${problem}`).join("; ")

/** `validate()` for sources that must be valid (built-ins, tests): throws. */
export function parseState(raw: unknown): StudioState {
  const result = validate(raw)
  if (!result.ok)
    throw new Error(`Invalid studio state — ${formatIssues(result.issues)}`)
  return result.state
}

export const DEFAULT_STATE = parseState({})

/** Keys that can follow `key` but are saved off that follow: a Motion
 *  row's custom components, a Style's explicit picks. */
export const followersOf = (state: StudioState, key: string): Key[] =>
  (FOLLOWERS.get(key) ?? []).flatMap(([k, id]) => (state[k] === id ? [] : [k]))

/** `state` with `key` set. */
export const setKey = (state: StudioState, key: Key, value: unknown) =>
  ({ ...state, [key]: value }) as StudioState

/** Key-by-key equality. */
export const sameState = (a: StudioState, b: StudioState) =>
  a === b || (Object.keys(SCHEMA) as Key[]).every((key) => a[key] === b[key])

const engine = createEngine({
  defaults: DEFAULTS,
  follows: FOLLOWS,
  rules: RULES,
})

/** Saved → effective, memoized on the saved object. `explain` covers the keys
 *  a follow or rule can touch. */
export const effective = engine.effective as unknown as (
  state: StudioState,
) => {
  values: Effective
  explain: Readonly<Partial<Record<Key, Explained>>>
}

export const DEFAULT_EFFECTIVE = effective(DEFAULT_STATE).values

/* A chapter whose resolver reads anything but the branded Effective (saved
   state, a plain object) is not assignable here: a compile-time check. */
type Checked<C> = C extends { resolve: (state: infer S) => Resolved }
  ? [S, Effective] extends [Effective, S]
    ? C
    : never
  : never
const CHECKED: readonly Checked<(typeof CHAPTERS)[number]>[] = CHAPTERS
const RESOLVERS = CHECKED.map(
  (chapter): ((state: Effective) => Resolved) => chapter.resolve,
)

/** The engine's view of the state: every chapter's resolution merged. Later
 *  chapters win on a token or param collision, so keep slices disjoint. */
export interface ResolvedAll extends Omit<Resolved, "tokens" | "params"> {
  tokens: Record<string, string>
  params: Record<string, Record<string, string>>
}

function mergeColor(
  base: Partial<ColorConfig>,
  part: Partial<ColorConfig>,
): Partial<ColorConfig> {
  const merged: Partial<ColorConfig> = { ...base, ...part }
  const overrides = { ...base.overrides, ...part.overrides }
  const scopes = { ...base.scopes, ...part.scopes }
  if (Object.keys(overrides).length > 0) merged.overrides = overrides
  else delete merged.overrides
  if (Object.keys(scopes).length > 0) merged.scopes = scopes
  else delete merged.scopes
  return merged
}

export function resolveAll(state: Effective): ResolvedAll {
  const tokens: Record<string, string> = {}
  const params: Record<string, Record<string, string>> = {}
  let density: Density | undefined
  let color: Partial<ColorConfig> | undefined
  let icons: IconLibraryName | undefined
  for (const resolve of RESOLVERS) {
    const part = resolve(state)
    Object.assign(tokens, part.tokens)
    for (const [component, selections] of Object.entries(part.params ?? {})) {
      params[component] = { ...params[component], ...selections }
    }
    if (part.density) density = part.density
    // Color merges deep on its per-token maps so a chapter other than Color
    // (a control's fill scope, focus overrides) can contribute without
    // owning the recipe.
    if (part.color) color = color ? mergeColor(color, part.color) : part.color
    if (part.icons) icons = part.icons
  }
  return { tokens, params, density, color, icons }
}
