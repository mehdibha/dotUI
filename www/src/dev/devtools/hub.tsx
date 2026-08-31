"use client"

import { lazy, Suspense, useEffect, useState } from "react"
import { WrenchIcon, XIcon } from "lucide-react"
import type { ReactGrabAPI } from "react-grab/core"

import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"
import { Switch, SwitchControl } from "@/registry/ui/switch"

// Same escape hatch as the tweaker (see src/dev/tweaker/tweaker.tsx): keeps
// the hub clickable above react-aria overlays without dismissing them.
const TOP_LAYER = { "data-react-aria-top-layer": true } as const

const STORAGE_KEY = "dotui:devtools"

type ToolId = "tweaker" | "reactGrab" | "tanstack"

const DEFAULTS: Record<ToolId, boolean> = {
  tweaker: true,
  reactGrab: false,
  tanstack: false,
}

const TOOLS: Array<{ id: ToolId; label: string; detail: string }> = [
  {
    id: "tweaker",
    label: "Tweaker",
    detail: "Live design tweaks · ⌘. to open",
  },
  { id: "reactGrab", label: "React Grab", detail: "Grab elements for agents" },
  { id: "tanstack", label: "TanStack Devtools", detail: "Router panel" },
]

function loadEnabled(): Record<ToolId, boolean> {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw
      ? {
          ...DEFAULTS,
          ...(JSON.parse(raw) as Partial<Record<ToolId, boolean>>),
        }
      : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

const DevTweaker = lazy(() =>
  import("@/dev/tweaker").then((m) => ({ default: m.DevTweaker })),
)
const TanStackDevtools = lazy(() => import("./tanstack"))

/**
 * Devtools hub — dev + Vercel previews only. ⌘⇧D toggles a small switch panel
 * that decides which devtools are mounted at all (persisted per browser):
 * Tweaker (on by default), React Grab, TanStack Devtools. Each tool keeps its
 * own UI once enabled; the hub only controls mounting, so disabled tools cost
 * nothing — their chunks never load.
 */
export function DevtoolsHub() {
  const [enabled, setEnabled] = useState(loadEnabled)
  const [open, setOpen] = useState(false)

  // ⌘⇧D / Ctrl+Shift+D toggles the hub; Escape closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "d"
      ) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // React Grab is imperative: init on enable, dispose on disable. The root
  // "react-grab" entry auto-inits on import, so go through /core instead —
  // and mirror the root's window.__REACT_GRAB__ global so external tooling
  // (and the console) can reach the API.
  const grabEnabled = enabled.reactGrab
  useEffect(() => {
    if (!grabEnabled) return
    const w = window as { __REACT_GRAB__?: ReactGrabAPI }
    let disposed = false
    let api: ReactGrabAPI | null = null
    void import("react-grab/core").then((m) => {
      if (disposed) return
      api = m.init()
      w.__REACT_GRAB__ = api
    })
    return () => {
      disposed = true
      api?.dispose()
      if (w.__REACT_GRAB__ === api) delete w.__REACT_GRAB__
    }
  }, [grabEnabled])

  const toggle = (id: ToolId, value: boolean) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <>
      {enabled.tweaker && (
        <Suspense fallback={null}>
          <DevTweaker />
        </Suspense>
      )}
      {enabled.tanstack && (
        <Suspense fallback={null}>
          <TanStackDevtools />
        </Suspense>
      )}

      {/* Bottom-centered so it collides with neither the tweaker trigger (side
          edges) nor TanStack Devtools' trigger (bottom-right). z-120 outranks
          the tweaker's z-110 so the hub is always reachable. */}
      {open && (
        <div
          {...TOP_LAYER}
          className="fixed bottom-4 left-1/2 z-120 flex w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="flex items-center gap-2">
              <WrenchIcon className="size-4 text-fg-muted" />
              <span className="text-sm font-medium">Devtools</span>
            </div>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Close"
              onPress={() => setOpen(false)}
            >
              <XIcon />
            </Button>
          </div>

          <div className="flex flex-col p-1">
            {TOOLS.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{tool.label}</p>
                  <p className="text-xs text-fg-muted">{tool.detail}</p>
                </div>
                <Switch
                  aria-label={tool.label}
                  isSelected={enabled[tool.id]}
                  onChange={(value) => toggle(tool.id, value)}
                  className="shrink-0"
                >
                  <SwitchControl />
                </Switch>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[10px] text-fg-muted">
            <span>dev only · not shipped</span>
            <span className="flex items-center gap-1">
              <Kbd>⌘⇧D</Kbd> to toggle
            </span>
          </div>
        </div>
      )}
    </>
  )
}
