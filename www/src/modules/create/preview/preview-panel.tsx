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

// iOS-style progressive blur, mirroring the app navbar (components/layout/header.tsx):
// each layer adds a larger backdrop blur over an overlapping gradient window, so where
// the windows overlap the blurs compound — ramping smoothly from sharp (the toolbar's
// bottom edge) to heavily blurred (top). `to top` puts the strongest blur under the
// toolbar content, so preview content slides under a glass bar as it scrolls.
const BLUR_LAYERS = [
  {
    blur: 0.5,
    mask: 'linear-gradient(to top, transparent 0%, #000 10%, #000 30%, transparent 40%)',
  },
  {
    blur: 1,
    mask: 'linear-gradient(to top, transparent 10%, #000 20%, #000 40%, transparent 50%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to top, transparent 15%, #000 30%, #000 50%, transparent 60%)',
  },
  {
    blur: 4,
    mask: 'linear-gradient(to top, transparent 20%, #000 40%, #000 60%, transparent 70%)',
  },
  {
    blur: 8,
    mask: 'linear-gradient(to top, transparent 40%, #000 60%, #000 80%, transparent 90%)',
  },
  { blur: 16, mask: 'linear-gradient(to top, transparent 60%, #000 80%)' },
  { blur: 24, mask: 'linear-gradient(to top, transparent 70%, #000 100%)' },
]

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
        'relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-bg',
        className,
      )}
    >
      {/* Stage — holds the iframe. Full-bleed on desktop (content slides under the glass
          toolbar); a centered device card on smaller sizes. Scrolls when zoomed past fit. */}
      <div
        className={cn(
          'relative flex-1 overflow-auto',
          constrained && 'bg-neutral',
        )}
      >
        <div
          className={cn(
            'flex min-h-full w-full justify-center',
            constrained && 'p-6 pt-16',
          )}
        >
          <iframe
            ref={iframeRef}
            key={effectivePreview}
            src={iframeSrc}
            title="preview"
            className={cn(
              'border-0 bg-bg',
              constrained
                ? 'self-stretch rounded-lg border shadow-sm'
                : 'size-full',
            )}
            style={{
              width: constrained ? DEVICE_WIDTHS[size] : '100%',
              zoom,
            }}
          />
        </div>
      </div>

      {/* Glass toolbar — overlays the top of the stage with the progressive blur. The
          wrapper is pointer-events-none so empty areas click through to the preview;
          each control cluster re-enables pointer events. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32"
        >
          {BLUR_LAYERS.map(({ blur, mask }) => (
            <div
              key={blur}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, transparent 0%, color-mix(in oklab, var(--color-bg) 55%, transparent) 55%, color-mix(in oklab, var(--color-bg) 80%, transparent) 100%)',
            }}
          />
        </div>

        <div className="relative flex h-12 items-center gap-2 px-2">
          {/* Preview selector */}
          <Select
            value={effectivePreview}
            onChange={(v) =>
              navigate({
                search: (prev) => ({ ...prev, preview: v as string }),
              })
            }
            className="pointer-events-auto w-44 max-w-[45%]"
            aria-label="Preview"
          >
            <Button size="sm" className="w-full">
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
                    <ListBoxSectionHeader>Blocks</ListBoxSectionHeader>
                    {/* Composed, real-world UI (the landing cards grid), themed live. */}
                    <ListBoxItem id="cards" textValue="Cards">
                      <span className="truncate">Cards</span>
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

          {/* Right cluster */}
          <div className="pointer-events-auto ml-auto flex items-center gap-1">
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
      </div>
    </div>
  )
}
