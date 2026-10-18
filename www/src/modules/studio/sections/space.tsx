"use client"

/* Density, with the UI text size under it. */

import { DENSITY_OPTIONS } from "../axes/space.meta"
import { DialSelect } from "../dial"
import { Row } from "../family-page"
import type { RowMap } from "../family-page"

function DensityRow() {
  return (
    <DialSelect
      axis="density"
      holds={["uiTextSize"]}
      label="Density"
      options={DENSITY_OPTIONS}
    >
      <Row axis="uiTextSize" label="Text size" />
    </DialSelect>
  )
}

export const ROWS: RowMap = { density: DensityRow }
