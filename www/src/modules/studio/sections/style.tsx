"use client"

/* Style — the first Foundations row: the look, each option one system's
   whole look. Picking one puts the look back on it. */

import { pickStyle } from "../axes/style"
import type { Style } from "../axes/style"
import { STYLE_OPTIONS } from "../axes/style.meta"
import { DialSelect } from "../dial"
import type { RowMap } from "../row-host"
import { useStudio } from "../use-studio"

function StyleRow() {
  const { state, setState } = useStudio()
  return (
    <DialSelect
      axis="style"
      label="Style"
      options={STYLE_OPTIONS}
      onChange={(style) => setState(pickStyle(state, style as Style))}
    />
  )
}

export const ROWS: RowMap = { style: StyleRow }
