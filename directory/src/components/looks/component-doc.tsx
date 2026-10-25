import { Badge } from "@/registry/ui/badge"
import type { DocsBlock, DocsEntry } from "~/data/docs"
import { STATES } from "~/data/looks"
import type { State } from "~/data/looks"
import type { SpecFile, SpecGrid } from "~/data/spec"

import { Copy } from "./copy"

/* One component's docs: its variants and sizes as the capture grouped them,
   by name where the product or the written docs give one, and the states of
   its most used look. The written docs leave out what belongs to another
   component. Products that name little have long axes of hashed keys, so
   each axis shows its most used entries. */

type Cell = SpecGrid["cells"][number]
type Axis = SpecGrid["variants"][number] | SpecGrid["sizes"][number]
type Written = NonNullable<DocsBlock["groups"]>[string]
type Name = NonNullable<Axis["name"] | DocsEntry["name"]>

const SHOWN = 6

const SOURCES = {
  attribute: (name: Name) => ("key" in name ? name.key : "attribute"),
  class: () => "class",
  storybook: () => "story args",
  ai: () => "named by AI",
  docs: () => "their docs",
}

/** A cell's frozen copy in a state, light first. */
const copyOf = (cell: Cell | undefined, state: State = "rest") =>
  cell?.copies?.[state]?.light ?? cell?.copies?.[state]?.dark

const px = (value: string | undefined) => Number.parseFloat(value ?? "") || 0

export function DocStatus({ doc }: { doc?: DocsBlock }) {
  if (doc?.status === "checked")
    return (
      <Badge size="sm" appearance="soft" variant="success">
        Checked
      </Badge>
    )
  if (doc?.status === "reviewed")
    return (
      <Badge size="sm" appearance="soft" variant="accent">
        Reviewed
      </Badge>
    )
  return (
    <Badge size="sm" appearance="soft" variant="warning">
      Draft
    </Badge>
  )
}

/** A written block: its title and status, what the product calls it, its
 *  summary, then its body and notes. */
export function WrittenBlock({
  id,
  title,
  doc,
  called = [],
  children,
}: {
  id: string
  title: string
  doc?: DocsBlock
  called?: string[]
  children?: React.ReactNode
}) {
  return (
    <article
      id={`docs-${id}`}
      className="flex scroll-mt-24 flex-col gap-8 border-t pt-6"
    >
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          <DocStatus doc={doc} />
        </div>
        {called.length > 0 && (
          <p className="text-xs text-fg-muted">
            Called <span className="font-mono">{called.join(", ")}</span> in the
            product
          </p>
        )}
        {doc?.summary && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed">
            {doc.summary}
          </p>
        )}
      </header>
      {children}
      {doc?.usage?.length ? <Notes title="Usage" items={doc.usage} /> : null}
      {doc?.missing?.length ? (
        <Notes title="Still missing" items={doc.missing} />
      ) : null}
    </article>
  )
}

export function ComponentDoc({
  slug,
  id,
  spec,
  doc,
}: {
  slug: string
  id: string
  spec: SpecFile["components"][string]
  doc?: DocsBlock
}) {
  const grids = spec.grids.filter((grid) => grid.cells.length)
  return (
    <WrittenBlock
      id={id}
      title={id}
      doc={doc}
      called={[...new Set(spec.names?.map((name) => name.value))]}
    >
      {grids.map((grid) => (
        <GridDoc
          key={grid.group}
          slug={slug}
          grid={grid}
          written={doc?.groups?.[grid.group]}
          titled={grids.length > 1}
        />
      ))}
    </WrittenBlock>
  )
}

function GridDoc({
  slug,
  grid,
  written,
  titled,
}: {
  slug: string
  grid: SpecGrid
  written?: Written
  titled: boolean
}) {
  const cells = grid.cells
    .filter(
      (c) =>
        !written?.variants?.[c.variant]?.hide &&
        !written?.sizes?.[c.size]?.hide,
    )
    .sort((a, b) => b.count - a.count)
  // A variant or size reached only through left-out looks goes with them.
  const variants = grid.variants.filter((v) =>
    cells.some((c) => c.variant === v.key),
  )
  const kept = grid.sizes.filter((s) => cells.some((c) => c.size === s.key))
  const variantName = (key: string) =>
    written?.variants?.[key]?.name ??
    grid.variants.find((v) => v.key === key)?.name
  const sizeName = (key: string) =>
    written?.sizes?.[key]?.name ?? grid.sizes.find((s) => s.key === key)?.name
  // A size reads as its most used kept cell: a size's own values come from
  // its most used look, which can be a variant left out (an avatar button).
  const sizes = kept.slice(0, SHOWN).map((size) => {
    const cell = cells.find((c) => c.size === size.key)
    return {
      ...size,
      values: {
        ...size.values,
        ...(cell?.values?.light ?? cell?.values?.dark),
      },
    }
  })
  sizes.sort((a, b) => px(a.values.height) - px(b.values.height))
  const top = cells[0]
  const left = [
    ...Object.entries(written?.variants ?? {}),
    ...Object.entries(written?.sizes ?? {}),
  ].filter(([, entry]) => entry.hide)

  return (
    <section className="flex flex-col gap-6">
      {titled && (
        <h4 className="font-mono text-xs text-fg-muted">{grid.group}</h4>
      )}
      {variants.length > 0 && (
        <Part title="Variants" note={axisNote(variants)}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {variants.slice(0, SHOWN).map((variant) => (
              <figure
                key={variant.key}
                className="flex flex-col overflow-hidden rounded-lg border"
              >
                <CopyOr
                  slug={slug}
                  path={copyOf(
                    cells.find((c) => c.variant === variant.key && copyOf(c)),
                  )}
                />
                <figcaption className="flex flex-col gap-1 border-t px-3 py-2 text-xs">
                  <span className="flex items-baseline justify-between gap-2">
                    <NameLabel
                      name={variantName(variant.key)}
                      id={variant.key}
                    />
                    <span className="text-fg-muted tabular-nums">
                      ×{variant.count}
                    </span>
                  </span>
                  {written?.variants?.[variant.key]?.note && (
                    <span className="text-fg-muted">
                      {written.variants[variant.key]!.note}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </Part>
      )}
      {sizes.length > 0 && (
        <Part title="Sizes" note={axisNote(kept)}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-120 text-left text-xs">
              <thead className="text-fg-muted">
                <tr className="border-b">
                  <th className="py-1.5 pr-4 font-normal">Size</th>
                  <th className="py-1.5 pr-4 font-normal">Height</th>
                  <th className="py-1.5 pr-4 font-normal">Padding</th>
                  <th className="py-1.5 pr-4 font-normal">Text</th>
                  <th className="py-1.5 pr-4 font-normal">Icon</th>
                  <th className="py-1.5 text-right font-normal">Seen</th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {sizes.map((size) => (
                  <tr key={size.key} className="border-b last:border-0">
                    <td className="py-1.5 pr-4 font-sans">
                      <NameLabel name={sizeName(size.key)} id={size.key} />
                      {written?.sizes?.[size.key]?.note && (
                        <span className="block text-fg-muted">
                          {written.sizes[size.key]!.note}
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 pr-4">{size.values.height ?? "—"}</td>
                    <td className="py-1.5 pr-4">
                      {size.values.paddingInline ?? "—"}
                    </td>
                    <td className="py-1.5 pr-4">
                      {size.values.fontSize ?? "—"}
                    </td>
                    <td className="py-1.5 pr-4">
                      {size.values.iconSize ?? "—"}
                    </td>
                    <td className="py-1.5 text-right">×{size.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Part>
      )}
      {top && (
        <States
          slug={slug}
          cell={top}
          of={[variantName(top.variant), sizeName(top.size)]
            .map((name) => name?.value)
            .filter(Boolean)
            .join(" · ")}
        />
      )}
      {left.length > 0 && (
        <Part
          title="Left out"
          note="Looks the capture put here that are not this component."
        >
          <ul className="flex flex-col gap-1 text-xs">
            {left.map(([key, entry]) => (
              <li key={key} className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-fg-muted">
                  {key}
                </span>
                <span>{entry.hide}</span>
              </li>
            ))}
          </ul>
        </Part>
      )}
    </section>
  )
}

function States({ slug, cell, of }: { slug: string; cell: Cell; of: string }) {
  const shown = STATES.filter((state) => copyOf(cell, state))
  return (
    <Part title="States" note={`Of its most used look${of ? `, ${of}` : ""}.`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((state) => (
          <figure
            key={state}
            className="flex flex-col overflow-hidden rounded-lg border"
          >
            <CopyOr slug={slug} path={copyOf(cell, state)} />
            <figcaption className="border-t px-3 py-2 text-xs">
              {state}
              {cell.forced?.includes(state as "disabled") && (
                <span className="text-fg-muted"> · set by the capture</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </Part>
  )
}

function CopyOr({ slug, path }: { slug: string; path?: string }) {
  if (!path)
    return (
      <p className="flex min-h-20 items-center px-3 text-xs text-fg-muted">
        No copy
      </p>
    )
  return <Copy slug={slug} path={path} className="min-h-20" />
}

function NameLabel({ name, id }: { name?: Name; id: string }) {
  if (!name)
    return (
      <span className="flex min-w-0 items-baseline gap-1.5">
        <span className="text-fg-muted">unnamed</span>
        <span className="truncate font-mono text-fg-muted">{id}</span>
      </span>
    )
  return (
    <span className="flex min-w-0 items-baseline gap-1.5">
      <span className="font-medium">{name.value}</span>
      <span className="truncate font-mono text-fg-muted">
        {SOURCES[name.from](name)}
      </span>
    </span>
  )
}

function axisNote(axis: Axis[]) {
  const named = axis.filter((entry) => entry.name).length
  return [
    `${axis.length} found, ${named} named by the product`,
    axis.length > SHOWN && `the ${SHOWN} most used shown`,
  ]
    .filter(Boolean)
    .join(" · ")
}

function Part({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-fg-muted">{note}</span>
      </p>
      {children}
    </div>
  )
}

function Notes({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{title}</p>
      <ul className="list-disc pl-5 text-sm text-fg-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
