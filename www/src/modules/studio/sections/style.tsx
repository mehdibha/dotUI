"use client"

/* Style — the first Foundations row: the look, each option one system's
   whole look, drawn by its primary button. Picking one puts the look back
   on it. */

import { useMemo } from "react"

import { pickStyle } from "../axes/style"
import type { Style } from "../axes/style"
import { STYLE_OPTIONS } from "../axes/style.meta"
import { DialSelect } from "../dial"
import { designSystemOf } from "../resolve"
import type { RowMap } from "../row-host"
import { useStudio } from "../use-studio"
import { PrimaryButton, System } from "./buttons"

function StyleRow() {
  const { state, setState } = useStudio()
  const options = useMemo(
    () =>
      STYLE_OPTIONS.map((option) => ({
        ...option,
        glyph: (
          <System ds={designSystemOf(pickStyle(state, option.value))}>
            <PrimaryButton />
          </System>
        ),
      })),
    [state],
  )
  return (
    <DialSelect
      axis="style"
      label="Style"
      options={options}
      onChange={(style) => setState(pickStyle(state, style as Style))}
    />
  )
}

export const ROWS: RowMap = { style: StyleRow }
