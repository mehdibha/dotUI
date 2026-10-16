"use client"

import { DENSITY_OPTIONS } from "../axes/space.meta"
import { DialSelect } from "../dial"
import type { RowMap } from "../family-page"

function DensityRow() {
  return <DialSelect axis="density" label="Density" options={DENSITY_OPTIONS} />
}

export const ROWS: RowMap = { density: DensityRow }
