'use client'

import { useState } from 'react'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import { PreviewPanel } from '../preview/preview-panel'
import { ExportBar } from './export-bar'
import { StudioHeader } from './header'
import { Inspector } from './inspector'
import { Rail } from './rail'
import { StudioProvider } from './store'

type MobilePane = 'customize' | 'preview'

/**
 * The redesigned /create experience — "Studio". One living surface: a chapter
 * rail + an inspector that sharpens from Quick to Studio, beside the live
 * preview it drives. Replaces the old drill-down customizer panel entirely.
 */
export function StudioExperience() {
  return (
    <StudioProvider>
      <StudioLayout />
    </StudioProvider>
  )
}

function StudioLayout() {
  // Below `lg` the panel and preview can't sit side by side, so they collapse
  // to one switchable pane. Both stay mounted (CSS-hidden) so switching never
  // reloads the preview iframe.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col gap-3 p-4 pt-2 lg:flex-row lg:gap-6 lg:p-6 lg:pt-2">
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

      <StudioPanel
        className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
      />
      <PreviewPanel
        className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
      />
    </div>
  )
}

function StudioPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-96 lg:flex-none lg:shrink-0',
        className,
      )}
    >
      <StudioHeader />

      <div className="flex min-h-0 flex-1">
        <Rail />
        <Inspector />
      </div>

      {/* The payoff — always reachable, never buried. */}
      <ExportBar />
    </div>
  )
}
