/* The studio's design-system state, and how it becomes a design system.

   Each axis module owns one chapter's slice: its defaults (the state shape),
   its option vocabularies, and `resolve` — the pure mapping from that slice
   to what the engine consumes: global tokens (CSS vars), per-component
   registry params, the density tier, the color recipe, the icon library. No
   React here: the same resolver runs in the panel, the preview, the docs
   demos, and the /r/* registry routes. */

import type { IconLibraryName } from "@/registry/icons/icon-map"
import type { ColorConfig } from "@/registry/theme"
import type { Density } from "@/registry/types"

import * as color from "./color"
import * as type from "./type"
import * as icons from "./icons"
import * as shape from "./shape"
import * as space from "./space"
import * as surfaces from "./surfaces"
import * as focus from "./focus"
import * as cursor from "./cursor"
import * as selection from "./selection"
import * as scrollbars from "./scrollbars"
import * as disabled from "./disabled"
import * as invalid from "./invalid"
import * as motion from "./motion"
import * as mobile from "./mobile"
import * as charts from "./charts"
import * as links from "./links"
import * as notices from "./notices"
import * as skeleton from "./skeleton"
import * as spinner from "./spinner"
import * as progress from "./progress"
import * as buttons from "./buttons"
import * as buttonGroups from "./button-groups"
import * as toggles from "./toggles"
import * as segmentedControl from "./segmented-control"
import * as switchAxis from "./switch"
import * as checkbox from "./checkbox"
import * as radio from "./radio"
import * as choiceCards from "./choice-cards"
import * as inputs from "./inputs"
import * as inputGroups from "./input-groups"
import * as numberField from "./number-field"
import * as otpField from "./otp-field"
import * as pickers from "./pickers"
import * as calendar from "./calendar"
import * as sliders from "./sliders"
import * as menus from "./menus"
import * as dialogs from "./dialogs"
import * as popovers from "./popovers"
import * as tooltips from "./tooltips"
import * as tabs from "./tabs"
import * as accordion from "./accordion"
import * as breadcrumbs from "./breadcrumbs"
import * as pagination from "./pagination"
import * as badges from "./badges"
import * as kbd from "./kbd"
import * as avatars from "./avatars"
import * as tables from "./tables"

/** One chapter's contribution to the resolved design system. */
export interface Resolved {
  /** Global CSS vars written on `:root` (and into the exported theme). */
  tokens?: Record<string, string>
  /** Registry param selections: component → param → value. */
  params?: Record<string, Record<string, string>>
  density?: Density
  color?: ColorConfig
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
  ...notices.NOTICE_DEFAULTS,
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

export type StudioState = typeof DEFAULTS

/** Chapter id (state.ts) → whether its axes drive the preview and export. */
export const WIRED: Record<string, boolean> = {
  "color": color.WIRED,
  "typography": type.WIRED,
  "icons": icons.WIRED,
  "shape": shape.WIRED,
  "space": space.WIRED,
  "surfaces": surfaces.WIRED,
  "focus": focus.WIRED,
  "cursor": cursor.WIRED,
  "selection": selection.WIRED,
  "scrollbars": scrollbars.WIRED,
  "disabled": disabled.WIRED,
  "invalid": invalid.WIRED,
  "motion": motion.WIRED,
  "mobile": mobile.WIRED,
  "charts": charts.WIRED,
  "links": links.WIRED,
  "notices": notices.WIRED,
  "skeleton": skeleton.WIRED,
  "spinner": spinner.WIRED,
  "progress": progress.WIRED,
  "buttons": buttons.WIRED,
  "button-groups": buttonGroups.WIRED,
  "toggles": toggles.WIRED,
  "segmented-control": segmentedControl.WIRED,
  switch: switchAxis.WIRED,
  "checkbox": checkbox.WIRED,
  "radio": radio.WIRED,
  "choice-cards": choiceCards.WIRED,
  "inputs": inputs.WIRED,
  "input-groups": inputGroups.WIRED,
  "number-field": numberField.WIRED,
  "otp-field": otpField.WIRED,
  "pickers": pickers.WIRED,
  "calendar": calendar.WIRED,
  "sliders": sliders.WIRED,
  "menus": menus.WIRED,
  "dialogs": dialogs.WIRED,
  "popovers": popovers.WIRED,
  "tooltips": tooltips.WIRED,
  "tabs": tabs.WIRED,
  "accordion": accordion.WIRED,
  "breadcrumbs": breadcrumbs.WIRED,
  "pagination": pagination.WIRED,
  "badges": badges.WIRED,
  "kbd": kbd.WIRED,
  "avatars": avatars.WIRED,
  "tables": tables.WIRED,
}

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
  notices.resolveNotices,
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

export function resolveAll(state: StudioState): ResolvedAll {
  const tokens: Record<string, string> = {}
  const params: Record<string, Record<string, string>> = {}
  let density: Density | undefined
  let color: ColorConfig | undefined
  let icons: IconLibraryName | undefined
  for (const resolve of RESOLVERS) {
    const part = resolve(state)
    Object.assign(tokens, part.tokens)
    for (const [component, selections] of Object.entries(part.params ?? {})) {
      params[component] = { ...params[component], ...selections }
    }
    if (part.density) density = part.density
    if (part.color) color = part.color
    if (part.icons) icons = part.icons
  }
  return { tokens, params, density, color, icons }
}
