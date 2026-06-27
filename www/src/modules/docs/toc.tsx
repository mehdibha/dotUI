import React from 'react'
import {
  AnchorProvider,
  TOCItem as PrimitiveTOCItem,
  ScrollProvider,
  type TOCItemType,
  useActiveAnchors,
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
        'relative ms-px scrollbar-none min-h-0 scroll-fade-y overflow-auto py-3 text-sm scroll-fade-4',
        className,
      )}
      {...props}
    >
      <ScrollProvider containerRef={viewRef}>{props.children}</ScrollProvider>
    </div>
  )
}

type TocThumb = [top: number, height: number]

interface RefProps {
  containerRef: React.RefObject<HTMLElement | null>
}

export function TocThumb({
  containerRef,
  ...props
}: React.ComponentProps<'div'> & RefProps) {
  const thumbRef = React.useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={thumbRef} role="none" {...props} />
      <Updater containerRef={containerRef} thumbRef={thumbRef} />
    </>
  )
}

function Updater({
  containerRef,
  thumbRef,
}: RefProps & { thumbRef: React.RefObject<HTMLElement | null> }) {
  const active = useActiveAnchors()
  const updateThumb = React.useCallback(() => {
    if (!containerRef.current || !thumbRef.current) return
    update(thumbRef.current, calc(containerRef.current, active))
  }, [active, containerRef, thumbRef])

  React.useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const observer = new ResizeObserver(updateThumb)
    observer.observe(container)

    return () => observer.disconnect()
  }, [containerRef, updateThumb])

  React.useEffect(() => {
    updateThumb()
  }, [updateThumb])

  return null
}

function calc(container: HTMLElement, active: string[]): TocThumb {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0]
  }

  let upper = Number.MAX_VALUE
  let lower = 0

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`)
    if (!element) continue

    const styles = getComputedStyle(element)
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop))
    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom),
    )
  }

  return [upper, lower - upper]
}

function update(element: HTMLElement, info: TocThumb): void {
  element.style.setProperty('--toc-top', `${info[0]}px`)
  element.style.setProperty('--toc-height', `${info[1]}px`)
}

export function TOCItems({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const items = useTOCItems()

  if (items.length === 0) return null

  return (
    <>
      <TocThumb
        containerRef={containerRef}
        className="absolute top-(--toc-top) h-(--toc-height) w-px bg-primary transition-[height,top]"
      />
      <nav
        ref={mergeRefs(ref, containerRef)}
        aria-label="On this page"
        className={cn('flex flex-col', className)}
        {...props}
      >
        {items.map((item) => (
          <TOCItem key={item.url} item={item} />
        ))}
      </nav>
    </>
  )
}

function TOCItem({ item }: { item: TOCItemType }) {
  return (
    <PrimitiveTOCItem
      href={item.url}
      className={cn(
        'py-1 text-sm wrap-anywhere text-fg-muted transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg',
        item.depth <= 2 && 'pl-3',
        item.depth === 3 && 'pl-6',
        item.depth >= 4 && 'pl-8',
      )}
    >
      {item.title}
    </PrimitiveTOCItem>
  )
}
