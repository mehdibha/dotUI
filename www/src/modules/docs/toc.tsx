import React from 'react'
import {
  AnchorProvider,
  TOCItem as PrimitiveTOCItem,
  ScrollProvider,
  type TOCItemType,
} from 'fumadocs-core/toc'
import { mergeRefs } from 'react-aria/mergeRefs'

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
        'sticky top-10 flex h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden',
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
        'scrollbar-none min-h-0 scroll-fade-y overflow-auto pt-10 pb-3 text-sm scroll-fade-4',
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
