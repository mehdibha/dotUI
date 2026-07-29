import { useEffect, useMemo, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  MonitorIcon,
  MoonIcon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import {
  sendPreviewMode,
  sendToIframe,
  useDesignSystem,
} from '@/modules/create/preset'
import type { PreviewMode } from '@/modules/create/preset'
import { componentsData } from '@/modules/docs/components-list/components-data'

type DeviceSize = 'mobile' | 'tablet' | 'desktop'

// Widths the iframe reflows to per device — true responsive previews (changing the
// iframe's CSS width re-lays-out the content inside). Desktop is unconstrained (fills).
const DEVICE_WIDTHS: Record<Exclude<DeviceSize, 'desktop'>, number> = {
  mobile: 390,
  tablet: 768,
}

const SIZE_OPTIONS: {
  id: DeviceSize
  label: string
  Icon: typeof MonitorIcon
}[] = [
  { id: 'mobile', label: 'Mobile', Icon: SmartphoneIcon },
  { id: 'tablet', label: 'Tablet', Icon: TabletIcon },
  { id: 'desktop', label: 'Desktop', Icon: MonitorIcon },
]

// Zoom magnifies the rendered iframe (CSS `zoom`, no reflow) — distinct from device
// size, which reflows the content. Combined, they behave like a browser's device bar.
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const routeApi = getRouteApi('/_app/create')

export function PreviewPanel({ className }: { className?: string }) {
  const { preview, preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem } = useDesignSystem()
  const { resolvedTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light')
  const [size, setSize] = useState<DeviceSize>('desktop')
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const effectivePreview = preview
  const constrained = size !== 'desktop'

  // Open the preview in the same light / dark mode the site is currently in. Seeded on
  // mount rather than via the useState initializer: this page is server-rendered and the
  // server can't know the client's stored theme (it always resolves "light"), so reading
  // it during render would mismatch the SSR'd toggle icon on hydration. Runs once — the
  // preview mode is toggled independently of the site theme afterwards.
  useEffect(() => {
    setPreviewMode(resolvedTheme)
    // oxlint-disable-next-line react/exhaustive-deps -- seed once from the site theme at open; preview mode is independent thereafter
  }, [])

  // Bake the preset into the iframe src so the initial render has the right state.
  // Only recompute when the previewed component changes (not on every param change)
  // — further updates go through postMessage without reloading the iframe.
  const iframeSrc = useMemo(() => {
    const base = `/preview/${effectivePreview}`
    return preset ? `${base}?preset=${encodeURIComponent(preset)}` : base
    // oxlint-disable-next-line react/exhaustive-deps -- keep live preset changes on the postMessage channel to avoid iframe reloads
  }, [effectivePreview])

  // The iframe remounts per previewed component (key below) — show the stage
  // skeleton again until the new document signals it has rendered. The iframe's
  // `load` event is too early (it fires before the SPA paints), so listen for
  // the app's own `preview-ready` message instead.
  useEffect(() => {
    setIsLoaded(false)
  }, [iframeSrc])

  useEffect(() => {
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === 'preview-ready') setIsLoaded(true)
    }
    window.addEventListener('message', onReady)
    return () => window.removeEventListener('message', onReady)
  }, [])

  // Send the design system to the iframe on change, on load, and when the iframe signals it's
  // ready — its message listener can mount after the load event, racing the load-fired send.
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const send = () => sendToIframe(iframe, designSystem)

    if (iframe.contentWindow) send()

    iframe.addEventListener('load', send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === 'preview-ready') send()
    }
    window.addEventListener('message', onReady)
    return () => {
      iframe.removeEventListener('load', send)
      window.removeEventListener('message', onReady)
    }
  }, [designSystem])

  // Forward the previewed display mode (light / dark) to the iframe — on change,
  // on load, and when the iframe signals it's ready (its listener can mount after load).
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendPreviewMode(iframe, previewMode)
    if (iframe.contentWindow) send()
    iframe.addEventListener('load', send)
    const onReady = (event: MessageEvent) => {
      if (event.data?.type === 'preview-ready') send()
    }
    window.addEventListener('message', onReady)
    return () => {
      iframe.removeEventListener('load', send)
      window.removeEventListener('message', onReady)
    }
  }, [previewMode])

  // Keep the fullscreen toggle's icon in sync with the actual state — exiting via Esc
  // (not just the button) still flips it back.
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === panelRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      panelRef.current?.requestFullscreen()
    }
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        'relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/45 bg-neutral shadow-xs',
        className,
      )}
    >
      {/* Toolbar — an in-flow bar attached above the stage. The wrapper owns the
          neutral surface; the bar itself stays transparent. */}
      <div className="flex items-center gap-2 p-1">
        {/* Preview selector */}
        <div className="max-w-[45%] min-w-0">
          <Select
            value={effectivePreview}
            onChange={(v) =>
              navigate({
                search: (prev) => ({ ...prev, preview: v as string }),
              })
            }
            className="w-fit"
            aria-label="Preview"
          >
            <Button size="sm" variant="quiet">
              <SelectValue className="truncate" />
              <ChevronDownIcon data-icon-end="" />
            </Button>
            <Popover>
              <Command>
                <SearchField autoFocus aria-label="Search previews">
                  <Input />
                </SearchField>
                <ListBox>
                  <ListBoxSection>
                    <ListBoxSectionHeader>Preview</ListBoxSectionHeader>
                    {/* Composed, real-world UI (the landing cards grid), themed live. */}
                    <ListBoxItem id="cards" textValue="Cards">
                      <span className="truncate">Cards</span>
                    </ListBoxItem>
                    {/* A designer walkthrough of the whole system. */}
                    <ListBoxItem id="overview" textValue="Brand Guidelines">
                      <span className="truncate">Brand Guidelines</span>
                    </ListBoxItem>
                  </ListBoxSection>
                  <ListBoxSection>
                    <ListBoxSectionHeader>Components</ListBoxSectionHeader>
                    {componentsData
                      .flatMap((category) => category.components)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((comp) => (
                        <ListBoxItem
                          key={comp.slug}
                          id={comp.slug}
                          textValue={comp.name}
                        >
                          <span className="truncate">{comp.name}</span>
                        </ListBoxItem>
                      ))}
                  </ListBoxSection>
                </ListBox>
              </Command>
            </Popover>
          </Select>
        </div>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1">
          {/* Device size — desktop only; the mobile pane is already viewport-width. */}
          <ToggleButtonGroup
            aria-label="Preview size"
            selectionMode="single"
            disallowEmptySelection
            size="sm"
            isIconOnly
            selectedKeys={[size]}
            onSelectionChange={(keys) => {
              const next = keys.values().next().value
              if (next) setSize(next as DeviceSize)
            }}
            className="max-lg:hidden"
          >
            {SIZE_OPTIONS.map(({ id, label, Icon }) => (
              <ToggleButton key={id} id={id} aria-label={label}>
                <Icon />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Zoom level */}
          <Menu>
            <Button
              size="sm"
              variant="quiet"
              className="gap-1 tabular-nums max-lg:hidden"
            >
              {Math.round(zoom * 100)}%
              <ChevronDownIcon data-icon-end="" />
            </Button>
            <Popover placement="bottom end" className="min-w-28">
              <MenuContent
                selectionMode="single"
                selectedKeys={[String(zoom)]}
                onSelectionChange={(keys) => {
                  if (keys === 'all') return
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

          <div className="mx-0.5 h-5 w-px bg-border max-lg:hidden" />

          {/* Light / dark preview mode */}
          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={() =>
                setPreviewMode((m) => (m === 'dark' ? 'light' : 'dark'))
              }
              aria-label="Toggle preview mode"
            >
              {previewMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
            <TooltipContent>
              {previewMode === 'dark' ? 'Light mode' : 'Dark mode'}
            </TooltipContent>
          </Tooltip>

          {/* Open in new tab */}
          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={() =>
                window.open(iframeSrc, '_blank', 'noopener,noreferrer')
              }
              aria-label="Open preview in new tab"
            >
              <ExternalLinkIcon />
            </Button>
            <TooltipContent>Open in new tab</TooltipContent>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </Button>
            <TooltipContent>
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Stage — holds the iframe at full height for every device size. Smaller sizes
          narrow the iframe and center it on the surface. Scrolls when zoomed past fit.
          Inset on three sides so the panel's surface frames the artifact; the top
          stays flush under the toolbar. Radius is the panel's minus the inset. */}
      <div
        className={cn(
          'relative mx-1 mb-1 min-h-0 flex-1 overflow-auto rounded-lg border border-border/45 bg-bg',
          // Constrained sizes reveal the stage: a recessed, dot-gridded surface
          // the device "floats" on, so tool chrome and artifact read as layers.
          constrained &&
            'bg-neutral [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:14px_14px]',
        )}
      >
        <div className="flex h-full w-full justify-center">
          <iframe
            ref={iframeRef}
            key={effectivePreview}
            src={iframeSrc}
            title="preview"
            className={cn(
              'h-full border-0 bg-bg',
              constrained && 'border-x shadow-md',
            )}
            style={{
              width: constrained ? DEVICE_WIDTHS[size] : '100%',
              zoom,
            }}
          />
        </div>
        {/* Stage skeleton — the preview never opens on a black void. */}
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 z-10 flex flex-col gap-4 bg-bg p-8 transition-opacity duration-300',
            isLoaded && 'pointer-events-none opacity-0',
          )}
        >
          <div className="h-3 w-24 animate-pulse rounded bg-neutral" />
          <div className="h-10 w-56 animate-pulse rounded-md bg-neutral" />
          <div className="h-3 w-80 max-w-full animate-pulse rounded bg-neutral" />
          <div className="mt-4 h-64 w-full animate-pulse rounded-xl bg-neutral" />
        </div>
      </div>
    </div>
  )
}
