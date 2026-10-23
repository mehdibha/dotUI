"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import type { ComponentType, ReactNode } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { DesignSystemProvider } from "@/lib/styles"
import { InternalShell } from "@/modules/internal/shell"
import { getPreset, PRESETS } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import {
  useAnnouncePreviewReady,
  useAppliedDesignSystem,
} from "@/modules/studio/preset/iframe-sync"
import type { PrepareDesignSystem } from "@/modules/studio/preset/iframe-sync"
import { designSystemOf, internDesignSystem } from "@/modules/studio/resolve"

import { SHEETS, type SheetName } from "./sheets"

const route = getRouteApi("/internal/specimens")

/* A preset rendered through the preview iframe's global-mode provider, one
   sheet per 1280×900 capture. `scripts/capture-specimens.mts` screenshots it,
   and /internal/compare embeds it. */
export function SpecimenPage() {
  const { preset = "origin", mode, sheet, diff } = route.useSearch()
  if (!sheet) return <SpecimenIndex />

  const Sheet = Object.hasOwn(SHEETS, sheet)
    ? SHEETS[sheet as SheetName]
    : undefined
  const base = getPreset(preset)
  if (!base || !Sheet) {
    return (
      <SpecimenError>
        Unknown {Sheet ? `preset "${preset}"` : `sheet "${sheet}"`}. Presets:{" "}
        {PRESETS.map((p) => p.id).join(", ")}. Sheets:{" "}
        {Object.keys(SHEETS).join(", ")}.
      </SpecimenError>
    )
  }

  let state = base.state
  try {
    if (diff) state = withDiff(state, JSON.parse(diff))
  } catch (error) {
    return <SpecimenError>{(error as Error).message}</SpecimenError>
  }

  return (
    <SpecimenSheet
      key={`${preset}|${diff}`}
      state={state}
      sheet={sheet}
      Sheet={Sheet}
      mode={mode}
    />
  )
}

function SpecimenError({ children }: { children: ReactNode }) {
  return (
    <p data-specimen-error="" className="p-10 font-mono text-sm">
      {children}
    </p>
  )
}

const withDiff = (state: StudioState, diff: unknown) =>
  parseState({ ...state, ...(diff as object) })

const prepare: PrepareDesignSystem<undefined> = (_, ready) => ready(undefined)

/* The sheet shows `state`, then follows the `design-system` messages its
   own origin posts: /internal/compare's studio panel, or a script calling
   `window.__specimen.setDiff(diff)` to re-render in place, which resolves
   once the new design system has committed. */
function SpecimenSheet({
  state,
  sheet,
  Sheet,
  mode,
}: {
  state: StudioState
  sheet: string
  Sheet: ComponentType
  mode?: "light" | "dark"
}) {
  const { designSystem } = useAppliedDesignSystem(
    prepare,
    () => ({ designSystem: designSystemOf(state), prepared: undefined }),
    internDesignSystem,
  )
  useAnnouncePreviewReady()
  const shown = useRef({ json: "", commits: 0, wait: () => {} })
  useLayoutEffect(() => {
    shown.current.json = JSON.stringify(designSystem)
    shown.current.commits++
    shown.current.wait()
  }, [designSystem])
  useEffect(() => {
    const host = window as { __specimen?: unknown }
    host.__specimen = {
      setDiff: (diff: unknown) => {
        const data = designSystemOf(withDiff(state, diff))
        // The same design system renders nothing, so nothing commits.
        if (JSON.stringify(data) === shown.current.json)
          return Promise.resolve()
        const from = shown.current.commits
        const committed = new Promise<void>((done) => {
          shown.current.wait = () => {
            if (shown.current.commits > from) done()
          }
        })
        window.postMessage(
          { type: "design-system", data, live: false, drag: false },
          window.location.origin,
        )
        return committed
      },
    }
    return () => {
      delete host.__specimen
    }
  }, [state])
  return (
    <DesignSystemProvider
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
      // Embedded in /internal/compare, a scroll would move the parent page.
      document
        .querySelector<HTMLElement>("[data-specimen-focus]")
        ?.focus({ preventScroll: true })
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
