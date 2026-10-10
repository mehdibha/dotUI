"use client"

/* Style — the first Foundations row. Picking one keeps every explicit pick
   it allows; the popover ends with a reset for the rest. */

import { useMemo } from "react"
import { Button as RacButton } from "react-aria-components"

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"

import { effective, followersOf } from "../axes"
import { resolveButtons } from "../axes/buttons"
import { pickStyle, resetToStyle } from "../axes/style"
import type { Style } from "../axes/style"
import { STYLE_OPTIONS } from "../axes/style.meta"
import { DIAL_LABEL, DIAL_PRESS, DIAL_ROW, DialSelect } from "../dial"
import type { RowMap } from "../family-page"
import { useStudio } from "../use-studio"

/** A secondary button, the control the four styles all draw apart. */
function Specimen() {
  const styles = useButtonStyles()
  return (
    <span
      data-button=""
      className={styles({ variant: "secondary", size: "xs" })}
    >
      Cancel
    </span>
  )
}

function StyleRow() {
  const { state, setState } = useStudio()
  const options = useMemo(
    () =>
      STYLE_OPTIONS.map((option) => {
        const values = effective(pickStyle(state, option.value)).values
        const system = {
          params: { button: resolveButtons(values).params?.button ?? {} },
          density: "default" as const,
        }
        return {
          ...option,
          preview: (
            <DesignSystemContext.Provider value={system}>
              <Specimen />
            </DesignSystemContext.Provider>
          ),
        }
      }),
    [state],
  )
  const explicit = followersOf(state, "style").length
  const label = STYLE_OPTIONS.find((o) => o.value === state.style)?.label
  return (
    <DialSelect
      axis="style"
      label="Style"
      rowPreview={false}
      options={options}
      onChange={(style) => setState(pickStyle(state, style as Style))}
    >
      {explicit > 0 && (
        <RacButton
          onPress={() => setState(resetToStyle(state))}
          className={cn(DIAL_ROW, DIAL_PRESS, "justify-center")}
        >
          <span className={DIAL_LABEL}>
            Reset {explicit} to {label}
          </span>
        </RacButton>
      )}
    </DialSelect>
  )
}

export const ROWS: RowMap = { style: StyleRow }
