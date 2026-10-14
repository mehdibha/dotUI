"use client"

/* Foundations — the eight decisions every component reads, then the pages
   that refine them. */

import { Fragment, useContext } from "react"

import { DialGap, DialLink } from "../dial"
import { Row, RowLabel } from "../family-page"
import { PanelNav } from "../rows"
import type { ChapterPage, SearchRow, Studio } from "../state"
import type { AxisKey } from "../use-axis"
import { SemanticsPreview } from "./color"
import { PrimaryRow } from "./primary"
import { ShapePreview } from "./shape"
import { InteractionPreview } from "./states"
import { TypePreview } from "./type"

/** A row and its name: a key's row, or one with no key of its own. */
type FoundationRow = [AxisKey | React.ComponentType, string]

export const MAIN_ROWS: FoundationRow[] = [
  ["style", "Style"],
  ["brand", "Brand"],
  ["neutralHue", "Neutral"],
  ["bodyFont", "Font"],
  ["radiusPx", "Radius"],
  ["density", "Density"],
  ["iconLibrary", "Icons"],
  ["motion", "Motion"],
]

/** The keys whose rows sit on the main page, in or under its eight rows. */
export const FOUNDATION_KEYS = [
  "style",
  "brand",
  "preserveSeed",
  "solidInk",
  "vividness",
  "neutralHue",
  "neutralTint",
  "bodyFont",
  "radiusPx",
  "density",
  "iconLibrary",
  "iconStroke",
  "iconWeight",
  "motion",
]

/** Each page's rows, in groups. */
export const PAGE_ROWS: Record<string, FoundationRow[][]> = {
  color: [
    [
      ["successSeed", "Semantics"],
      [PrimaryRow, "Primary"],
      ["selectionColor", "Selected fill"],
      ["selectedWash", "Selected wash"],
    ],
    [
      ["surfaceLayers", "Surfaces"],
      ["controlEdge", "Control edge"],
      ["controlStroke", "Control stroke"],
    ],
  ],
  typography: [
    [
      ["headingFont", "Heading"],
      ["readingFont", "Reading"],
      ["monoFont", "Mono"],
    ],
    [
      ["titleStyle", "Titles"],
      ["uiTextSize", "UI text size"],
      ["fieldTextSize", "Field text"],
      ["labelWeight", "Label weight"],
      ["sectionLabels", "Section labels"],
    ],
  ],
  shape: [
    [
      ["roleControl", "Controls"],
      ["roleItem", "Items"],
      ["roleSurface", "Surfaces"],
      ["rolePanel", "Panels"],
      ["roleCard", "Cards"],
      ["tracks", "Tracks"],
    ],
  ],
  interaction: [
    [
      ["focusStyle", "Focus ring"],
      ["focusInputStyle", "Field focus"],
      ["invalidStyle", "Invalid"],
      ["disabledTreatment", "Disabled"],
    ],
    [
      ["cursorControls", "Control cursor"],
      ["cursorDisabled", "Disabled cursor"],
      ["selectionHighlight", "Text selection"],
    ],
  ],
}

const searchRow = ([row, name]: FoundationRow): SearchRow => ({
  name,
  key: typeof row === "string" ? row : undefined,
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
    id: "color",
    label: "Color & surfaces",
    owners: [
      "successSeed",
      "warningSeed",
      "dangerSeed",
      "selectionSeed",
      "selectionColor",
      "selectedWash",
      "surfaces",
      "lightBg",
      "darkBg",
      "controlEdge",
      "controlStroke",
    ],
    aliases: ["Color", "Semantics", "Primary", "Surfaces", "Elevation"],
    Preview: SemanticsPreview,
  }),
  page({
    id: "typography",
    label: "Typography",
    owners: ["type"],
    aliases: ["Fonts", "Menu labels"],
    Preview: TypePreview,
  }),
  page({
    id: "shape",
    label: "Shape",
    owners: ["shape"],
    aliases: ["Corners", "Radius"],
    Preview: ShapePreview,
  }),
  page({
    id: "interaction",
    label: "Interaction",
    owners: ["states", "selection"],
    aliases: ["States", "Interactivity", "Focus", "Cursors"],
    Preview: InteractionPreview,
  }),
]

/** The main page's rows, for search. */
export const FOUNDATION_ROWS = MAIN_ROWS.map(searchRow)

export function FoundationsSection({ studio }: { studio: Studio }) {
  const open = useContext(PanelNav)
  return (
    <>
      <Rows rows={MAIN_ROWS} />
      <DialGap />
      {FOUNDATION_PAGES.map(({ id, label, Preview }) => (
        <DialLink
          key={id}
          label={label}
          onPress={() => open(id)}
          value={Preview && <Preview state={studio.effective} />}
        />
      ))}
    </>
  )
}
