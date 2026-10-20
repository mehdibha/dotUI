"use client"

/* Components — one row per component, A to Z. A component with one key is
   that key's row; the others open a page of their rows. */

import type { Chapter, ChapterPage } from "../chapters"
import { DialLink } from "../dial"
import { Row } from "../row-host"
import { valueLabel } from "../use-axis"
import type { AxisKey } from "../use-axis"
import type { Studio } from "../use-studio"

interface Component {
  /** Also its page's id and deep link: `/studio#<id>`. */
  id: string
  label: string
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
    id: "accordion",
    label: "Accordion",
    rows: [
      ["accordionContainer", "Layout"],
      ["accordionMarker", "Marker"],
      ["accordionMotion", "Motion"],
    ],
    aliases: ["Collapsible"],
  },
  {
    id: "alert",
    label: "Alert",
    rows: [["alertStyle", "Style"]],
    aliases: ["Empty"],
  },
  {
    id: "avatar",
    label: "Avatar",
    rows: [
      ["avatarShape", "Shape"],
      ["avatarFallback", "Fallback"],
    ],
  },
  {
    id: "badge",
    label: "Badge",
    rows: [
      ["badgeStyle", "Style"],
      ["badgeShape", "Shape"],
      ["badgeCase", "Case"],
    ],
    aliases: ["Tag group", "Tag"],
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    rows: [
      ["breadcrumbSeparator", "Separator"],
      ["breadcrumbTone", "Ancestors"],
    ],
  },
  {
    id: "button",
    label: "Button",
    rows: [
      ["buttonStyle", "Style"],
      ["buttonSecondary", "Secondary"],
      ["buttonPress", "Press"],
      ["buttonRadius", "Corners"],
      ["buttonCase", "Case"],
      ["labelWeight", "Label weight"],
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
    id: "calendar",
    label: "Calendar",
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
    id: "card",
    label: "Card",
    says: { none: "Plain header", rule: "Ruled header", band: "Banded header" },
    rows: [
      ["cardHeader", "Header"],
      ["cardFooter", "Footer"],
      ["titleStyle", "Titles"],
    ],
  },
  {
    id: "chart",
    label: "Chart",
    says: {
      mono: "Mono palette",
      vivid: "Vivid palette",
      muted: "Muted palette",
    },
    rows: [
      ["chartPalette", "Palette"],
      ["chartAxes", "Axes"],
      ["chartGrid", "Gridlines"],
      ["chartLines", "Lines"],
      ["chartArea", "Area"],
      ["chartBars", "Bars"],
      ["chartLegend", "Legend"],
      ["chartMotion", "Motion"],
    ],
    aliases: ["Charts", "Area chart", "Bar chart", "Line chart", "Pie chart"],
  },
  {
    id: "checkbox",
    label: "Checkbox",
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
    id: "choice-card",
    label: "Choice card",
    rows: [
      ["cardSelected", "Selected"],
      ["cardColor", "Color"],
    ],
  },
  {
    id: "command",
    label: "Command",
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
    id: "field",
    label: "Field",
    rows: [
      ["inputStyle", "Style"],
      ["inputHover", "Hover"],
      ["inputHeight", "Height"],
      ["fieldLabel", "Label"],
      ["inputError", "Error message"],
      ["invalidStyle", "Invalid"],
      ["fieldTextSize", "Text size"],
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
    id: "kbd",
    label: "Kbd",
    rows: [["kbdTreatment", "Style"]],
  },
  {
    id: "link",
    label: "Link",
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
    id: "menu",
    label: "Menu",
    rows: [
      ["menuInset", "Items"],
      ["menuHighlight", "Highlight"],
      ["menuIndicator", "Check"],
      ["menuSelectedRow", "Selected row"],
      ["menuRows", "Rows"],
      ["sectionLabels", "Section labels"],
      ["popoverMotion", "Motion"],
    ],
    hosts: ["popoverMotion"],
    aliases: ["Menus", "Dropdown", "Context menu", "List box"],
  },
  {
    id: "number-field",
    label: "Number field",
    rows: [["numberLayout", "Steppers"]],
  },
  {
    id: "otp-field",
    label: "OTP field",
    rows: [["otpStyle", "Cells"]],
  },
  {
    id: "pagination",
    label: "Pagination",
    rows: [["paginationCurrent", "Current page"]],
  },
  {
    id: "popover",
    label: "Popover",
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
    id: "progress",
    label: "Progress",
    rows: [
      ["progressTrack", "Thickness"],
      ["progressTrackStyle", "Track"],
      ["progressColor", "Fill"],
      ["progressMotion", "Motion"],
    ],
    aliases: ["Progress bar"],
  },
  {
    id: "radio",
    label: "Radio",
    rows: [
      ["radioMark", "Mark"],
      ["radioColor", "Color"],
      ["checkboxMotion", "Motion"],
    ],
    hosts: ["checkboxMotion"],
    aliases: ["Radio group"],
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    rows: [
      ["segmentedSelected", "Selected"],
      ["segmentedTrack", "Track"],
      ["segmentedMotion", "Motion"],
    ],
  },
  {
    id: "select",
    label: "Select",
    says: { field: "Field trigger", button: "Button trigger" },
    rows: [
      ["selectTrigger", "Trigger"],
      ["pickerCaret", "Caret"],
      ["mobilePickers", "On mobile"],
    ],
    aliases: ["Combobox", "Picker"],
  },
  {
    id: "sheet",
    label: "Sheet",
    rows: [
      ["drawerEdge", "Edge"],
      ["sheetMotion", "Motion"],
    ],
    aliases: ["Drawer"],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    rows: [
      ["navMarker", "Current item"],
      ["navItemWeight", "Weight"],
      ["sidebarMotion", "Motion"],
    ],
  },
  {
    id: "skeleton",
    label: "Skeleton",
    rows: [["skeletonAnimation", "Animation"]],
  },
  {
    id: "slider",
    label: "Slider",
    rows: [
      ["sliderThumb", "Thumb"],
      ["sliderTrack", "Track"],
      ["sliderColor", "Color"],
      ["sliderMotion", "Motion"],
    ],
  },
  {
    id: "spinner",
    label: "Spinner",
    rows: [["spinnerStyle", "Style"]],
    aliases: ["Loader"],
  },
  {
    id: "switch",
    label: "Switch",
    rows: [
      ["switchStyle", "Style"],
      ["switchColor", "Color"],
      ["switchMotion", "Motion"],
    ],
  },
  {
    id: "table",
    label: "Table",
    says: { plain: "Plain header", filled: "Filled header" },
    rows: [
      ["tableHeader", "Header"],
      ["tableHeaderLabel", "Header label"],
      ["tableMotion", "Motion"],
    ],
    aliases: ["Tree"],
  },
  {
    id: "tabs",
    label: "Tabs",
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
    id: "toast",
    label: "Toast",
    rows: [
      ["toastStyle", "Style"],
      ["toastStatus", "Status"],
      ["toastMotion", "Motion"],
    ],
  },
  {
    id: "tooltip",
    label: "Tooltip",
    rows: [
      ["tooltipStyle", "Style"],
      ["tooltipEntrance", "Entrance"],
      ["tooltipMotion", "Motion"],
    ],
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
  const [lead] = component.rows[0] ?? []
  if (!lead) return null
  // Its id stands in for a page, so the preview focuses it like one.
  if (isSingle(component))
    return (
      <div data-page={component.id} className="contents">
        <Row axis={lead} label={component.label} />
      </div>
    )
  return (
    <DialLink
      page={component.id}
      label={component.label}
      value={
        <span className="truncate">
          {component.says?.[String(studio.effective[lead])] ??
            valueLabel(lead, studio.effective[lead])}
        </span>
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

const singles = COMPONENTS.filter(isSingle)

export const COMPONENTS_CHAPTER: Chapter = {
  id: "components",
  label: "Components",
  owners: singles.flatMap(homeKeys),
  // A one-row component is its row: search knows it by the row's name too.
  rows: singles.map(({ label, aliases = [], rows }) => ({
    name: label,
    key: rows[0]?.[0],
    aliases: [...aliases, ...rows.map(([, name]) => name)],
  })),
  Body: function ComponentRows({ studio }: { studio: Studio }) {
    return COMPONENTS.map((component) => (
      <ComponentRow key={component.id} component={component} studio={studio} />
    ))
  },
  pages: COMPONENTS.filter((component) => !isSingle(component)).map(pageOf),
}
