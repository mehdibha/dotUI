'use client'

import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  ColumnsIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  MonitorIcon,
  MoonIcon,
  SmartphoneIcon,
  SquareIcon,
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
import { componentsData } from '@/modules/docs/components-list/components-data'

import { sendPreviewMode, sendToIframe, useDesignSystem } from '../preset'
import type { DesignSystem, PreviewMode } from '../preset'

type DeviceSize = 'mobile' | 'tablet' | 'desktop'
type ViewMode = 'single' | 'split'

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

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const routeApi = getRouteApi('/_app/create')

/* ----------------------------------------------------------------------------
 * A single preview iframe that keeps itself in sync with the design system and
 * a forced light/dark mode over postMessage. Reloads only when the previewed
 * scene changes — every token edit streams in without a reload.
 * -------------------------------------------------------------------------- */
function PreviewFrame({
  preview,
  preset,
  designSystem,
  mode,
  className,
  style,
}: {
  preview: string
  preset: string | undefined
  designSystem: DesignSystem
  mode: PreviewMode
  className?: string
  style?: CSSProperties
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const iframeSrc = useMemo(() => {
    const base = `/preview/${preview}`
    return preset ? `${base}?preset=${encodeURIComponent(preset)}` : base
    // oxlint-disable-next-line react/exhaustive-deps -- live preset changes ride the postMessage channel to avoid reloads
  }, [preview])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendToIframe(iframe, designSystem)
    if (iframe.contentWindow) send()
    iframe.addEventListener('load', send)
    const onReady = (e: MessageEvent) => {
      if (e.data?.type === 'preview-ready') send()
    }
    window.addEventListener('message', onReady)
    return () => {
      iframe.removeEventListener('load', send)
      window.removeEventListener('message', onReady)
    }
  }, [designSystem])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const send = () => sendPreviewMode(iframe, mode)
    if (iframe.contentWindow) send()
    iframe.addEventListener('load', send)
    const onReady = (e: MessageEvent) => {
      if (e.data?.type === 'preview-ready') send()
    }
    window.addEventListener('message', onReady)
    return () => {
      iframe.removeEventListener('load', send)
      window.removeEventListener('message', onReady)
    }
  }, [mode])

  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      title={`preview-${mode}`}
      className={cn('h-full border-0 bg-bg', className)}
      style={style}
    />
  )
}

export function Canvas({ className }: { className?: string }) {
  const { preview, preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem } = useDesignSystem()
  const { resolvedTheme } = useTheme()

  const stageRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<PreviewMode>('light')
  const [view, setView] = useState<ViewMode>('single')
  const [size, setSize] = useState<DeviceSize>('desktop')
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const constrained = size !== 'desktop'

  useEffect(() => {
    setMode(resolvedTheme === 'dark' ? 'dark' : 'light')
    // oxlint-disable-next-line react/exhaustive-deps -- seed once from the site theme; canvas mode is independent thereafter
  }, [])

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else stageRef.current?.requestFullscreen()
  }

  const sharedSrc = preset
    ? `/preview/${preview}?preset=${encodeURIComponent(preset)}`
    : `/preview/${preview}`

  return (
    <div
      ref={stageRef}
      className={cn(
        'relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-bg',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        {/* Scene selector */}
        <Select
          value={preview}
          onChange={(v) =>
            navigate({ search: (prev) => ({ ...prev, preview: v as string }) })
          }
          className="w-48 max-w-[45%]"
          aria-label="Preview scene"
        >
          <Button size="sm" className="w-full">
            <SelectValue className="truncate" />
            <ChevronDownIcon data-icon-end="" />
          </Button>
          <Popover>
            <Command>
              <SearchField autoFocus aria-label="Search scenes">
                <Input />
              </SearchField>
              <ListBox>
                <ListBoxSection>
                  <ListBoxSectionHeader>Blocks</ListBoxSectionHeader>
                  <ListBoxItem id="cards" textValue="Cards">
                    <span className="truncate">Cards</span>
                  </ListBoxItem>
                </ListBoxSection>
                <ListBoxSection>
                  <ListBoxSectionHeader>Components</ListBoxSectionHeader>
                  {componentsData
                    .flatMap((c) => c.components)
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

        <div className="ml-auto flex items-center gap-1">
          {/* Device size */}
          <ToggleButtonGroup
            aria-label="Device size"
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

          {/* Zoom */}
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

          {/* Single / split light-dark */}
          <ToggleButtonGroup
            aria-label="View mode"
            selectionMode="single"
            disallowEmptySelection
            size="sm"
            isIconOnly
            selectedKeys={[view]}
            onSelectionChange={(keys) => {
              const next = keys.values().next().value
              if (next) setView(next as ViewMode)
            }}
            className="max-lg:hidden"
          >
            <ToggleButton id="single" aria-label="Single view">
              <SquareIcon />
            </ToggleButton>
            <ToggleButton id="split" aria-label="Light + dark split">
              <ColumnsIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Light / dark (single view only) */}
          {view === 'single' && (
            <Tooltip>
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                onPress={() =>
                  setMode((m) => (m === 'dark' ? 'light' : 'dark'))
                }
                aria-label="Toggle preview mode"
              >
                {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
              <TooltipContent>
                {mode === 'dark' ? 'Light mode' : 'Dark mode'}
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={() =>
                window.open(sharedSrc, '_blank', 'noopener,noreferrer')
              }
              aria-label="Open preview in new tab"
            >
              <ExternalLinkIcon />
            </Button>
            <TooltipContent>Open in new tab</TooltipContent>
          </Tooltip>

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

      {/* Stage */}
      <div
        className={cn(
          'relative flex-1 overflow-auto',
          (constrained || view === 'split') && 'bg-neutral',
        )}
      >
        {view === 'split' ? (
          <div className="flex h-full w-full">
            {(['light', 'dark'] as const).map((m) => (
              <div
                key={m}
                className={cn(
                  'relative flex h-full min-w-0 flex-1 flex-col',
                  m === 'light' && 'border-r',
                )}
              >
                <span className="absolute top-2 left-2 z-10 rounded bg-bg/70 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted uppercase backdrop-blur">
                  {m}
                </span>
                <PreviewFrame
                  preview={preview}
                  preset={preset}
                  designSystem={designSystem}
                  mode={m}
                  className="w-full flex-1"
                  style={{ zoom }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full justify-center">
            <PreviewFrame
              preview={preview}
              preset={preset}
              designSystem={designSystem}
              mode={mode}
              className={cn(constrained && 'border-x shadow-sm')}
              style={{
                width: constrained ? DEVICE_WIDTHS[size] : '100%',
                zoom,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
