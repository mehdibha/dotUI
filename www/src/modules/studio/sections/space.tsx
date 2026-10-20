"use client"

/* Density, with the UI text size under it. */

import { DENSITY_OPTIONS } from "../axes/space.meta"
import { DialSelect } from "../dial"
import { Row } from "../row-host"
import type { RowMap } from "../row-host"

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
