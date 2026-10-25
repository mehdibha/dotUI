import { Link } from "@tanstack/react-router"

import { Badge } from "@/registry/ui/badge"
import type { Block, BlocksFile, BlocksPage } from "~/data/blocks"
import type { DocsFile } from "~/data/docs"
import { pageLabel } from "~/data/schema"
import type { SpecFile } from "~/data/spec"

import { Copy } from "./copy"

/* A captured system's Blocks tab: composed pieces of the real product (a
   card, a dialog, a page header) frozen whole, page by page, each page drawn
   as a wireframe of its regions and where its blocks sit. */

export const pageId = (i: number) => `page-${i + 1}`

/** Wireframe width in CSS px: its labels are sized to it. */
const WIREFRAME = 112

export function BlocksTabPanel({
  blocks,
  docs,
  spec,
}: {
  blocks: BlocksFile
  docs?: DocsFile
  spec?: SpecFile
}) {
  return (
    <div className="flex flex-col gap-20 pt-12 pb-28">
      <p className="max-w-2xl text-[15px] leading-relaxed text-balance text-fg-muted">
        Composed pieces of the real product, frozen whole from its pages on{" "}
        {blocks.capture.date}, and how those pages are laid out. Copies keep the
        product's own markup and styles; redacted ones come from pages that show
        people, with text as x and images as gray boxes.
      </p>
      {blocks.pages.map((page, i) => (
        <PageBlocks
          key={page.key}
          id={pageId(i)}
          slug={blocks.slug}
          page={page}
          blocks={blocks.blocks.filter((block) => block.page === page.key)}
          docs={docs}
          spec={spec}
        />
      ))}
    </div>
  )
}

function PageBlocks({
  id,
  slug,
  page,
  blocks,
  docs,
  spec,
}: {
  id: string
  slug: string
  page: BlocksPage
  blocks: Block[]
  docs?: DocsFile
  spec?: SpecFile
}) {
  const written = docs?.pages?.[page.key]
  // Top to bottom, then what opens over the page.
  const atRest = blocks
    .filter((block) => !block.pass)
    .sort((a, b) => a.box[1] - b.box[1] || a.box[0] - b.box[0])
  const ordered = [...atRest, ...blocks.filter((block) => block.pass)]
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-10">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold tracking-tight">
          {written?.title ?? pageLabel(page.key)}
        </h2>
        <a
          href={page.key}
          target="_blank"
          rel="noreferrer"
          className="w-fit font-mono text-xs break-all text-fg-muted underline-offset-2 hover:text-fg hover:underline"
        >
          {pageLabel(page.key)} ↗
        </a>
      </header>
      <div className="flex gap-6">
        <Wireframe
          page={page}
          blocks={atRest}
          className="hidden shrink-0 sm:block"
        />
        <div className="flex min-w-0 flex-col gap-6">
          {written?.summary && (
            <p className="max-w-2xl text-[15px] leading-relaxed">
              {written.summary}
            </p>
          )}
          {written?.layout?.length ? (
            <ul className="flex max-w-2xl list-disc flex-col gap-1 pl-4 text-sm text-fg-muted">
              {written.layout.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          ) : null}
          <ol className="flex flex-col gap-1 text-sm">
            {ordered.map((block, i) => (
              <li key={block.name} className="flex items-baseline gap-2">
                <span className="w-5 shrink-0 text-right text-xs text-fg-muted tabular-nums">
                  {i + 1}
                </span>
                <a
                  href={`#block-${block.name}`}
                  className="underline-offset-2 hover:underline"
                >
                  {docs?.blocks?.[block.name]?.title ?? block.name}
                </a>
                {block.pass && (
                  <span className="text-xs text-fg-muted">opens over it</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {ordered.map((block, i) => (
        <BlockDoc
          key={block.name}
          n={i + 1}
          slug={slug}
          block={block}
          docs={docs}
          spec={spec}
        />
      ))}
    </section>
  )
}

/** The page at its own proportions: its regions, and its blocks numbered as
 *  in the list beside it. */
function Wireframe({
  page,
  blocks,
  className,
}: {
  page: BlocksPage
  blocks: Block[]
  className?: string
}) {
  const unit = page.viewport.width / WIREFRAME
  return (
    <svg
      viewBox={`0 0 ${page.viewport.width} ${page.height}`}
      width={WIREFRAME}
      className={className}
      role="img"
      aria-label="The page's regions and where its blocks sit"
    >
      <rect
        width={page.viewport.width}
        height={page.height}
        className="fill-bg stroke-border"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {page.regions.map((region, i) => (
        <rect
          key={i}
          x={region.box[0]}
          y={region.box[1]}
          width={region.box[2]}
          height={region.box[3]}
          className="fill-muted stroke-border"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        >
          <title>{region.role}</title>
        </rect>
      ))}
      {blocks.map((block, i) => (
        <g key={block.name}>
          <rect
            x={block.box[0]}
            y={block.box[1]}
            width={block.box[2]}
            height={block.box[3]}
            className="fill-accent/10 stroke-accent"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          >
            <title>{block.name}</title>
          </rect>
          <text
            x={block.box[0] + 2 * unit}
            y={block.box[1] + 9 * unit}
            fontSize={8 * unit}
            className="fill-fg-accent"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}

function BlockDoc({
  n,
  slug,
  block,
  docs,
  spec,
}: {
  n: number
  slug: string
  block: Block
  docs?: DocsFile
  spec?: SpecFile
}) {
  const written = docs?.blocks?.[block.name]
  const copy = block.copies.light ?? block.copies.dark
  return (
    <article
      id={`block-${block.name}`}
      className="flex scroll-mt-24 flex-col gap-4 border-t pt-6"
    >
      <header className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xs text-fg-muted tabular-nums">{n}</span>
          <h3 className="text-base font-semibold">
            {written?.title ?? block.name}
          </h3>
          <span className="font-mono text-xs text-fg-muted tabular-nums">
            {block.box[2]} × {block.box[3]}
          </span>
          {block.redacted && (
            <Badge size="sm" appearance="outline">
              Redacted
            </Badge>
          )}
        </div>
        {written?.note && (
          <p className="max-w-2xl text-[15px] leading-relaxed">
            {written.note}
          </p>
        )}
        {written?.uses?.length ? (
          <p className="text-xs text-fg-muted">
            Built from{" "}
            {written.uses.map((component, i) => (
              <span key={component}>
                {i > 0 && ", "}
                {spec?.components[component]?.grids.some(
                  (grid) => grid.cells.length,
                ) ? (
                  <Link
                    to="/systems/$slug"
                    params={{ slug }}
                    hash={`docs-${component}`}
                    className="underline-offset-2 hover:text-fg hover:underline"
                  >
                    {component}
                  </Link>
                ) : (
                  component
                )}
              </span>
            ))}
          </p>
        ) : null}
      </header>
      {copy ? (
        <Copy
          slug={slug}
          path={copy}
          className="max-h-160 overflow-y-auto rounded-lg border"
        />
      ) : (
        <p className="text-xs text-fg-muted">No copy</p>
      )}
    </article>
  )
}
