"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/registry/lib/utils"

import { CAPTION, stateProps } from "./board"
import type { StateName } from "./board"

export type Frozen = ReturnType<typeof stateProps>

export interface GridColumn {
  id: string
  label: string
  states?: StateName[]
}

export interface GridRow {
  id: string
  label: string
  render: (props: Frozen, column: string) => React.ReactNode
}

type Mode = "matrix" | "stacked" | "wrapped"

// Pixels, not spacing classes: the measurement must not scale with Density.
const GAP = 12
const WRAP_GAP = 16

/** Labels beside the rows when everything fits, above them when only the cells fit, else wrapped cells. */
function useGridMode(columns: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({
    mode: "matrix" as Mode,
    cell: 0,
    perRow: columns,
  })
  useLayoutEffect(() => {
    const container = ref.current
    if (!container) return
    const measure = () => {
      const widths = Array.from({ length: columns + 1 }, () => 0)
      for (const el of container.querySelectorAll<HTMLElement>(
        "[data-column]",
      )) {
        const i = Number(el.dataset.column)
        widths[i] = Math.max(
          widths[i] ?? 0,
          Math.ceil(el.getBoundingClientRect().width),
        )
      }
      const [label = 0, ...cells] = widths
      const span = cells.reduce((a, b) => a + b, 0) + GAP * (columns - 1)
      const available = container.clientWidth
      const mode: Mode =
        label + GAP + span <= available
          ? "matrix"
          : span <= available
            ? "stacked"
            : "wrapped"
      const cell = Math.max(...cells)
      const fit = Math.max(
        1,
        Math.floor((available + WRAP_GAP) / (cell + WRAP_GAP)),
      )
      // Balanced rows: 3 + 2, not 4 + 1.
      const perRow = Math.ceil(columns / Math.ceil(columns / fit))
      setLayout((prev) =>
        prev.mode === mode && prev.cell === cell && prev.perRow === perRow
          ? prev
          : { mode, cell, perRow },
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    for (const el of container.querySelectorAll("[data-column]"))
      observer.observe(el)
    return () => observer.disconnect()
  }, [columns])
  return [ref, layout] as const
}

/** Frozen specimens, one row per variant and one column per state. */
export function StateGrid({
  columns,
  rows,
  emphasis,
}: {
  columns: readonly GridColumn[]
  rows: readonly GridRow[]
  /** A row or column id the panel is editing. */
  emphasis?: string
}) {
  const [ref, { mode, cell, perRow }] = useGridMode(columns.length)
  const wrapped = mode === "wrapped"
  const caption = (id: string) =>
    cn(CAPTION, "transition-colors", emphasis === id && "font-medium text-fg")
  return (
    <div ref={ref} className="w-full">
      <div
        inert
        className={
          wrapped ? "flex flex-col gap-4" : "grid items-center gap-y-3.5"
        }
        style={{
          columnGap: GAP,
          gridTemplateColumns: wrapped
            ? undefined
            : `${mode === "matrix" ? "auto " : ""}repeat(${columns.length}, minmax(max-content, 1fr))`,
        }}
      >
        {mode === "matrix" && <span />}
        {columns.map((column, i) => (
          <span
            key={column.id}
            data-column={i + 1}
            className={cn(
              caption(column.id),
              "justify-self-center",
              wrapped && "hidden",
            )}
          >
            {column.label}
          </span>
        ))}
        {rows.map((row) => (
          <div
            key={row.id}
            className={
              wrapped
                ? "flex flex-col gap-3 [&+&]:border-t [&+&]:pt-4"
                : "contents"
            }
          >
            <span
              data-column={0}
              className={cn(
                "justify-self-start transition-colors",
                mode === "matrix"
                  ? caption(row.id)
                  : cn(
                      "col-span-full self-start text-xs font-medium text-fg-muted",
                      mode === "stacked" && "-mb-1.5 pt-1",
                      emphasis === row.id && "text-fg",
                    ),
              )}
            >
              {row.label}
            </span>
            <div
              className={
                wrapped
                  ? "mx-auto flex w-full flex-wrap justify-center gap-y-3"
                  : "contents"
              }
              style={
                wrapped
                  ? {
                      columnGap: WRAP_GAP,
                      maxWidth: perRow * cell + (perRow - 1) * WRAP_GAP,
                    }
                  : undefined
              }
            >
              {columns.map((column, i) => (
                <div
                  key={column.id}
                  className="flex min-w-0 flex-col items-center gap-2"
                  style={
                    wrapped
                      ? {
                          // A share, not a width: subpixels never break a row.
                          flex: `0 0 calc((100% - ${(perRow - 1) * WRAP_GAP}px) / ${perRow})`,
                        }
                      : undefined
                  }
                >
                  <div data-column={i + 1} className="flex">
                    {row.render(
                      stateProps(...(column.states ?? [])),
                      column.id,
                    )}
                  </div>
                  <span
                    data-column={i + 1}
                    className={cn(
                      caption(column.id),
                      "whitespace-nowrap",
                      !wrapped && "hidden",
                    )}
                  >
                    {column.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
