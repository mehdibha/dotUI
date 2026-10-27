"use client"

/* The panel on a phone held upright: the main page's rows as cards in one
   strip under the preview, and one sheet for everything they open. A card's
   page or picker is the sheet's first view; each picker opened inside it
   drills in over the view under it, and Back pops it. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"
import { ChevronLeftIcon, XIcon } from "lucide-react"
import { Button as RacButton, Dialog as RacDialog } from "react-aria-components"

import {
  ComponentParamsProvider,
  useDensity,
  useParamSelections,
} from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

/** Every chapter's rows, side by side on the panel's surface: styles.css
 *  lays each out as a card. */
export function CardStrip({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-clip rounded-[14px] border border-fg/6 bg-card">
      <div
        data-cards=""
        className="no-scrollbar flex gap-1.5 overflow-x-auto overscroll-x-contain p-2"
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
  /** Dismisses the whole sheet, from any view. */
  close: () => void
}

/** The sheet's views, provided while the panel docks under the preview. */
export const SheetStack = createContext<SheetStackValue | null>(null)

/** The sheet's state: the views' host, and the pickers open in it.
 *  `onClose` drops the pages it showed. */
export function useSheetStack(onClose: () => void) {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const closers = useRef(new Set<() => void>())
  const [pickers, setPickers] = useState(0)
  const [closing, setClosing] = useState(false)
  const finish = useRef<(() => void) | null>(null)
  const register = useCallback((close: () => void) => {
    closers.current.add(close)
    setPickers((n) => n + 1)
    return () => {
      closers.current.delete(close)
      setPickers((n) => n - 1)
    }
  }, [])
  // The sheet slides out with its views; they go once it's gone, topmost
  // first, so each closes over a view that is still there.
  const close = useCallback(() => {
    finish.current = () => {
      for (const close of [...closers.current].reverse()) close()
      onClose()
      setClosing(false)
    }
    setClosing(true)
  }, [onClose])
  const attach = useCallback((node: HTMLElement | null) => {
    setHost(node)
    if (node) return
    finish.current?.()
    finish.current = null
  }, [])
  const value = useMemo(
    () => ({ host, register, close }),
    [host, register, close],
  )
  return { value, attach, pickers, closing }
}

/* A view drills in from the right; the one Back reveals comes back from the
   left (shown again, it replays). Only the top view shows. */
const VIEW =
  "flex flex-col data-[drill=in]:animate-in data-[drill=in]:slide-in-from-right-6 data-[drill=out]:animate-in data-[drill=out]:slide-in-from-left-6 fade-in duration-200 ease-out motion-reduce:animate-none"

const ROUND =
  "flex size-10 cursor-interactive items-center justify-center rounded-full tint-6 text-fg outline-none transition-colors hover:tint-10 focus-visible:focus-ring pressed:tint-12 *:[svg]:size-5"

/** A view, after iOS's sheets: a round Close, or Back once there's a view
 *  under it, and the title centered over its rows. */
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
  // Pickers portal in from elsewhere in the tree: the stack reaches them.
  const close = useContext(SheetStack)?.close
  // With no page named behind it, Back leads to the view under it, if any:
  // the first view, opened from a card, closes instead.
  const picker = !!onBack && !backLabel
  return (
    <section
      aria-label={title}
      data-drill={drill}
      className={cn("group/view", VIEW)}
      {...props}
    >
      <div className="sticky top-0 z-10 grid h-15 shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 bg-(--panel-surface) px-4 pb-3">
        {onBack && (
          <RacButton
            aria-label={backLabel ? `Back to ${backLabel}` : "Back"}
            onPress={onBack}
            className={cn(ROUND, picker && "group-first/view:hidden")}
          >
            <ChevronLeftIcon />
          </RacButton>
        )}
        {(!onBack || picker) && (
          <RacButton
            aria-label="Close"
            onPress={close}
            className={cn(ROUND, picker && "hidden group-first/view:flex")}
          >
            <XIcon />
          </RacButton>
        )}
        <h2 className="col-start-2 truncate text-center text-[17px] font-semibold">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-1.5 px-4 pb-4">{children}</div>
    </section>
  )
}

/** The one sheet: open while a page or a picker is. */
export function PanelSheet({
  isOpen,
  stack,
  label,
  children,
}: {
  isOpen: boolean
  stack: ReturnType<typeof useSheetStack>
  label: string
  children: ReactNode
}) {
  useDrill(stack.value.host)
  const open = isOpen && !stack.closing
  // What it showed stays while it slides out.
  const shown = useRef(children)
  if (open) shown.current = children
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
        isOpen={open}
        onOpenChange={(open) => !open && stack.value.close()}
        // Fits its view, short of the screen's top. Set off from the page: a
        // firmer edge and shadow, and in dark mode a lighter fill.
        className="max-h-[calc(100dvh-3rem)] [--overlay-border:color-mix(in_oklab,var(--color-fg)_14%,transparent)] [--shadow-modal:0_16px_48px_-12px_rgb(0_0_0/0.3),0_2px_8px_-2px_rgb(0_0_0/0.08)] dark:[--color-popover:var(--color-muted)]"
      >
        <RacDialog
          aria-label={label}
          // styles.css keeps the backdrop clear: the preview is the point.
          data-panel-sheet=""
          className="flex flex-col outline-none"
        >
          <SheetHandle className="mb-0" />
          <div
            ref={stack.attach}
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
 *  reveals as drilling back; a new view opens at its top. The sheet eases to
 *  the new view's height. */
function useDrill(host: HTMLElement | null) {
  useEffect(() => {
    if (!host) return
    const sheet = host.closest<HTMLElement>("[data-sheet]")
    const content = host.closest<HTMLElement>("[data-sheet-content]")
    if (!sheet || !content) return
    const scrolled = new WeakMap<Element, number>()
    let top = host.lastElementChild
    // Its content box: the sheet pads itself a screen down to overscroll.
    const measure = () => parseFloat(getComputedStyle(sheet).height)
    let height = measure()
    let resize: Animation | undefined
    const resized = new ResizeObserver(() => {
      if (!resize) height = measure()
    })
    resized.observe(sheet)
    const observer = new MutationObserver((records) => {
      const added = records.some((record) => record.addedNodes.length > 0)
      const next = host.lastElementChild
      if (!(next instanceof HTMLElement) || next === top) return
      if (top) scrolled.set(top, content.scrollTop)
      // A page swaps itself, and says which way.
      if (!next.dataset.drill && host.childElementCount > 1)
        next.dataset.drill = added ? "in" : "out"
      else if (!added) next.dataset.drill = "out"
      content.scrollTop = added ? 0 : (scrolled.get(next) ?? 0)
      // The sheet opening on its first view rests and sizes itself.
      const first = !top
      top = next
      if (first) return

      const from = resize ? measure() : height
      resize?.cancel()
      resize = undefined
      const to = measure()
      height = to
      if (
        Math.abs(to - from) > 1 &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const started = sheet.animate(
          [{ height: `${from}px` }, { height: `${to}px` }],
          { duration: 250, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
        )
        resize = started
        // Held at its start through the view's first render, so the frames
        // that render takes don't eat the ease.
        started.pause()
        started.onfinish = () => (resize = undefined)
        requestAnimationFrame(() => requestAnimationFrame(() => started.play()))
      }
    })
    observer.observe(host, { childList: true })
    return () => {
      observer.disconnect()
      resized.disconnect()
    }
  }, [host])
}
