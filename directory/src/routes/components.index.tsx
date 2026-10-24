import { useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { SearchField } from "@/registry/ui/search-field"
import { componentIllustrations } from "~/components/illustrations"
import { dataIndex, getComponentExamples } from "~/data"

export const Route = createFileRoute("/components/")({
  component: ComponentsIndex,
})

// Components with examples first (most examples on top), then the rest.
const components = [...dataIndex.componentsCatalog]
  .map((def) => ({ def, examples: getComponentExamples(def.slug) }))
  .sort(
    (a, b) =>
      b.examples.length - a.examples.length ||
      a.def.name.localeCompare(b.def.name),
  )

const totalExamples = components.reduce(
  (sum, { examples }) => sum + examples.length,
  0,
)

function ComponentsIndex() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return components
    return components.filter(({ def }) =>
      `${def.name} ${def.aliases.join(" ")}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Components, across systems.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          The same component, as every design system ships it — live, from each
          system&apos;s real published code.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {components.length} components · {totalExamples} examples across
          systems
        </p>
      </section>

      <section className="pb-24">
        <SearchField
          aria-label="Search components"
          placeholder="Search components…"
          value={query}
          onChange={setQuery}
        />
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtered.map(({ def, examples }) => {
            const hasExamples = examples.length > 0
            return (
              <li key={def.slug}>
                <Link
                  to="/components/$slug"
                  params={{ slug: def.slug }}
                  className="group block"
                  disabled={!hasExamples}
                >
                  <div
                    className={
                      hasExamples
                        ? "overflow-hidden rounded-xl border bg-field transition-colors group-hover:bg-muted/60"
                        : "overflow-hidden rounded-xl border border-disabled bg-field opacity-50"
                    }
                  >
                    {componentIllustrations[def.slug] ?? (
                      <div className="aspect-[5/3]" />
                    )}
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between gap-2 px-0.5">
                    <span
                      className={
                        hasExamples
                          ? "truncate text-sm font-medium"
                          : "truncate text-sm font-medium text-fg-disabled"
                      }
                    >
                      {def.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-fg-muted">
                      {hasExamples ? examples.length : "planned"}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
        {filtered.length === 0 && (
          <p className="mt-8 text-sm text-fg-muted">
            No components match your search.
          </p>
        )}
      </section>
    </div>
  )
}
