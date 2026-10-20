import { useEffect, useMemo, useRef, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  LocateFixedIcon,
  LocateOffIcon,
  MaximizeIcon,
  MinimizeIcon,
  MonitorIcon,
  MoonIcon,
  PanelsTopLeftIcon,
  SmartphoneIcon,
  SquareDashedMousePointerIcon,
  SunIcon,
  TabletIcon,
} from "lucide-react"
import { useTheme } from "starter-themes"

import type { Mode } from "@dotui/colors"

import { createPersistedStore, enumCodec } from "@/lib/persisted-store"
import { useIsMobile } from "@/registry/hooks/use-mobile"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { DialogContent } from "@/registry/ui/dialog"
import { Input } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { Loader } from "@/registry/ui/loader"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Select, SelectValue } from "@/registry/ui/select"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { HeaderActions } from "@/components/layout/header-slot"
import { componentsData } from "@/modules/docs/components-list/components-data"
import { KEY_BOARDS, pageBoard, usePreviewFocus } from "@/modules/studio/focus"
import {
  clearSettled,
  isDragPreview,
  onWarmPreview,
  useLive,
} from "@/modules/studio/live"
import {
  BOARD_SLUG_PREFIX,
  onMessage,
  postToIframe,
  useMessage,
} from "@/modules/studio/preset/iframe-sync"
import type { ParentToIframeMessage } from "@/modules/studio/preset/iframe-sync"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { AVAILABLE_BLOCKS } from "@/modules/studio/preview/blocks"
import { BOARD_TITLES } from "@/modules/studio/preview/boards/titles"
import type { BoardId } from "@/modules/studio/preview/boards/titles"
import { designSystemOf } from "@/modules/studio/resolve"
import { useDocked } from "@/modules/studio/rows"
import { useCurrent } from "@/modules/studio/selection"

type DeviceSize = "mobile" | "tablet" | "desktop"

// The iframe's width per device: its content reflows. Desktop fills.
const DEVICE_WIDTHS: Record<Exclude<DeviceSize, "desktop">, number> = {
  mobile: 390,
  tablet: 768,
}

const SIZE_OPTIONS: {
  id: DeviceSize
  label: string
  Icon: typeof MonitorIcon
}[] = [
  { id: "mobile", label: "Mobile", Icon: SmartphoneIcon },
  { id: "tablet", label: "Tablet", Icon: TabletIcon },
  { id: "desktop", label: "Desktop", Icon: MonitorIcon },
]

const ALL_COMPONENTS = componentsData
  .flatMap((category) => category.components)
  .sort((a, b) => a.name.localeCompare(b.name))

// Composed, real-world previews: the landing cards grid plus the page blocks.
const PREVIEW_ITEMS = [{ slug: "cards", name: "Cards" }, ...AVAILABLE_BLOCKS]

const previewName = (slug: string) =>
  [...PREVIEW_ITEMS, ...ALL_COMPONENTS].find((item) => item.slug === slug)
    ?.name ?? slug

/** Whether the preview shows what the panel is editing. */
const followStore = createPersistedStore(
  "dotui:preview-follow",
  "on",
  enumCodec(["on", "off"], "on"),
)
// The toggle names itself on the first takeovers, until it's been used once.
const cueStore = createPersistedStore("dotui:preview-follow-cues", 0, {
  decode: (raw) => Number(raw) || 0,
  encode: String,
})
const CUE_LIMIT = 3
const CUE_MS = 2400
// A board outlives its focus by a beat, so a popover handing over to a page
// (or another popover) never flashes the user's preview.
const FOCUS_RELEASE_MS = 50
// Panel popovers are modal: a click on another board's row only dismisses the
// open one, and a second click opens the next. The board waits that long.
const HOP_RELEASE_MS = 800

/** The board a panel row or page link shows, if any. */
function boardOfElement(element: Element) {
  const link = element
    .closest("[data-page-link]")
    ?.getAttribute("data-page-link")
  const axis = element.closest("[data-axis]")?.getAttribute("data-axis")
  return pageBoard(link) ?? (axis ? KEY_BOARDS[axis] : undefined)
}

// CSS `zoom`: magnifies without the reflow a device size causes.
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const PREVIEW_PING_INTERVAL = 150
const PREVIEW_READY_TIMEOUT = 8000

const routeApi = getRouteApi("/_app/studio")

// Pill tooltips pop without the base tooltip's transition.
function PillTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipContent className="transition-none entering:scale-100 entering:transform-none entering:opacity-100 exiting:scale-100 exiting:transform-none exiting:opacity-100">
      {children}
    </TooltipContent>
  )
}

type IframeRef = React.RefObject<HTMLIFrameElement | null>

/** Posts `message` whenever `key` changes, and again on each iframe load and
 *  `preview-ready`: the iframe's listener can mount after either. */
function usePreviewSync(
  iframeRef: IframeRef,
  message: ParentToIframeMessage,
  key = JSON.stringify(message),
) {
  const latest = useRef(message)
  useEffect(() => {
    latest.current = message
  })
  useEffect(() => {
    postToIframe(iframeRef.current, latest.current)
  }, [iframeRef, key])
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => postToIframe(iframe, latest.current)
    iframe.addEventListener("load", send)
    const off = onMessage("preview-ready", send)
    return () => {
      iframe.removeEventListener("load", send)
      off()
    }
  }, [iframeRef])
}

const withJson = (data: DesignSystem) => ({ data, json: JSON.stringify(data) })

/** Posts the live preview, else the committed design, to the iframe. */
function DesignSystemSync({ iframeRef }: { iframeRef: IframeRef }) {
  const { state } = useCurrent()
  const live = useLive()
  const committed = useMemo(() => withJson(designSystemOf(state)), [state])
  const preview = useMemo(() => live && withJson(designSystemOf(live)), [live])
  const { message, key } = useMemo(() => {
    // A preview that resolves to the committed design isn't one.
    const shown =
      preview && preview.json !== committed.json ? preview : committed
    const { data, json } = shown
    const isLive = shown !== committed
    const drag = isDragPreview()
    return {
      message: { type: "design-system", data, live: isLive, drag } as const,
      key: `${isLive}|${drag}|${json}`,
    }
  }, [preview, committed])
  usePreviewSync(iframeRef, message, key)

  // Another tab's change drops a hover's preview; a drag keeps its own.
  useEffect(() => clearSettled(), [state])

  useEffect(
    () =>
      onWarmPreview((assets) =>
        postToIframe(iframeRef.current, { type: "preview-warm", ...assets }),
      ),
    [iframeRef],
  )

  return null
}

export function PreviewPanel({ className }: { className?: string }) {
  const { preview } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { resolvedTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<Mode>("light")
  const [size, setSize] = useState<DeviceSize>("desktop")
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  // Open the picker centered on the selected item: the autocomplete's virtual
  // focus starts at the top, so react-aria never scrolls to the selection.
  // Retried briefly — the collection DOM mounts a few frames after the open.
  // Offset math, not scrollIntoView: the popover's entering scale skews rects.
  useEffect(() => {
    if (!pickerOpen) return
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const attempt = () => {
      const option = document.querySelector<HTMLElement>(
        '[data-listbox] [role="option"][aria-selected="true"]',
      )
      const scroller = option?.offsetParent
      if (option && scroller instanceof HTMLElement) {
        scroller.scrollTop =
          option.offsetTop - (scroller.clientHeight - option.offsetHeight) / 2
      } else if (++tries < 20) {
        timer = setTimeout(attempt, 16)
      }
    }
    attempt()
    return () => clearTimeout(timer)
  }, [pickerOpen])
  const [inspecting, setInspecting] = useState(false)
  const [toolbarHidden, setToolbarHidden] = useState(false)
  // Docked, the tools sit in the site header: a pill would cover the small
  // preview, and stacked its bottom edge moves with every chapter.
  const docked = useDocked()

  // The tools collapse by animating the wrapper to 0×0 — a `0fr` grid track
  // (react-grab's trick) resolves to content size here because the
  // shrink-to-fit pill gives the grid no definite width. The content keeps
  // its natural size (w-max) inside, so it slides out instead of reflowing.
  const toolsRef = useRef<HTMLDivElement>(null)
  const [toolsSize, setToolsSize] = useState<{ w: number; h: number } | null>(
    null,
  )
  useEffect(() => {
    const el = toolsRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setToolsSize({ w: rect.width, h: rect.height })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    measure()
    return () => observer.disconnect()
  }, [docked])
  const isMobile = useIsMobile()

  // While following, the panel's focus takes the preview over with its board.
  const focus = usePreviewFocus()
  const following = followStore.useValue() === "on"
  const setFollowing = (on: boolean) => followStore.set(on ? "on" : "off")
  const target = following ? (focus?.board ?? null) : null
  const [board, setBoard] = useState<BoardId | null>(null)

  // The focus that last held the board: a popover's or a page's.
  const lastFocus = useRef(focus)
  useEffect(() => {
    if (focus) lastFocus.current = focus
  }, [focus])
  const takenOver = board !== null
  const [cueing, setCueing] = useState(false)
  useEffect(() => {
    if (!takenOver || cueStore.get() >= CUE_LIMIT) return
    cueStore.update((n) => n + 1)
    setCueing(true)
    const timer = setTimeout(() => setCueing(false), CUE_MS)
    return () => {
      clearTimeout(timer)
      setCueing(false)
    }
  }, [takenOver])
  const lastHop = useRef({ at: -Infinity, board: "" })
  useEffect(() => {
    // A press that dismisses a popover on another board's row: the user is
    // hopping to it. By rect, as the popover's underlay covers the row.
    const onPress = ({ clientX: x, clientY: y }: PointerEvent) => {
      if (!document.querySelector("[data-panel-popover]")) return
      const row = [
        ...document.querySelectorAll("[data-axis], [data-page-link]"),
      ].find((element) => {
        const rect = element.getBoundingClientRect()
        return (
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
        )
      })
      const hop = row && boardOfElement(row)
      if (hop) lastHop.current = { at: performance.now(), board: hop }
    }
    document.addEventListener("pointerdown", onPress, true)
    return () => document.removeEventListener("pointerdown", onPress, true)
  }, [])
  useEffect(() => {
    if (target || !following) return setBoard(target)
    const from = lastFocus.current
    const hopping =
      from?.popover &&
      lastHop.current.board !== from.board &&
      performance.now() - lastHop.current.at < HOP_RELEASE_MS
    const timer = setTimeout(
      () => setBoard(null),
      hopping ? HOP_RELEASE_MS : FOCUS_RELEASE_MS,
    )
    return () => clearTimeout(timer)
  }, [target, following])

  // A hovered page link or board row loads its board's chunk, so the switch is instant.
  useEffect(() => {
    const onOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      const next = boardOfElement(event.target)
      if (next)
        postToIframe(iframeRef.current, {
          type: "preview-prefetch",
          slug: BOARD_SLUG_PREFIX + next,
        })
    }
    document.addEventListener("pointerover", onOver)
    return () => document.removeEventListener("pointerover", onOver)
  }, [])

  const effectivePreview = board ? BOARD_SLUG_PREFIX + board : preview
  const constrained = size !== "desktop"
  // Always found: `size` is a DeviceSize and SIZE_OPTIONS covers all three.
  const sizeOption = SIZE_OPTIONS.find((o) => o.id === size)!
  const SizeIcon = sizeOption.Icon

  // Follow the site's light / dark mode; the pill's toggle overrides it until the
  // next site toggle. An effect, not the useState initializer: the server can't
  // know the stored theme, so reading it during render would mismatch on hydration.
  useEffect(() => {
    setPreviewMode(resolvedTheme)
  }, [resolvedTheme])

  // Fixed at mount: everything after goes over postMessage, so the iframe
  // never reloads.
  const [iframeSrc] = useState(() => `/preview/${preview}`)

  // The skeleton stays until the preview reports it rendered (`load` fires
  // before the SPA paints). Its first report is often lost to hydration, so
  // poll; a preview that never reports (an error page) shows after a timeout.
  useEffect(() => {
    setIsLoaded(false)
    const iframe = iframeRef.current
    if (!iframe) return
    const ping = () => postToIframe(iframe, { type: "preview-ping" })
    const poll = setInterval(ping, PREVIEW_PING_INTERVAL)
    const stop = () => {
      clearInterval(poll)
      clearTimeout(giveUp)
      off()
    }
    const settle = () => {
      setIsLoaded(true)
      stop()
    }
    const giveUp = setTimeout(settle, PREVIEW_READY_TIMEOUT)
    const off = onMessage("preview-ready", settle)
    ping()
    return stop
  }, [iframeSrc])

  // Switches navigate the iframe's own router: no remount, and revisited
  // previews come from its module cache.
  // The board goes over the user's preview, which stays on the iframe's route.
  usePreviewSync(iframeRef, { type: "preview-navigate", slug: preview })
  usePreviewSync(iframeRef, {
    type: "preview-board",
    slug: board && BOARD_SLUG_PREFIX + board,
  })
  usePreviewSync(iframeRef, { type: "preview-mode", mode: previewMode })
  const sentFocus = following ? focus : null
  usePreviewSync(iframeRef, {
    type: "preview-focus",
    axis: sentFocus?.axis,
    holds: sentFocus?.holds,
    popover: !!sentFocus?.popover,
  })
  usePreviewSync(iframeRef, { type: "inspector-mode", enabled: inspecting })
  // The preview leaves inspect mode itself on Escape.
  useMessage("inspector-exit", () => setInspecting(false))

  // Esc leaves fullscreen too.
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === panelRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      panelRef.current?.requestFullscreen()
    }
  }

  // A hovered picker item loads its chunk, so the switch is instant.
  const prefetchPreview = (slug: string) =>
    postToIframe(iframeRef.current, { type: "preview-prefetch", slug })

  // The desktop popover's and the mobile sheet's: only the list's sizing
  // differs. Selection comes from the wrapping Select.
  const renderPicker = (listClassName: string) => (
    <Command className="min-h-0 flex-1 gap-1.5 in-data-popover:[--command-inset:--spacing(1.5)]">
      <SearchField autoFocus aria-label="Search previews">
        <Input placeholder="Search previews…" />
      </SearchField>
      <ListBox className={listClassName}>
        <ListBoxSection>
          <ListBoxSectionHeader>Blocks</ListBoxSectionHeader>
          {PREVIEW_ITEMS.map((block) => (
            <ListBoxItem
              key={block.slug}
              id={block.slug}
              textValue={block.name}
              onHoverStart={() => prefetchPreview(block.slug)}
            >
              <span className="truncate">{block.name}</span>
            </ListBoxItem>
          ))}
        </ListBoxSection>
        <ListBoxSection>
          <ListBoxSectionHeader>Components</ListBoxSectionHeader>
          {ALL_COMPONENTS.map((comp) => (
            <ListBoxItem
              key={comp.slug}
              id={comp.slug}
              textValue={comp.name}
              onHoverStart={() => prefetchPreview(comp.slug)}
            >
              <span className="truncate">{comp.name}</span>
            </ListBoxItem>
          ))}
        </ListBoxSection>
      </ListBox>
    </Command>
  )

  /* The tools, shared by the pill and — stacked under the dock on phones —
     the site header. Preview switcher: a real Select (trigger a11y,
     typeahead, focus restoration for free). Its overlay is the anchored
     popover on desktop and the bottom sheet on mobile; open state is
     controlled so the sheet can be driven by the same Select. */
  const previewPicker = (
    <Select
      value={preview}
      onChange={(v) => {
        // Picking another preview during a takeover stops following.
        if (takenOver) setFollowing(false)
        navigate({
          search: (prev) => ({ ...prev, preview: v as string }),
        })
      }}
      isOpen={pickerOpen}
      onOpenChange={setPickerOpen}
      aria-label="Preview"
      // w-fit overrides the field base's w-full, which would collapse the
      // trigger inside the pill's shrink-to-fit absolute box.
      className="w-fit min-w-0"
    >
      {/* Icon-only on phones. */}
      <Button
        size="sm"
        variant="quiet"
        className="max-w-44 rounded-full max-sm:w-8 max-sm:px-0 pointer-coarse:h-9 pointer-coarse:max-sm:w-9"
      >
        {/* flex-initial overrides the base flex-1 (basis-0), which has no
            space to grow into inside the pill's shrink-to-fit box and
            collapses the value to a sliver. */}
        <SelectValue className="min-w-0 flex-initial max-sm:sr-only">
          {board ? BOARD_TITLES[board] : previewName(preview)}
        </SelectValue>
        <ChevronsUpDownIcon data-icon="inline-end" className="max-sm:hidden" />
        <PanelsTopLeftIcon className="sm:hidden" />
      </Button>
      {isMobile ? (
        <Sheet
          isOpen={pickerOpen}
          onOpenChange={setPickerOpen}
          className="h-[80svh]"
        >
          <DialogContent
            aria-label="Select preview"
            className="flex h-full min-h-0 flex-col gap-0 p-0"
          >
            <SheetHandle />
            {/* relative: the options' offsetTop then reads against the
                scroller for the scroll-to-selection effect. */}
            {renderPicker("relative min-h-0 flex-1 overflow-y-auto")}
          </DialogContent>
        </Sheet>
      ) : (
        <Popover placement="top" className="w-64">
          {renderPicker("relative max-h-72 overflow-y-auto")}
        </Popover>
      )}
    </Select>
  )

  // On by default; the first takeovers spell out its name beside the icon.
  const followToggle = (
    <Tooltip delay={0} isDisabled={cueing}>
      <Button
        size="sm"
        variant="quiet"
        aria-label="Follow the panel"
        aria-pressed={following}
        onPress={() => {
          cueStore.set(CUE_LIMIT)
          setFollowing(!following)
        }}
        className={cn(
          "min-w-8 shrink-0 gap-0 rounded-full px-2 transition-colors pointer-coarse:h-9",
          cueing && "bg-accent-muted text-fg-accent",
        )}
      >
        {following ? <LocateFixedIcon /> : <LocateOffIcon />}
        <span
          aria-hidden
          className={cn(
            "overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding] duration-300 ease-out motion-reduce:transition-none",
            cueing ? "max-w-40 pl-1.5 opacity-100" : "max-w-0 opacity-0",
          )}
        >
          Following the panel
        </span>
      </Button>
      <PillTooltipContent>
        Follow the panel{" "}
        <span className="text-fg-on-tooltip/60">
          {following ? "On" : "Off"}
        </span>
      </PillTooltipContent>
    </Tooltip>
  )
  const zoomMenu = (
    <Menu>
      <Tooltip delay={0}>
        <Button
          size="sm"
          variant="quiet"
          className="rounded-full tabular-nums pointer-coarse:h-9"
        >
          {Math.round(zoom * 100)}%
        </Button>
        <PillTooltipContent>
          Zoom{" "}
          <span className="text-fg-on-tooltip/60">
            {Math.round(zoom * 100)}%
          </span>
        </PillTooltipContent>
      </Tooltip>
      <Popover placement="top" className="min-w-28">
        <MenuContent
          selectionMode="single"
          selectedKeys={[String(zoom)]}
          onSelectionChange={(keys) => {
            if (keys === "all") return
            const v = keys.values().next().value
            if (v != null) setZoom(Number(v))
          }}
        >
          {(docked ? ZOOM_LEVELS.filter((z) => z <= 1) : ZOOM_LEVELS).map(
            (z) => (
              <MenuItem key={z} id={String(z)} textValue={`${z * 100}%`}>
                {Math.round(z * 100)}%
              </MenuItem>
            ),
          )}
        </MenuContent>
      </Popover>
    </Menu>
  )
  const modeToggle = (
    <Tooltip delay={0}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        className="rounded-full pointer-coarse:data-icon-only:size-9"
        onPress={() => setPreviewMode((m) => (m === "dark" ? "light" : "dark"))}
        aria-label="Toggle preview mode"
      >
        {previewMode === "dark" ? <SunIcon /> : <MoonIcon />}
      </Button>
      <PillTooltipContent>
        Preview mode{" "}
        <span className="text-fg-on-tooltip/60">
          {previewMode === "dark" ? "Dark" : "Light"}
        </span>
      </PillTooltipContent>
    </Tooltip>
  )
  const openInTab = (
    <Tooltip delay={0}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        // Not on phones: the header has no room, and the preview already
        // spans the screen there.
        className="rounded-full max-sm:hidden pointer-coarse:data-icon-only:size-9"
        onPress={() => {
          // Built at click time — the iframe src is frozen at mount, so
          // it no longer reflects the current preview or mode.
          window.open(
            `/preview/${effectivePreview}?mode=${previewMode}`,
            "_blank",
            "noopener,noreferrer",
          )
        }}
        aria-label="Open preview in new tab"
      >
        <ExternalLinkIcon />
      </Button>
      <PillTooltipContent>Open in new tab</PillTooltipContent>
    </Tooltip>
  )

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/45 bg-bg shadow-xs max-lg:rounded-[14px] max-lg:shadow-none",
        className,
      )}
    >
      {/* Smaller devices center the iframe on a dot-gridded surface. */}
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-auto",
          constrained &&
            "bg-neutral bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px]",
        )}
      >
        {/* `mx-auto`, not `justify-center`: auto margins collapse once the
            device is wider than the stage, so it scrolls from its left edge.
            `shrink-0` keeps the device width. */}
        <div className="flex h-full w-full">
          <DesignSystemSync iframeRef={iframeRef} />
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="preview"
            className={cn(
              "mx-auto h-full shrink-0 border-0 bg-bg",
              constrained && "border-x shadow-md",
            )}
            style={{
              width: constrained ? DEVICE_WIDTHS[size] : "100%",
              zoom,
            }}
          />
        </div>
      </div>

      {/* A spinner, not mock content: the incoming preview is any page. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center bg-bg transition-opacity duration-300",
          isLoaded && "pointer-events-none opacity-0",
        )}
      >
        <Loader className="size-5 text-fg-muted" />
      </div>

      {/* Over a page of any color: a solid surface, full border and deep
          shadow set it apart. Above the spinner, so it works while loading. */}
      {docked ? (
        <HeaderActions>
          <div className="order-first mr-1 flex items-center gap-0.5">
            {previewPicker}
            {followToggle}
            {zoomMenu}
            {modeToggle}
            {openInTab}
          </div>
        </HeaderActions>
      ) : (
        <div
          className={cn(
            // rounded-[20px] renders like rounded-full (half the 40px pill) but,
            // unlike calc(infinity*1px), interpolates visibly during the tuck —
            // react-grab's trick for its edge collapse.
            "absolute left-1/2 z-20 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center border border-border bg-neutral shadow-[0_8px_24px_-6px_rgb(0_0_0/0.3),0_2px_8px_-2px_rgb(0_0_0/0.18)] transition-[bottom,border-radius,padding] duration-200 ease-out",
            toolbarHidden
              ? // Tucked into the panel's bottom edge as a react-grab-style tab:
                // flush, squared toward the edge, the chevron button IS the tab.
                "bottom-0 rounded-[10px] rounded-b-none border-b-0 p-0"
              : "bottom-3 gap-1 rounded-[20px] p-1",
          )}
        >
          {/* Collapsible content — slides shut toward the chevron, react-grab
            style, leaving the pill as a lone show/hide button. */}
          <div
            className={cn(
              "overflow-hidden transition-[width,height] duration-200 ease-out",
              toolbarHidden && "pointer-events-none",
            )}
            style={{
              width: toolbarHidden ? 0 : (toolsSize?.w ?? "auto"),
              // Shrink to the collapsed button's height so the tab is exactly
              // the chevron — the wrapper's clipped content otherwise props the
              // pill open at the expanded height.
              height: toolbarHidden ? 20 : (toolsSize?.h ?? "auto"),
            }}
          >
            <div
              ref={toolsRef}
              className={cn(
                "flex w-max items-center gap-1 transition-opacity duration-150",
                toolbarHidden ? "opacity-0" : "opacity-100",
              )}
            >
              {previewPicker}
              {followToggle}

              <div className="h-4 w-px shrink-0 bg-border max-lg:hidden" />

              {/* Device size — desktop only; the mobile pane is already viewport-width. */}
              {/* w-fit: the field base's w-full would absorb the pill's width. */}
              <Select
                value={size}
                onChange={(v) => setSize(v as DeviceSize)}
                aria-label="Device size"
                className="w-fit shrink-0 max-lg:hidden"
              >
                <Tooltip delay={0}>
                  <Button
                    size="sm"
                    variant="quiet"
                    isIconOnly
                    className="rounded-full"
                  >
                    <SizeIcon />
                  </Button>
                  <PillTooltipContent>
                    Device{" "}
                    <span className="text-fg-on-tooltip/60">
                      {sizeOption.label}
                    </span>
                  </PillTooltipContent>
                </Tooltip>
                <Popover placement="top" className="min-w-32">
                  <ListBox>
                    {SIZE_OPTIONS.map(({ id, label, Icon }) => (
                      <ListBoxItem key={id} id={id} textValue={label}>
                        <Icon />
                        {label}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>

              {zoomMenu}

              <div className="h-4 w-px shrink-0 bg-border max-lg:hidden" />

              {/* Pointer-driven, so desktop only. */}
              <Tooltip delay={0}>
                <Button
                  size="sm"
                  variant={inspecting ? "primary" : "quiet"}
                  isIconOnly
                  className="rounded-full max-lg:hidden"
                  onPress={() => setInspecting((v) => !v)}
                  aria-label="Toggle component inspector"
                >
                  <SquareDashedMousePointerIcon />
                </Button>
                <PillTooltipContent>
                  Inspect{" "}
                  <span className="text-fg-on-tooltip/60">
                    {inspecting ? "On" : "Off"}
                  </span>
                </PillTooltipContent>
              </Tooltip>

              {modeToggle}

              {openInTab}

              <Tooltip delay={0}>
                <Button
                  size="sm"
                  variant="quiet"
                  isIconOnly
                  // iOS Safari can't fullscreen an element.
                  className="rounded-full max-lg:hidden"
                  onPress={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
                </Button>
                <PillTooltipContent>
                  Fullscreen{" "}
                  <span className="text-fg-on-tooltip/60">
                    {isFullscreen ? "On" : "Off"}
                  </span>
                </PillTooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Show / hide — tucks the pill into the bottom edge, chevron flipping
            to point the way back out. */}
          <Tooltip delay={0}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              // rounded-[14px] = rounded-full at the 28px size, but interpolates.
              // Collapsed, the button shrinks and fills the whole tab (inline
              // style wins over the size variant's icon-only square).
              className="rounded-[14px] transition-[width,height,border-radius] duration-200 ease-out pointer-coarse:rounded-[18px] pointer-coarse:data-icon-only:size-9"
              style={
                toolbarHidden
                  ? { height: 20, width: 36, borderRadius: "9px 9px 0 0" }
                  : undefined
              }
              onPress={() => setToolbarHidden((v) => !v)}
              aria-label={toolbarHidden ? "Show toolbar" : "Hide toolbar"}
            >
              <ChevronDownIcon
                className={cn(
                  "transition-transform duration-200",
                  toolbarHidden && "rotate-180",
                )}
              />
            </Button>
            <PillTooltipContent>
              {toolbarHidden ? "Show toolbar" : "Hide toolbar"}
            </PillTooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
