import { Link } from "@/registry/ui/link"
import type { SystemEntry } from "~/data/schema"

import { Section } from "./primitives"

/* A live system's components: the ones with a demo render from its real
   published package (build-demos.ts), the rest link to its docs. */

export function LiveComponents({ system }: { system: SystemEntry }) {
  const components = system.components?.components ?? []
  const demos = components.filter((entry) => entry.demo && entry.component)
  return (
    <Section
      title="Components"
      intro={`${components.length} components in ${system.name}'s docs. ${demos.length} ${demos.length === 1 ? "renders" : "render"} live from its published package, at pinned versions.`}
    >
      {demos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {demos.map((entry) => (
            <article
              key={entry.name}
              className="overflow-hidden rounded-lg border bg-bg"
            >
              {/* A standalone page that follows this page's light or dark
                  class through window.parent, hence allow-same-origin. */}
              <iframe
                src={`/demos/${system.slug}/${entry.component}.html`}
                title={`${system.name} ${entry.name} demo`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className="block w-full border-0 bg-white dark:bg-[#111]"
                style={{ height: entry.demo?.height ?? 130 }}
              />
              <footer className="flex items-baseline justify-between gap-2 border-t px-4 py-2.5">
                <span className="truncate text-sm font-medium">
                  {entry.name}
                </span>
                {entry.docsUrl && (
                  <Link href={entry.docsUrl} className="text-xs">
                    docs ↗
                  </Link>
                )}
              </footer>
            </article>
          ))}
        </div>
      )}
      <ul className="columns-2 gap-6 text-sm sm:columns-3">
        {components.map((entry) => (
          <li key={entry.name} className="py-0.5">
            {entry.docsUrl ? (
              <Link href={entry.docsUrl}>{entry.name}</Link>
            ) : (
              entry.name
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
