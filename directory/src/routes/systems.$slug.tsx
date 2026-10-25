import {
  createFileRoute,
  notFound,
  Outlet,
  useParams,
} from "@tanstack/react-router"

import { Link } from "@/registry/ui/link"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { getTabs, TABS } from "~/components/system/registry"
import { SystemDesktopToc } from "~/components/system/toc"
import { dataIndex } from "~/data"
import type { LooksFile } from "~/data/looks"

// Each system's looks.json is its own chunk: a page loads only its own.
const looksFiles = import.meta.glob<LooksFile>("../../systems/*/looks.json", {
  import: "default",
})

/* A system's page: its header and tabs. The first tab is /systems/<slug>,
   the others /systems/<slug>/<tab>, so each one prerenders. */
export const Route = createFileRoute("/systems/$slug")({
  loader: async ({ params }) => {
    const catalogEntry = dataIndex.catalog.find(
      (entry) => entry.slug === params.slug || entry.preset === params.slug,
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    const captured = dataIndex.looks.find((l) => l.slug === params.slug)
    const load = looksFiles[`../../systems/${params.slug}/looks.json`]
    const looks = load ? await load() : undefined
    if (!system && !looks) throw notFound()
    return { catalogEntry, system, captured, looks }
  },
  component: SystemPage,
})

function SystemPage() {
  const { catalogEntry, system, captured } = Route.useLoaderData()
  const { slug, tab: param } = useParams({ strict: false })
  const tabs = getTabs(slug!)
  const tab = tabs.find((id) => id === param) ?? tabs[0]!
  const name = system?.name ?? catalogEntry?.name ?? captured?.name ?? ""
  const org = system?.org ?? catalogEntry?.org
  const homepage = catalogEntry?.homepage ?? system?.sources.site ?? undefined
  const homepageLabel = homepage
    ? homepage.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : undefined

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* In-page TOC floating in the left gutter, aligned with the title's
          vertical center — full list on wide gutters, collapsing to lines, then
          to the header dropdown below lg. Never affects the centered content. */}
      <div className="absolute top-13 right-full bottom-0 hidden lg:block">
        <SystemDesktopToc
          key={tab}
          slug={slug!}
          tab={tab}
          className="sticky top-24 mr-4"
        />
      </div>
      <header className="px-6 pt-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          {org && <span className="text-sm text-fg-muted">by {org}</span>}
        </div>
        {homepage && homepageLabel && (
          <div className="mt-2 text-sm">
            <Link href={homepage}>{homepageLabel} ↗</Link>
          </div>
        )}
      </header>

      {tabs.length > 1 ? (
        <Tabs selectedKey={tab} className="px-6 pt-8">
          <TabList aria-label="Views">
            {tabs.map((id, i) => (
              <Tab
                key={id}
                id={id}
                href={
                  i === 0
                    ? { to: "/systems/$slug", params: { slug } }
                    : { to: "/systems/$slug/$tab", params: { slug, tab: id } }
                }
              >
                {TABS[id]}
              </Tab>
            ))}
          </TabList>
          <TabPanel id={tab}>
            <Outlet />
          </TabPanel>
        </Tabs>
      ) : (
        <div className="px-6">
          <Outlet />
        </div>
      )}
    </div>
  )
}
