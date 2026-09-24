/* The studio's design-system state, and how it becomes a design system.

   Each axis module owns one chapter's slice: its defaults (the state shape),
   its option vocabularies, the schema raw values are validated against, and
   `resolve` — the pure mapping from that slice
   to what the engine consumes: global tokens (CSS vars), per-component
   registry params, the density tier, the color recipe, the icon library. No
   React here: the same resolver runs in the panel, the preview, the docs
   demos, and the /r/* registry routes. */

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
import * as charts from "./charts"
import * as checkbox from "./checkbox"
import * as choiceCards from "./choice-cards"
import * as color from "./color"
import * as cursor from "./cursor"
import * as dialogs from "./dialogs"
import * as disabled from "./disabled"
import * as focus from "./focus"
import * as icons from "./icons"
import * as inputGroups from "./input-groups"
import * as inputs from "./inputs"
import * as invalid from "./invalid"
import * as kbd from "./kbd"
import * as links from "./links"
import * as menus from "./menus"
import * as mobile from "./mobile"
import * as motion from "./motion"
import * as numberField from "./number-field"
import * as otpField from "./otp-field"
import * as pagination from "./pagination"
import * as pickers from "./pickers"
import * as popovers from "./popovers"
import * as progress from "./progress"
import * as radio from "./radio"
import { checkAxisValue } from "./schema"
import type { AxisSchema } from "./schema"
import * as scrollbars from "./scrollbars"
import * as segmentedControl from "./segmented-control"
import * as selection from "./selection"
import * as shape from "./shape"
import * as skeleton from "./skeleton"
import * as sliders from "./sliders"
import * as space from "./space"
import * as spinner from "./spinner"
import * as surfaces from "./surfaces"
import * as switchAxis from "./switch"
import * as tables from "./tables"
import * as tabs from "./tabs"
import * as toast from "./toast"
import * as toggles from "./toggles"
import * as tooltips from "./tooltips"
import * as type from "./type"

/** One chapter's contribution to the resolved design system. */
export interface Resolved {
  /** Global CSS vars written on `:root` (and into the exported theme). */
  tokens?: Record<string, string>
  /** Registry param selections: component → param → value. */
  params?: Record<string, Record<string, string>>
  density?: Density
  /** A slice of the recipe — a chapter other than Color contributes token
   *  overrides, border targets or a control's fill scope;
   *  `resolveDesignSystem` completes it. */
  color?: Partial<ColorConfig>
  icons?: IconLibraryName
}

export const DEFAULTS = {
  ...color.COLOR_DEFAULTS,
  ...type.TYPE_DEFAULTS,
  ...icons.ICON_DEFAULTS,
  ...shape.SHAPE_DEFAULTS,
  ...space.SPACE_DEFAULTS,
  ...surfaces.SURFACE_DEFAULTS,
  ...focus.FOCUS_DEFAULTS,
  ...cursor.CURSOR_DEFAULTS,
  ...selection.SELECTION_DEFAULTS,
  ...scrollbars.SCROLLBAR_DEFAULTS,
  ...disabled.DISABLED_DEFAULTS,
  ...invalid.INVALID_DEFAULTS,
  ...motion.MOTION_DEFAULTS,
  ...mobile.MOBILE_DEFAULTS,
  ...charts.CHART_DEFAULTS,
  ...links.LINK_DEFAULTS,
  ...alert.ALERT_DEFAULTS,
  ...toast.TOAST_DEFAULTS,
  ...skeleton.SKELETON_DEFAULTS,
  ...spinner.SPINNER_DEFAULTS,
  ...progress.PROGRESS_DEFAULTS,
  ...buttons.BUTTON_DEFAULTS,
  ...buttonGroups.BUTTON_GROUP_DEFAULTS,
  ...toggles.TOGGLE_DEFAULTS,
  ...segmentedControl.SEGMENTED_DEFAULTS,
  ...switchAxis.SWITCH_DEFAULTS,
  ...checkbox.CHECKBOX_DEFAULTS,
  ...radio.RADIO_DEFAULTS,
  ...choiceCards.CHOICE_CARD_DEFAULTS,
  ...inputs.INPUT_DEFAULTS,
  ...inputGroups.INPUT_GROUP_DEFAULTS,
  ...numberField.NUMBER_FIELD_DEFAULTS,
  ...otpField.OTP_FIELD_DEFAULTS,
  ...pickers.PICKER_DEFAULTS,
  ...calendar.CALENDAR_DEFAULTS,
  ...sliders.SLIDER_DEFAULTS,
  ...menus.MENU_DEFAULTS,
  ...dialogs.DIALOG_DEFAULTS,
  ...popovers.POPOVER_DEFAULTS,
  ...tooltips.TOOLTIP_DEFAULTS,
  ...tabs.TAB_DEFAULTS,
  ...accordion.ACCORDION_DEFAULTS,
  ...breadcrumbs.BREADCRUMB_DEFAULTS,
  ...pagination.PAGINATION_DEFAULTS,
  ...badges.BADGE_DEFAULTS,
  ...kbd.KBD_DEFAULTS,
  ...avatars.AVATAR_DEFAULTS,
  ...tables.TABLE_DEFAULTS,
}

export type StudioStateInput = typeof DEFAULTS

export const SCHEMA = {
  ...color.COLOR_SCHEMA,
  ...type.TYPE_SCHEMA,
  ...icons.ICON_SCHEMA,
  ...shape.SHAPE_SCHEMA,
  ...space.SPACE_SCHEMA,
  ...surfaces.SURFACE_SCHEMA,
  ...focus.FOCUS_SCHEMA,
  ...cursor.CURSOR_SCHEMA,
  ...selection.SELECTION_SCHEMA,
  ...scrollbars.SCROLLBAR_SCHEMA,
  ...disabled.DISABLED_SCHEMA,
  ...invalid.INVALID_SCHEMA,
  ...motion.MOTION_SCHEMA,
  ...mobile.MOBILE_SCHEMA,
  ...charts.CHART_SCHEMA,
  ...links.LINK_SCHEMA,
  ...alert.ALERT_SCHEMA,
  ...toast.TOAST_SCHEMA,
  ...skeleton.SKELETON_SCHEMA,
  ...spinner.SPINNER_SCHEMA,
  ...progress.PROGRESS_SCHEMA,
  ...buttons.BUTTON_SCHEMA,
  ...buttonGroups.BUTTON_GROUP_SCHEMA,
  ...toggles.TOGGLE_SCHEMA,
  ...segmentedControl.SEGMENTED_SCHEMA,
  ...switchAxis.SWITCH_SCHEMA,
  ...checkbox.CHECKBOX_SCHEMA,
  ...radio.RADIO_SCHEMA,
  ...choiceCards.CHOICE_CARD_SCHEMA,
  ...inputs.INPUT_SCHEMA,
  ...inputGroups.INPUT_GROUP_SCHEMA,
  ...numberField.NUMBER_FIELD_SCHEMA,
  ...otpField.OTP_FIELD_SCHEMA,
  ...pickers.PICKER_SCHEMA,
  ...calendar.CALENDAR_SCHEMA,
  ...sliders.SLIDER_SCHEMA,
  ...menus.MENU_SCHEMA,
  ...dialogs.DIALOG_SCHEMA,
  ...popovers.POPOVER_SCHEMA,
  ...tooltips.TOOLTIP_SCHEMA,
  ...tabs.TAB_SCHEMA,
  ...accordion.ACCORDION_SCHEMA,
  ...breadcrumbs.BREADCRUMB_SCHEMA,
  ...pagination.PAGINATION_SCHEMA,
  ...badges.BADGE_SCHEMA,
  ...kbd.KBD_SCHEMA,
  ...avatars.AVATAR_SCHEMA,
  ...tables.TABLE_SCHEMA,
} satisfies Record<keyof typeof DEFAULTS, AxisSchema>

// Every schema key is a state key; `satisfies` covers the reverse.
type StateKey<K extends keyof StudioStateInput> = K
type SchemaKey = StateKey<keyof typeof SCHEMA>

declare const VALID: unique symbol

/** Axis values that passed `validate()` — the only way to mint one. */
export type StudioState = StudioStateInput & { readonly [VALID]: true }

export interface StateIssue {
  key: string
  problem: string
}

export type Validation =
  | { ok: true; state: StudioState }
  | { ok: false; issues: StateIssue[] }

/** Checks raw state against every axis schema. A missing key takes the axis
 *  default; an unknown key or a bad value is an issue — nothing is salvaged. */
export function validate(raw: unknown): Validation {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return { ok: false, issues: [{ key: "", problem: "expected an object" }] }
  const input = raw as Record<string, unknown>
  const issues: StateIssue[] = []
  for (const key of Object.keys(input))
    if (!Object.hasOwn(SCHEMA, key))
      issues.push({ key, problem: "unknown key" })
  const state: Record<string, unknown> = {}
  for (const [key, schema] of Object.entries(SCHEMA)) {
    const value = Object.hasOwn(input, key)
      ? input[key]
      : DEFAULTS[key as SchemaKey]
    const problem = checkAxisValue(schema, value)
    if (problem) issues.push({ key, problem })
    else state[key] = value
  }
  return issues.length > 0
    ? { ok: false, issues }
    : { ok: true, state: state as StudioState }
}

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

/** Every axis value is a primitive, so key-by-key identity is equality. */
export const sameState = (a: StudioState, b: StudioState) =>
  a === b ||
  (Object.keys(SCHEMA) as SchemaKey[]).every((key) => a[key] === b[key])

const RESOLVERS: Array<(state: StudioState) => Resolved> = [
  color.resolveColor,
  type.resolveType,
  icons.resolveIcons,
  shape.resolveShape,
  space.resolveSpace,
  surfaces.resolveSurfaces,
  focus.resolveFocus,
  cursor.resolveCursor,
  selection.resolveSelection,
  scrollbars.resolveScrollbars,
  disabled.resolveDisabled,
  invalid.resolveInvalid,
  motion.resolveMotion,
  mobile.resolveMobile,
  charts.resolveCharts,
  links.resolveLinks,
  alert.resolveAlert,
  toast.resolveToast,
  skeleton.resolveSkeleton,
  spinner.resolveSpinner,
  progress.resolveProgress,
  buttons.resolveButtons,
  buttonGroups.resolveButtonGroups,
  toggles.resolveToggles,
  segmentedControl.resolveSegmentedControl,
  switchAxis.resolveSwitch,
  checkbox.resolveCheckbox,
  radio.resolveRadio,
  choiceCards.resolveChoiceCards,
  inputs.resolveInputs,
  inputGroups.resolveInputGroups,
  numberField.resolveNumberField,
  otpField.resolveOtpField,
  pickers.resolvePickers,
  calendar.resolveCalendar,
  sliders.resolveSliders,
  menus.resolveMenus,
  dialogs.resolveDialogs,
  popovers.resolvePopovers,
  tooltips.resolveTooltips,
  tabs.resolveTabs,
  accordion.resolveAccordion,
  breadcrumbs.resolveBreadcrumbs,
  pagination.resolvePagination,
  badges.resolveBadges,
  kbd.resolveKbd,
  avatars.resolveAvatars,
  tables.resolveTables,
]

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

export function resolveAll(state: StudioState): ResolvedAll {
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
    // (Surfaces: border targets, token overrides; a control: its fill scope)
    // can contribute without owning the recipe.
    if (part.color) color = color ? mergeColor(color, part.color) : part.color
    if (part.icons) icons = part.icons
  }
  return { tokens, params, density, color, icons }
}
