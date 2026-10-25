import { Link } from "@tanstack/react-router"

import { Badge } from "@/registry/ui/badge"
import { Section } from "~/components/system/primitives"
import type { DocsFile } from "~/data/docs"
import { CORE_COMPONENTS } from "~/data/looks"
import { cn } from "~/lib/utils"

import type { LooksData } from "."
import { ComponentDoc, DocStatus, WrittenSection } from "./component-doc"

/* A system's docs, one section per foundation and per component: written
   where docs.json covers it, otherwise a draft of what the capture read,
   or missing when it read nothing. */

interface DocSection {
  id: string
  name: string
  /** What the capture read for it, empty when it read nothing. */
  read: string
  /** Its section under Computed. */
  anchor?: string
  /** Its section further down this tab, once a spec grid describes it. */
  inPage?: boolean
}

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`

export function DocsFoundations({ looks, docs }: LooksData) {
  const { color, type, shape, spacing, elevation } = looks
  const roles = Math.max(
    ...Object.values(color.modes).map(
      (mode) => Object.keys(mode?.roles ?? {}).length,
    ),
    0,
  )
  const sections: DocSection[] = [
    {
      id: "color",
      name: "Color",
      read: roles ? plural(roles, "color role") : "",
      anchor: "color",
    },
    {
      id: "type",
      name: "Type",
      read: type.styles.length ? plural(type.styles.length, "text style") : "",
      anchor: "type",
    },
    {
      id: "shape",
      name: "Shape",
      read: shape.radius.length
        ? plural(shape.radius.length, "corner radius", "corner radii")
        : "",
      anchor: "shape",
    },
    {
      id: "spacing",
      name: "Spacing",
      read: spacing.steps.length
        ? plural(spacing.steps.length, "spacing step")
        : "",
      anchor: "spacing",
    },
    {
      id: "elevation",
      name: "Elevation",
      read: elevation.shadows.length
        ? plural(elevation.shadows.length, "shadow")
        : "",
      anchor: "elevation",
    },
    { id: "icons", name: "Icons", read: "" },
  ].map((section) => ({ ...section, inPage: !!docs?.sections[section.id] }))
  return (
    <Section
      title="Foundations"
      intro="The docs are written one section at a time, from what the capture read and a review of full-page shots. A draft has captured data to write from; a missing section needs another capture pass."
    >
      <SectionList slug={looks.slug} sections={sections} docs={docs} />
      {sections
        .filter((section) => section.inPage)
        .map((section) => (
          <WrittenSection
            key={section.id}
            id={section.id}
            title={section.name}
            doc={docs!.sections[section.id]}
          />
        ))}
    </Section>
  )
}

export function DocsComponents({ looks, spec, docs }: LooksData) {
  const keys = [
    ...CORE_COMPONENTS,
    ...Object.keys(looks.components).filter(
      (key) => key !== "other" && !CORE_COMPONENTS.includes(key),
    ),
  ]
  const sections = keys.map((key) => {
    const found = looks.components[key]?.looks.length ?? 0
    return {
      id: key,
      name: key,
      read: found ? plural(found, "look") : "",
      anchor: `component-${key}`,
      inPage: !!spec?.components[key]?.grids.some((g) => g.cells.length),
    }
  })
  return (
    <Section
      title="Components"
      intro="One section per component: its variants and sizes by name, its states, and how the product uses it."
    >
      <SectionList slug={looks.slug} sections={sections} docs={docs} />
      {sections
        .filter((section) => section.inPage)
        .map((section) => (
          <ComponentDoc
            key={section.id}
            slug={looks.slug}
            id={section.id}
            spec={spec!.components[section.id]!}
            doc={docs?.sections[section.id]}
          />
        ))}
    </Section>
  )
}

function SectionList({
  slug,
  sections,
  docs,
}: {
  slug: string
  sections: DocSection[]
  docs?: DocsFile
}) {
  const drafts = sections.filter((section) => section.read).length
  const written = sections.filter(
    (section) => docs?.sections[section.id],
  ).length
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-muted">
        {drafts} of {sections.length} with captured data · {written} written
      </p>
      <ul className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
        {sections.map((section) => (
          <li
            key={section.id}
            className="flex items-center justify-between gap-3 bg-bg px-4 py-3"
          >
            <span className="flex min-w-0 flex-col">
              {section.inPage ? (
                <a
                  href={`#docs-${section.id}`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  {section.name}
                </a>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    !section.read && "text-fg-muted",
                  )}
                >
                  {section.name}
                </span>
              )}
              {section.read && section.anchor ? (
                <Link
                  to="/systems/$slug/$tab"
                  params={{ slug, tab: "computed" }}
                  hash={section.anchor}
                  className="text-xs text-fg-muted underline-offset-2 hover:text-fg hover:underline"
                >
                  {section.read} read
                </Link>
              ) : (
                <span className="text-xs text-fg-muted">nothing read yet</span>
              )}
            </span>
            {section.read ? (
              <DocStatus doc={docs?.sections[section.id]} />
            ) : (
              <Badge size="sm" appearance="outline">
                Missing
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
