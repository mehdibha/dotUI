"use client"

/* Style — the first Foundations row: the material, named by its light.
   Picking one keeps every explicit pick it allows; under the list, the
   Style's finish, then a reset for the rest. */

import { useMemo } from "react"

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { CONTAINER_SURFACE } from "@/registry/ui/card/styles"

import { effective, followersOf } from "../axes"
import { resolveButtons } from "../axes/buttons"
import { FINISH_KEYS, pickStyle, resetToStyle } from "../axes/style"
import type { Style } from "../axes/style"
import { FINISHES, STYLE_OPTIONS } from "../axes/style.meta"
import { resolveSurfaces } from "../axes/surfaces"
import { DialAction, DialSegmented, DialSelect } from "../dial"
import type { RowMap } from "../family-page"
import { useStudio } from "../use-studio"

/** A card holding a secondary button: the surface and the control the
 *  Styles draw apart. */
function Specimen({ tokens }: { tokens: Record<string, string> }) {
  const styles = useButtonStyles()
  return (
    <span
      aria-hidden
      className={cn(CONTAINER_SURFACE, "flex rounded-lg p-1.5")}
      style={tokens as React.CSSProperties}
    >
      <span
        data-button=""
        className={cn(styles({ variant: "secondary", size: "xs" }), "w-9")}
      />
    </span>
  )
}

function StyleRow() {
  const { state, effective: values, setState } = useStudio()
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
              <Specimen tokens={resolveSurfaces(values).tokens ?? {}} />
            </DesignSystemContext.Provider>
          ),
        }
      }),
    [state],
  )
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
      rowPreview={false}
      options={options.map((option) =>
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
