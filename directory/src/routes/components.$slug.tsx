import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"

import { Link } from "@/registry/ui/link"
import { getComponentDef, getComponentExamples } from "~/data"
import type { ComponentExample } from "~/data"

export const Route = createFileRoute("/components/$slug")({
  loader: ({ params }) => {
    const def = getComponentDef(params.slug)
    return { def, examples: getComponentExamples(params.slug) }
  },
  component: ComponentPage,
})

function ComponentPage() {
  const { def, examples } = Route.useLoaderData()
  const live = examples.filter((example) => example.demoSrc !== null)
  const linkOnly = examples.filter((example) => example.demoSrc === null)

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <header className="pt-10">
        <p className="font-mono text-xs tracking-wider text-fg-muted uppercase">
          <RouterLink to="/components" className="hover:underline">
            Components
          </RouterLink>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {def.name}
        </h1>
        {def.aliases.length > 0 && (
          <p className="mt-3 text-sm text-fg-muted">
            <span className="font-medium text-fg">Also known as:</span>{" "}
            {def.aliases.join(", ")}
          </p>
        )}
        <p className="mt-3 max-w-2xl text-base text-fg-muted">
          {def.description}
        </p>
        <p className="mt-6 font-mono text-xs text-fg-muted">
          {examples.length} examples · {live.length} live
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 pt-8 pb-24 sm:grid-cols-2">
        {live.map((example) => (
          <ExampleCard key={example.system.slug} example={example} />
        ))}
        {linkOnly.map((example) => (
          <ExampleCard key={example.system.slug} example={example} />
        ))}
        {examples.length === 0 && (
          <p className="col-span-full rounded-lg border p-6 text-fg-muted">
            No systems have been extracted for this component yet.
          </p>
        )}
      </section>
    </div>
  )
}

function ExampleCard({ example }: { example: ComponentExample }) {
  const { system, entry, demoSrc } = example
  return (
    <article className="overflow-hidden rounded-lg border bg-bg">
      {/* Preview first; the info bar follows. */}
      {demoSrc ? (
        // Each demo is a standalone page built from the system's real
        // published package (pinned versions). It resolves light/dark itself:
        // it reads this page's <html> class through window.parent (same
        // origin) and observes it, so theme toggles restyle it in place with
        // no reload. allow-same-origin is what makes that read possible.
        <iframe
          src={demoSrc}
          title={`${system.name} ${entry.name} demo`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          className="block w-full border-0 bg-white dark:bg-[#111]"
          style={{ height: entry.demo?.height ?? 130 }}
        />
      ) : (
        <div className="flex h-24 items-center justify-center text-xs text-fg-muted">
          No live demo yet
        </div>
      )}
      <footer className="border-t px-4 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <RouterLink
            to="/systems/$slug"
            params={{ slug: system.slug }}
            className="truncate text-sm font-medium hover:underline"
          >
            {system.name}
          </RouterLink>
          {/* The system's own name for it, when it differs from ours. */}
          {entry.name !== system.name && (
            <span className="truncate font-mono text-xs text-fg-muted">
              {entry.name}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          {entry.docsUrl ? (
            <Link href={entry.docsUrl} className="text-xs">
              docs ↗
            </Link>
          ) : (
            <span />
          )}
          <span className="font-mono text-[10px] text-fg-muted">
            {demoSrc ? "live · pinned" : "docs only"}
          </span>
        </div>
      </footer>
    </article>
  )
}
