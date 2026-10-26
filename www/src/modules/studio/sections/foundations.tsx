"use client"

/* Foundations — the decisions every component reads, in groups, with the
   pages that refine them. Shape, Surfaces and Motion open from their
   picker's Custom. */

import { Fragment } from "react"

import type { ChapterPage, SearchRow } from "../chapters"
import { DialGap, DialGroupTitle, DialLink } from "../dial"
import { Row, RowLabel } from "../row-host"
import type { AxisKey } from "../use-axis"
import type { Studio } from "../use-studio"
import { ComponentMotionRow } from "./motion"
import { PrimaryRow } from "./primary"
import { ComponentCornersRow, ShapeRow } from "./shape"
import {
  CursorPreview,
  DisabledPreview,
  FocusPreview,
  TextSelectionPreview,
} from "./states"
import { SurfacesRow } from "./surfaces"
import { TypePreview } from "./type"

/** A row, its name and other names search knows it by: a key's row, or one
 *  with no key of its own. */
type FoundationRow = [AxisKey | React.ComponentType, string, string[]?]

/** The main page's groups: rows, then the pages listed under them. */
const MAIN_GROUPS: { rows?: FoundationRow[]; pages?: string[] }[] = [
  {
    rows: [
      ["brandAssets", "Brand assets", ["Logo", "Wordmark", "Identity"]],
      ["style", "Style"],
      ["brand", "Theme", ["Brand", "Accent"]],
      ["neutralHue", "Neutral"],
      [PrimaryRow, "Primary"],
      [SurfacesRow, "Surfaces"],
    ],
  },
  {
    rows: [
      ["bodyFont", "Font"],
      ["monoFont", "Mono"],
    ],
    pages: ["typography"],
  },
  {
    rows: [
      [ShapeRow, "Radius"],
      ["density", "Density"],
      ["iconLibrary", "Icons"],
      ["motion", "Motion"],
    ],
  },
  { pages: ["focus", "disabled", "cursor", "text-selection"] },
]

export const MAIN_ROWS = MAIN_GROUPS.flatMap(({ rows = [] }) => rows)

/** The keys whose rows sit on the main page, in or under its rows. */
export const FOUNDATION_KEYS = [
  "style",
  "brand",
  "preserveSeed",
  "solidInk",
  "vividness",
  "neutralHue",
  "neutralTint",
  "bodyFont",
  "monoFont",
  "density",
  "uiTextSize",
  "iconLibrary",
  "iconStroke",
  "iconWeight",
  "motion",
  "brandAssets",
]

/** A run of rows; a titled one reads in search as "Title › Row". */
type RowGroup = FoundationRow[] | { title: string; rows: FoundationRow[] }

const rowsOf = (group: RowGroup) => ("rows" in group ? group.rows : group)

/** Each page's rows, in groups. */
export const PAGE_ROWS: Record<string, RowGroup[]> = {
  typography: [[["headingFont", "Heading"]]],
  focus: [
    // One ink for controls and inputs alike.
    [["focusColor", "Color"]],
    {
      title: "Controls",
      rows: [
        ["focusStyle", "Style", ["Focus ring"]],
        ["focusWidth", "Width"],
        ["focusRingGap", "Gap"],
      ],
    },
    {
      title: "Inputs",
      rows: [
        ["focusInputStyle", "Style", ["Field focus"]],
        ["focusFieldWidth", "Width"],
      ],
    },
  ],
  disabled: [
    [
      ["disabledTreatment", "Style"],
      ["disabledOpacity", "Opacity"],
    ],
  ],
  cursor: [
    [
      ["cursorControls", "Controls"],
      ["cursorDisabled", "Disabled"],
      ["cursorBusy", "Busy", ["Pending", "Progress", "Wait"]],
      ["cursorDrag", "Drag", ["Grab", "Dragging"]],
    ],
  ],
  "text-selection": [
    [
      ["selectionHighlight", "Highlight"],
      ["selectionUiText", "Control text"],
    ],
  ],
  shape: [
    [["radiusPx", "Base radius"]],
    [
      ["roleControl", "Controls"],
      ["roleItem", "Items"],
      ["roleSurface", "Surfaces"],
      ["rolePanel", "Panels"],
      ["roleCard", "Cards"],
      ["tracks", "Tracks"],
    ],
    [[ComponentCornersRow, "Components"]],
  ],
  motion: [[["motionSpeed", "Speed"]], [[ComponentMotionRow, "Components"]]],
  surfaces: [
    [
      ["surfaceLayers", "Look", ["Layers", "Edge", "Elevation"]],
      ["surfaceShadow", "Shadow"],
      ["shadowColor", "Shadow color", ["Tinted shadows"]],
    ],
    {
      title: "Overlays",
      rows: [
        ["overlayEdge", "Edge", ["Menu border", "Dialog border"]],
        ["overlayShadow", "Shadow", ["Menu shadow", "Dialog shadow"]],
        ["translucentOverlays", "Background", ["Glass", "Translucent"]],
      ],
    },
    {
      title: "Dark mode",
      rows: [
        ["darkLayers", "Layers", ["Dark elevation"]],
        ["darkBg", "Page", ["Page tone"]],
      ],
    },
    {
      title: "Page",
      rows: [
        ["lightBg", "Light", ["Page tone"]],
        ["shellTone", "App shell", ["Sidebar"]],
      ],
    },
    {
      title: "Controls",
      rows: [
        ["controlEdge", "Edge", ["Control edge"]],
        ["controlStroke", "Stroke", ["Control stroke"]],
      ],
    },
  ],
}

/** A page's rows, every group's in order. */
export const pageRows = (id: string) => (PAGE_ROWS[id] ?? []).flatMap(rowsOf)

const searchRows = (group: RowGroup): SearchRow[] =>
  rowsOf(group).map(([row, name, aliases]) => ({
    name: "title" in group ? `${group.title} › ${name}` : name,
    key: typeof row === "string" ? row : undefined,
    aliases,
  }))

function Rows({ rows }: { rows: FoundationRow[] }) {
  return rows.map(([row, label]) => {
    if (typeof row === "string")
      return <Row key={row} axis={row} label={label} />
    const Component = row
    return (
      <RowLabel.Provider key={label} value={label}>
        <Component />
      </RowLabel.Provider>
    )
  })
}

const page = (page: Omit<ChapterPage, "Body" | "rows">): ChapterPage => {
  const groups = PAGE_ROWS[page.id] ?? []
  return {
    ...page,
    rows: groups.flatMap(searchRows),
    Body: function FoundationPage() {
      return (
        <>
          {groups.map((group, i) => (
            <Fragment key={i}>
              {i > 0 && <DialGap />}
              {"title" in group && (
                <DialGroupTitle>{group.title}</DialGroupTitle>
              )}
              <Rows rows={rowsOf(group)} />
            </Fragment>
          ))}
        </>
      )
    },
  }
}

export const FOUNDATION_PAGES: ChapterPage[] = [
  page({
    id: "typography",
    label: "Typography",
    owners: ["headingFont"],
    aliases: ["Fonts"],
    Preview: TypePreview,
  }),
  page({
    id: "focus",
    label: "Focus",
    owners: [
      "focusColor",
      "focusStyle",
      "focusWidth",
      "focusRingGap",
      "focusInputStyle",
      "focusFieldWidth",
    ],
    aliases: ["Focus ring", "Keyboard"],
    Preview: FocusPreview,
  }),
  page({
    id: "disabled",
    label: "Disabled",
    owners: ["disabledTreatment", "disabledOpacity"],
    Preview: DisabledPreview,
  }),
  page({
    id: "cursor",
    label: "Cursor",
    owners: ["cursorControls", "cursorDisabled", "cursorBusy", "cursorDrag"],
    aliases: ["Cursors", "Pointer"],
    Preview: CursorPreview,
  }),
  page({
    id: "text-selection",
    label: "Text selection",
    owners: ["selection", "selectionUiText"],
    aliases: ["Highlight", "Select text"],
    Preview: TextSelectionPreview,
  }),
  page({
    id: "shape",
    label: "Shape",
    owners: ["shape"],
    aliases: ["Corners", "Radius"],
  }),
  page({
    id: "motion",
    label: "Motion",
    owners: ["motionSpeed"],
    aliases: ["Animation", "Transitions"],
  }),
  page({
    id: "surfaces",
    label: "Surfaces",
    owners: ["surfaces", "lightBg", "darkBg", "controlEdge", "controlStroke"],
    aliases: ["Elevation", "Cards", "Shadows"],
  }),
]

/** The main page's rows, for search. */
export const FOUNDATION_ROWS = searchRows(MAIN_ROWS)

export function FoundationsSection({ studio }: { studio: Studio }) {
  return MAIN_GROUPS.map(({ rows = [], pages = [] }, i) => (
    <Fragment key={i}>
      {i > 0 && <DialGap />}
      <Rows rows={rows} />
      {FOUNDATION_PAGES.filter(({ id }) => pages.includes(id)).map(
        ({ id, label, Preview }) => (
          <DialLink
            key={id}
            page={id}
            label={label}
            value={Preview && <Preview state={studio.effective} />}
          />
        ),
      )}
    </Fragment>
  ))
}
