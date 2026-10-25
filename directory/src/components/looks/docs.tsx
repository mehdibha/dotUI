import { Link } from "@tanstack/react-router"

import { Badge } from "@/registry/ui/badge"
import { Section } from "~/components/system/primitives"
import type { DocsFile } from "~/data/docs"
import { CORE_COMPONENTS } from "~/data/looks"
import { cn } from "~/lib/utils"

import type { LooksData } from "."
import { ComponentDoc, DocStatus, WrittenBlock } from "./component-doc"

/* A system's docs, one block per foundation and per component: written
   where docs.json covers it, otherwise a draft of what the capture read,
   or missing when it read nothing. */

interface DocBlock {
  id: string
  name: string
  /** What the capture read for it, empty when it read nothing. */
  read: string
  /** Its section under Computed. */
  anchor?: string
  /** Its block further down this tab, once a spec grid describes it. */
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
  const blocks: DocBlock[] = [
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
  ].map((block) => ({ ...block, inPage: !!docs?.blocks[block.id] }))
  return (
    <Section
      title="Foundations"
      intro="The docs are written block by block, from what the capture read and a review of full-page shots. A draft has captured data to write from; a missing block needs another capture pass."
    >
      <Blocks slug={looks.slug} blocks={blocks} docs={docs} />
      {blocks
        .filter((block) => block.inPage)
        .map((block) => (
          <WrittenBlock
            key={block.id}
            id={block.id}
            title={block.name}
            doc={docs!.blocks[block.id]}
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
  const blocks = keys.map((key) => {
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
      intro="One block per component: its variants and sizes by name, its states, and how the product uses it."
    >
      <Blocks slug={looks.slug} blocks={blocks} docs={docs} />
      {blocks
        .filter((block) => block.inPage)
        .map((block) => (
          <ComponentDoc
            key={block.id}
            slug={looks.slug}
            id={block.id}
            spec={spec!.components[block.id]!}
            doc={docs?.blocks[block.id]}
          />
        ))}
    </Section>
  )
}

function Blocks({
  slug,
  blocks,
  docs,
}: {
  slug: string
  blocks: DocBlock[]
  docs?: DocsFile
}) {
  const drafts = blocks.filter((block) => block.read).length
  const written = blocks.filter((block) => docs?.blocks[block.id]).length
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-muted">
        {drafts} of {blocks.length} with captured data · {written} written
      </p>
      <ul className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
        {blocks.map((block) => (
          <li
            key={block.id}
            className="flex items-center justify-between gap-3 bg-bg px-4 py-3"
          >
            <span className="flex min-w-0 flex-col">
              {block.inPage ? (
                <a
                  href={`#docs-${block.id}`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  {block.name}
                </a>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    !block.read && "text-fg-muted",
                  )}
                >
                  {block.name}
                </span>
              )}
              {block.read && block.anchor ? (
                <Link
                  to="/systems/$slug/$tab"
                  params={{ slug, tab: "computed" }}
                  hash={block.anchor}
                  className="text-xs text-fg-muted underline-offset-2 hover:text-fg hover:underline"
                >
                  {block.read} read
                </Link>
              ) : (
                <span className="text-xs text-fg-muted">nothing read yet</span>
              )}
            </span>
            {block.read ? (
              <DocStatus doc={docs?.blocks[block.id]} />
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
