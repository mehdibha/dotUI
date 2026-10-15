"use client"

/* Style — the first Foundations row: the material, named by its light.
   Picking one keeps every explicit pick it allows; under the list, the
   Style's finish, then a reset for the rest. */

import { followersOf } from "../axes"
import { FINISH_KEYS, pickStyle, resetToStyle } from "../axes/style"
import type { Style } from "../axes/style"
import { FINISHES, STYLE_OPTIONS } from "../axes/style.meta"
import { DialAction, DialSegmented, DialSelect } from "../dial"
import type { RowMap } from "../family-page"
import { useStudio } from "../use-studio"

function StyleRow() {
  const { state, effective: values, setState } = useStudio()
  const explicit = followersOf(state, "style").length
  const label = STYLE_OPTIONS.find((o) => o.value === state.style)?.label
  const finishKey = FINISH_KEYS[state.style as Style]
  const finishes = FINISHES[state.style as Style]
  const current =
    finishKey &&
    finishes?.find((option) => option.value === String(values[finishKey]))
  return (
    <DialSelect
      axis="style"
      label="Style"
      options={STYLE_OPTIONS.map((option) =>
        option.value === state.style && current
          ? { ...option, label: `${option.label} · ${current.label}` }
          : option,
      )}
      onChange={(style) => setState(pickStyle(state, style as Style))}
    >
      {finishKey && finishes && (
        <DialSegmented
          // Each Style's row is its own: the indicator never slides between them.
          key={state.style}
          axis={finishKey}
          label="Finish"
          options={[...finishes]}
        />
      )}
      {explicit > 0 && (
        <DialAction onPress={() => setState(resetToStyle(state))}>
          Reset {explicit} to {label}
        </DialAction>
      )}
    </DialSelect>
  )
}

export const ROWS: RowMap = { style: StyleRow }
