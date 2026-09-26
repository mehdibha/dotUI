"use client"

/* Tables — how a data grid separates its rows, and how loud its header is. */

import { HEADER_OPTIONS, SEPARATION_OPTIONS } from "../axes/tables"
import {
  DialGlyph,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "../dial"
import type { Studio, StudioState } from "../state"

/** The grid: a header band or line, then three rows divided as chosen. */
function TableGlyph({
  separation,
  header,
}: {
  separation: string
  header: string
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {header === "filled" && (
        <path
          d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3z"
          fill="currentColor"
          opacity=".2"
        />
      )}
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
      {separation === "lines" && (
        <path
          d="M3 12.75h18M3 16.5h18"
          stroke="currentColor"
          strokeWidth="1"
          opacity=".35"
        />
      )}
      {separation === "striped" && (
        <rect
          x="3.75"
          y="12.75"
          width="16.5"
          height="3.5"
          fill="currentColor"
          opacity=".12"
        />
      )}
      <path
        d="M6 6.5h6M6 11h8M6 14.5h5M6 18h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  )
}

function TablesPreview({ state }: { state: StudioState }) {
  return (
    <DialGlyph>
      <TableGlyph
        separation={state.tableSeparation}
        header={state.tableHeader}
      />
    </DialGlyph>
  )
}

export function TablesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <DialTrigger
        label="Table"
        value={
          <>
            <span className="truncate">
              {optionLabel(SEPARATION_OPTIONS, state.tableSeparation)}
            </span>
            <TablesPreview state={state} />
          </>
        }
      >
        <DialPopover className="w-72">
          <DialSelect
            label="Rows"
            value={state.tableSeparation}
            onChange={set("tableSeparation")}
            rowPreview={false}
            options={SEPARATION_OPTIONS.map((option) => ({
              ...option,
              preview: (
                <DialGlyph>
                  <TableGlyph
                    separation={option.value}
                    header={state.tableHeader}
                  />
                </DialGlyph>
              ),
            }))}
          />
          <DialSegmented
            label="Header"
            value={state.tableHeader}
            onChange={set("tableHeader")}
            options={HEADER_OPTIONS}
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
