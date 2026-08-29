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
  SlidersHorizontalIcon,
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
import {
  pingIframe,
  sendInspectorMode,
  sendPreviewMode,
  sendPreviewNavigate,
  sendPreviewPrefetch,
  sendToIframe,
  useDesignSystem,
  useInspectorExitMessages,
} from "@/modules/create/preset"
import type { PreviewMode } from "@/modules/create/preset"
import { AVAILABLE_BLOCKS } from "@/modules/create/preview/blocks"
import { componentsData } from "@/modules/docs/components-list/components-data"

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

// How many previews the picker shows before "Show more".
const PREVIEW_ITEMS_COLLAPSED = 4

const SHOW_ALL_PREVIEWS_ID = "__show-all-previews"

// Zoom magnifies the rendered iframe (CSS `zoom`, no reflow) — distinct from device
// size, which reflows the content. Combined, they behave like a browser's device bar.
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const PREVIEW_PING_INTERVAL = 150
const PREVIEW_READY_TIMEOUT = 8000

const routeApi = getRouteApi("/_app/create")

// Pill tooltips pop with no enter / exit transition — neutralizes the scale /
// fade / slide the base tooltip ships with.
function PillTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipContent className="transition-none entering:scale-100 entering:transform-none entering:opacity-100 exiting:scale-100 exiting:transform-none exiting:opacity-100">
      {children}
    </TooltipContent>
  )
}

export function PreviewPanel({
  className,
  onCustomize,
}: {
  className?: string
  /** Mobile only — opens the customize sheet from the floating toolbar. */
  onCustomize?: () => void
}) {
  const { preview, preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem } = useDesignSystem()
  const { resolvedTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light")
  const [size, setSize] = useState<DeviceSize>("desktop")
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerQuery, setPickerQuery] = useState("")
  const [showAllPreviews, setShowAllPreviews] = useState(false)
  // Set when "Show more" is picked so the close the Select requests right
  // after committing that selection can be swallowed.
  const keepPickerOpen = useRef(false)
  const [inspecting, setInspecting] = useState(false)
  const [toolbarHidden, setToolbarHidden] = useState(false)

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
  }, [])
  const isMobile = useIsMobile()

  const effectivePreview = preview
  const constrained = size !== "desktop"
  // Always found: `size` is a DeviceSize and SIZE_OPTIONS covers all three.
  const sizeOption = SIZE_OPTIONS.find((o) => o.id === size)!
  const SizeIcon = sizeOption.Icon

  // Open the preview in the same light / dark mode the site is currently in. Seeded on
  // mount rather than via the useState initializer: this page is server-rendered and the
  // server can't know the client's stored theme (it always resolves "light"), so reading
  // it during render would mismatch the SSR'd toggle icon on hydration. Runs once — the
  // preview mode is toggled independently of the site theme afterwards.
  useEffect(() => {
    setPreviewMode(resolvedTheme)
    // oxlint-disable-next-line react/exhaustive-deps -- seed once from the site theme at open; preview mode is independent thereafter
  }, [])

  // The iframe's document URL, fixed at mount — the preset is baked in so the
  // initial render has the right state. Everything after goes over postMessage
  // (preset / mode changes, and preview switches, which navigate the iframe's
  // own SPA router), so the iframe never reloads.
  const [iframeSrc] = useState(() => {
    const base = `/preview/${effectivePreview}`
    return preset ? `${base}?${new URLSearchParams({ preset })}` : base
  })

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

  // The picker truncates the blocks list behind "Show more" while browsing, but
  // hidden items can't match the Autocomplete filter — so the full list renders
  // whenever a search is underway (the filter then prunes it).
  const onPickerOpenChange = (open: boolean) => {
    if (!open && keepPickerOpen.current) {
      keepPickerOpen.current = false
      return
    }
    setPickerOpen(open)
    if (!open) {
      // Fresh picker on reopen — collapsed list, cleared search.
      setShowAllPreviews(false)
      setPickerQuery("")
    }
  }

  const previewsExpanded = showAllPreviews || pickerQuery.trim() !== ""
  const visiblePreviews = previewsExpanded
    ? PREVIEW_ITEMS
    : PREVIEW_ITEMS.slice(0, PREVIEW_ITEMS_COLLAPSED)
  const hiddenPreviewCount = PREVIEW_ITEMS.length - visiblePreviews.length

  // Warm a preview's chunk inside the iframe while the pointer hovers its
  // picker item, so the switch on click is instant.
  const prefetchPreview = (slug: string) =>
    sendPreviewPrefetch(iframeRef.current, slug)

  // Picker body shared by the desktop popover and the mobile drawer — only the
  // list's sizing differs between the two containers. Selection state comes
  // from the wrapping Select, so the ListBox carries no props of its own.
  const renderPicker = (listClassName: string) => (
    <Command className="min-h-0 flex-1">
      <SearchField
        autoFocus
        aria-label="Search previews"
        onChange={setPickerQuery}
      >
        <Input placeholder="Search previews…" />
      </SearchField>
      <ListBox className={listClassName}>
        {/* Real-world previews — the whole system composed into full screens. */}
        <ListBoxSection>
          <ListBoxSectionHeader>Blocks</ListBoxSectionHeader>
          {visiblePreviews.map((block) => (
            <ListBoxItem
              key={block.slug}
              id={block.slug}
              textValue={block.name}
              onHoverStart={() => prefetchPreview(block.slug)}
            >
              <span className="truncate">{block.name}</span>
            </ListBoxItem>
          ))}
          {hiddenPreviewCount > 0 && (
            <ListBoxItem id={SHOW_ALL_PREVIEWS_ID} textValue="Show more">
              <span className="truncate text-fg-muted">
                Show {hiddenPreviewCount} more…
              </span>
            </ListBoxItem>
          )}
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

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/45 bg-bg shadow-xs",
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
            "bg-neutral [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:14px_14px]",
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
            {/* Preview switcher — a real Select (trigger a11y, typeahead, focus
            restoration for free). Its overlay is the anchored popover on
            desktop and the bottom drawer on mobile; open state is controlled
            so the drawer can be driven by the same Select. */}
            <Select
              value={effectivePreview}
              onChange={(v) => {
                if (v === SHOW_ALL_PREVIEWS_ID) {
                  setShowAllPreviews(true)
                  keepPickerOpen.current = true
                  return
                }
                navigate({
                  search: (prev) => ({ ...prev, preview: v as string }),
                })
              }}
              isOpen={pickerOpen}
              onOpenChange={onPickerOpenChange}
              aria-label="Preview"
              // w-fit overrides the field base's w-full, which would collapse the
              // trigger inside the pill's shrink-to-fit absolute box.
              className="w-fit min-w-0"
            >
              <Button
                size="sm"
                variant="quiet"
                className="max-w-44 rounded-full"
              >
                {/* flex-initial overrides the base flex-1 (basis-0), which has no
                space to grow into inside the pill's shrink-to-fit box and
                collapses the value to a sliver. */}
                <SelectValue className="min-w-0 flex-initial" />
                <ChevronsUpDownIcon data-icon-end="" />
              </Button>
              {isMobile ? (
                <Drawer
                  isOpen={pickerOpen}
                  onOpenChange={onPickerOpenChange}
                  className="h-[80svh]"
                >
                  <DialogContent
                    aria-label="Select preview"
                    className="flex h-full min-h-0 flex-col gap-0 p-0"
                  >
                    <DrawerHandle />
                    {renderPicker("min-h-0 flex-1 overflow-y-auto")}
                  </DialogContent>
                </Drawer>
              ) : (
                <Popover placement="top" className="w-64">
                  {renderPicker("max-h-72 overflow-y-auto")}
                </Popover>
              )}
            </Select>

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

            {/* Zoom level */}
            <Menu>
              <Tooltip delay={0}>
                <Button
                  size="sm"
                  variant="quiet"
                  className="rounded-full tabular-nums max-lg:hidden"
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
                  {ZOOM_LEVELS.map((z) => (
                    <MenuItem key={z} id={String(z)} textValue={`${z * 100}%`}>
                      {Math.round(z * 100)}%
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>

            <div className="h-4 w-px shrink-0 bg-border" />

            {/* Component inspector — hover the preview to see the dotUI component
            under the cursor with its props; click jumps to its params. */}
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant={inspecting ? "primary" : "quiet"}
                isIconOnly
                className="rounded-full"
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

            {/* Light / dark preview mode */}
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                className="rounded-full"
                onPress={() =>
                  setPreviewMode((m) => (m === "dark" ? "light" : "dark"))
                }
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

            {/* Open in new tab */}
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                className="rounded-full"
                onPress={() => {
                  // Built at click time — the iframe src is frozen at mount, so
                  // it no longer reflects the current preview or mode.
                  const params = new URLSearchParams()
                  if (preset) params.set("preset", preset)
                  params.set("mode", previewMode)
                  window.open(
                    `/preview/${effectivePreview}?${params}`,
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

            {/* Fullscreen */}
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                className="rounded-full"
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

            {/* Mobile — the customize sheet joins the pill so the page has a single
            floating cluster instead of two stacked bottom-center controls. */}
            {onCustomize && (
              <>
                <div className="h-4 w-px shrink-0 bg-border lg:hidden" />
                <Button
                  size="sm"
                  className="rounded-full lg:hidden"
                  onPress={onCustomize}
                >
                  <SlidersHorizontalIcon data-icon-start="" />
                  Customize
                </Button>
              </>
            )}
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
            className="rounded-[14px] transition-[width,height,border-radius] duration-200 ease-out"
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
    </div>
  )
}
