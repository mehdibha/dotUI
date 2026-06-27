'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink } from '@tanstack/react-router'
import { ExternalLinkIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react'
import { useTheme } from 'starter-themes'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { encodePreset, sendPreviewMode } from '@/modules/create/preset'
import type { Density, PreviewMode } from '@/modules/create/preset'

import type { Preset } from './presets-data'

const DENSITY_LABEL: Record<Density, string> = {
  compact: 'Compact',
  default: 'Default',
  comfortable: 'Comfortable',
}

const ALGORITHM_LABEL: Record<string, string> = {
  oklch: 'OKLCH',
  tailwind: 'Tailwind',
  contrast: 'Contrast',
  material: 'Material',
}

/** A descriptive word for a `--radius-factor` multiplier (1 = builder default). */
function radiusLabel(factor: string | undefined): string {
  const n = factor ? Number(factor) : 1
  if (Number.isNaN(n) || n === 1) return 'Default'
  if (n <= 0.5) return 'Sharp'
  if (n < 1) return 'Tight'
  if (n >= 2) return 'Pill'
  return 'Rounded'
}

interface PresetModalProps {
  /** The preset to present; retained through the close animation so the panel
   *  doesn't blank out as it scales away. */
  preset: Preset | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * The preset presentation modal: a large two-pane dialog that shows a design
 * system the way a designer would walk you through it. The left pane is an
 * editorial spec sheet (name, palette, the headline axes) with the call to take
 * it into the editor; the right pane is the live showcase — the exact `/create`
 * preview iframe, themed by this preset, with a light / dark toggle.
 */
export function PresetModal({
  preset,
  isOpen,
  onOpenChange,
}: PresetModalProps) {
  // Keep the last preset mounted while the modal animates closed (the overlay
  // lingers for the exit transition); without this the panel empties mid-close.
  const [shown, setShown] = useState(preset)
  useEffect(() => {
    if (preset) setShown(preset)
  }, [preset])
  const active = preset ?? shown

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="h-[80vh] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
    >
      <DialogContent
        aria-label={active ? `${active.name} design system` : 'Design system'}
        className="relative flex h-full min-h-0 flex-col overflow-hidden p-0"
      >
        {/* Close sits just outside the panel's top-right corner (kept inside the
            dialog so focus management still scopes to it). */}
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Close"
          onPress={() => onOpenChange(false)}
          className="absolute -top-10 right-0 z-10 text-fg-muted hover:bg-inverse/10 hover:text-fg"
        >
          <XIcon />
        </Button>
        {active ? <PresetModalBody preset={active} /> : null}
      </DialogContent>
    </Modal>
  )
}

function PresetModalBody({ preset }: { preset: Preset }) {
  const { resolvedTheme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light')

  const encoded = useMemo(
    () => encodePreset(preset.designSystem),
    [preset.designSystem],
  )
  const iframeSrc = encoded
    ? `/preview/cards?preset=${encodeURIComponent(encoded)}`
    : '/preview/cards'

  // Seed the preview's light / dark from the site theme on open, then it's
  // independent (mirrors the /create PreviewPanel: the SSR'd server can't know
  // the client's stored theme, so seed after mount rather than during render).
  useEffect(() => {
    setPreviewMode(resolvedTheme === 'dark' ? 'dark' : 'light')
    // oxlint-disable-next-line react/exhaustive-deps -- seed once at open; preview mode is independent thereafter
  }, [])

  // Forward the preview mode to the iframe — on change, on load, and when it
  // signals ready (its listener can mount after the load event fires).
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

  const seeds = preset.designSystem.color?.seeds ?? DEFAULT_COLOR_CONFIG.seeds
  const palette = [
    { label: 'Accent', color: seeds.accent },
    { label: 'Neutral', color: seeds.neutral },
    { label: 'Success', color: seeds.success },
    { label: 'Warning', color: seeds.warning },
    { label: 'Danger', color: seeds.danger },
    { label: 'Info', color: seeds.info },
  ].filter((s): s is { label: string; color: string } => Boolean(s.color))

  const specs = [
    { label: 'Density', value: DENSITY_LABEL[preset.designSystem.density] },
    {
      label: 'Radius',
      value: radiusLabel(preset.designSystem.tokens['--radius-factor']),
    },
    {
      label: 'Color model',
      value: ALGORITHM_LABEL[preset.designSystem.color?.algorithm ?? 'oklch'],
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      {/* LEFT: the editorial spec sheet. Capped on mobile (where it stacks above
          the preview) so the live showcase always keeps a usable share. */}
      <div className="flex min-h-0 flex-col gap-6 overflow-auto border-b p-6 max-md:max-h-[55%] md:w-[340px] md:shrink-0 md:border-r md:border-b-0 lg:w-[380px]">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Design system
          </span>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {preset.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-fg-muted">
            {preset.description}
          </DialogDescription>
        </div>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Palette
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {palette.map(({ label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border bg-bg p-2"
              >
                <span
                  className="size-6 shrink-0 rounded-md border border-bg shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium">{label}</div>
                  <div className="truncate font-mono text-[0.7rem] text-fg-muted uppercase">
                    {color}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Details
          </h3>
          <dl className="grid grid-cols-3 gap-2">
            {specs.map(({ label, value }) => (
              <div key={label} className="rounded-lg border bg-bg p-3">
                <dt className="text-xs text-fg-muted">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-auto pt-2">
          <RouterLink
            to="/create"
            search={encoded ? { preset: encoded } : {}}
            className={buttonStyles({
              variant: 'primary',
              size: 'lg',
              className: 'w-full',
            })}
          >
            Open in editor
          </RouterLink>
        </div>
      </div>

      {/* RIGHT: the live showcase, themed by this preset. */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-bg">
        <div className="flex h-11 shrink-0 items-center justify-end gap-1 border-b px-2">
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
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title={`${preset.name} preview`}
            className="size-full border-0 bg-bg"
          />
        </div>
      </div>
    </div>
  )
}
