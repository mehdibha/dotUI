'use client'

import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  ColumnsIcon,
  ExternalLinkIcon,
  EyeIcon,
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
import { CodeView } from './code-view'
import { Segmented } from './primitives'
import { TokensView } from './tokens-view'

type DeviceSize = 'mobile' | 'tablet' | 'desktop'
type SplitMode = 'single' | 'split'
type Stage = 'preview' | 'tokens' | 'code'

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

// Vision-deficiency simulation applied as a CSS filter over the live preview.
const VISIONS: { id: string; label: string }[] = [
  { id: 'normal', label: 'Normal vision' },
  { id: 'protanopia', label: 'Protanopia (red-blind)' },
  { id: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
  { id: 'tritanopia', label: 'Tritanopia (blue-blind)' },
  { id: 'grayscale', label: 'Grayscale' },
]

function visionFilter(vision: string): string | undefined {
  if (vision === 'normal') return undefined
  if (vision === 'grayscale') return 'grayscale(1)'
  return `url(#cvd-${vision})`
}

const routeApi = getRouteApi('/_app/create')

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
  const [stage, setStage] = useState<Stage>('preview')
  const [mode, setMode] = useState<PreviewMode>('light')
  const [split, setSplit] = useState<SplitMode>('single')
  const [size, setSize] = useState<DeviceSize>('desktop')
  const [zoom, setZoom] = useState(1)
  const [vision, setVision] = useState('normal')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const constrained = size !== 'desktop'
  const filter = visionFilter(vision)

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
      {/* Hidden color-vision-deficiency filter matrices. */}
      <svg aria-hidden className="pointer-events-none absolute size-0">
        <defs>
          <filter id="cvd-protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="cvd-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="cvd-tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <div className="w-56 max-w-[55%]">
          <Segmented<Stage>
            ariaLabel="Canvas view"
            value={stage}
            onChange={setStage}
            options={[
              { value: 'preview', label: 'Preview' },
              { value: 'tokens', label: 'Tokens' },
              { value: 'code', label: 'Code' },
            ]}
          />
        </div>

        {stage === 'preview' && (
          <Select
            value={preview}
            onChange={(v) =>
              navigate({
                search: (prev) => ({ ...prev, preview: v as string }),
              })
            }
            className="w-44 max-lg:hidden"
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
        )}

        {stage === 'preview' && (
          <div className="ml-auto flex items-center gap-1">
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

            {/* Vision simulation */}
            <Menu>
              <Tooltip>
                <Button
                  size="sm"
                  variant={vision === 'normal' ? 'quiet' : 'primary'}
                  isIconOnly
                  aria-label="Vision simulation"
                >
                  <EyeIcon />
                </Button>
                <TooltipContent>Simulate color vision</TooltipContent>
              </Tooltip>
              <Popover placement="bottom end" className="min-w-56">
                <MenuContent
                  selectionMode="single"
                  selectedKeys={[vision]}
                  onSelectionChange={(keys) => {
                    if (keys === 'all') return
                    const v = keys.values().next().value
                    if (v != null) setVision(String(v))
                  }}
                >
                  {VISIONS.map((v) => (
                    <MenuItem key={v.id} id={v.id} textValue={v.label}>
                      {v.label}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>

            <div className="mx-0.5 h-5 w-px bg-border max-lg:hidden" />

            <ToggleButtonGroup
              aria-label="Split mode"
              selectionMode="single"
              disallowEmptySelection
              size="sm"
              isIconOnly
              selectedKeys={[split]}
              onSelectionChange={(keys) => {
                const next = keys.values().next().value
                if (next) setSplit(next as SplitMode)
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

            {split === 'single' && (
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
        )}
      </div>

      {/* Stage — the preview iframe stays mounted (just hidden) when Tokens/Code
          are shown, so switching back never reloads it. */}
      <div className="relative min-h-0 flex-1">
        <div
          className={cn(
            'absolute inset-0 overflow-auto',
            (constrained || split === 'split') && 'bg-neutral',
            stage !== 'preview' && 'hidden',
          )}
        >
          {split === 'split' ? (
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
                    style={{ zoom, filter }}
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
                  filter,
                }}
              />
            </div>
          )}
        </div>

        {stage === 'tokens' && (
          <div className="absolute inset-0">
            <TokensView />
          </div>
        )}
        {stage === 'code' && (
          <div className="absolute inset-0">
            <CodeView />
          </div>
        )}
      </div>
    </div>
  )
}
