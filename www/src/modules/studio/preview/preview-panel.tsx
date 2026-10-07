import { useEffect, useRef, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
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

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
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
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { HeaderActions } from "@/components/layout/header-slot"
import { componentsData } from "@/modules/docs/components-list/components-data"
import { usePreviewFocus } from "@/modules/studio/focus"
import {
  BOARD_SLUG_PREFIX,
  pingIframe,
  sendInspectorMode,
  sendPreviewFocus,
  sendPreviewMode,
  sendPreviewNavigate,
  sendPreviewPrefetch,
  sendToIframe,
  useInspectorExitMessages,
} from "@/modules/studio/preset"
import type { PreviewMode } from "@/modules/studio/preset"
import { AVAILABLE_BLOCKS } from "@/modules/studio/preview/blocks"
import { useDocked } from "@/modules/studio/rows"
import { CHAPTERS } from "@/modules/studio/state"
import { useStudio } from "@/modules/studio/use-studio"

type DeviceSize = "mobile" | "tablet" | "desktop"

// Widths the iframe reflows to per device — true responsive previews (changing the
// iframe's CSS width re-lays-out the content inside). Desktop is unconstrained (fills).
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

/** Boards share their panel chapter's or page's id and label. */
const BOARD_TITLES = new Map(
  CHAPTERS.flatMap((chapter) => [
    [chapter.id, chapter.label] as const,
    ...(chapter.pages ?? []).map((page) => [page.id, page.label] as const),
  ]),
)

/** The picker's first item: the preview shows what the panel is editing. */
const FOLLOW = "follow-panel"
/** How long a released focus keeps its board, so moving between popovers
 *  never flashes the user's preview. */
const FOCUS_RELEASE_MS = 200

// Zoom magnifies the rendered iframe (CSS `zoom`, no reflow) — distinct from device
// size, which reflows the content. Combined, they behave like a browser's device bar.
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const PREVIEW_PING_INTERVAL = 150
const PREVIEW_READY_TIMEOUT = 8000

const routeApi = getRouteApi("/_app/studio")

// Pill tooltips pop with no enter / exit transition — neutralizes the scale /
// fade / slide the base tooltip ships with.
function PillTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipContent className="transition-none entering:scale-100 entering:transform-none entering:opacity-100 exiting:scale-100 exiting:transform-none exiting:opacity-100">
      {children}
    </TooltipContent>
  )
}

export function PreviewPanel({ className }: { className?: string }) {
  const { preview } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem } = useStudio()
  const { resolvedTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light")
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
  const [following, setFollowing] = useState(true)
  const target = following ? (focus?.board ?? null) : null
  const [board, setBoard] = useState<string | null>(null)
  useEffect(() => {
    if (target || !following) return setBoard(target)
    const timer = setTimeout(() => setBoard(null), FOCUS_RELEASE_MS)
    return () => clearTimeout(timer)
  }, [target, following])

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

  // The iframe's document URL, fixed at mount: it boots on the open system
  // from the shared workspace. Everything after goes over postMessage (design
  // system / mode changes, and preview switches, which navigate the iframe's
  // own SPA router), so the iframe never reloads.
  const [iframeSrc] = useState(() => `/preview/${effectivePreview}`)

  // Show the stage skeleton until the iframe's document signals it has rendered
  // — initial boot only, since preview switches keep the document alive. The
  // iframe's `load` event is too early (it fires before the SPA paints), so
  // wait for the app's own `preview-ready` instead. On first load the iframe
  // usually mounts before this server-rendered parent hydrates, so its
  // unprompted announcement lands with no listener attached — poll until it
  // answers rather than trusting that one message. Give up after
  // PREVIEW_READY_TIMEOUT so a preview that never reports (an error page, say)
  // reveals itself instead of hanging.
  useEffect(() => {
    setIsLoaded(false)
    const iframe = iframeRef.current
    if (!iframe) return

    let poll: ReturnType<typeof setInterval>
    const settle = () => {
      setIsLoaded(true)
      clearInterval(poll)
      clearTimeout(giveUp)
      window.removeEventListener("message", onReady)
    }
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") settle()
    }

    window.addEventListener("message", onReady)
    const giveUp = setTimeout(settle, PREVIEW_READY_TIMEOUT)
    poll = setInterval(() => pingIframe(iframe), PREVIEW_PING_INTERVAL)
    pingIframe(iframe)

    return () => {
      clearInterval(poll)
      clearTimeout(giveUp)
      window.removeEventListener("message", onReady)
    }
  }, [iframeSrc])

  // Preview switches navigate the iframe's SPA router instead of remounting the
  // iframe — the current preview stays on screen until the next one commits, and
  // revisited previews appear instantly from the document's module cache. Resent
  // on load / ready: a switch made while the document is still booting would
  // land before its message listener exists. (The iframe ignores same-slug sends.)
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendPreviewNavigate(iframe, effectivePreview)
    if (iframe.contentWindow) send()
    iframe.addEventListener("load", send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") send()
    }
    window.addEventListener("message", onReady)
    return () => {
      iframe.removeEventListener("load", send)
      window.removeEventListener("message", onReady)
    }
  }, [effectivePreview])

  // Send the design system to the iframe on change, on load, and when the iframe signals it's
  // ready — its message listener can mount after the load event, racing the load-fired send.
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const send = () => sendToIframe(iframe, designSystem)

    if (iframe.contentWindow) send()

    iframe.addEventListener("load", send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") send()
    }
    window.addEventListener("message", onReady)
    return () => {
      iframe.removeEventListener("load", send)
      window.removeEventListener("message", onReady)
    }
  }, [designSystem])

  // Forward the previewed display mode (light / dark) to the iframe — on change,
  // on load, and when the iframe signals it's ready (its listener can mount after load).
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendPreviewMode(iframe, previewMode)
    if (iframe.contentWindow) send()
    iframe.addEventListener("load", send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") send()
    }
    window.addEventListener("message", onReady)
    return () => {
      iframe.removeEventListener("load", send)
      window.removeEventListener("message", onReady)
    }
  }, [previewMode])

  // Docked, panel popovers cover the dock, never the preview.
  const sentFocus = following ? focus : null
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () =>
      sendPreviewFocus(iframe, {
        member: sentFocus?.member,
        axis: sentFocus?.axis,
        popover: !!sentFocus?.popover && !docked,
      })
    if (iframe.contentWindow) send()
    iframe.addEventListener("load", send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") send()
    }
    window.addEventListener("message", onReady)
    return () => {
      iframe.removeEventListener("load", send)
      window.removeEventListener("message", onReady)
    }
  }, [sentFocus, docked])

  // Forward inspect mode to the iframe — same resend-on-load/ready dance as the
  // display mode, so it survives preview switches (the iframe remounts per preview).
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendInspectorMode(iframe, inspecting)
    if (iframe.contentWindow) send()
    iframe.addEventListener("load", send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === "preview-ready") send()
    }
    window.addEventListener("message", onReady)
    return () => {
      iframe.removeEventListener("load", send)
      window.removeEventListener("message", onReady)
    }
  }, [inspecting])

  // The preview exits inspect mode itself on Escape — keep the toggle in sync.
  useInspectorExitMessages(() => setInspecting(false))

  // Keep the fullscreen toggle's icon in sync with the actual state — exiting via Esc
  // (not just the button) still flips it back.
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

  // Warm a preview's chunk inside the iframe while the pointer hovers its
  // picker item, so the switch on click is instant.
  const prefetchPreview = (slug: string) =>
    sendPreviewPrefetch(iframeRef.current, slug)

  // Picker body shared by the desktop popover and the mobile drawer — only the
  // list's sizing differs between the two containers. Selection state comes
  // from the wrapping Select, so the ListBox carries no props of its own.
  const renderPicker = (listClassName: string) => (
    <Command className="min-h-0 flex-1">
      <SearchField autoFocus aria-label="Search previews">
        <Input placeholder="Search previews…" />
      </SearchField>
      <ListBox className={listClassName}>
        <ListBoxSection>
          <ListBoxItem id={FOLLOW} textValue="Follow the panel">
            <span className="truncate">Follow the panel</span>
          </ListBoxItem>
        </ListBoxSection>
        {/* Real-world previews — the whole system composed into full screens. */}
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
     popover on desktop and the bottom drawer on mobile; open state is
     controlled so the drawer can be driven by the same Select. */
  const previewPicker = (
    <Select
      value={following ? FOLLOW : preview}
      onChange={(v) => {
        setFollowing(v === FOLLOW)
        if (v === FOLLOW) return
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
          {board ? BOARD_TITLES.get(board) : previewName(preview)}
        </SelectValue>
        <ChevronsUpDownIcon data-icon="inline-end" className="max-sm:hidden" />
        <PanelsTopLeftIcon className="sm:hidden" />
      </Button>
      {isMobile ? (
        <Drawer
          isOpen={pickerOpen}
          onOpenChange={setPickerOpen}
          className="h-[80svh]"
        >
          <DialogContent
            aria-label="Select preview"
            className="flex h-full min-h-0 flex-col gap-0 p-0"
          >
            <DrawerHandle />
            {/* relative: the options' offsetTop then reads against the
                scroller for the scroll-to-selection effect. */}
            {renderPicker("relative min-h-0 flex-1 overflow-y-auto")}
          </DialogContent>
        </Drawer>
      ) : (
        <Popover placement="top" className="w-64">
          {renderPicker("relative max-h-72 overflow-y-auto")}
        </Popover>
      )}
    </Select>
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
      {/* Stage — the preview fills the panel edge to edge; there is no chrome row.
          Smaller device sizes narrow the iframe and center it on a recessed,
          dot-gridded surface so tool chrome and artifact read as layers. */}
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-auto",
          constrained &&
            "bg-neutral bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px]",
        )}
      >
        {/* Centred with `mx-auto`, not `justify-center`: auto margins collapse to
            zero once the device is wider than the stage, so it stays scrollable
            from its left edge. `shrink-0` keeps the set device width — as a flex
            item the iframe would otherwise shrink to fit and preview a lie. */}
        <div className="flex h-full w-full">
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

      {/* Loading — a plain surface with a centered spinner. One surface rather
          than mock content: the incoming preview is an arbitrary page, so any
          guessed layout would be wrong more often than right. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center bg-bg transition-opacity duration-300",
          isLoaded && "pointer-events-none opacity-0",
        )}
      >
        <Loader className="size-5 text-fg-muted" />
      </div>

      {/* Floating toolbar — the panel's only chrome. It overlays the user's page,
          which can be any color in either mode, so the surface is always
          site-themed and earns separation from contrast, not size: a solid
          neutral surface, full-strength border, and a deep layered shadow.
          Sits above the skeleton so the switcher works while loading. */}
      {docked ? (
        <HeaderActions>
          <div className="order-first mr-1 flex items-center gap-0.5">
            {previewPicker}
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

              {/* Component inspector — hover the preview to see the dotUI component
            under the cursor with its props; click jumps to its params.
            Pointer-driven, so desktop only. */}
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

              {/* Fullscreen */}
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
