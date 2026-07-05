import React from 'react'
import {
  AnchorProvider,
  TOCItem as PrimitiveTOCItem,
  ScrollProvider,
  type TOCItemType,
} from 'fumadocs-core/toc'
import { mergeRefs } from 'react-aria/mergeRefs'

import { nodeText } from '@/lib/node-text'
import { cn } from '@/registry/lib/utils'

export type { TableOfContents, TOCItemType } from 'fumadocs-core/toc'

const TOCContext = React.createContext<TOCItemType[]>([])

export function useTOCItems(): TOCItemType[] {
  return React.use(TOCContext)
}

export function TOCProvider({
  toc,
  children,
  ...props
}: React.ComponentProps<typeof AnchorProvider>) {
  return (
    <TOCContext value={toc}>
      <AnchorProvider toc={toc} {...props}>
        {children}
      </AnchorProvider>
    </TOCContext>
  )
}

export function TOC({ className, ...props }: React.ComponentProps<'div'>) {
  const tocItems = useTOCItems()
  if (tocItems.length === 0) return null

  return (
    <div
      className={cn(
        'sticky top-10 flex max-h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden',
        className,
      )}
      {...props}
    >
      {/* <h3 className="inline-flex items-center gap-1.5 text-fg-muted text-sm">
				<AlignLeftIcon className="size-4 text-fg-muted" />
				On this page
			</h3> */}
      <TOCScrollArea>
        <TOCItems />
      </TOCScrollArea>
    </div>
  )
}

export function TOCScrollArea({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const viewRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={mergeRefs(viewRef, ref)}
      className={cn(
        'no-scrollbar min-h-0 scroll-fade-y overflow-auto pt-10 pb-3 text-sm scroll-fade-6',
        className,
      )}
      {...props}
    >
      <ScrollProvider containerRef={viewRef}>{props.children}</ScrollProvider>
    </div>
  )
}

export function TOCItems({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const items = useTOCItems()

  if (items.length === 0) return null

  return (
    <nav
      ref={ref}
      aria-label="On this page"
      className={cn('flex flex-col', className)}
      {...props}
    >
      {items.map((item) => (
        <TOCItem key={item.url} item={item} />
      ))}
    </nav>
  )
}

function TOCItem({ item }: { item: TOCItemType }) {
  return (
    <PrimitiveTOCItem
      href={item.url}
      className={cn(
        'py-1 text-[0.8rem] wrap-anywhere text-fg-muted transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg',
        item.depth <= 2 && 'pl-3',
        item.depth === 3 && 'pl-6',
        item.depth >= 4 && 'pl-8',
      )}
    >
      {item.title}
    </PrimitiveTOCItem>
  )
}

/**
 * Collapsed TOC for the md–xl range: a stack of lines standing in for the
 * headings, one per item, with the active one highlighted. Hovering or
 * focusing them reveals a panel listing every heading to jump to.
 *
 * The panel is a CSS group-hover/focus-within child sitting flush against the
 * lines (right-full + a transparent pr bridge), so the pointer never crosses
 * dead space between lines and panel — no open/close flicker.
 */
export function MiniTOC({ className }: { className?: string }) {
  const items = useTOCItems()
  if (items.length === 0) return null

  return (
    <div className={cn('group relative', className)}>
      <div className="flex flex-col items-end">
        {items.map((item) => (
          <MiniTOCLine key={item.url} item={item} />
        ))}
      </div>
      <div className="invisible absolute top-0 right-full origin-top-right scale-95 pr-2.5 opacity-0 transition-[opacity,scale,visibility] duration-150 ease-out group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
        <div className="no-scrollbar max-h-[70svh] w-64 overflow-auto rounded-xl border bg-popover p-2 text-sm shadow-md">
          <TOCItems
            aria-label="On this page"
            className="[&_a]:rounded-md [&_a]:pr-2 [&_a:hover]:bg-muted [&_a:hover]:text-fg"
          />
        </div>
      </div>
    </div>
  )
}

function MiniTOCLine({ item }: { item: TOCItemType }) {
  return (
    // The link is a taller, transparent hit area so the whole column is
    // clickable (no dead gaps); the thin bar is a child that shows the state.
    <PrimitiveTOCItem
      href={item.url}
      aria-label={nodeText(item.title)}
      className="flex h-3.5 items-center justify-end"
    >
      <span
        className={cn(
          'h-0.5 w-5 rounded-full bg-border transition-all [[data-active=true]>&]:w-6 [[data-active=true]>&]:bg-fg',
          item.depth === 3 && 'w-4',
          item.depth >= 4 && 'w-3',
        )}
      />
    </PrimitiveTOCItem>
  )
}
