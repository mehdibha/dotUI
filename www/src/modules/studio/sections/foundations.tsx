"use client"

/* Foundations — the decisions every component reads, then the pages that
   refine them. Shape and Surfaces open from their picker's Custom. */

import { Fragment } from "react"

import { DialGap, DialLink } from "../dial"
import { Row, RowLabel } from "../family-page"
import type { ChapterPage, SearchRow, Studio } from "../state"
import type { AxisKey } from "../use-axis"
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

export const MAIN_ROWS: FoundationRow[] = [
  ["style", "Style"],
  ["brand", "Brand"],
  ["neutralHue", "Neutral"],
  [PrimaryRow, "Primary"],
  [SurfacesRow, "Surfaces"],
  ["bodyFont", "Font"],
  [ShapeRow, "Radius"],
  ["density", "Density"],
  ["iconLibrary", "Icons"],
  ["motion", "Motion"],
]

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
  "density",
  "uiTextSize",
  "iconLibrary",
  "iconStroke",
  "iconWeight",
  "motion",
]

/** Each page's rows, in groups. */
export const PAGE_ROWS: Record<string, FoundationRow[][]> = {
  typography: [
    [
      ["headingFont", "Heading"],
      ["monoFont", "Mono"],
    ],
  ],
  focus: [
    [
      ["focusStyle", "Focus ring"],
      ["focusInputStyle", "Field focus"],
    ],
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

const page = (page: Omit<ChapterPage, "Body" | "rows">): ChapterPage => {
  const groups = PAGE_ROWS[page.id] ?? []
  return {
    ...page,
    rows: groups.flat().map(searchRow),
    Body: function FoundationPage() {
      return groups.map((rows, i) => (
        <Fragment key={i}>
          {i > 0 && <DialGap />}
          <Rows rows={rows} />
        </Fragment>
      ))
    },
  }
}

export const FOUNDATION_PAGES: ChapterPage[] = [
  page({
    id: "typography",
    label: "Typography",
    owners: ["headingFont", "monoFont"],
    aliases: ["Fonts"],
    Preview: TypePreview,
  }),
  page({
    id: "focus",
    label: "Focus",
    owners: [
      "focusStyle",
      "focusStrength",
      "focusWidth",
      "focusColor",
      "focusInputStyle",
      "focusInputWeight",
      "focusInputColor",
    ],
    aliases: ["Focus ring", "Keyboard"],
    Preview: FocusPreview,
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
    id: "surfaces",
    label: "Surfaces",
    owners: ["surfaces", "lightBg", "darkBg", "controlEdge", "controlStroke"],
    aliases: ["Elevation", "Cards", "Shadows"],
  }),
]

/** The pages listed under the main page's rows; the rest open from a
 *  picker's Custom. */
const LISTED = ["typography", "focus", "disabled", "cursor", "text-selection"]

/** The main page's rows, for search. */
export const FOUNDATION_ROWS = MAIN_ROWS.map(searchRow)

export function FoundationsSection({ studio }: { studio: Studio }) {
  return (
    <>
      <Rows rows={MAIN_ROWS} />
      <DialGap />
      {FOUNDATION_PAGES.filter(({ id }) => LISTED.includes(id)).map(
        ({ id, label, Preview }) => (
          <DialLink
            key={id}
            page={id}
            label={label}
            value={Preview && <Preview state={studio.effective} />}
          />
        ),
      )}
    </>
  )
}
