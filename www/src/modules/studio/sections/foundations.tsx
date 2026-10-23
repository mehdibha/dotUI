"use client"

/* Foundations — the decisions every component reads, in groups, with the
   pages that refine them. Shape, Surfaces and Motion open from their
   picker's Custom. */

import { Fragment } from "react"

import type { ChapterPage, SearchRow } from "../chapters"
import { DialGap, DialLink } from "../dial"
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
  FocusSpecimen,
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

/** Each page's rows, in groups. */
export const PAGE_ROWS: Record<string, FoundationRow[][]> = {
  typography: [[["headingFont", "Heading"]]],
  focus: [
    [
      ["focusStyle", "Controls", ["Focus ring"]],
      ["focusWidth", "Width"],
      ["focusColor", "Color"],
    ],
    [["focusInputStyle", "Fields", ["Field focus"]]],
  ],
  disabled: [[["disabledTreatment", "Style"]]],
  cursor: [
    [
      ["cursorControls", "Controls"],
      ["cursorDisabled", "Disabled"],
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
      ["surfaceLayers", "Layers"],
      ["surfaceEdge", "Edge"],
      ["surfaceShadow", "Shadow"],
    ],
    [
      ["translucentOverlays", "Overlays", ["Glass"]],
      ["shellTone", "App shell"],
      ["lightBg", "Page"],
    ],
    [
      ["controlEdge", "Control edge"],
      ["controlStroke", "Control stroke"],
    ],
  ],
}

const searchRow = ([row, name, aliases]: FoundationRow): SearchRow => ({
  name,
  key: typeof row === "string" ? row : undefined,
  aliases,
})

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

/** `lead` sits above the page's rows: a specimen they edit together. */
const page = ({
  lead: Lead,
  ...page
}: Omit<ChapterPage, "Body" | "rows"> & {
  lead?: React.ComponentType
}): ChapterPage => {
  const groups = PAGE_ROWS[page.id] ?? []
  return {
    ...page,
    rows: groups.flat().map(searchRow),
    Body: function FoundationPage() {
      return (
        <>
          {Lead && <Lead />}
          {groups.map((rows, i) => (
            <Fragment key={i}>
              {(i > 0 || Lead) && <DialGap />}
              <Rows rows={rows} />
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
    owners: ["focusStyle", "focusWidth", "focusColor", "focusInputStyle"],
    aliases: ["Focus ring", "Keyboard"],
    Preview: FocusPreview,
    lead: FocusSpecimen,
  }),
  page({
    id: "disabled",
    label: "Disabled",
    owners: ["disabledTreatment"],
    Preview: DisabledPreview,
  }),
  page({
    id: "cursor",
    label: "Cursor",
    owners: ["cursorControls", "cursorDisabled"],
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
export const FOUNDATION_ROWS = MAIN_ROWS.map(searchRow)

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
