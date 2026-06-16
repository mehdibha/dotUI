import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useTheme } from 'starter-themes'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { CustomizerPanel } from '@/modules/create/customizer-panel'
import {
  sendPreviewMode,
  sendToIframe,
  useDesignSystem,
} from '@/modules/create/preset'
import type { PreviewMode } from '@/modules/create/preset'

type MobilePane = 'customize' | 'preview'

export const createSearchSchema = z.object({
  panel: z.string().optional().catch(undefined),
  preview: z.string().default('cards').catch('cards'),
  preset: z.string().optional().catch(undefined),
})

const searchDefaults = { preview: 'cards' }

export const Route = createFileRoute('/_app/create')({
  validateSearch: createSearchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  component: CreatePage,
})

function CreatePage() {
  const { preview, preset } = Route.useSearch()
  const { designSystem } = useDesignSystem()
  const { resolvedTheme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light')
  // Below `lg` the customizer and the live preview can't sit side by side (the iframe
  // would be a ~15px sliver), so they collapse into a single switchable pane toggled
  // by the segmented control. Both stay mounted — only CSS-hidden, never unmounted —
  // so switching never reloads the preview. Above `lg` this state is inert; both show.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

  // Open the preview in the same light / dark mode the site is currently in. Seeded on
  // mount rather than via the useState initializer: this page is server-rendered and the
  // server can't know the client's stored theme (it always resolves "light"), so reading
  // it during render would mismatch the SSR'd toggle icon on hydration. Runs once — the
  // preview mode is toggled independently of the site theme afterwards.
  useEffect(() => {
    setPreviewMode(resolvedTheme)
    // oxlint-disable-next-line react/exhaustive-deps -- seed once from the site theme at open; preview mode is independent thereafter
  }, [])

  const effectivePreview = preview

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

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col gap-3 p-4 pt-2 lg:flex-row lg:gap-6 lg:p-6 lg:pt-2">
      {/* Mobile-only view switcher — hidden once the two panes fit side by side. */}
      <ToggleButtonGroup
        aria-label="Editor view"
        selectionMode="single"
        disallowEmptySelection
        size="sm"
        selectedKeys={[mobilePane]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next === 'customize' || next === 'preview') setMobilePane(next)
        }}
        className="w-full shrink-0 *:flex-1 lg:hidden"
      >
        <ToggleButton id="customize">Customize</ToggleButton>
        <ToggleButton id="preview">Preview</ToggleButton>
      </ToggleButtonGroup>
      <CustomizerPanel
        previewMode={previewMode}
        onTogglePreviewMode={() =>
          setPreviewMode((m) => (m === 'dark' ? 'light' : 'dark'))
        }
        className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
      />
      <iframe
        ref={iframeRef}
        key={effectivePreview}
        src={iframeSrc}
        title="preview"
        className={cn(
          'min-w-0 flex-1 rounded-xl border',
          mobilePane === 'customize' && 'max-lg:hidden',
        )}
      />
    </div>
  )
}
