import { createFileRoute, notFound } from "@tanstack/react-router"

import { Link } from "@/registry/ui/link"
import { PRESET_CATALOG } from "@/modules/presets/__generated__/catalog"
import { LooksExplorer } from "~/components/looks"
import { SystemExplorer } from "~/components/system"
import { SystemDesktopToc } from "~/components/system/toc"
import { dataIndex } from "~/data"
import type { LooksFile } from "~/data/looks"

// Each system's looks.json is its own chunk: a page loads only its own.
const looksFiles = import.meta.glob<LooksFile>("../../systems/*/looks.json", {
  import: "default",
})

export const Route = createFileRoute("/systems/$slug")({
  loader: async ({ params }) => {
    const catalogEntry = dataIndex.catalog.find(
      (entry) => entry.slug === params.slug,
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    const load = looksFiles[`../../systems/${params.slug}/looks.json`]
    const looks = load ? await load() : undefined
    if (!catalogEntry && !system && !looks) throw notFound()
    return { catalogEntry, system, looks }
  },
  component: SystemPage,
})

function SystemPage() {
  const { catalogEntry, system, looks } = Route.useLoaderData()
  const preset = PRESET_CATALOG.find((p) => p.id === looks?.preset)
  const name = system?.name ?? catalogEntry?.name ?? preset?.name ?? ""
  const org = system?.org ?? catalogEntry?.org ?? preset?.name ?? ""
  const homepage = catalogEntry?.homepage ?? system?.sources.site ?? undefined
  const homepageLabel = homepage
    ? homepage.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : undefined

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* In-page TOC floating in the left gutter, aligned with the title's
          vertical center — full list on wide gutters, collapsing to lines, then
          to the header dropdown below lg. Never affects the centered content. */}
      {(system || looks) && (
        <div className="absolute top-13 right-full bottom-0 hidden lg:block">
          <SystemDesktopToc
            slug={system?.slug ?? looks?.slug ?? ""}
            className="sticky top-24 mr-4"
          />
        </div>
      )}
      <header className="px-6 pt-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          <span className="text-sm text-fg-muted">by {org}</span>
        </div>
        {homepage && homepageLabel && (
          <div className="mt-2 text-sm">
            <Link href={homepage}>{homepageLabel} ↗</Link>
          </div>
        )}
      </header>

      {looks ? (
        <LooksExplorer looks={looks} />
      ) : system ? (
        <SystemExplorer system={system} catalogEntry={catalogEntry} />
      ) : (
        <div className="px-6 pb-16">
          <p className="mt-10 max-w-2xl rounded-lg border p-6 text-fg-muted">
            Not explorable yet. This system&apos;s color and tokens will show up
            here once its pages are built.
          </p>
        </div>
      )}
    </div>
  )
}
