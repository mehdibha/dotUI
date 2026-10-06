"use client"

import { useEffect } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { DesignSystemProvider } from "@/lib/styles"
import { InternalShell } from "@/modules/internal/shell"
import { getPreset, PRESETS, resolvePreset } from "@/modules/presets"

import { SHEETS, type SheetName } from "./sheets"

const route = getRouteApi("/internal/specimens")

/* A preset rendered through the preview iframe's global-mode provider, one
   sheet per 1280×900 capture. `scripts/capture-specimens.mts` screenshots it. */
export function SpecimenPage() {
  const { preset = "origin", mode, sheet } = route.useSearch()
  if (!sheet) return <SpecimenIndex />

  const Sheet = Object.hasOwn(SHEETS, sheet)
    ? SHEETS[sheet as SheetName]
    : undefined
  if (!getPreset(preset) || !Sheet) {
    return (
      <p data-specimen-error="" className="p-10 font-mono text-sm">
        Unknown {Sheet ? `preset "${preset}"` : `sheet "${sheet}"`}. Presets:{" "}
        {PRESETS.map((p) => p.id).join(", ")}. Sheets:{" "}
        {Object.keys(SHEETS).join(", ")}.
      </p>
    )
  }

  const designSystem = resolvePreset(preset)
  return (
    <DesignSystemProvider
      key={preset}
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      <div
        data-specimen={sheet}
        data-specimen-mode={mode}
        className="min-h-svh bg-bg text-fg"
      >
        <Sheet />
      </div>
      <ReadySignal />
    </DesignSystemProvider>
  )
}

/* Focuses the sheet's `[data-specimen-focus]` element (forced focus state),
   then flags `html[data-specimen-ready]` once fonts have loaded. */
function ReadySignal() {
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await document.fonts.ready
      await new Promise((r) => setTimeout(r, 300))
      if (cancelled) return
      document.querySelector<HTMLElement>("[data-specimen-focus]")?.focus()
      await document.fonts.ready
      document.documentElement.dataset.specimenReady = ""
    }
    void run()
    return () => {
      cancelled = true
      delete document.documentElement.dataset.specimenReady
    }
  }, [])
  return null
}

function SpecimenIndex() {
  return (
    <InternalShell
      crumbs={[{ label: "Specimens" }]}
      title="Specimens"
      description="Every preset rendered on fixed component sheets, for side-by-side comparison with the system it recreates."
    >
      <div
        id="specimen-catalog"
        hidden
        data-presets={PRESETS.map((p) => p.id).join(",")}
        data-sheets={Object.keys(SHEETS).join(",")}
      />
      <table className="text-left text-sm">
        <tbody>
          {PRESETS.map((p) => (
            <tr key={p.id} className="border-b border-border/45">
              <th className="py-2 pr-6 font-medium">{p.name}</th>
              {Object.keys(SHEETS).map((sheet) => (
                <td key={sheet} className="py-2 pr-4 text-fg-muted">
                  {sheet}{" "}
                  {(["light", "dark"] as const).map((mode) => (
                    <a
                      key={mode}
                      href={`/internal/specimens?preset=${p.id}&mode=${mode}&sheet=${sheet}`}
                      className="mr-1 text-fg underline-offset-2 hover:underline"
                    >
                      {mode[0]}
                    </a>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </InternalShell>
  )
}
