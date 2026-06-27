import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { encodePreset, sendToIframe } from '@/modules/create/preset'

import { PresetThumbnail } from './preset-thumbnail'
import { PRESETS, type Preset } from './presets-data'

/** Minimum gallery tile width; tiles flex to fill the row (`1fr`) above this. */
const MIN_TILE = 280

/**
 * Fixed width of the preview panel. Constant during the open/close animation, so
 * the iframe inside never changes size — only the panel's clip reveals it.
 */
const PREVIEW_WIDTH = 'clamp(520px, 62vw, 1100px)'

export function PresetsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = useMemo(
    () => PRESETS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  )
  const isSplit = selected !== null

  // One persistent preview iframe, exactly like /create: the `cards` slug renders
  // the showcase grid, the first opened preset is baked into the src, and every
  // later switch is pushed in live via postMessage — so the iframe never reloads
  // and theme changes are instant (no blank flash between presets).
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)

  const handleSelect = useCallback((preset: Preset) => {
    setSelectedId(preset.id)
    setIframeSrc((current) => {
      if (current) return current
      const encoded = encodePreset(preset.designSystem)
      return encoded
        ? `/preview/cards?preset=${encodeURIComponent(encoded)}`
        : '/preview/cards'
    })
  }, [])

  // Push the selected design system into the iframe — on change, on load, and
  // when the iframe signals it's ready (its listener can mount after the load).
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !selected) return
    const send = () => sendToIframe(iframe, selected.designSystem)
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
  }, [selected])

  return (
    <div
      className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 p-4 pt-2 lg:p-6 lg:pt-2"
      style={{ '--pw': PREVIEW_WIDTH } as React.CSSProperties}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Gallery — fills the row; collapses to a rail when a preset opens.   */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <GalleryHeader
          isSplit={isSplit}
          selected={selected}
          onBack={() => setSelectedId(null)}
        />
        <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto overscroll-contain pt-1 pb-6">
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_TILE}px, 1fr))`,
            }}
          >
            {PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={preset.id === selectedId}
                onSelect={() => handleSelect(preset)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Preview — fixed-width panel revealed by a width animation. The      */}
      {/* iframe stays pinned to a constant width, so its content never       */}
      {/* reflows as the panel opens; it's just clipped/revealed.             */}
      {/* On mobile (no room to split) it becomes a full-screen overlay.      */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={cn(
          'relative shrink-0 overflow-hidden',
          'lg:transition-[width,margin-left] lg:duration-[520ms] lg:ease-[cubic-bezier(0.32,0.72,0,1)]',
          isSplit
            ? 'max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:bg-bg lg:ml-6 lg:w-[var(--pw)]'
            : 'max-lg:hidden lg:ml-0 lg:w-0',
        )}
      >
        <div className="absolute inset-y-0 right-0 w-full lg:w-[var(--pw)]">
          {iframeSrc && (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              title="Preset preview"
              className="size-full rounded-xl border bg-bg max-lg:rounded-none max-lg:border-0"
            />
          )}
        </div>
        {isSplit && (
          <Button
            variant="quiet"
            size="sm"
            onPress={() => setSelectedId(null)}
            className="absolute top-3 right-3 bg-card/80 backdrop-blur lg:hidden"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  )
}

function GalleryHeader({
  isSplit,
  selected,
  onBack,
}: {
  isSplit: boolean
  selected: Preset | null
  onBack: () => void
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <AnimatePresence initial={false}>
        {isSplit && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Back to gallery"
              onPress={onBack}
            >
              <ArrowLeftIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {isSplit ? selected?.name : 'Presets'}
        </h1>
        <p className="truncate text-sm text-fg-muted">
          {isSplit
            ? selected?.description
            : 'Pick a design system to preview it live.'}
        </p>
      </div>
    </div>
  )
}

function PresetCard({
  preset,
  isSelected,
  onSelect,
}: {
  preset: Preset
  isSelected: boolean
  onSelect: () => void
}) {
  const seeds = preset.designSystem.color?.seeds ?? DEFAULT_COLOR_CONFIG.seeds
  const swatches = [seeds.accent, seeds.neutral, seeds.success, seeds.danger]
  // The card can't be a <button>: the themed thumbnail renders the showcase
  // cards, which contain their own buttons (calendars, etc.) — nesting buttons
  // is invalid HTML. Instead the whole card is a div with a transparent
  // click-target button laid over it as a sibling of the thumbnail.
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition',
        'hover:border-border-hover hover:shadow-md',
        isSelected
          ? 'border-primary ring-2 ring-primary/35'
          : 'group-has-[button:focus-visible]:border-border-hover',
      )}
    >
      <div className="relative h-[240px] overflow-hidden border-b">
        <PresetThumbnail designSystem={preset.designSystem} />
        {/* Fade the clipped bottom edge into the card chrome. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{preset.name}</div>
          <div className="truncate text-xs text-fg-muted">
            {preset.description}
          </div>
        </div>
        <div className="flex shrink-0 items-center -space-x-1">
          {swatches.map((color, i) => (
            <span
              key={i}
              className="size-3.5 rounded-full border border-bg"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Preview ${preset.name}`}
        aria-pressed={isSelected}
        className="absolute inset-0 z-10 rounded-xl focus-visible:focus-ring"
      />
    </div>
  )
}
