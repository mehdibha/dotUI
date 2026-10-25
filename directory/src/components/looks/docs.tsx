import { Link } from "@tanstack/react-router"

import { Badge } from "@/registry/ui/badge"
import { Section } from "~/components/system/primitives"
import { CORE_COMPONENTS } from "~/data/looks"
import type { LooksFile } from "~/data/looks"
import { cn } from "~/lib/utils"

/* A system's docs, one block per foundation and per component. None is
   written yet: each block says whether the capture has data for it, and
   links to what it read. */

interface DocBlock {
  name: string
  /** What the capture read for it, empty when it read nothing. */
  read: string
  /** Its section under Computed. */
  anchor?: string
}

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`

export function DocsFoundations({ looks }: { looks: LooksFile }) {
  const { color, type, shape, spacing, elevation } = looks
  const roles = Math.max(
    ...Object.values(color.modes).map(
      (mode) => Object.keys(mode?.roles ?? {}).length,
    ),
    0,
  )
  const blocks: DocBlock[] = [
    {
      name: "Color",
      read: roles ? plural(roles, "color role") : "",
      anchor: "color",
    },
    {
      name: "Type",
      read: type.styles.length ? plural(type.styles.length, "text style") : "",
      anchor: "type",
    },
    {
      name: "Shape",
      read: shape.radius.length
        ? plural(shape.radius.length, "corner radius", "corner radii")
        : "",
      anchor: "shape",
    },
    {
      name: "Spacing",
      read: spacing.steps.length
        ? plural(spacing.steps.length, "spacing step")
        : "",
      anchor: "spacing",
    },
    {
      name: "Elevation",
      read: elevation.shadows.length
        ? plural(elevation.shadows.length, "shadow")
        : "",
      anchor: "elevation",
    },
    { name: "Icons", read: "" },
  ]
  return (
    <Section
      title="Foundations"
      intro="The docs are written block by block, from what the capture read and a review of full-page shots. No block is written yet: a draft has captured data to write from, a missing block needs another capture pass."
    >
      <Blocks slug={looks.slug} blocks={blocks} />
    </Section>
  )
}

export function DocsComponents({ looks }: { looks: LooksFile }) {
  const keys = [
    ...CORE_COMPONENTS,
    ...Object.keys(looks.components).filter(
      (key) => key !== "other" && !CORE_COMPONENTS.includes(key),
    ),
  ]
  const blocks = keys.map((key) => {
    const found = looks.components[key]?.looks.length ?? 0
    return {
      name: key,
      read: found ? plural(found, "look") : "",
      anchor: `component-${key}`,
    }
  })
  return (
    <Section
      title="Components"
      intro="One block per component: its variants and sizes by name, its states, and how the product uses it."
    >
      <Blocks slug={looks.slug} blocks={blocks} />
    </Section>
  )
}

function Blocks({ slug, blocks }: { slug: string; blocks: DocBlock[] }) {
  const drafts = blocks.filter((block) => block.read).length
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-muted">
        {drafts} of {blocks.length} drafts · 0 written
      </p>
      <ul className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
        {blocks.map((block) => (
          <li
            key={block.name}
            className="flex items-center justify-between gap-3 bg-bg px-4 py-3"
          >
            <span className="flex min-w-0 flex-col">
              <span
                className={cn(
                  "text-sm font-medium",
                  !block.read && "text-fg-muted",
                )}
              >
                {block.name}
              </span>
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
              <Badge size="sm" appearance="soft" variant="warning">
                Draft
              </Badge>
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
