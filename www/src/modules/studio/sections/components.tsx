"use client"

/* Components — one row per component, grouped in chapters. A component with
   one key is that key's row; the others open a page of their rows. */

import { useContext } from "react"

import { DEFAULTS } from "../axes"
import { DialLink, ModifiedDot } from "../dial"
import { Row } from "../family-page"
import { PanelNav } from "../rows"
import type { Chapter, ChapterPage, Studio } from "../state"
import { valueLabel } from "../use-axis"
import type { AxisKey } from "../use-axis"

export interface Component {
  /** Also its page's id and deep link: `/studio#<id>`. */
  id: string
  label: string
  chapter: string
  /** Its rows in order, lead first, each with its name on the page (a
   *  single row is named for the component; search knows it by both). */
  rows: [AxisKey, string][]
  /** Rows whose home is another component's page, shown here too. */
  hosts?: AxisKey[]
  /** Keys edited inside one of its rows' popovers. */
  holds?: AxisKey[]
  /** Other names search answers to. */
  aliases?: string[]
  /** The main page's value, by the lead's value, where its option label
   *  alone wouldn't name the component's look. */
  says?: Record<string, string>
}

export const COMPONENTS: Component[] = [
  {
    id: "button",
    label: "Button",
    chapter: "actions",
    rows: [
      ["buttonStyle", "Style"],
      ["buttonSecondary", "Secondary"],
      ["buttonPress", "Press"],
      ["buttonRadius", "Corners"],
      ["buttonCase", "Case"],
      ["toggleSelected", "Toggled"],
      ["buttonColor", "Color"],
      ["buttonMotion", "Motion"],
    ],
    holds: ["groupSeparator"],
    aliases: [
      "Buttons",
      "Toggle button",
      "Button group",
      "Toggle button group",
      "File trigger",
    ],
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    chapter: "actions",
    rows: [
      ["segmentedSelected", "Selected"],
      ["segmentedTrack", "Track"],
      ["segmentedMotion", "Motion"],
    ],
  },
  {
    id: "link",
    label: "Link",
    chapter: "actions",
    says: {
      always: "Underlined",
      hover: "Underline on hover",
      never: "No underline",
    },
    rows: [
      ["linkUnderline", "Underline"],
      ["linkColor", "Color"],
      ["linkMotion", "Motion"],
    ],
  },
  {
    id: "field",
    label: "Field",
    chapter: "forms",
    rows: [
      ["inputStyle", "Style"],
      ["inputHover", "Hover"],
      ["inputHeight", "Height"],
      ["fieldLabel", "Label"],
      ["inputError", "Error message"],
      ["fieldMotion", "Motion"],
    ],
    aliases: [
      "Inputs",
      "Input",
      "Text field",
      "Text area",
      "Textarea",
      "Search field",
      "Input group",
      "Token field",
      "Mention",
    ],
  },
  {
    id: "select",
    label: "Select",
    chapter: "forms",
    says: { field: "Field trigger", button: "Button trigger" },
    rows: [
      ["selectTrigger", "Trigger"],
      ["pickerCaret", "Caret"],
      ["mobilePickers", "On mobile"],
    ],
    aliases: ["Combobox", "Picker"],
  },
  {
    id: "number-field",
    label: "Number field",
    chapter: "forms",
    rows: [["numberLayout", "Steppers"]],
  },
  {
    id: "otp-field",
    label: "OTP field",
    chapter: "forms",
    rows: [["otpStyle", "Cells"]],
  },
  {
    id: "checkbox",
    label: "Checkbox",
    chapter: "forms",
    says: { auto: "Rounded corners", sharp: "Sharp corners" },
    rows: [
      ["checkCorner", "Corner"],
      ["checkEdge", "Edge"],
      ["checkboxColor", "Color"],
      ["checkboxMotion", "Motion"],
    ],
    aliases: ["Checkbox group", "Selection"],
  },
  {
    id: "radio",
    label: "Radio",
    chapter: "forms",
    rows: [
      ["radioMark", "Mark"],
      ["radioColor", "Color"],
      ["checkboxMotion", "Motion"],
    ],
    hosts: ["checkboxMotion"],
    aliases: ["Radio group"],
  },
  {
    id: "switch",
    label: "Switch",
    chapter: "forms",
    rows: [
      ["switchStyle", "Style"],
      ["switchColor", "Color"],
      ["switchMotion", "Motion"],
    ],
  },
  {
    id: "slider",
    label: "Slider",
    chapter: "forms",
    rows: [
      ["sliderThumb", "Thumb"],
      ["sliderTrack", "Track"],
      ["sliderColor", "Color"],
      ["sliderMotion", "Motion"],
    ],
  },
  {
    id: "choice-card",
    label: "Choice card",
    chapter: "forms",
    rows: [
      ["cardSelected", "Selected"],
      ["cardColor", "Color"],
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    chapter: "forms",
    says: { same: "Days like buttons", circle: "Circle days" },
    rows: [
      ["calendarDayShape", "Day shape"],
      ["calendarToday", "Today"],
      ["calendarTodayColor", "Today color"],
      ["calendarWeekdays", "Weekdays"],
      ["calendarMotion", "Motion"],
    ],
    aliases: [
      "Date & time",
      "Date picker",
      "Date range picker",
      "Date field",
      "Time field",
      "Time picker",
    ],
  },
  {
    id: "menu",
    label: "Menu",
    chapter: "overlays",
    rows: [
      ["menuInset", "Items"],
      ["menuHighlight", "Highlight"],
      ["menuIndicator", "Check"],
      ["menuSelectedRow", "Selected row"],
      ["menuRows", "Rows"],
      ["popoverMotion", "Motion"],
    ],
    hosts: ["popoverMotion"],
    aliases: ["Menus", "Dropdown", "Context menu", "List box"],
  },
  {
    id: "popover",
    label: "Popover",
    chapter: "overlays",
    says: {
      tooltips: "Arrows on tooltips",
      none: "No arrows",
      popovers: "Arrows on popovers",
      both: "Arrows everywhere",
    },
    rows: [
      ["menuArrows", "Arrows"],
      ["popoverEntrance", "Entrance"],
      ["popoverMotion", "Motion"],
    ],
  },
  {
    id: "tooltip",
    label: "Tooltip",
    chapter: "overlays",
    rows: [
      ["tooltipStyle", "Style"],
      ["tooltipEntrance", "Entrance"],
      ["tooltipMotion", "Motion"],
    ],
  },
  {
    id: "command",
    label: "Command",
    chapter: "overlays",
    says: { field: "Search field", bar: "Search bar", prompt: "Prompt" },
    rows: [
      ["menuSearch", "Search"],
      ["menuScale", "Scale"],
    ],
    aliases: ["Command palette"],
  },
  {
    id: "dialog",
    label: "Dialog",
    chapter: "overlays",
    rows: [
      ["dialogBackdrop", "Backdrop"],
      ["dialogSections", "Sections"],
      ["dialogActions", "Actions"],
      ["dialogClose", "Close"],
      ["dialogPosition", "Position"],
      ["dialogEntrance", "Entrance"],
      ["mobileDialogs", "On mobile"],
      ["dialogMotion", "Motion"],
    ],
    holds: ["dialogBackdropStrength", "dialogFrost"],
    aliases: ["Dialogs", "Modal", "Alert dialog"],
  },
  {
    id: "sheet",
    label: "Sheet",
    chapter: "overlays",
    rows: [
      ["drawerEdge", "Edge"],
      ["sheetMotion", "Motion"],
    ],
    aliases: ["Drawer"],
  },
  {
    id: "tabs",
    label: "Tabs",
    chapter: "navigation",
    rows: [
      ["tabStyle", "Style"],
      ["tabIndicator", "Indicator"],
      ["tabsPill", "Pill fill"],
      ["tabsColor", "Color"],
      ["navWeight", "Weight"],
      ["navCase", "Case"],
      ["tabsMotion", "Motion"],
    ],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    chapter: "navigation",
    rows: [
      ["navMarker", "Current item"],
      ["navItemWeight", "Weight"],
      ["sidebarMotion", "Motion"],
    ],
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    chapter: "navigation",
    rows: [
      ["breadcrumbSeparator", "Separator"],
      ["breadcrumbTone", "Ancestors"],
    ],
  },
  {
    id: "pagination",
    label: "Pagination",
    chapter: "navigation",
    rows: [["paginationCurrent", "Current page"]],
  },
  {
    id: "accordion",
    label: "Accordion",
    chapter: "navigation",
    rows: [
      ["accordionContainer", "Layout"],
      ["accordionMarker", "Marker"],
      ["accordionMotion", "Motion"],
    ],
    aliases: ["Collapsible"],
  },
  {
    id: "card",
    label: "Card",
    chapter: "data",
    says: { none: "Plain header", rule: "Ruled header", band: "Banded header" },
    rows: [
      ["cardHeader", "Header"],
      ["cardFooter", "Footer"],
    ],
  },
  {
    id: "table",
    label: "Table",
    chapter: "data",
    says: { plain: "Plain header", filled: "Filled header" },
    rows: [
      ["tableHeader", "Header"],
      ["tableHeaderLabel", "Header label"],
      ["tableMotion", "Motion"],
    ],
    aliases: ["Tree"],
  },
  {
    id: "badge",
    label: "Badge",
    chapter: "data",
    rows: [
      ["badgeStyle", "Style"],
      ["badgeShape", "Shape"],
      ["badgeCase", "Case"],
    ],
    aliases: ["Tag group", "Tag"],
  },
  {
    id: "avatar",
    label: "Avatar",
    chapter: "data",
    rows: [
      ["avatarShape", "Shape"],
      ["avatarFallback", "Fallback"],
    ],
  },
  {
    id: "kbd",
    label: "Kbd",
    chapter: "data",
    rows: [["kbdTreatment", "Style"]],
  },
  {
    id: "chart",
    label: "Chart",
    chapter: "data",
    says: {
      mono: "Mono palette",
      vivid: "Vivid palette",
      muted: "Muted palette",
    },
    rows: [
      ["chartPalette", "Palette"],
      ["chartGrid", "Gridlines"],
      ["chartMotion", "Motion"],
    ],
    aliases: ["Charts", "Area chart", "Bar chart", "Line chart", "Pie chart"],
  },
  {
    id: "alert",
    label: "Alert",
    chapter: "feedback",
    rows: [["alertStyle", "Style"]],
    aliases: ["Empty"],
  },
  {
    id: "toast",
    label: "Toast",
    chapter: "feedback",
    rows: [
      ["toastStyle", "Style"],
      ["toastStatus", "Status"],
      ["toastMotion", "Motion"],
    ],
  },
  {
    id: "progress",
    label: "Progress",
    chapter: "feedback",
    rows: [
      ["progressTrack", "Thickness"],
      ["progressTrackStyle", "Track"],
      ["progressColor", "Fill"],
      ["progressMotion", "Motion"],
    ],
    aliases: ["Progress bar"],
  },
  {
    id: "spinner",
    label: "Spinner",
    chapter: "feedback",
    rows: [["spinnerStyle", "Style"]],
    aliases: ["Loader"],
  },
  {
    id: "skeleton",
    label: "Skeleton",
    chapter: "feedback",
    rows: [["skeletonAnimation", "Animation"]],
  },
]

/** A component with one row is that row, on the main page. */
export const isSingle = (component: Component) => component.rows.length === 1

/** Every key a component's rows edit, hosted ones included. */
export const keysOf = (component: Component): AxisKey[] => [
  ...component.rows.map(([key]) => key),
  ...(component.holds ?? []),
]

/** The keys whose home is the component. */
const homeKeys = (component: Component) =>
  keysOf(component).filter((key) => !component.hosts?.includes(key))

function ComponentRow({
  component,
  studio,
}: {
  component: Component
  studio: Studio
}) {
  const open = useContext(PanelNav)
  const [lead] = component.rows[0] ?? []
  if (!lead) return null
  // Its id stands in for a page, so the preview focuses it like one.
  if (isSingle(component))
    return (
      <div data-page={component.id} className="contents">
        <Row axis={lead} label={component.label} />
      </div>
    )
  const modified = keysOf(component).some(
    (key) => studio.state[key] !== DEFAULTS[key],
  )
  return (
    <DialLink
      label={component.label}
      onPress={() => open(component.id)}
      value={
        <>
          {modified && <ModifiedDot />}
          <span className="truncate">
            {component.says?.[String(studio.effective[lead])] ??
              valueLabel(lead, studio.effective[lead])}
          </span>
        </>
      }
    />
  )
}

const pageOf = (component: Component): ChapterPage => ({
  id: component.id,
  label: component.label,
  owners: homeKeys(component),
  aliases: component.aliases,
  rows: component.rows.map(([key, name]) => ({ name, key })),
  Body: function ComponentPage() {
    return component.rows.map(([key, label]) => (
      <Row key={key} axis={key} label={label} />
    ))
  },
})

const GROUPS: { id: string; label: string }[] = [
  { id: "actions", label: "Actions" },
  { id: "forms", label: "Forms" },
  { id: "overlays", label: "Overlays" },
  { id: "navigation", label: "Navigation" },
  { id: "data", label: "Data display" },
  { id: "feedback", label: "Feedback" },
]

export const COMPONENT_CHAPTERS: Chapter[] = GROUPS.map(({ id, label }) => {
  const members = COMPONENTS.filter((component) => component.chapter === id)
  return {
    id,
    label,
    owners: members.filter(isSingle).flatMap(homeKeys),
    // A one-row component is its row: search knows it by the row's name too.
    rows: members.filter(isSingle).map(({ label, aliases = [], rows }) => ({
      name: label,
      key: rows[0]?.[0],
      aliases: [...aliases, ...rows.map(([, name]) => name)],
    })),
    Body: function ComponentRows({ studio }: { studio: Studio }) {
      return members.map((component) => (
        <ComponentRow
          key={component.id}
          component={component}
          studio={studio}
        />
      ))
    },
    pages: members.filter((component) => !isSingle(component)).map(pageOf),
  }
})
