import { useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { CustomizerPanel } from '@/modules/create/customizer-panel'
import { PreviewPanel } from '@/modules/create/preview/preview-panel'

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
  // Below `lg` the customizer and the live preview can't sit side by side (the iframe
  // would be a ~15px sliver), so they collapse into a single switchable pane toggled
  // by the segmented control. Both stay mounted — only CSS-hidden, never unmounted —
  // so switching never reloads the preview. Above `lg` this state is inert; both show.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

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
        className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
      />
      <PreviewPanel
        className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
      />
    </div>
  )
}
