/* Charts Lab — a side-by-side bench for the chart-stack question. Left seat:
   the current shadcn-mirror chart on Recharts, with its real customization
   surface (series colors, nothing else). Right seat: the same data on
   @tanstack/charts, where the declarative definition turns every visual and
   behavioral decision into a runtime knob. Standalone route; the mode toggle
   drives the html `.dark` class while mounted and restores it on unmount. */

import { useEffect, useState } from "react"

import { Button } from "@/registry/ui/button"

import { RechartsSeat } from "./recharts-seat"
import { TanstackSeat } from "./tanstack-seat"

type Mode = "light" | "dark"

const FACTS = [
  {
    title: "Primitive",
    recharts:
      "~490 lines patching a runtime (injected styles, rebuilt tooltip)",
    tanstack:
      "Components over spec fragments; one chartDefaults object; raw marks as escape hatch",
  },
  {
    title: "Config surface",
    recharts: "3 fields per series (label, icon, color)",
    tanstack: "Every option is a prop; emitted code shows only your decisions",
  },
  {
    title: "Accessibility",
    recharts: "sr-only data table (our ChartDataTable)",
    tanstack: "Keyboard focus, arrow navigation, pinnable native tooltips",
  },
] as const

export function ChartsLab() {
  const [mode, setMode] = useState<Mode>("light")

  useEffect(() => {
    const root = document.documentElement
    const had = root.classList.contains("dark")
    return () => {
      root.classList.toggle("dark", had)
    }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
  }, [mode])

  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
              internal / charts-lab
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Charts Lab
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              The same six months of visitors, twice. The left seat is the
              Recharts era — a shadcn mirror where runtime customization stops
              at series colors. The right seat is the TanStack Charts engine the
              registry now ships, where the chart is a declarative definition
              and every decision becomes a knob. Kept as the historical bench
              that decided the migration.
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? "Dark" : "Light"} mode
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="flex flex-col overflow-hidden rounded-xl border border-border">
            <div className="flex items-baseline justify-between border-b border-border bg-muted/40 px-4 py-3">
              <h2 className="text-sm font-medium">shadcn approach</h2>
              <span className="font-mono text-[11px] text-fg-muted">
                recharts · 2 knobs
              </span>
            </div>
            <RechartsSeat />
          </section>
          <section className="flex flex-col overflow-hidden rounded-xl border border-border">
            <div className="flex items-baseline justify-between border-b border-border bg-muted/40 px-4 py-3">
              <h2 className="text-sm font-medium">dotUI × TanStack Charts</h2>
              <span className="font-mono text-[11px] text-fg-muted">
                @tanstack/charts · 17 knobs
              </span>
            </div>
            <TanstackSeat />
          </section>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {FACTS.map((fact) => (
            <div
              key={fact.title}
              className="space-y-2 rounded-xl border border-border p-4"
            >
              <h3 className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
                {fact.title}
              </h3>
              <p className="text-sm leading-relaxed">
                <span className="text-fg-muted">Recharts:</span> {fact.recharts}
              </p>
              <p className="text-sm leading-relaxed">
                <span className="text-fg-muted">TanStack:</span> {fact.tanstack}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
