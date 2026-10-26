"use client"

/* The panel on a phone held upright: the main page's rows as cards in one
   strip under the preview, and one sheet for everything they open. A card's
   page or picker is the sheet's first view; each picker opened inside it
   drills in over the view under it, and Back pops it. */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Dialog as RacDialog } from "react-aria-components"

import {
  ComponentParamsProvider,
  useDensity,
  useParamSelections,
} from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

/** Every chapter's rows, side by side on the panel's surface: styles.css
 *  lays each out as a card. */
export function CardStrip({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-clip rounded-[14px] border border-fg/6 bg-card">
      <div
        data-cards=""
        className="no-scrollbar flex snap-x scroll-px-2 gap-1.5 overflow-x-auto overscroll-x-contain p-2"
      >
        {children}
      </div>
    </div>
  )
}

export interface SheetStackValue {
  /** Where pickers portal their view, over the views opened before. */
  host: HTMLElement | null
  /** An open picker's close, for dismissing the whole sheet. */
  register: (close: () => void) => () => void
}

/** The sheet's views, provided while the panel docks under the preview. */
export const SheetStack = createContext<SheetStackValue | null>(null)

/** The sheet's state: the views' host, and the pickers open in it. */
export function useSheetStack() {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const closers = useRef(new Set<() => void>())
  const [pickers, setPickers] = useState(0)
  const register = useCallback((close: () => void) => {
    closers.current.add(close)
    setPickers((n) => n + 1)
    return () => {
      closers.current.delete(close)
      setPickers((n) => n - 1)
    }
  }, [])
  // Topmost first, so each closes over a view that is still there.
  const closeAll = useCallback(() => {
    for (const close of [...closers.current].reverse()) close()
  }, [])
  const value = useMemo(() => ({ host, register }), [host, register])
  return { value, setHost, pickers, closeAll }
}

/* A view drills in from the right; the one Back reveals comes back from the
   left (shown again, it replays). Only the top view shows. */
const VIEW =
  "flex flex-col data-[drill=in]:animate-in data-[drill=in]:slide-in-from-right-6 data-[drill=out]:animate-in data-[drill=out]:slide-in-from-left-6 fade-in duration-200 ease-out motion-reduce:animate-none"

/** A view: Back and its title over its rows. */
export function SheetView({
  title,
  onBack,
  backLabel,
  drill,
  children,
  ...props
}: {
  title: string
  /** Back, when there's a view to return to. */
  onBack?: () => void
  backLabel?: string
  drill?: "in" | "out"
  children: ReactNode
} & Omit<React.ComponentProps<"section">, "title">) {
  return (
    <section
      aria-label={title}
      data-drill={drill}
      className={cn("group/view", VIEW)}
      {...props}
    >
      <div className="sticky top-0 z-10 flex h-10 shrink-0 items-center gap-1 bg-(--panel-surface) px-2">
        {onBack && (
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label={backLabel ? `Back to ${backLabel}` : "Back"}
            onPress={onBack}
            // A picker opened from a card is the first view: nothing to go back to.
            className="data-icon-only:size-7 group-first/view:data-pop:hidden"
            data-pop={backLabel ? undefined : ""}
          >
            <ChevronLeftIcon />
          </Button>
        )}
        <h2 className="min-w-0 truncate px-1 text-sm font-medium">{title}</h2>
      </div>
      <div className="flex flex-col gap-1.5 px-2 pb-2">{children}</div>
    </section>
  )
}

/** The one sheet: open while a page or a picker is. It opens to a snap
 *  point that leaves the preview's top in view; dragged up, it shows the
 *  rest. */
export function PanelSheet({
  isOpen,
  onDismiss,
  stack,
  label,
  children,
}: {
  isOpen: boolean
  onDismiss: () => void
  stack: ReturnType<typeof useSheetStack>
  label: string
  children: ReactNode
}) {
  useDrill(stack.value.host)
  // What it showed stays while it slides out.
  const shown = useRef(children)
  if (isOpen) shown.current = children
  // Detached whatever the site's design system picks: a card inset from the
  // screen's edges.
  const params = useParamSelections()
  const detached = useMemo(
    () => ({ ...params, sheet: { ...params.sheet, edge: "detached" } }),
    [params],
  )
  return (
    <ComponentParamsProvider params={detached} density={useDensity()}>
      <Sheet
        isOpen={isOpen}
        onOpenChange={(open) => !open && onDismiss()}
        // One height for every view, so the snap point sits at the same place
        // whatever's open.
        className="h-[calc(100dvh-3rem)]"
        snapPoints={["60%"]}
      >
        <RacDialog aria-label={label} className="flex flex-col outline-none">
          <SheetHandle />
          <div
            ref={stack.setHost}
            className="flex flex-col [--panel-surface:var(--color-popover)] *:not-last:hidden"
          >
            {shown.current}
          </div>
        </RacDialog>
      </Sheet>
    </ComponentParamsProvider>
  )
}

/** Marks a view pushed over another as drilling in, and the view a pop
 *  reveals as drilling back; a new view opens at its top. */
function useDrill(host: HTMLElement | null) {
  useEffect(() => {
    if (!host) return
    const scroller = host.closest<HTMLElement>("[data-sheet-content]")
    const scrolled = new WeakMap<Element, number>()
    let top = host.lastElementChild
    const observer = new MutationObserver((records) => {
      const added = records.some((record) => record.addedNodes.length > 0)
      const next = host.lastElementChild
      if (!(next instanceof HTMLElement) || next === top) return
      if (top) scrolled.set(top, scroller?.scrollTop ?? 0)
      // A page swaps itself, and says which way.
      if (!next.dataset.drill && host.childElementCount > 1)
        next.dataset.drill = added ? "in" : "out"
      else if (!added) next.dataset.drill = "out"
      if (scroller) scroller.scrollTop = added ? 0 : (scrolled.get(next) ?? 0)
      top = next
    })
    observer.observe(host, { childList: true })
    return () => observer.disconnect()
  }, [host])
}
