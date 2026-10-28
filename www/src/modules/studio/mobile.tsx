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
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
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

import { releaseFocus } from "./focus"

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
  headings: Headings
}

interface Heading {
  title: string
  /** Back, when there's a view to return to. */
  onBack?: () => void
  backLabel?: string
}

type Headings = ReturnType<typeof createHeadings>

/** The open views' headings, in the order they opened: the sheet's one
 *  header shows the top one's. */
function createHeadings() {
  let views = new Map<string, Heading>()
  let list: Heading[] = []
  const listeners = new Set<() => void>()
  return {
    set(id: string, heading: Heading | null) {
      views = new Map(views)
      if (heading) views.set(id, heading)
      else views.delete(id)
      list = [...views.values()]
      for (const listener of listeners) listener()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    list: () => list,
  }
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
  const [headings] = useState(createHeadings)
  const value = useMemo(
    () => ({ host, register, close, headings }),
    [host, register, close, headings],
  )
  return { value, attach, pickers, closing }
}

/* A view drills in from the right; the one Back reveals comes back from the
   left (shown again, it replays). Only the top view shows. */
const VIEW =
  "flex flex-col data-[drill=in]:animate-in data-[drill=in]:slide-in-from-right-6 data-[drill=out]:animate-in data-[drill=out]:slide-in-from-left-6 fade-in duration-200 ease-out motion-reduce:animate-none"

const ROUND =
  "flex size-10 cursor-interactive items-center justify-center rounded-full tint-6 text-fg outline-none transition-colors hover:tint-10 focus-visible:focus-ring pressed:tint-12"

/** A view of the sheet: its rows, under the sheet's header, which shows
 *  its title and Back. */
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
  const headings = useContext(SheetStack)?.headings
  const id = useId()
  const back = useRef(onBack)
  useLayoutEffect(() => {
    back.current = onBack
  })
  const hasBack = !!onBack
  useLayoutEffect(() => {
    headings?.set(id, {
      title,
      backLabel,
      onBack: hasBack ? () => back.current?.() : undefined,
    })
  }, [headings, id, title, backLabel, hasBack])
  useLayoutEffect(() => () => headings?.set(id, null), [headings, id])
  return (
    <section aria-label={title} data-drill={drill} className={VIEW} {...props}>
      <div className="flex flex-col gap-1.5 px-4 pb-4">{children}</div>
    </section>
  )
}

/** The sheet's header, after iOS's sheets: a round Close, or Back once
 *  there's a view under the top one, and its title, centered. Both swap in
 *  place as views open and close. */
function SheetHeader({
  headings,
  close,
}: {
  headings: Headings
  close: () => void
}) {
  const list = useSyncExternalStore(
    headings.subscribe,
    headings.list,
    headings.list,
  )
  const top = list.at(-1)
  if (!top) return null
  // With no page named behind it, Back leads to the view under it, if any:
  // the first view, opened from a card, closes instead.
  const back = !!top.onBack && (!!top.backLabel || list.length > 1)
  return (
    <div className="sticky top-0 z-10 grid h-15 shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 bg-(--panel-surface) px-4 pb-3">
      <RacButton
        aria-label={
          back ? (top.backLabel ? `Back to ${top.backLabel}` : "Back") : "Close"
        }
        onPress={back ? top.onBack : close}
        className={ROUND}
      >
        <Swap id={back ? "back" : "close"} scale className="flex">
          {back ? (
            <ChevronLeftIcon className="size-5" />
          ) : (
            <XIcon className="size-5" />
          )}
        </Swap>
      </RacButton>
      <h2 className="col-start-2 min-w-0 text-center text-[17px] font-semibold">
        <Swap id={top.title} className="block max-w-full truncate">
          {top.title}
        </Swap>
      </h2>
    </div>
  )
}

const SWAP = { duration: 200, easing: "ease-out" }

/** Swaps its content in place: the old one blurs and fades out over the new
 *  one coming in; `scale` shrinks the old and grows the new. */
function Swap({
  id,
  scale = false,
  className,
  children,
}: {
  id: string
  scale?: boolean
  className?: string
  children: ReactNode
}) {
  const [shown, setShown] = useState(id)
  const [leaving, setLeaving] = useState<{ id: string; node: ReactNode }[]>([])
  const last = useRef(children)
  useLayoutEffect(() => {
    last.current = children
  })
  if (shown !== id) {
    setShown(id)
    setLeaving((items) => [
      ...items.filter((item) => item.id !== id),
      { id: shown, node: last.current },
    ])
  }
  // What's there when it mounts shows as is.
  const ready = useRef(false)
  useEffect(() => {
    ready.current = true
  }, [])
  return (
    <span className="grid grid-cols-[minmax(0,1fr)] place-items-center *:col-start-1 *:row-start-1">
      {leaving.map((item) => (
        <Fade
          key={item.id}
          out
          scale={scale}
          ready={ready}
          className={className}
          onDone={() => setLeaving((items) => items.filter((i) => i !== item))}
        >
          {item.node}
        </Fade>
      ))}
      <Fade key={id} scale={scale} ready={ready} className={className}>
        {children}
      </Fade>
    </span>
  )
}

function Fade({
  out = false,
  scale,
  ready,
  onDone,
  className,
  children,
}: {
  out?: boolean
  scale: boolean
  ready: React.RefObject<boolean>
  onDone?: () => void
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(onDone)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || (!out && !ready.current)) return
    const hidden = { opacity: 0, filter: "blur(4px)", scale: scale ? 0.5 : 1 }
    const shown = { opacity: 1, filter: "blur(0px)", scale: 1 }
    const animation = element.animate(out ? [shown, hidden] : [hidden, shown], {
      ...SWAP,
      fill: out ? "forwards" : "none",
    })
    if (out) animation.onfinish = () => done.current?.()
    return () => animation.cancel()
  }, [out, scale, ready])
  return (
    <span
      ref={ref}
      aria-hidden={out || undefined}
      className={cn("min-w-0", out && "pointer-events-none", className)}
    >
      {children}
    </span>
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
  // The preview crossfades back as the sheet starts sliding out: closed, or
  // swiped away.
  const leaving = useSwipeAway(stack.value.host) || stack.closing
  const host = stack.value.host
  useEffect(() => {
    if (!leaving) return
    // Once it's under way: the preview's render shares the main thread, and
    // would hold up its start.
    const scroller = host?.closest("[data-sheet-scroll]")
    const release = () => releaseFocus(true)
    scroller?.addEventListener("scroll", release, { once: true })
    const timer = setTimeout(release, 100)
    return () => {
      scroller?.removeEventListener("scroll", release)
      clearTimeout(timer)
      releaseFocus(false)
    }
  }, [leaving, host])
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
          className="flex flex-col outline-none [--panel-surface:var(--color-popover)]"
        >
          {/* Over the views, which pass under it as the sheet grows. */}
          <SheetHandle className="relative z-10 mb-0" />
          <SheetHeader
            headings={stack.value.headings}
            close={stack.value.close}
          />
          <div
            ref={stack.attach}
            className="relative flex flex-col *:not-last:hidden"
          >
            {shown.current}
          </div>
        </RacDialog>
      </Sheet>
    </ComponentParamsProvider>
  )
}

/** Whether a swipe let the sheet go toward the screen's edge: React Aria
 *  closes it only once it's gone. Let go, the sheet settles toward the snap
 *  it'll rest at, so its first move says which. */
function useSwipeAway(host: HTMLElement | null) {
  const [away, setAway] = useState(false)
  useEffect(() => {
    const scroller = host?.closest<HTMLElement>("[data-sheet-scroll]")
    if (!scroller) return
    // Where the finger let go, until the sheet's first move from there.
    let lifted: number | null = null
    const touch = () => {
      lifted = null
      setAway(false)
    }
    const lift = () => (lifted = scroller.scrollTop)
    // A bottom sheet leaves toward scroll 0.
    const scroll = () => {
      if (lifted === null || Math.abs(scroller.scrollTop - lifted) < 2) return
      setAway(scroller.scrollTop < lifted)
      lifted = null
    }
    // Back at rest after all: still open.
    const settle = () => {
      if (scroller.scrollTop > 1) setAway(false)
    }
    scroller.addEventListener("touchstart", touch, { passive: true })
    scroller.addEventListener("touchend", lift)
    scroller.addEventListener("touchcancel", lift)
    scroller.addEventListener("scroll", scroll, { passive: true })
    scroller.addEventListener("scrollend", settle)
    return () => {
      scroller.removeEventListener("touchstart", touch)
      scroller.removeEventListener("touchend", lift)
      scroller.removeEventListener("touchcancel", lift)
      scroller.removeEventListener("scroll", scroll)
      scroller.removeEventListener("scrollend", settle)
      setAway(false)
    }
  }, [host])
  return away
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
    let hold: Animation | undefined
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
      hold?.cancel()
      resize = hold = undefined
      const to = measure()
      height = to
      if (
        Math.abs(to - from) > 1 &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const timing = {
          duration: 250,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        }
        const grow = sheet.animate(
          [{ height: `${from}px` }, { height: `${to}px` }],
          timing,
        )
        // Only the sheet's top edge travels: the views hold where they
        // settle, sliding across alone. By `top`: a composited transform
        // drifts frames from the height and jitters.
        const still = host.animate(
          [{ top: `${from - to}px` }, { top: "0px" }],
          timing,
        )
        resize = grow
        hold = still
        // Held at their start through the view's first render, so the frames
        // that render takes don't eat the ease.
        grow.pause()
        still.pause()
        grow.onfinish = () => (resize = undefined)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            grow.play()
            still.play()
          }),
        )
      }
    })
    observer.observe(host, { childList: true })
    return () => {
      observer.disconnect()
      resized.disconnect()
    }
  }, [host])
}
