/* Looks the studio can't express yet, as data. Every gap a reference pack
   records (`refs/<id>/gaps.json`) names a look from this vocabulary, so
   `presets:gaps` can count systems per look and per pattern, and the ledger
   (#1020) is a generated view instead of prose. */

import type { Measures, Prop } from "./probe"

/** The kinds of gap, by what a fix would change. A look id starts with its
 *  pattern's prefix. */
export const PATTERNS = {
  size: { prefix: "size", label: "Sizes apart from density" },
  "type-role": { prefix: "type", label: "Type roles" },
  surface: { prefix: "surface", label: "Surfaces per element" },
  "color-routing": { prefix: "ink", label: "Color routing" },
  corners: { prefix: "radius", label: "Corners apart from the rungs" },
  "color-engine": { prefix: "color", label: "Color engine" },
  anatomy: { prefix: "anatomy", label: "Anatomy" },
  state: { prefix: "state", label: "States" },
  flourish: { prefix: "flourish", label: "Flourishes" },
  "font-catalog": { prefix: "font", label: "Font catalog" },
} as const

export type Pattern = keyof typeof PATTERNS

interface Look {
  label: string
  /** The specimen values that show the look, as "<part> <prop>" (a part
   *  ending in `.*` matches it and its variants, `*.x` any part ending in
   *  `.x`, `*` any part), so a measured row
   *  that stays off can be filed under it. */
  measures?: readonly string[]
}

const look = (label: string, ...measures: string[]): Look => ({
  label,
  ...(measures.length ? { measures } : {}),
})

/* Within a pattern, a look that claims a row more narrowly comes first:
   `lookOf` takes the first match. */
export const LOOKS = {
  "size.switch": look("Switch size", "switch.* height"),
  "size.check": look(
    "Checkbox and radio size",
    "checkbox.* height",
    "radio.* height",
  ),
  "size.badge": look("Badge size", "badge.* height", "badge.* paddingInline"),
  "size.keycap": look("Keycap size", "kbd height", "kbd paddingInline"),
  "size.tooltip": look(
    "Tooltip size",
    "tooltip height",
    "tooltip paddingInline",
  ),
  "size.nav-row": look("Sidebar row height", "nav.item.* height"),
  "size.tab-height": look("Tab height", "tab.* height"),
  "size.tab-padding": look("Tab padding", "tab.* paddingInline"),
  "size.segmented": look("Segmented control height", "segmented.* height"),
  "size.calendar-day": look("Calendar day cell size", "calendar.* height"),
  "size.pagination": look(
    "Pagination item size",
    "pagination.current height",
    "pagination.current paddingInline",
  ),
  "size.progress": look("Progress track height", "progress height"),
  "size.button-quiet": look(
    "Quiet button size",
    "button.quiet height",
    "button.quiet paddingInline",
  ),
  "size.button-padding": look(
    "Button inline padding",
    "button.primary paddingInline",
    "button.secondary paddingInline",
  ),
  "size.button": look(
    "Button height apart from density",
    "button.primary height",
    "button.secondary height",
    "button.icon height",
  ),
  "size.button-icon-padding": look("Button padding beside an icon"),
  "size.field-padding": look(
    "Field inline padding",
    "input paddingInline",
    "select.trigger paddingInline",
  ),
  "size.field-height": look(
    "Field height between the control steps",
    "input height",
  ),
  "size.command-row": look("Command palette row height", "command.item height"),
  "size.menu-row": look("Menu row height", "menu.item height"),
  "size.menu-inset": look(
    "Menu label inset",
    "menu.item paddingInline",
    "command.item paddingInline",
  ),
  "size.overlay-width": look("Overlay widths"),
  "size.dialog-padding": look("Dialog padding"),
  "size.toast": look("Toast width"),
  "size.table-row": look("Table row height"),
  "size.table-padding": look("Table cell inset"),
  "size.accordion-inset": look("Accordion row inset"),

  "type.field-label": look(
    "Field label size and weight",
    "field.label fontSize",
    "field.label fontWeight",
  ),
  "type.heading-size": look("Heading sizes", "heading.* fontSize"),
  "type.heading-weight": look("Heading weight", "heading.* fontWeight"),
  "type.keycap": look(
    "Keycap label type",
    "kbd fontSize",
    "kbd fontWeight",
    "kbd fontFamily",
  ),
  "type.badge": look(
    "Badge label weight",
    "badge.* fontWeight",
    "badge.* fontSize",
  ),
  "type.button-quiet": look("Quiet button weight", "button.quiet fontWeight"),
  "type.menu-row": look(
    "Menu row type",
    "menu.item fontWeight",
    "menu.item fontSize",
  ),
  "type.tooltip": look(
    "Tooltip text",
    "tooltip fontSize",
    "tooltip fontWeight",
  ),
  "type.calendar-day": look(
    "Calendar numerals",
    "calendar.* fontSize",
    "calendar.* fontWeight",
  ),
  "type.segmented": look("Segmented item weight", "segmented.* fontWeight"),
  "type.link": look("Link weight", "link fontWeight"),
  "type.body-size": look("Body text size", "text fontSize", "text.* fontSize"),
  "type.tracking": look("Letter spacing per role", "* letterSpacing"),
  "type.weight-steps": look("Weights between the standard steps"),
  "type.caption": look("Caption text size"),
  "type.select-value": look("Select value type"),
  "type.field-value": look("Field value size"),
  "type.choice-label": look("Checkbox, radio and switch label weight"),
  "type.reading-body": look("Body copy in the reading face"),
  "type.tab-label": look("Tab labels in the heading face"),
  "type.display-font": look("Display face"),
  "type.display-case": look("Display title case"),
  "type.case": look("Capitals beyond buttons and badges"),
  "type.control-size": look("Two control text sizes"),
  "type.notification-title": look("Notification title weight"),
  "type.menu-section": look("Menu section headers"),
  "type.command-input": look("Command search text size"),
  "type.dialog-title": look("Dialog title size"),
  "type.table-header": look("Table header labels"),
  "type.accordion-title": look("Accordion title weight"),
  "type.pagination": look("Pagination number weight"),
  "type.scale-off": look("Type sizes off the scale"),

  "surface.switch-off": look(
    "Off switch track",
    "switch.off backgroundColor",
    "switch.off edge",
  ),
  "surface.keycap": look(
    "Keycap fill and edge",
    "kbd backgroundColor",
    "kbd edge",
    "kbd boxShadow",
  ),
  "surface.toggle": look(
    "Toggle buttons apart from Button",
    "toggle.* backgroundColor",
    "toggle.* edge",
  ),
  "surface.segmented-chip": look(
    "Segmented selected chip",
    "segmented.selected backgroundColor",
    "segmented.selected edge",
    "segmented.selected boxShadow",
  ),
  "surface.segmented-track": look(
    "Segmented track",
    "segmented backgroundColor",
    "segmented edge",
  ),
  "surface.select-trigger": look(
    "Select trigger plate",
    "select.trigger backgroundColor",
    "select.trigger edge",
  ),
  "surface.field-fill": look("Field fill", "input backgroundColor"),
  "surface.button-secondary": look(
    "Secondary button surface",
    "button.secondary backgroundColor",
    "button.secondary edge",
  ),
  "surface.check-fill": look("Checkbox fill", "checkbox backgroundColor"),
  "surface.check-clear": look(
    "Checked boxes that stay clear",
    "checkbox.checked backgroundColor",
  ),
  "surface.check-edge": look(
    "Checkbox and radio edge",
    "checkbox edge",
    "radio edge",
  ),
  "surface.radio-checked": look("Checked radio edge", "radio.checked edge"),
  "surface.overlay-edge": look(
    "Overlay edge apart from cards",
    "menu edge",
    "dialog edge",
    "command edge",
  ),
  "surface.overlay-shadow": look(
    "Overlay shadow per kind",
    "menu boxShadow",
    "dialog boxShadow",
    "command boxShadow",
  ),
  "surface.tooltip-shadow": look("Tooltip shadow", "tooltip boxShadow"),
  "surface.alert-shadow": look("Alert shadow", "alert boxShadow"),
  "surface.alert-edge": look("Alert edge thicker than the hairline"),
  "surface.control-shadow": look(
    "Small drop under some controls",
    "select.trigger boxShadow",
    "checkbox boxShadow",
  ),
  "surface.panel-edge": look("Page panel edge", "panel edge"),
  "surface.badge-neutral": look(
    "Neutral badge surface",
    "badge backgroundColor",
    "badge edge",
  ),
  "surface.badge-edge": look("Soft badge edge", "badge.accent edge"),
  "surface.card-dark": look("Dark cards on the page tone"),
  "surface.overlay-dark": look("Dark overlays on the card or page tone"),
  "surface.tooltip-dark": look("Tooltips that stay dark in dark mode"),
  "surface.tooltip-chip": look("Tooltips as a mid-gray chip"),
  "surface.menu-highlight": look("Option highlight as a brand tint"),
  "surface.scrim": look("Dialog scrim per mode and kind"),
  "surface.hairline-width": look("Half-pixel hairlines"),
  "surface.field-layer": look("Layer-aware fields"),
  "surface.layers-tonal": look("Deeper tonal layers"),
  "surface.tabs-rule": look("Line tabs rule"),
  "surface.divider-weight": look("Dividers in the control stroke"),
  "surface.command-translucent": look("Translucent command palette"),
  "surface.command-edge": look("Command palette rim"),
  "surface.header-translucent": look("Translucent sticky headers"),

  "ink.row-rest": look(
    "Row, tab and segmented ink at rest",
    "nav.item color",
    "tab color",
    "segmented.item color",
    "menu.item color",
    "command.item color",
  ),
  "ink.tab-selected": look("Selected tab label color", "tab.selected color"),
  "ink.button-quiet": look("Quiet button ink", "button.quiet color"),
  "ink.switch-on": look("Switch on color", "switch.on backgroundColor"),
  "ink.calendar-today": look(
    "Today marker color",
    "calendar.today backgroundColor",
    "calendar.today color",
  ),
  "ink.calendar-selected": look(
    "Calendar selection color",
    "calendar.selected backgroundColor",
  ),
  "ink.progress-track": look(
    "Progress track color",
    "progress backgroundColor",
  ),
  "ink.progress-fill": look(
    "Progress fill color",
    "progress.fill backgroundColor",
  ),
  "ink.keycap": look("Keycap label ink", "kbd color"),
  "ink.alert-text": look("Alert text ink", "alert color"),
  "ink.pagination-current": look(
    "Current page fill",
    "pagination.current backgroundColor",
  ),
  "ink.button-primary": look("Two primary buttons"),
  "ink.button-icon": look("Quiet icon button ink"),
  "ink.button-danger": look("Danger buttons in danger ink"),
  "ink.soft-neutral": look("Neutral soft fills in secondary ink"),
  "ink.selected-row": look("Selected list rows in the brand"),
  "ink.choice-card": look("Selected choice card ink"),
  "ink.second-accent": look("Links and selection in a second accent"),
  "ink.tab-indicator": look("Line-tab indicator color"),
  "ink.tab-pill": look("Pill tab tones"),
  "ink.nav-marker": look("Nav marker in the brand"),
  "ink.switch-knob": look("Switch knob color"),
  "ink.slider": look("Slider range and knob colors"),
  "ink.radio-edge": look("Radios edged in the brand"),
  "ink.menu-row": look("Menu rows in the brand ink"),
  "ink.menu-check": look("Menu checkmarks in the accent"),
  "ink.badge-soft": look("Soft badge tints per mode"),
  "ink.categorical": look("Categorical label colors"),
  "ink.info-seed": look("Info status seed"),
  "ink.accordion-panel": look("Accordion panel ink"),
  "ink.heading-muted": look("Section headings in muted ink"),

  "radius.keycap": look("Keycap corners", "kbd borderRadius"),
  "radius.segmented": look("Segmented corners", "segmented.* borderRadius"),
  "radius.alert": look("Alert corners", "alert borderRadius"),
  "radius.tooltip": look("Tooltip corners", "tooltip borderRadius"),
  "radius.badge": look("Badge corners", "badge.* borderRadius"),
  "radius.check": look("Checkbox corners", "checkbox.* borderRadius"),
  "radius.card": look("Card corners", "card borderRadius"),
  "radius.squircle": look("Superellipse corners"),
  "radius.dialog": look("Dialog corners", "dialog borderRadius"),
  "radius.command": look("Command palette corners", "command borderRadius"),
  "radius.command-row": look(
    "Command palette row corners",
    "command.item borderRadius",
  ),
  "radius.menu-row": look("Menu row corners", "menu.item borderRadius"),
  "radius.button-icon": look("Icon button corners", "button.icon borderRadius"),
  "radius.button": look(
    "Button corners apart from fields",
    "button.* borderRadius",
  ),
  "radius.control-size": look("Control corners per control size"),
  "radius.tab-pill": look("Pill tab corners", "tab.* borderRadius"),
  "radius.progress-fill": look(
    "Progress fill leading end",
    "progress.fill borderRadius",
  ),
  "radius.progress": look("Progress corners", "progress borderRadius"),
  "radius.calendar-today": look(
    "Today marker shape",
    "calendar.today borderRadius",
  ),
  "radius.overlay": look("Overlay corners in a square system"),
  "radius.drawer": look("Docked drawer corners"),

  "state.focus-color": look("Focus ring color", "*.focus ring"),
  "state.focus-field-edge": look("Focused field edge", "input.focus edge"),
  "state.focus-flush": look("Focus line over the edge", "button.focus edge"),
  "state.focus-per-kind": look("Focus ring width and offset per control"),
  "state.focus-double": look("Focus ring over a page-colored line"),
  "state.focus-glow": look("Focus glow"),
  "state.focus-fill": look("Focus as a fill"),
  "state.invalid-field": look("Invalid field treatment"),
  "state.disabled": look("Disabled treatment"),

  "anatomy.shell-header": look("Full-width header above the side nav"),
  "anatomy.nav-filled-icon": look(
    "Current nav item marked by weight and a filled icon",
  ),
  "anatomy.button-layout": look("Button layout with a trailing icon slot"),
  "anatomy.field-label-inside": look("Labels inside the field"),
  "anatomy.choice-card": look("Choice card radio placement"),
  "anatomy.slider-thumb": look("Slider thumb as a bar"),
  "anatomy.search-pill": look("Search field as a pill"),
  "anatomy.tabs-top": look("Line tabs marked along the top"),
  "anatomy.tabs-chip": look("Chip tabs"),
  "anatomy.tabs-ink": look("Tabs marked by ink alone"),
  "anatomy.tabs-folder": look("Folder tabs", "tab.selected edge"),
  "anatomy.tabs-dot": look("Tabs marked by a dot"),
  "anatomy.segmented-trackless": look("Segmented control with no track"),
  "anatomy.segmented-joined": look("Segmented control as joined buttons"),
  "anatomy.calendar-today": look("Today marker shape and line"),
  "anatomy.calendar-weekend": look("Weekend columns banded"),
  "anatomy.notification": look("Notifications with a status stripe"),
  "anatomy.menu-dividers": look("Hairlines between options"),
  "anatomy.menu-trailing-icon": look("Menu icons after the label"),
  "anatomy.dialog-header": look("Dialog title centered in the header"),
  "anatomy.dialog-centered": look("Centered dialog content"),
  "anatomy.dialog-close": look("Dialogs with no close button"),
  "anatomy.badge-per-tone": look("Badge shape per tone"),
  "anatomy.badge-tag": look("Badges and tags styled apart"),
  "anatomy.badge-text": look("Tags as plain text"),
  "anatomy.check-square": look("A filled inner square as the check mark"),
  "anatomy.alert-header": look("Banners with a status header"),
  "anatomy.table-frame": look("Tables with no outer frame"),
  "anatomy.card-rule": look("Cards drawn as a top rule"),
  "anatomy.table-columns": look("Table column rules"),
  "anatomy.accordion-marker": look("Accordion marker under the title"),
  "anatomy.pagination-current": look("Current page over a bar"),

  "flourish.card-bezel": look("Double-bezel cards"),
  "flourish.button-gradient": look("Gradient CTA fill"),
  "flourish.button-hero": look("Hero CTA finish"),
  "flourish.toggle-morph": look("Selected toggles change shape"),
  "flourish.press-morph": look("Pressed buttons change shape"),
  "flourish.badge-skew": look("Skewed promo badges"),
  "flourish.ledge-depth": look("Ledge depth"),

  "font.ibm-plex-mono": look("IBM Plex Mono in the catalog"),
  "font.space-mono": look("Space Mono in the catalog"),

  "color.accent-per-mode": look("An accent that changes per mode"),
  "color.ink-light": look("Light-mode ink lightness"),
  "color.ink-dark": look("Dark-mode ink lightness"),
  "color.ink-muted": look("Muted ink lightness"),
  "color.ink-steps": look("Text ink in several steps"),
  "color.neutral-chroma": look("More strongly tinted neutrals"),
  "color.neutral-tint-per-mode": look("A neutral tint per mode"),
  "color.shell-dark": look("A deeper dark shell"),
  "color.inverse": look("Inverse surfaces off the ink"),
  "color.field-line": look("Field line step"),
  "color.check-edge": look("Check edge step"),
  "color.edge-ink": look("Outline edges in full ink"),
  "color.link": look("Link ink step"),
  "color.selection-seed": look("Selection on its exact seed"),
  "color.secondary-role": look("A secondary color role"),
  "color.solid-neutral-dark": look("Neutral solid brighter in dark"),
  "color.focus-step": look("Focus on an opaque accent step"),
  "color.overlay-line": look("Overlay hairline step"),
  "color.one-line": look("One hairline for everything"),
  "color.surface-line": look("Surface hairline strength"),
  "color.card-dark": look("Dark cards two steps up"),
  "color.soft-accent": look("Soft accent fill steps"),
  "color.soft-dark": look("Soft fills in dark"),
  "color.status-tint": look("Stronger status tints"),
  "color.on-brand": look("Labels on brand solids"),
  "color.on-selection": look("Selection solid labelled in the brand"),
  "color.neutral-fill": look("A deeper neutral fill"),
  "color.nav-active-dark": look("Current sidebar row in dark"),
  "color.brand-tint-dark": look("Brand tints that turn neutral in dark"),
  "color.gray-alpha-steps": look("Gray alpha steps"),
  "color.segmented-track-dark": look("Segmented track sunk in dark"),
  "color.alert-line": look("Alert edge step"),
  "color.brand-ink": look("Text in the brand ink"),
} satisfies Record<string, Look>

export type LookId = keyof typeof LOOKS

export const patternOf = (id: string): Pattern | undefined =>
  (Object.keys(PATTERNS) as Pattern[]).find((pattern) =>
    id.startsWith(`${PATTERNS[pattern].prefix}.`),
  )

const matches = (measure: string, part: string, prop: Prop) => {
  const [want = "", wantProp] = measure.split(" ")
  if (wantProp !== prop) return false
  if (want === "*") return true
  if (want.startsWith("*.")) return part.endsWith(want.slice(1))
  // "badge.*" is the badge and its variants.
  return want.endsWith(".*")
    ? part === want.slice(0, -2) || part.startsWith(want.slice(0, -1))
    : part === want
}

/** The look a measured row that stays off belongs to, if any claims it. */
export function lookOf(part: string, prop: Prop): LookId | undefined {
  return (Object.keys(LOOKS) as LookId[]).find((id) =>
    (LOOKS[id] as Look).measures?.some((measure) =>
      matches(measure, part, prop),
    ),
  )
}

/** One look a system needs, as its pack records it. */
export interface Gap {
  look: LookId
  /** The look as worded where it was found (a ledger row's headline). */
  title: string
  /** What this system does: its values and where they show. */
  note?: string
  /** What the preset uses instead today. */
  standin?: string
  /** "ledger" (backfilled from #1020), "hand", or "fit <probe>". */
  source: string
  /** Fit residuals: the rows no key closes, as measured. */
  rows?: {
    mode: "light" | "dark"
    part: string
    prop: Prop
    reference: string
    preset: string
  }[]
  /** Fit residuals: the reference values those rows read, by mode. */
  values?: { light?: Measures; dark?: Measures }
}

/** `refs/<id>/gaps.json`: one file per pack, written only by its thread. */
export interface GapsFile {
  gaps: Gap[]
}

/** Systems whose need alone moves a look toward the bar (CLAUDE.md, the
 *  presets README): three systems, or two with one of these. */
export const NORTH_STARS = ["material3", "vercel", "linear"] as const

export interface LedgerRow {
  look: LookId
  label: string
  pattern: Pattern
  /** Pack ids, sorted. */
  systems: string[]
  /** Meets the proposal bar; color engine looks go to the engine rewrite
   *  instead. */
  bar: boolean
}

/** Every look some pack needs, most-needed first. */
export function ledger(packs: Record<string, GapsFile>): LedgerRow[] {
  const systems = new Map<LookId, Set<string>>()
  for (const [pack, file] of Object.entries(packs))
    for (const gap of file.gaps)
      systems.set(gap.look, (systems.get(gap.look) ?? new Set()).add(pack))
  return [...systems]
    .map(([id, set]): LedgerRow => {
      const list = [...set].sort()
      const pattern = patternOf(id) as Pattern
      const stars = list.filter((pack) =>
        (NORTH_STARS as readonly string[]).includes(pack),
      ).length
      return {
        look: id,
        label: LOOKS[id].label,
        pattern,
        systems: list,
        bar:
          pattern !== "color-engine" &&
          (list.length >= 3 || (list.length === 2 && stars > 0)),
      }
    })
    .sort(
      (a, b) =>
        b.systems.length - a.systems.length || a.look.localeCompare(b.look),
    )
}
