'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  BoxSelectIcon,
  ChevronsUpDownIcon,
  Redo2Icon,
  SearchIcon,
  ShuffleIcon,
  Undo2Icon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { PresetGalleryModal } from '@/modules/presets/preset-gallery-modal'
import type { Preset } from '@/modules/presets/presets-data'

import { ExamplesIndex } from '../__generated__/examples'
import { ExportDialog } from '../export'
import { encodePreset, useInspectMessages, useMyPresets } from '../preset'
import { saveDesignSystemName, useDesignSystemName } from '../preset/storage'
import { SavePresetDialog } from '../save-preset-dialog'
import { CommandPalette } from './command'
import type { CommandTarget } from './command'
import { ComponentsSection } from './components-section'
import { usePresetHistory, useShuffle } from './history'
import { ChapterHeading, ControlRow } from './primitives'
import { SECTIONS, useSectionStatus } from './schema'
import type { Section } from './types'

const routeApi = getRouteApi('/_app/create')

/** Card chrome shared by every chapter of the story scroll. */
const CHAPTER_CARD =
  'scroll-mt-14 rounded-xl border border-border/45 bg-card p-3'

/** Gap of the card stack (matches the body's `gap-3`) — also sets the resting
 * space between the floating bars and the first/last card. */
const PANELS_GAP = 12

/** One chapter of the story scroll: sticky marker, opening visual, controls. */
function SectionChapter({ section }: { section: Section }) {
  const { modified, reset } = useSectionStatus(section.id)
  return (
    <section data-section={section.id} className={CHAPTER_CARD}>
      <ChapterHeading
        icon={section.icon}
        label={section.label}
        modified={modified}
        onReset={reset}
        className="mb-1"
      />
      {section.Visual && (
        <div className="mb-3">
          <section.Visual />
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {section.controls.map((control) => (
          <ControlRow key={control.id} control={control} />
        ))}
      </div>
    </section>
  )
}

function ComponentsChapter({
  expanded,
  onToggle,
}: {
  expanded: string | undefined
  onToggle: (name: string | undefined) => void
}) {
  const { modified, reset } = useSectionStatus('components')
  return (
    <section data-section="components" className={CHAPTER_CARD}>
      <ChapterHeading
        icon={BoxSelectIcon}
        label="Components"
        modified={modified}
        onReset={reset}
        className="mb-1"
      />
      <ComponentsSection expanded={expanded} onToggle={onToggle} />
    </section>
  )
}

export function CreatePanel({ className }: { className?: string }) {
  const { panel, preset, gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  // `?panel=` deep-links a chapter of the scroll (`components.<name>` expands a
  // component's params). It's read on arrival and by ⌘K; scrolling never writes it.
  const [linkedSection, expandedComponent] = panel?.split('.') ?? []

  const { canUndo, canRedo, undo, redo } = usePresetHistory()
  const shuffle = useShuffle()

  const [commandOpen, setCommandOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const pendingJumpRef = useRef<string | null>(null)

  // Measured bar heights — the reveal below/above the floating bars is
  // bar height + PANELS_GAP, so the rhythm matches the card stack exactly.
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [barHeights, setBarHeights] = useState({ header: 44, footer: 48 })
  useEffect(() => {
    setBarHeights({
      header: headerRef.current?.offsetHeight ?? 44,
      footer: footerRef.current?.offsetHeight ?? 48,
    })
  }, [])

  // The header names what's being edited: the active saved preset (dotted when
  // edited past its snapshot), else the standalone design-system name.
  const { presets, activeId, setActive } = useMyPresets()
  const storedName = useDesignSystemName()
  const activeSaved = presets.find((p) => p.id === activeId)
  const isDirty = activeSaved ? activeSaved.state !== (preset ?? '') : false
  const displayName = activeSaved?.name ?? storedName

  // Expanding a component also switches the live preview to it so param edits
  // are visible immediately; collapsing leaves the preview where it is.
  function toggleComponent(name: string | undefined) {
    navigate({
      search: (prev) => ({
        ...prev,
        panel: name ? `components.${name}` : 'components',
        ...(name && name in ExamplesIndex ? { preview: name } : {}),
      }),
    })
  }

  function scrollToAnchor(anchor: string, flash = true) {
    // Next frame — the target may render on this same update.
    requestAnimationFrame(() => {
      const el = bodyRef.current?.querySelector<HTMLElement>(
        `[data-control="${anchor}"], [data-section="${anchor}"]`,
      )
      if (!el) return
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      el.scrollIntoView({
        block: anchor.startsWith('component-') || flash ? 'center' : 'start',
        behavior: reduced ? 'auto' : 'smooth',
      })
      if (flash)
        el.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], {
          duration: reduced ? 0 : 700,
          easing: 'ease-in-out',
        })
    })
  }

  // ⌘K jump: controls just scroll (every chapter is always in the DOM);
  // components first expand via `?panel=`, then scroll once rendered.
  function jump(target: CommandTarget) {
    if (target.kind === 'component') {
      pendingJumpRef.current = `component-${target.id}`
      toggleComponent(target.id)
    } else {
      scrollToAnchor(target.id)
    }
  }

  useEffect(() => {
    const id = pendingJumpRef.current
    if (!id) return
    pendingJumpRef.current = null
    scrollToAnchor(id)
  }, [panel])

  // The preview's "Adjust" chips (overview sections) hop straight to the
  // owning chapter — the preview is a navigation surface, not just a monitor.
  useInspectMessages((panelId) => scrollToAnchor(panelId, false))

  // Deep link on arrival: scroll the linked chapter (or expanded component)
  // into view once, without the ⌘K flash.
  const arrivedRef = useRef(false)
  useEffect(() => {
    if (arrivedRef.current) return
    arrivedRef.current = true
    if (expandedComponent)
      scrollToAnchor(`component-${expandedComponent}`, false)
    else if (linkedSection) scrollToAnchor(linkedSection, false)
  }, [])

  // Apply a gallery preset and close the modal in one navigation — two separate
  // updates (setDesignSystem + closing) would race on the functional `prev`.
  // The `?preset=` change lands in the undo history like any other edit.
  function applyPreset(picked: Preset) {
    setActive(undefined)
    saveDesignSystemName(picked.name)
    navigate({
      search: (prev) => ({
        ...prev,
        preset: encodePreset(picked.designSystem),
        gallery: undefined,
      }),
    })
  }

  // A saved preset's `state` is already an encoded `?preset=` value — apply it
  // directly (no re-encode) and close the gallery in one navigation.
  function applySavedPreset(state: string) {
    navigate({
      search: (prev) => ({
        ...prev,
        preset: state || undefined,
        gallery: undefined,
      }),
    })
  }

  function setGalleryOpen(open: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: open ? true : undefined }),
    })
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col lg:w-80 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Header — flush glass bar; cards dip under it, never past it. */}
      <div
        ref={headerRef}
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 rounded-xl border border-border/45 bg-neutral/90 p-1.5 shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm"
      >
        <Button
          variant="quiet"
          size="sm"
          onPress={() => setGalleryOpen(true)}
          className="min-w-0 justify-start gap-1.5 font-medium"
        >
          <span className="truncate">{displayName}</span>
          {isDirty ? (
            <span
              aria-label="Unsaved changes"
              className="size-1.5 shrink-0 rounded-full bg-fg-muted"
            />
          ) : null}
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </Button>
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Shuffle"
              onPress={shuffle}
            >
              <ShuffleIcon />
            </Button>
            <TooltipContent>Shuffle the system</TooltipContent>
          </Tooltip>
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={undo}
              isDisabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2Icon />
            </Button>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              onPress={redo}
              isDisabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2Icon />
            </Button>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Search controls"
              onPress={() => setCommandOpen(true)}
            >
              <SearchIcon />
            </Button>
            <TooltipContent>Search controls ⌘K</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Body — the story scroll: every chapter its own card. Same radius as the
          bars and clipped, so cards show below the header but never exceed it. */}
      <div
        ref={bodyRef}
        className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-xl"
        style={{
          paddingTop: barHeights.header + PANELS_GAP,
          paddingBottom: barHeights.footer + PANELS_GAP,
        }}
      >
        {SECTIONS.map((section) => (
          <SectionChapter key={section.id} section={section} />
        ))}
        <ComponentsChapter
          expanded={expandedComponent}
          onToggle={toggleComponent}
        />
      </div>

      {/* Footer — same treatment as the header. */}
      <div
        ref={footerRef}
        className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-xl border border-border/45 bg-neutral/90 p-2 shadow-[0_-4px_16px_-4px_rgb(0_0_0/0.2),0_-2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm"
      >
        <SavePresetDialog />
        <ExportDialog>
          <Button variant="primary" size="sm" className="flex-1">
            Export
          </Button>
        </ExportDialog>
      </div>

      <CommandPalette
        isOpen={commandOpen}
        onOpenChange={setCommandOpen}
        onJump={jump}
      />

      <PresetGalleryModal
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        currentState={preset ?? ''}
        onApply={applyPreset}
        onApplySaved={applySavedPreset}
      />
    </div>
  )
}
