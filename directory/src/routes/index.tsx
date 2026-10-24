import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { dataIndex, getComponentExamples } from "~/data"

export const Route = createFileRoute("/")({
  component: Home,
})

const systemsBySlug = new Set(dataIndex.systems.map((system) => system.slug))
const explorable = dataIndex.catalog.filter((entry) =>
  systemsBySlug.has(entry.slug),
)

const componentsWithExamples = dataIndex.componentsCatalog.filter(
  (def) => getComponentExamples(def.slug).length > 0,
)

function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          The design system directory.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          How the best design systems are built — their color ramps, tokens,
          components, and the conventions that hold them together.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2">
        <Link
          to="/design-systems"
          className="group rounded-xl border p-6 transition-colors hover:bg-field"
        >
          <h2 className="flex items-center gap-2 font-medium">
            Design systems
            <ArrowRightIcon className="size-4 text-fg-muted transition-transform group-hover:translate-x-0.5" />
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            The systems worth learning from, documented from their real
            published sources.
          </p>
          <p className="mt-4 font-mono text-xs text-fg-muted">
            {dataIndex.catalog.length} systems · {explorable.length} explorable
          </p>
        </Link>
        <Link
          to="/components"
          className="group rounded-xl border p-6 transition-colors hover:bg-field"
        >
          <h2 className="flex items-center gap-2 font-medium">
            Components
            <ArrowRightIcon className="size-4 text-fg-muted transition-transform group-hover:translate-x-0.5" />
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            The same component, as every design system ships it — live, from
            each system&apos;s real published code.
          </p>
          <p className="mt-4 font-mono text-xs text-fg-muted">
            {dataIndex.componentsCatalog.length} components ·{" "}
            {componentsWithExamples.length} with live examples
          </p>
        </Link>
      </section>
    </div>
  )
}
